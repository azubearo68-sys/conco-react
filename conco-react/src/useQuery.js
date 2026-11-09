import { useSearchParams } from 'react-router-dom';

// La consulta (actividad + dirección) viaja en la URL entre una pantalla y otra.
export function useQuery() {
  const [params] = useSearchParams();
  const actividad = (params.get('actividad') || '').trim();
  const direccion = (params.get('direccion') || '').trim();
  const partes = direccion.split(',');
  const calle = partes[0].trim();
  const barrio = partes.slice(1).join(',').trim();
  const search = actividad || direccion ? '?' + new URLSearchParams({ actividad, direccion }).toString() : '';

  // to('/mapa') -> mismo destino pero conservando la consulta.
  const to = (pathname) => ({ pathname, search });
  return { actividad, direccion, calle, barrio, search, to };
}
