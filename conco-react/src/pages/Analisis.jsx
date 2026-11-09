import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Steps from '../components/Steps.jsx';
import Footer from '../components/Footer.jsx';
import { useQuery } from '../useQuery.js';
import '../styles/analisis.css';

// Simula la consulta a las fuentes. Reemplazar por las consultas reales.
const FUENTES = [
  ['Trámites y requisitos', 1200],
  ['Zonificación y usos del suelo', 1500],
  ['Habilitaciones y control', 1400],
  ['Cartografía y capas territoriales', 2000],
  ['Datos abiertos de la Ciudad', 1300],
];

export default function Analisis() {
  const { actividad, direccion, calle, barrio, to } = useQuery();
  const hayConsulta = actividad || direccion;

  // paso: -1 = por empezar · i = consultando la fuente i · FUENTES.length = todo listo
  const [paso, setPaso] = useState(-1);
  const listo = paso >= FUENTES.length;
  const ver = useRef(null);

  useEffect(() => {
    const ms = paso < 0 ? 30 : FUENTES[paso]?.[1];
    if (ms === undefined) return;
    const t = setTimeout(() => setPaso(paso + 1), ms);
    return () => clearTimeout(t);
  }, [paso]);

  useEffect(() => { if (listo) ver.current?.focus(); }, [listo]);

  return (
    <>
      <Header />
      <Steps active={2} />

      <main className="main main--wide">
        <section className="intro intro--left">
          <h1>{listo ? 'Listo, interpretamos tu consulta' : 'Estamos interpretando tu consulta'}</h1>
          <p>Identificamos la actividad y la ubicación, y consultamos las fuentes oficiales al mismo tiempo.</p>
        </section>

        <div className="panels">
          <section className="panel" aria-labelledby="h-entendimos">
            <h2 id="h-entendimos">Lo que entendimos</h2>
            <blockquote className="quote">
              {hayConsulta
                ? [actividad, direccion].filter(Boolean).join(' · ')
                : 'Quiero abrir una cafetería en Av. Cabildo 2040, Belgrano'}
            </blockquote>

            <div className="data">
              <span className="data__label">Actividad</span>
              <div className="data__row"><strong>{actividad || 'Cafetería'}</strong><Link to="/">Editar</Link></div>
              <span className="data__note">Rubro asociado: Café-bar / Casa de comidas</span>
            </div>

            <div className="data">
              <span className="data__label">Ubicación</span>
              <div className="data__row"><strong>{calle || 'Av. Cabildo 2040'}</strong><Link to="/">Editar</Link></div>
              <span className="data__note">
                {hayConsulta
                  ? 'Barrio: ' + (barrio || '[a confirmar]') + ' · Ciudad Autónoma de Buenos Aires'
                  : 'Barrio: Belgrano · Ciudad Autónoma de Buenos Aires'}
              </span>
            </div>

            <p className="help"><span className="help__icon"></span>¿No es lo que querías decir? Podés corregirlo antes de ver los resultados.</p>
          </section>

          <section className="panel" aria-labelledby="h-fuentes">
            <h2 id="h-fuentes">Consultando fuentes oficiales</h2>
            <div aria-live="polite">
              {FUENTES.map(([nombre, ms], i) => {
                const hecho = i < paso;
                const estado = hecho ? 'Listo' : i === paso ? 'Consultando…' : 'En espera';
                return (
                  <div className="source" key={nombre}>
                    <div className="source__head">
                      <span>{nombre}</span>
                      <span className={'source__state' + (hecho ? ' is-done' : '')}>{estado}</span>
                    </div>
                    <div className="bar">
                      <div className="bar__fill" style={{ width: i <= paso ? '100%' : '0', transition: `width ${ms}ms linear` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="panel__actions">
              <Link to="/">Cancelar</Link>
              <Link
                ref={ver}
                className={'btn btn--primary btn--sm' + (listo ? '' : ' is-disabled')}
                to={to('/orientacion')}
                aria-disabled={listo ? undefined : 'true'}
                onClick={(e) => { if (!listo) e.preventDefault(); }}
              >
                Ver resultados <span aria-hidden="true">→</span>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
