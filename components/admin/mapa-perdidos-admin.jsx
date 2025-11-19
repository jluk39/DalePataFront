"use client"

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MAPBOX_TOKEN, MAPBOX_CONFIG } from '../../lib/mapbox'
import { Card } from '../ui/card'

/**
 * Componente de Mapa para Admin - Vista de solo lectura
 * Muestra mascotas perdidas reportadas por usuarios
 */
export function MapaPerdidosAdmin({ mascotas = [] }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markers = useRef([])
  const [mapError, setMapError] = useState(null)

  useEffect(() => {
    if (!MAPBOX_TOKEN) {
      setMapError('Token de Mapbox no configurado')
      console.warn('⚠️ MAPBOX_TOKEN no configurado')
      return
    }

    if (map.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAPBOX_CONFIG.style,
        center: MAPBOX_CONFIG.center,
        zoom: MAPBOX_CONFIG.zoom
      })

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserHeading: true
        }),
        'top-right'
      )

    } catch (error) {
      console.error('Error inicializando mapa:', error)
      setMapError('Error al cargar el mapa')
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!map.current) return

    markers.current.forEach(marker => marker.remove())
    markers.current = []

    const bounds = new mapboxgl.LngLatBounds()
    let hasValidCoordinates = false

    mascotas.forEach(mascota => {
      if (!mascota.lat || !mascota.lon) {
        console.warn(`Mascota ${mascota.name} sin coordenadas`)
        return
      }

      hasValidCoordinates = true

      const el = document.createElement('div')
      el.className = 'custom-marker'
      el.style.width = '40px'
      el.style.height = '40px'
      el.style.backgroundImage = `url(${mascota.image || '/placeholder.jpg'})`
      el.style.backgroundSize = 'cover'
      el.style.backgroundPosition = 'center'
      el.style.borderRadius = '50%'
      el.style.border = '3px solid #ef4444'
      el.style.cursor = 'pointer'
      el.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)'

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 10px; min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">${mascota.name}</h3>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Tipo:</strong> ${mascota.species || mascota.type || 'No especificado'}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Raza:</strong> ${mascota.breed || 'No especificada'}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Ubicación:</strong> ${mascota.location}</p>
          ${mascota.description ? `<p style="margin: 8px 0 4px 0; font-size: 13px; color: #666;">${mascota.description.substring(0, 100)}${mascota.description.length > 100 ? '...' : ''}</p>` : ''}
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
            <p style="margin: 4px 0; font-size: 13px; font-weight: bold;">Información de Contacto:</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Nombre:</strong> ${mascota.contactName || 'No disponible'}</p>
            ${mascota.contactPhone && mascota.contactPhone !== 'No disponible' ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Teléfono:</strong> <a href="tel:${mascota.contactPhone}" style="color: #3b82f6;">${mascota.contactPhone}</a></p>` : ''}
            ${mascota.contactEmail && mascota.contactEmail !== 'No disponible' ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Email:</strong> <a href="mailto:${mascota.contactEmail}" style="color: #3b82f6;">${mascota.contactEmail}</a></p>` : ''}
          </div>
        </div>
      `)

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([mascota.lon, mascota.lat])
        .setPopup(popup)
        .addTo(map.current)

      markers.current.push(marker)
      bounds.extend([mascota.lon, mascota.lat])
    })

    if (hasValidCoordinates && mascotas.length > 0) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 14
      })
    }
  }, [mascotas])

  if (mapError) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p>{mapError}</p>
          <p className="text-sm mt-2">Configura NEXT_PUBLIC_MAPBOX_TOKEN en las variables de entorno</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div 
        ref={mapContainer} 
        className="map-container" 
        style={{ width: '100%', height: '500px' }}
      />
    </Card>
  )
}
