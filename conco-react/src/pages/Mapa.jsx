import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Steps from '../components/Steps.jsx';
import QueryBar from '../components/QueryBar.jsx';
import Footer from '../components/Footer.jsx';
import MapaInteractivo from '../components/MapaInteractivo.jsx';
import { useQuery } from '../useQuery.js';
import { useUbicacion } from '../useUbicacion.js';
import '../styles/mapa.css';

export default function Mapa() {
  const { actividad, direccion, calle, barrio, to } = useQuery();
  const { coords, buscando, encontrada } = useUbicacion(direccion);
  const [capas, setCapas] = useState({ zonificacion: true, parcela: true, comercios: false, transporte: false, protegidas: false });
  const [satelite, setSatelite] = useState(false);
  const mapa = useRef(null); // API del mapa: zoomIn(), zoomOut(), centrar()
  const alternar = (id) => setCapas((c) => ({ ...c, [id]: !c[id] }));

  return (
    <>
      <Header />
      <Steps active={4} />
      <QueryBar tab="mapa" />
      <main className="map-layout">
        <aside className="map-side" aria-label="Controles del mapa">
      <section className="box">
        <h2>Capas de información</h2>
        <label className="layer"><input type="checkbox" checked={capas.zonificacion} onChange={() => alternar('zonificacion')} /><span>Zonificación y usos del suelo</span></label>
        <label className="layer"><input type="checkbox" checked={capas.parcela} onChange={() => alternar('parcela')} /><span>Parcela y catastro</span></label>
        <label className="layer"><input type="checkbox" checked={capas.comercios} onChange={() => alternar('comercios')} /><span>Comercios habilitados cercanos</span></label>
        <label className="layer"><input type="checkbox" checked={capas.transporte} onChange={() => alternar('transporte')} /><span>Transporte público</span></label>
        <label className="layer"><input type="checkbox" checked={capas.protegidas} onChange={() => alternar('protegidas')} /><span>Áreas protegidas y patrimonio</span></label>
      </section>
      <section className="box">
        <h2>Leyenda</h2>
        <div className="legend"><i className="sw-zone"></i><span>Distrito comercial</span></div>
        <div className="legend"><i className="sw-parcel"></i><span>Parcela consultada</span></div>
        <div className="legend"><i className="sw-dot"></i><span>Ubicación de la consulta</span></div>
      </section>
      <section className="box" style={{ gap: '10px' }}>
        <h2>Datos de la ubicación</h2>
        <div className="kv"><span>Dirección</span><span>{calle || 'Av. Cabildo 2040'}</span></div>
        <div className="kv"><span>Barrio / Comuna</span><span>{barrio || 'Belgrano / 13'}</span></div>
        <div className="kv"><span>Distrito de zonificación</span><span>[a completar]</span></div>
        <div className="kv"><span>Parcela</span><span>[SMP]</span></div>
        <span className="map-src">Fuente: <b style={{ color: 'var(--blue)' }}>[4]</b> Mapa y datos abiertos de la Ciudad</span>
      </section>
    </aside>

        <section className="map-main" aria-label="Mapa interactivo">
          <div className="map">
            <MapaInteractivo
              ref={mapa}
              center={coords}
              capas={capas}
              satelite={satelite}
              calle={calle || 'Av. Cabildo 2040'}
              actividad={actividad || 'Cafetería'}
            />

            {buscando && <div className="map__status" role="status">Buscando la dirección…</div>}
            {!buscando && direccion && !encontrada && (
              <div className="map__status" role="status">No pudimos ubicar la dirección: mostramos una zona de referencia.</div>
            )}

            <div className="map__zoom">
              <button type="button" onClick={() => mapa.current?.zoomIn()} aria-label="Acercar">+</button>
              <button type="button" onClick={() => mapa.current?.zoomOut()} aria-label="Alejar">−</button>
              <button type="button" onClick={() => mapa.current?.centrar()} aria-label="Centrar en la ubicación">Centro</button>
            </div>
            <div className="map__base" role="group" aria-label="Tipo de mapa">
              <button type="button" aria-pressed={!satelite} onClick={() => setSatelite(false)}>Calles</button>
              <button type="button" aria-pressed={satelite} onClick={() => setSatelite(true)}>Satélite</button>
            </div>
            <div className="map__credit">
              Fuente del mapa: [4] · {satelite ? 'Imágenes © Esri' : '© colaboradores de OpenStreetMap'}
            </div>
          </div>

          <div className="map-actions">
            <Link to={to('/orientacion')}>← Volver a la orientación</Link>
            <Link className="btn btn--primary btn--sm" to={to('/asistente')}>Preguntarle al asistente →</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
