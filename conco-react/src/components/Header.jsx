import { Link } from 'react-router-dom';
import { useQuery } from '../useQuery.js';

export default function Header() {
  const { to } = useQuery();
  return (
    <header className="header">
        <Link className="logo"  aria-label="ConCo, inicio" to={'/'}>ConCo</Link>
        <nav className="nav" aria-label="Principal">
          <a href="#">Cómo funciona</a>
          <a href="#">Fuentes oficiales</a>
          <a href="#">Ayuda</a>
        </nav>
      </header>
  );
}
