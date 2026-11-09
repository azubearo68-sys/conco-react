import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Steps from '../components/Steps.jsx';
import QueryBar from '../components/QueryBar.jsx';
import Footer from '../components/Footer.jsx';
import { useQuery } from '../useQuery.js';
import '../styles/asistente.css';

// Respuestas de ejemplo. Reemplazar responder() por la llamada real al asistente:
// debe devolver { texto, fuentes: [1, 2, ...] } usando solo fuentes oficiales.
const FUENTES = {
  1: 'Código Urbanístico de la Ciudad',
  2: 'Guía de trámites de habilitación',
  3: 'Normativa de control y habilitaciones',
  4: 'Mapa y datos abiertos de la Ciudad',
};

const RESPUESTAS = [
  { claves: ['document', 'papel', 'present'],
    texto: 'Para una cafetería se pide: DNI y CUIT del titular, título o contrato de alquiler vigente, plano del local, constancia de inscripción impositiva y certificado de manipulación de alimentos del personal [2].',
    fuentes: [2] },
  { claves: ['tarda', 'plazo', 'demora', 'cuánto', 'cuanto', 'tiempo'],
    texto: 'El plazo estimado de la habilitación es [a completar]. Puede incluir una inspección del local, según el caso [2].',
    fuentes: [2] },
  { claves: ['ambiental', 'aptitud'],
    texto: 'La aptitud ambiental puede requerirse según la superficie y las características del local [3]. Confirmá el caso con el organismo: [nombre del organismo].',
    fuentes: [3] },
  { claves: ['permitid', 'zona', 'rubro', 'uso del suelo', 'zonific'],
    texto: 'Según la zonificación de la dirección, el uso del suelo es [resultado de la capa] y la actividad figura como [permitida / condicionada] [1]. Podés verlo en el mapa [4].',
    fuentes: [1, 4] },
];

const SIN_RESPUESTA = 'No encontré una fuente oficial que responda eso, así que prefiero no inventar una respuesta. Probá reformular la pregunta o elegí una de las sugeridas.';

const SUGERIDAS = [
  '¿Qué documentos necesito?',
  '¿Cuánto tarda la habilitación?',
  '¿Necesito aptitud ambiental?',
  '¿Está permitido el rubro en esta zona?',
];

function responder(pregunta) {
  const q = pregunta.toLowerCase();
  const hit = RESPUESTAS.find((r) => r.claves.some((k) => q.includes(k)));
  return hit || { texto: SIN_RESPUESTA, fuentes: [] };
}

// Convierte "[1]" en un enlace a la fuente.
function ConCitas({ texto }) {
  return texto.split(/(\[\d\])/).map((parte, i) => {
    const m = parte.match(/^\[(\d)\]$/);
    return m ? <a key={i} className="ref" href={`#fuente-${m[1]}`}>{parte}</a> : parte;
  });
}

