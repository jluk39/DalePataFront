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
}