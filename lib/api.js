const API_BASE_URL = 'http://localhost:3001/api'

export class ApiService {
  static async fetchPets() {
    try {
      const response = await fetch(`${API_BASE_URL}/listarMascotas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || 'Error fetching pets')
      }
      
      // Transform the API data to match our component structure
      return result.data.map(pet => ({
        id: pet.id,
        name: pet.nombre,
        age: pet.edad,
        gender: pet.genero,
        location: pet.ubicacion,
        shelter: pet.refugio,
        description: pet.acercaDe,
        image: pet.imagen,
        phone: pet.telefono_refugio,
        shelterId: pet.refugio_id,
        species: pet.especie,
        breed: pet.raza,
        healthStatus: pet.estado_salud,
        // Additional fields for UI compatibility
        vaccinated: pet.estado_salud === 'Saludable' || pet.estado_salud?.includes('Vacunado'),
        sterilized: false, // This would need to be added to your API if needed
        urgent: false, // This would need to be added to your API if needed
        // For AdoptionCard compatibility
        status: pet.estado_salud
      }))
    } catch (error) {
      console.error('Error fetching pets:', error)
      throw error
    }
  }

  static async fetchPetById(petId) {
    try {
      const response = await fetch(`${API_BASE_URL}/listarMascotas/${petId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || 'Error fetching pet details')
      }
      
      // Transform the API data to match our component structure
      const pet = result.data
      return {
        id: pet.id,
        name: pet.nombre,
        breed: pet.detalles?.raza || 'No especificado',
        age: pet.edad,
        gender: pet.genero,
        color: 'No especificado', // No viene en la API
        size: 'No especificado', // No viene en la API
        weight: 'No especificado', // No viene en la API
        location: pet.ubicacion,
        rescueDate: pet.detalles?.fecha_registro ? new Date(pet.detalles.fecha_registro).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : 'No disponible',
        status: pet.detalles?.estado_salud || 'Disponible',
        description: pet.acercaDe,
        image: pet.imagen,
        personality: [], // No viene en la API, array vacío
        medicalHistory: pet.detalles?.estado_salud ? [pet.detalles.estado_salud] : [],
        requirements: [], // No viene en la API, array vacío
        phone: pet.contacto?.telefono,
        email: pet.contacto?.email,
        shelter: pet.refugio,
        species: pet.detalles?.especie || 'No especificado',
        shelterId: pet.contacto?.refugio_id
      }
    } catch (error) {
      console.error('Error fetching pet by ID:', error)
      throw error
    }
  }
}