function Traza({ fuentes }) {
  if (!fuentes.length) return null;
  return (
    <div className="trace">
      <span className="trace__label">Fuentes de esta respuesta</span>
      <ul>
        {fuentes.map((n) => (
          <li key={n}>
            <span className="ref">[{n}]</span>
            <span>{FUENTES[n]}<small>Fragmento: [texto de la fuente]</small></span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Asistente() {
  const { actividad, calle, to } = useQuery();
  const verbo = actividad ? actividad.charAt(0).toLowerCase() + actividad.slice(1) : 'abrir una cafetería';
  const lugar = calle || 'Av. Cabildo 2040';

  const [mensajes, setMensajes] = useState([
    { rol: 'user', texto: `¿Qué necesito para ${verbo} en ${lugar}?` },
    {
      rol: 'bot',
      texto: `Para ${verbo} en ${lugar} tenés que: confirmar que el rubro está permitido en la zona [1], reunir la documentación del titular y del local [2] y iniciar la habilitación en línea [2]. Algunas condiciones del local dependen de la superficie y el aforo [3].`,
      fuentes: [1, 2, 3],
    },
  ]);
  const [sugeridas, setSugeridas] = useState(SUGERIDAS);
  const [escribiendo, setEscribiendo] = useState(false);
  const [texto, setTexto] = useState('');
  const input = useRef(null);
  const log = useRef(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (mensajes.length > 2) log.current?.lastElementChild?.scrollIntoView({ block: 'nearest' }); }, [mensajes, escribiendo]);

  const preguntar = (pregunta) => {
    pregunta = pregunta.trim();
    if (!pregunta) return;
    setMensajes((m) => [...m, { rol: 'user', texto: pregunta }]);
    setEscribiendo(true);
    timer.current = setTimeout(() => {
      const r = responder(pregunta);
      setMensajes((m) => [...m, { rol: 'bot', ...r }]);
      setEscribiendo(false);
    }, 800);
  };

  return (
    <>
      <Header />
      <Steps active={5} />
      <QueryBar tab="asistente" />

      <main className="chat-layout">
        <section className="chat" aria-labelledby="h-chat">
          <div className="chat__intro">
            <h1 id="h-chat">Preguntale al asistente</h1>
            <p>Respondo solo con información oficial respaldada y te muestro de dónde sale cada dato.</p>
          </div>

          <div className="chat__log" aria-live="polite" ref={log}>
            {mensajes.map((m, i) =>
              m.rol === 'user' ? (
                <div className="msg msg--user" key={i}><p>{m.texto}</p></div>
              ) : (
                <article className={'msg msg--bot box' + (m.fuentes.length ? '' : ' msg--none')} key={i}>
                  <span className="msg__who">Asistente ConCo</span>
                  <p><ConCitas texto={m.texto} /></p>
                  <Traza fuentes={m.fuentes} />
                </article>
              )
            )}
            {escribiendo && <p className="typing">Buscando en las fuentes oficiales…</p>}
          </div>

          <div className="suggest">
            <span className="hint">Preguntas de seguimiento</span>
            <div className="suggest__list">
              {sugeridas.map((s) => (
                <button
                  key={s} className="chip" type="button"
                  onClick={() => { preguntar(s); setSugeridas((l) => l.filter((x) => x !== s)); input.current?.focus(); }}
                >{s}</button>
              ))}
            </div>
          </div>

          <form className="ask" onSubmit={(e) => { e.preventDefault(); preguntar(texto); setTexto(''); }}>
            <label className="sr-only" htmlFor="pregunta">Tu pregunta</label>
            <input
              id="pregunta" name="pregunta" type="text" placeholder="Escribí tu pregunta…" autoComplete="off"
              ref={input} value={texto} onChange={(e) => setTexto(e.target.value)}
            />
            <button className="btn btn--primary" type="submit">Preguntar <span aria-hidden="true">→</span></button>
          </form>
        </section>

        <aside className="chat-side" aria-label="Información complementaria">
          <section className="box side">
            <h2>Cómo responde</h2>
            <p>Solo usa información oficial respaldada. Si no encuentra una fuente que responda tu pregunta, te lo dice en lugar de inventar una respuesta.</p>
          </section>
          <section className="box side" aria-labelledby="h-fuentes">
            <h2 id="h-fuentes">Fuentes disponibles</h2>
            {Object.entries(FUENTES).map(([n, t]) => (
              <div className="src" id={`fuente-${n}`} key={n}><span className="ref">[{n}]</span><span>{t}</span></div>
            ))}
            <span className="note">Última actualización de datos: [fecha]</span>
          </section>
          <section className="box side">
            <h2>Seguí explorando</h2>
            <Link className="link" to={to('/orientacion')}>← Ver la orientación completa</Link>
            <Link className="link" to={to('/mapa')}>Abrir el mapa interactivo →</Link>
          </section>
        </aside>
      </main>

      <Footer />
    </>
  );
}
