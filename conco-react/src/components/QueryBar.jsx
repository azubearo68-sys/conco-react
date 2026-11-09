import { Link } from 'react-router-dom';
import { useQuery } from '../useQuery.js';

// Barra "Tu consulta" + pestañas Orientación / Mapa / Asistente.
export default function QueryBar({ tab }) {
  const { actividad, direccion, to } = useQuery();
  const tabs = [
    ['orientacion', '/orientacion', 'Orientación'],
    ['mapa', '/mapa', 'Mapa'],
    ['asistente', '/asistente', 'Asistente'],
  ];
  return (
    <div className="qbar">
      <div className="qbar__left">
        <span className="qbar__label">Tu consulta</span>
        <span className="pill">{actividad || 'Cafetería'}</span>
        <span className="pill">{direccion || 'Av. Cabildo 2040, Belgrano'}</span>
        <Link className="edit" to="/">Editar consulta</Link>
      </div>
      <nav className="tabs" aria-label="Secciones">
        {tabs.map(([id, path, label]) =>
          id === tab ? (
            <span key={id} className="is-active" aria-current="page">{label}</span>
          ) : (
            <Link key={id} to={to(path)}>{label}</Link>
          )
        )}
      </nav>
    </div>
  );
}
