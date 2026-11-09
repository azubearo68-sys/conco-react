const PASOS = ['Consulta', 'Análisis', 'Orientación', 'Mapa', 'Asistente'];

// active: número del paso actual (1 a 5). Los anteriores figuran como completados.
export default function Steps({ active }) {
  return (
    <ol className="steps" aria-label="Pasos de la consulta">
      {PASOS.map((nombre, i) => {
        const n = i + 1;
        const clase = n < active ? ' step--done' : n === active ? ' step--active' : '';
        return (
          <li key={n} className={'step' + clase} aria-current={n === active ? 'step' : undefined}>
            <span className="step__n">{n}</span>
            <span>{nombre}</span>
          </li>
        );
      })}
    </ol>
  );
}
