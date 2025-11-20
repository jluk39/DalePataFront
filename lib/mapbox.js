/**
 * Servicio de Mapbox para el frontend
 * Proporciona funcionalidades de geocoding y mapas
 */

// Token público de Mapbox (debe estar en variables de entorno)
export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

/**
 * Geocodificar dirección a coordenadas
 * @param {string} address - Dirección a geocodificar
 * @returns {Promise<{lat: number, lon: number, formatted: string} | null>}
 */
export const geocodeAddress = async (address) => {
  if (!MAPBOX_TOKEN) {
    console.warn('⚠️ MAPBOX_TOKEN no configurado');
    return null;
  }

  if (!address || address.trim() === '') {
    return null;
  }

  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&country=AR&limit=1&language=es`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const [lon, lat] = data.features[0].center;
      return {
        lat,
        lon,
        formatted: data.features[0].place_name
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error geocodificando dirección:', error);
    return null;
  }
};

/**
 * Geocodificación inversa: coordenadas a dirección
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @returns {Promise<string | null>}
 */
export const reverseGeocode = async (lat, lon) => {
  if (!MAPBOX_TOKEN) {
    console.warn('⚠️ MAPBOX_TOKEN no configurado');
    return null;
  }

  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MAPBOX_TOKEN}&limit=1&language=es`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      return data.features[0].place_name;
    }
    
    return null;
  } catch (error) {
    console.error('Error en geocodificación inversa:', error);
    return null;
  }
};

/**
 * Configuración por defecto de Mapbox
 */
export const MAPBOX_CONFIG = {
  center: [-58.3816, -34.6037], // Buenos Aires
  zoom: 11,
  style: 'mapbox://styles/mapbox/streets-v12'
};

/**
 * Calcular distancia entre dos puntos (Haversine)
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Distancia en kilómetros
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en km
  const toRad = (deg) => deg * (Math.PI / 180);
  
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // 2 decimales
};
