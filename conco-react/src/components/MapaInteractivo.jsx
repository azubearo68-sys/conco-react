import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const ZOOM_INICIAL = 16;

// Mapas base. Ambos son servicios públicos con atribución obligatoria (ya está en .map__credit).
const CALLES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const SATELITE = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

// --- utilidades: metros -> coordenadas, para dibujar capas de ejemplo alrededor de la consulta ---
const off = ([lat, lng], dx, dy) => [
  lat + dy / 111320,
  lng + dx / (111320 * Math.cos((lat * Math.PI) / 180)),
];
const rect = (c, x1, y1, x2, y2) => [off(c, x1, y1), off(c, x2, y2)];
const esc = (t) => String(t).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

const popupHtml = (calle, actividad) =>
  `<strong>${esc(calle)}</strong>` +
  `<p class="popup__txt">Uso del suelo: [resultado de la capa]. ${esc(actividad)}: [permitida / condicionada].</p>` +
  `<p class="popup__src">Fuente: <b style="color:var(--blue)">[1]</b></p>`;

// Capas de ejemplo. REEMPLAZAR por datos reales (GeoJSON / WMS de Buenos Aires Data):
//   L.geoJSON(datos, { style }) o L.tileLayer.wms(url, { layers: '...' })
function construirCapas(c) {
  const zona = { color: '#1D3343', weight: 1.5, fillColor: '#035C80', fillOpacity: 0.2 };
  const protegida = { color: '#035C80', weight: 2, dashArray: '6 4', fillColor: '#FFCD02', fillOpacity: 0.22 };
  const label = L.divIcon({
    className: 'label-icon',
    html: '<span>Distrito comercial</span>',
    iconSize: [150, 28],
    iconAnchor: [0, 0],
  });
  const stop = L.divIcon({ className: 'stop-icon', html: '<i></i>', iconSize: [16, 16], iconAnchor: [8, 8] });
  const poi = { radius: 7, color: '#1D3343', weight: 2, fillColor: '#FFCD02', fillOpacity: 1 };

  return {
    zonificacion: L.layerGroup([
      L.rectangle(rect(c, -180, 28, 180, 170), zona),
      L.rectangle(rect(c, -180, -170, 180, -28), zona),
      L.marker(off(c, -170, 164), { icon: label, interactive: false, keyboard: false }),
    ]),
    parcela: L.layerGroup([
      L.rectangle(rect(c, -11, -13, 11, 13), { color: '#1D3343', weight: 2, dashArray: '6 4', fillColor: '#fff', fillOpacity: 0.9 }),
    ]),
    comercios: L.layerGroup([[-100, 40], [95, 48], [150, -60], [-60, -110], [40, -130]].map(([x, y]) => L.circleMarker(off(c, x, y), poi))),
    transporte: L.layerGroup([[-175, -5], [170, 8], [10, -150]].map(([x, y]) => L.marker(off(c, x, y), { icon: stop, interactive: false, keyboard: false }))),
    protegidas: L.layerGroup([
      L.rectangle(rect(c, 220, 100, 330, 230), protegida),
      L.rectangle(rect(c, -340, -230, -230, -110), protegida),
    ]),
  };
}

/**
 * Mapa interactivo con Leaflet (sin react-leaflet: menos dependencias y sin choques de versión con React).
 * Props: center [lat,lng] · capas {id: bool} · satelite bool · calle · actividad
 * Ref:   zoomIn() · zoomOut() · centrar()
 */
const MapaInteractivo = forwardRef(function MapaInteractivo({ center, capas, satelite, calle, actividad }, ref) {
  const el = useRef(null);
  const mapa = useRef(null);
  const base = useRef({});
  const pin = useRef(null);
  const grupos = useRef({});
  const centerActual = useRef(center);
  centerActual.current = center;
  const capasActuales = useRef(capas);
  capasActuales.current = capas;

  useImperativeHandle(ref, () => ({
    zoomIn: () => mapa.current?.zoomIn(),
    zoomOut: () => mapa.current?.zoomOut(),
    centrar: () => mapa.current?.setView(centerActual.current, ZOOM_INICIAL),
  }));

  // Crear el mapa (una vez) y destruirlo al salir.
  useEffect(() => {
    const m = L.map(el.current, { zoomControl: false, attributionControl: false, center: centerActual.current, zoom: ZOOM_INICIAL, minZoom: 11, maxZoom: 19 });
    base.current = {
      calles: L.tileLayer(CALLES, { maxZoom: 19 }),
      satelite: L.tileLayer(SATELITE, { maxZoom: 19 }),
    };
    base.current.calles.addTo(m);
    mapa.current = m;

    // El contenedor puede cambiar de tamaño (menú, responsive): avisarle a Leaflet.
    const ro = new ResizeObserver(() => m.invalidateSize());
    ro.observe(el.current);
    const t = setTimeout(() => m.invalidateSize(), 0);

    return () => {
      clearTimeout(t);
      ro.disconnect();
      m.remove();
      mapa.current = null;
      pin.current = null;
      grupos.current = {};
    };
  }, []);

  // Mapa base: calles / satélite.
  useEffect(() => {
    const m = mapa.current;
    const { calles, satelite: sat } = base.current;
    if (satelite) { m.removeLayer(calles); sat.addTo(m); } else { m.removeLayer(sat); calles.addTo(m); }
  }, [satelite]);

  // Ubicación: mueve el mapa, el pin y redibuja las capas alrededor de la nueva consulta.
  useEffect(() => {
    const m = mapa.current;
    Object.values(grupos.current).forEach((g) => g.remove());
    if (pin.current) pin.current.remove();

    grupos.current = construirCapas(center);
    Object.entries(grupos.current).forEach(([id, g]) => { if (capasActuales.current[id]) g.addTo(m); });

    pin.current = L.marker(center, {
      icon: L.divIcon({ className: 'pin-icon', html: '<i></i>', iconSize: [30, 30], iconAnchor: [15, 38] }),
      zIndexOffset: 1000,
      title: 'Ubicación de la consulta',
    }).addTo(m).bindPopup(popupHtml(calle, actividad), { offset: [0, -34], minWidth: 240, maxWidth: 260 }).openPopup();

    m.setView(center, ZOOM_INICIAL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center]);

  // Texto del popup (si cambia la consulta sin cambiar la ubicación).
  useEffect(() => { pin.current?.setPopupContent(popupHtml(calle, actividad)); }, [calle, actividad]);

  // Capas: mostrar / ocultar.
  useEffect(() => {
    const m = mapa.current;
    Object.entries(grupos.current).forEach(([id, g]) => {
      if (capas[id]) g.addTo(m); else g.remove();
    });
  }, [capas]);

  return <div className="map__canvas" ref={el} role="application" aria-label="Mapa interactivo de la Ciudad de Buenos Aires" />;
});

export default MapaInteractivo;
