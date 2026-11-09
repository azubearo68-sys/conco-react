# ConCo · React

Misma interfaz del diseño (5 páginas), hecha en React + Vite + React Router, con mapa real de Leaflet.

## Cómo correrlo
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera /dist
```

## Estructura
- `src/styles/` → CSS del diseño: `base.css` (compartido) + uno por página.
- `src/pages/` → `Home`, `Analisis`, `Orientacion`, `Mapa`, `Asistente`.
- `src/components/` → `Header`, `Steps`, `QueryBar`, `Footer`, `MapaInteractivo`.
- `src/useQuery.js` → lee actividad y dirección de la URL y arma los links.
- `src/useUbicacion.js` → convierte la dirección en coordenadas (Nominatim, limitado a CABA).

## El mapa (`src/components/MapaInteractivo.jsx`)
Usa Leaflet directo (sin `react-leaflet`, así no hay choques de versión con React 19).
- Mapa base: calles (OpenStreetMap) y satélite (Esri). Las atribuciones están en `.map__credit`.
- Las 5 capas son **de ejemplo**, dibujadas alrededor de la dirección. Para datos reales, reemplazá
  `construirCapas()` por `L.geoJSON(datos, { style })` o `L.tileLayer.wms(...)` (Buenos Aires Data).
- Para producción, cambiá Nominatim por el servicio de direcciones del GCBA (USIG) o tu backend:
  Nominatim es gratuito pero con uso limitado.

### Si el mapa se "rompe", casi siempre es una de estas
1. Falta `import 'leaflet/dist/leaflet.css'` → mapa en pedazos o invisible (ya está importado).
2. El contenedor no tiene alto → no se ve (`.map` tiene `min-height: 640px`).
3. Íconos de marcador rotos con Vite → se evita usando `L.divIcon` (no hay imágenes de marcador).
4. `react-leaflet` v4 con React 19 (o v5 con React 18) → por eso acá no se usa.
5. `map.remove()` al desmontar (StrictMode monta dos veces) → ya está en el `useEffect`.

## Importante
- `base.css` se importa PRIMERO en `App.jsx`. Si lo movés, algunas tarjetas pierden estilos.
- `Asistente` responde con textos de ejemplo: reemplazá `responder()` en `src/pages/Asistente.jsx`.
