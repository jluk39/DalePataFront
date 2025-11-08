"use client"

import { useEffect, useRef } from 'react'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { MAPBOX_TOKEN } from '../lib/mapbox'

/**
 * Componente de Autocompletado de Direcciones con Mapbox
 * @param {function} onResult - Callback cuando se selecciona una dirección
 * @param {string} placeholder - Placeholder del input
 * @param {string} className - Clases CSS adicionales
 */
export function MapboxGeocoderInput({ onResult, placeholder = "Buscar dirección...", className = "" }) {
  const geocoderContainerRef = useRef(null)
  const geocoderRef = useRef(null)

  useEffect(() => {
    if (!MAPBOX_TOKEN) {
      console.warn('⚠️ MAPBOX_TOKEN no configurado')
      return
    }

    if (!geocoderContainerRef.current) return

    // Crear instancia del geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_TOKEN,
      types: 'address,poi,place', // Tipos de resultados
      country: 'AR', // Limitar a Argentina
      language: 'es', // Resultados en español
      placeholder: placeholder,
      mapboxgl: null, // Sin mapa asociado
    })

    // Montar el geocoder en el contenedor
    geocoderContainerRef.current.appendChild(geocoder.onAdd())
    geocoderRef.current = geocoder

    // Escuchar cuando se selecciona un resultado
    geocoder.on('result', (e) => {
      const result = e.result
      const [lon, lat] = result.center
      
      if (onResult) {
        onResult({
          address: result.place_name,
          lat,
          lon,
          formatted: result.place_name,
          center: result.center,
          bbox: result.bbox,
          raw: result
        })
      }
    })

    // Limpiar al desmontar
    return () => {
      if (geocoderRef.current) {
        geocoderRef.current.onRemove()
      }
    }
  }, [onResult, placeholder])

  return (
    <div 
      ref={geocoderContainerRef} 
      className={`mapbox-geocoder-container ${className}`}
      style={{
        width: '100%'
      }}
    />
  )
}
