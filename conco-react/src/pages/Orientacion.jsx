import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Steps from '../components/Steps.jsx';
import QueryBar from '../components/QueryBar.jsx';
import Footer from '../components/Footer.jsx';
import { useQuery } from '../useQuery.js';
import '../styles/orientacion.css';

export default function Orientacion() {
  const { calle, to } = useQuery();
  const lista = useRef(null);
  const [revisados, setRevisados] = useState(0);

  // Cuenta cuántos requisitos tildó la persona.
  const contar = () =>
    setRevisados(lista.current.querySelectorAll('input:checked').length);

  return (
    <>
      <Header />
      <Steps active={3} />
      <QueryBar tab="orientacion" />
      <main className="layout">
          <div className="col-main">

            <section className="section" aria-labelledby="h-tramites">
              <div className="section__head"><h2 id="h-tramites">Trámites relacionados</h2><span className="count">3 trámites</span></div>
              <div className="grid-3">
              <article className="box tramite">
                <span className="tag">Primer paso</span>
                <h3>Consulta de uso del suelo y zonificación</h3>
                <p>Verifica si el rubro está permitido en la dirección consultada.</p>
                <span className="tramite__org">Organismo: [nombre del organismo]</span>
                <a href="#">Ver detalle</a>
              </article>
              <article className="box box--hl tramite">
                <span className="tag tag--main">Principal</span>
                <h3>Habilitación comercial</h3>
                <p>Trámite que autoriza el funcionamiento del local como cafetería.</p>
                <span className="tramite__org">Organismo: [nombre del organismo]</span>
                <a href="#">Ver detalle</a>
              </article>
              <article className="box tramite">
                <span className="tag tag--maybe">Según el caso</span>
                <h3>Aptitud ambiental</h3>
                <p>Puede requerirse según la superficie y las características del local.</p>
                <span className="tramite__org">Organismo: [nombre del organismo]</span>
                <a href="#">Ver detalle</a>
              </article>
              </div>
            </section>

            <section className="section" aria-labelledby="h-req">
              <div className="section__head"><h2 id="h-req">Requisitos obligatorios</h2><span className="progress" aria-live="polite">{revisados} de 4 revisados</span></div>
              <div className="box checklist" onChange={contar} ref={lista}>
              <label className="check"><input type="checkbox" /><span className="check__text"><strong>El rubro debe estar permitido en la zona</strong><span>La actividad tiene que ser compatible con el uso del suelo de la dirección.</span></span><a className="ref" href="#fuente-1">[1]</a></label>
              <label className="check"><input type="checkbox" /><span className="check__text"><strong>Acreditar el derecho sobre el local</strong><span>Título de propiedad o contrato de locación vigente a nombre del solicitante.</span></span><a className="ref" href="#fuente-2">[2]</a></label>
              <label className="check"><input type="checkbox" /><span className="check__text"><strong>Condiciones del local</strong><span>Superficie, sanitarios y salidas acordes a la actividad.</span></span><a className="ref" href="#fuente-3">[3]</a></label>
              <label className="check"><input type="checkbox" /><span className="check__text"><strong>Inscripciones y habilitaciones del titular</strong><span>Alta impositiva y certificado de manipulación de alimentos del personal.</span></span><a className="ref" href="#fuente-2">[2]</a></label>
              </div>
            </section>

            <section className="section" aria-labelledby="h-cat">
              <div className="section__head"><h2 id="h-cat">Requisitos por categoría</h2><span className="count">4 categorías</span></div>
              <div className="cats">
              <article className="box cat">
                <div className="cat__head"><div className="cat__icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#035C80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 3h7l4 4v14H7z"></path><path d="M14 3v4h4M10 12h5M10 16h5"></path></svg></div><h3>Documentación</h3></div>
                <ul><li>DNI y CUIT del titular</li><li>Título o contrato de alquiler vigente</li><li>Plano del local</li></ul>
                <span className="cat__src">Fuente: <a className="ref" href="#fuente-2">[2]</a></span>
              </article>
              <article className="box cat">
                <div className="cat__head"><div className="cat__icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#035C80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"></path><path d="M8.5 12l2.5 2.5 4.5-5"></path></svg></div><h3>Seguridad</h3></div>
                <ul><li>Salidas acordes a la actividad</li><li>Prevención de incendios, según superficie y aforo</li><li>Instalaciones en condiciones [a completar]</li></ul>
                <span className="cat__src">Fuente: <a className="ref" href="#fuente-3">[3]</a></span>
              </article>
              <article className="box cat">
                <div className="cat__head"><div className="cat__icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#035C80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"></path></svg></div><h3>Higiene</h3></div>
                <ul><li>Certificado de manipulación de alimentos del personal</li><li>Sanitarios acordes a la actividad</li><li>Condiciones de limpieza del local [a completar]</li></ul>
                <span className="cat__src">Fuente: <a className="ref" href="#fuente-3">[3]</a></span>
              </article>
              <article className="box box--hl cat cat--hl">
                <div className="cat__head"><div className="cat__icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="5"></circle><path d="M9 13.5L8 21l4-2 4 2-1-7.5"></path><path d="M10 9l1.5 1.5L14 8"></path></svg></div><h3>Habilitación</h3></div>
                <ul><li>Consulta de uso del suelo aprobada</li><li>Solicitud de habilitación en línea</li><li>Pago de aranceles e inspección, si corresponde</li></ul>
                <span className="cat__src">Fuente: <a className="ref" href="#fuente-1">[1]</a> <a className="ref" href="#fuente-2">[2]</a></span>
              </article>
              </div>
            </section>

            <section className="section" aria-labelledby="h-doc">
              <h2 id="h-doc">Documentación necesaria</h2>
              <div className="grid-2">
              <div className="box doc"><div className="doc__icon"></div><div><strong>DNI y CUIT del titular</strong><span>Copia digital</span></div></div>
              <div className="box doc"><div className="doc__icon"></div><div><strong>Título o contrato de alquiler</strong><span>Vigente, con firmas certificadas</span></div></div>
              <div className="box doc"><div className="doc__icon"></div><div><strong>Plano del local</strong><span>Con distribución y superficies</span></div></div>
              <div className="box doc"><div className="doc__icon"></div><div><strong>Constancia de inscripción impositiva</strong><span>Nacional y de la Ciudad</span></div></div>
              <div className="box doc"><div className="doc__icon"></div><div><strong>Certificado de manipulación de alimentos</strong><span>Del personal a cargo</span></div></div>
              <div className="box doc doc--opt"><div className="doc__icon"></div><div><strong>Certificado de aptitud ambiental</strong><span>Solo si corresponde</span></div></div>
              </div>
            </section>

            <section className="section" aria-labelledby="h-pasos">
              <h2 id="h-pasos">Pasos a seguir</h2>
              <ol className="box timeline">
              <li className="tl"><div className="tl__rail"><span className="tl__n">1</span><div className="tl__line"></div></div><div className="tl__body"><strong>Confirmar que el rubro está permitido en la dirección</strong><span>Hacé la consulta de uso del suelo antes de alquilar o invertir.</span></div></li>
              <li className="tl"><div className="tl__rail"><span className="tl__n">2</span><div className="tl__line"></div></div><div className="tl__body"><strong>Reunir la documentación</strong><span>Digitalizá cada documento de la lista anterior.</span></div></li>
              <li className="tl"><div className="tl__rail"><span className="tl__n">3</span><div className="tl__line"></div></div><div className="tl__body"><strong>Iniciar el trámite de habilitación en línea</strong><span>Cargá los datos del local y adjuntá los documentos.</span></div></li>
              <li className="tl"><div className="tl__rail"><span className="tl__n">4</span><div className="tl__line"></div></div><div className="tl__body"><strong>Abonar los aranceles y esperar la verificación</strong><span>Puede incluir una inspección del local, según el caso.</span><span className="plazo">Plazo estimado: [a completar]</span></div></li>
              <li className="tl"><div className="tl__rail"><span className="tl__n tl__n--last">5</span></div><div className="tl__body"><strong>Recibir la habilitación y abrir el local</strong><span>Guardá la constancia y exhibila en el local.</span></div></li>
              </ol>
            </section>

            <p className="note">Texto ilustrativo del wireframe: los contenidos reales se completan con las fuentes oficiales.</p>
          </div>

          <aside className="col-side" aria-label="Información complementaria">
            <section className="box side">
              <h2>Tu ubicación</h2>
              <div className="minimap" aria-hidden="true"><div className="minimap__dot"></div><div className="minimap__label">{calle}</div></div>
              <Link className="link" to={to('/mapa')}>Abrir mapa interactivo →</Link>
            </section>
            <section className="box side">
              <h2>¿Te quedan dudas?</h2>
              <p>Preguntale al asistente. Responde solo con información oficial y te muestra las fuentes.</p>
              <Link className="btn btn--primary btn--block" to={to('/asistente')}>Hablar con el asistente</Link>
            </section>
            <section className="box side" aria-labelledby="h-fuentes">
              <h2 id="h-fuentes">Fuentes consultadas</h2>
              <div className="src" id="fuente-1"><span className="ref">[1]</span><span>Código Urbanístico de la Ciudad</span></div>
              <div className="src" id="fuente-2"><span className="ref">[2]</span><span>Guía de trámites de habilitación</span></div>
              <div className="src" id="fuente-3"><span className="ref">[3]</span><span>Normativa de control y habilitaciones</span></div>
              <div className="src" id="fuente-4"><span className="ref">[4]</span><span>Mapa y datos abiertos de la Ciudad</span></div>
              <span className="note">Última actualización de datos: [fecha]</span>
            </section>
          </aside>
        </main>
      <Footer />
    </>
  );
}
