import { useEffect, useState } from 'react';

// Av. Cabildo 2040, Belgrano (ubicación de referencia del ejemplo).
export const UBICACION_DEFECTO = [-34.5614, -58.4568];

// Convierte la dirección escrita en coordenadas con Nominatim (OpenStreetMap),
// limitado a la Ciudad de Buenos Aires. Si falla, usa la ubicación de referencia.
// Para producción conviene reemplazarlo por el servicio de normalización de direcciones
// del Gobierno de la Ciudad (USIG) o por tu propio backend.
export function useUbicacion(direccion) {
  const [estado, setEstado] = useState({ coords: UBICACION_DEFECTO, buscando: false, encontrada: false });

  useEffect(() => {
    if (!direccion) {
      setEstado({ coords: UBICACION_DEFECTO, buscando: false, encontrada: false });
      return;
    }
    const ctrl = new AbortController();
    setEstado((e) => ({ ...e, buscando: true }));

    const url =
      'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=ar' +
      '&viewbox=-58.53,-34.52,-58.33,-34.71&bounded=1&q=' +
      encodeURIComponent(direccion + ', Ciudad Autónoma de Buenos Aires');

    fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status))))
      .then((res) => {
        const hit = res && res[0];
        if (hit) setEstado({ coords: [parseFloat(hit.lat), parseFloat(hit.lon)], buscando: false, encontrada: true });
        else setEstado({ coords: UBICACION_DEFECTO, buscando: false, encontrada: false });
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setEstado({ coords: UBICACION_DEFECTO, buscando: false, encontrada: false });
      });

    return () => ctrl.abort();
  }, [direccion]);

  return estado;
}
