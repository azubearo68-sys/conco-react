import { Link } from 'react-router-dom';
import { useQuery } from '../useQuery.js';

export default function Footer() {
  const { to } = useQuery();
  return (
    <footer className="footer">
        <div className="footer__inner">
          <div className="footer__brand">
            <Link className="logo logo--yellow"  aria-label="ConCo, inicio" to={'/'}>ConCo</Link>
            <p>Consultá qué necesitás para habilitar tu comercio en la Ciudad de Buenos Aires, con información de fuentes oficiales.</p>
            <h2>Seguinos</h2>
            <div className="social">
              <a href="#" aria-label="Red social 1"></a>
              <a href="#" aria-label="Red social 2"></a>
              <a href="#" aria-label="Red social 3"></a>
            </div>
          </div>
          <nav className="footer__col" aria-label="Consultas">
            <h2>Consultas</h2>
            <Link  to={'/'}>Habilitación de comercios</Link>
            <Link  to={to('/orientacion')}>Trámites y requisitos</Link>
            <Link  to={to('/mapa')}>Mapa de la Ciudad</Link>
            <a href="#">Preguntas frecuentes</a>
          </nav>
          <nav className="footer__col" aria-label="Ayuda">
            <h2>Ayuda</h2>
            <a href="#">Cómo funciona</a>
            <a href="#">Fuentes oficiales</a>
            <a href="#">Centro de ayuda</a>
            <a href="#">Accesibilidad</a>
          </nav>
          <div className="footer__col">
            <h2>Contacto</h2>
            <span>[Teléfono de atención]</span>
            <span>[Correo de contacto]</span>
            <span>[Horario de atención]</span>
          </div>
        </div>
        <div className="footer__bar">
          <span>© [año] Gobierno de la Ciudad de Buenos Aires</span>
          <a href="#">Términos y condiciones</a>
          <a href="#">Política de privacidad</a>
          <a href="#">Datos abiertos</a>
        </div>
      </footer>
  );
}
