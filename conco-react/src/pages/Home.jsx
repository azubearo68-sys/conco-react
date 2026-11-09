import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Steps from '../components/Steps.jsx';
import Footer from '../components/Footer.jsx';
import '../styles/index.css';

const EJEMPLOS = [
  ['Abrir una panadería', 'Caballito', 'Abrir una panadería en Caballito'],
  ['Habilitar un gimnasio', 'Palermo', 'Habilitar un gimnasio en Palermo'],
  ['Instalar una librería', 'Av. Corrientes 4500', 'Instalar una librería en Av. Corrientes 4500'],
];

export default function Home() {
  const navigate = useNavigate();
  const [actividad, setActividad] = useState('Abrir una cafetería');
  const [direccion, setDireccion] = useState('Av. Cabildo 2040, Belgrano');
  const [error, setError] = useState(false);

  const usarEjemplo = (a, d) => {
    setActividad(a);
    setDireccion(d);
    setError(false);
  };

  const enviar = (e) => {
    e.preventDefault();
    const a = actividad.trim();
    const d = direccion.trim();
    if (!a || !d) return setError(true);
    setError(false);
    navigate('/analisis?' + new URLSearchParams({ actividad: a, direccion: d }).toString());
  };

  return (
    <>
      <Header />
      <Steps active={1} />

      <main className="main">
        <section className="intro">
          <h1>Contanos qué querés hacer y dónde</h1>
          <p>Indicá la actividad y la dirección. Nosotros cruzamos las fuentes oficiales de la Ciudad por vos.</p>
        </section>

        <form className="query" aria-label="Tu consulta" noValidate onSubmit={enviar}>
          <div className="query__group">
            <label htmlFor="actividad">¿Qué actividad querés realizar?</label>
            <input
              id="actividad" name="actividad" type="text" required
              value={actividad} onChange={(e) => setActividad(e.target.value)}
              aria-invalid={error && !actividad.trim() ? 'true' : undefined}
            />
          </div>
          <div className="query__group">
            <label htmlFor="direccion">¿En qué dirección?</label>
            <input
              id="direccion" name="direccion" type="text" required
              value={direccion} onChange={(e) => setDireccion(e.target.value)}
              aria-invalid={error && !direccion.trim() ? 'true' : undefined}
            />
            <span className="hint">Calle y altura, o el barrio.</span>
          </div>
          {error && <p className="error" role="alert">Completá la actividad y la dirección para continuar.</p>}
          <button className="btn btn--primary" type="submit">Consultar requisitos <span aria-hidden="true">→</span></button>
        </form>

        <section className="examples">
          <span className="hint">O probá con un ejemplo</span>
          <div className="examples__list">
            {EJEMPLOS.map(([a, d, texto]) => (
              <button key={texto} className="chip" type="button" onClick={() => usarEjemplo(a, d)}>{texto}</button>
            ))}
          </div>
        </section>

        <section className="features">
          <article className="feature"><div className="feature__icon"></div><div><h2>Varias fuentes, una respuesta</h2><p>Cruzamos trámites, normativa y datos territoriales al mismo tiempo.</p></div></article>
          <article className="feature"><div className="feature__icon"></div><div><h2>Cada dato con su fuente</h2><p>Vas a ver de dónde sale cada requisito y cada afirmación.</p></div></article>
          <article className="feature"><div className="feature__icon"></div><div><h2>Tu ubicación en el mapa</h2><p>Te mostramos la zona consultada con sus capas de información.</p></div></article>
        </section>
      </main>

      <Footer />
    </>
  );
}
