import { API_CONFIG, API_ENDPOINTS, debugLog, handleApiError } from './api-config.js'

export class ApiService {
  // Helper method for handling API responses and token expiration
  static async handleResponse(response) {
    if (response.status === 401) {
      // Token expired or invalid
      this.logout()
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }
  static async fetchPets() {
    try {
      const token = this.getToken()
      const headers = {
        'Content-Type': 'application/json',
      }
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.LIST_PETS}`, {
        method: 'GET',
        headers,
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error fetching pets')
      }
      
      // Transform the API data to match our component structure
      return result.data.map(pet => ({
        id: pet.id,
        name: pet.nombre,
        age: pet.edad || 'Edad no especificada', // La edad ya viene formateada desde la API
        gender: pet.genero, // Usar 'genero' según estructura de API
        location: pet.ubicacion,
        shelter: pet.refugio,
        description: pet.acercaDe && !pet.acercaDe.includes('Estado de salud:') ? pet.acercaDe : "",
        image: pet.imagen, // Usar 'imagen' en lugar de 'imagen_url'
        phone: pet.telefono_refugio,
        shelterId: pet.refugio_id,
        species: pet.especie, // Campo directo en lista de mascotas
        breed: pet.raza, // Campo directo en lista de mascotas
        healthStatus: pet.estado_salud, // Campo directo en lista de mascotas
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

  static async fetchMyPets() {
    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('Usuario no autenticado')
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.MY_PETS}`, {
        method: 'GET',
        headers,
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error fetching my pets')
      }
      
      // Transform the API data to match our component structure
      return result.data.map(pet => ({
        id: pet.id,
        name: pet.nombre,
        age: pet.edad || 'Edad no especificada',
        gender: pet.genero,
        location: pet.ubicacion,
        shelter: pet.refugio,
        description: pet.acercaDe && !pet.acercaDe.includes('Estado de salud:') ? pet.acercaDe : "",
        image: pet.imagen,
        phone: pet.telefono_refugio,
        shelterId: pet.refugio_id,
        species: pet.especie,
        breed: pet.raza,
        healthStatus: pet.estado_salud,
        // ✅ Estado de mascota perdida
        esta_perdida: pet.esta_perdida || false,
        isLost: pet.esta_perdida || false, // También en inglés para compatibilidad
        // ✅ Campos adicionales para el modal de edición
        fecha_nacimiento: pet.fecha_nacimiento,
        color: pet.color,
        peso: pet.peso,
        tamaño: pet.tamaño,
        weight: pet.peso, // También en inglés para compatibilidad
        size: pet.tamaño, // También en inglés para compatibilidad
        // ✅ Estado de adopción para el modal
        en_adopcion: pet.en_adopcion,
        availableForAdoption: pet.en_adopcion, // También en inglés para compatibilidad
        // Additional fields
        adoptionDate: pet.fecha_adopcion ? new Date(pet.fecha_adopcion).toLocaleDateString('es-ES') : null,
        vaccinated: pet.estado_salud === 'Saludable' || pet.estado_salud?.includes('Vacunado'),
        sterilized: false,
        urgent: false,
        status: pet.estado_salud,
        // Indicate this is an owned pet
        isOwned: true
      }))
    } catch (error) {
      console.error('Error fetching my pets:', error)
      throw error
    }
  }

  static async createPet(formData) {
    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('Usuario no autenticado. Por favor, inicia sesión.')
      }

      // NO agregar Content-Type cuando se usa FormData
      // FormData lo establece automáticamente con el boundary correcto
      const headers = {
        'Authorization': `Bearer ${token}`,
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/mascotas`, {
        method: 'POST',
        headers,
        body: formData, // FormData se envía directamente
      })
      
      let result
      try {
        const responseText = await response.text()
        console.log('📄 Body de respuesta (texto):', responseText)
        result = JSON.parse(responseText)
        console.log('📄 Body de respuesta (parseado):', JSON.stringify(result, null, 2))
      } catch (e) {
        console.error('❌ Error al parsear JSON:', e)
        const errorText = await response.text().catch(() => 'No se pudo leer la respuesta')
        console.error('Texto de respuesta:', errorText)
        throw new Error('Respuesta del servidor no es JSON válido')
      }

      if (!response.ok) {
        console.error('❌ ERROR DEL BACKEND:', result)
        
        // Manejar errores específicos del backend
        if (response.status === 401) {
          this.logout()
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
        }
        
        if (response.status === 403) {
          throw new Error('No tienes permisos para registrar mascotas.')
        }

        if (response.status === 400) {
          // Error de validación
          console.error('🔴 Error 400 - Detalles:', result)
          
          if (result.campos_faltantes) {
            const mensaje = `Faltan campos obligatorios: ${result.campos_faltantes.join(', ')}`
            console.error('🔴', mensaje)
            throw new Error(mensaje)
          }
          
          if (result.campos_requeridos) {
            const mensaje = `Campos requeridos: ${result.campos_requeridos.join(', ')}`
            console.error('🔴', mensaje)
            throw new Error(mensaje)
          }
          
          throw new Error(result.message || 'Datos inválidos. Revisa el formulario.')
        }

        throw new Error(result.message || `Error al registrar mascota (${response.status})`)
      }
      
      if (!result.success) {
        throw new Error(result.message || 'Error al registrar mascota')
      }

      return result.data
    } catch (error) {
      console.error('Error al crear mascota:', error.message)
      throw error
    }
  }

  static async fetchPetById(petId) {
    try {
      const token = this.getToken()
      const headers = {
        'Content-Type': 'application/json',
      }
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.GET_PET(petId)}`, {
        method: 'GET',
        headers,
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
        age: pet.edad || 'Edad no especificada', // La edad ya viene formateada desde la API
        gender: pet.genero,
        color: 'No especificado', // No viene en la API
        size: 'No especificado', // No viene en la API
        weight: 'No especificado', // No viene en la API
        location: pet.ubicacion,
        rescueDate: pet.updated_at ? new Date(pet.updated_at).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }) : 'No disponible',
        status: pet.detalles?.estado_salud || 'Disponible',
        description: pet.acercaDe && !pet.acercaDe.includes('Estado de salud:') ? pet.acercaDe : "",
        image: pet.imagen, // Usar 'imagen' en lugar de 'imagen_url'
        personality: [], // No viene en la API, array vacío
        medicalHistory: pet.detalles?.estado_salud ? [pet.detalles.estado_salud] : [],
        requirements: [], // No viene en la API, array vacío
        phone: pet.contacto?.telefono || pet.telefono_refugio,
        email: pet.contacto?.email || pet.email_refugio,
        shelter: pet.refugio,
        species: pet.detalles?.especie || 'No especificado',
        shelterId: pet.contacto?.refugio_id || pet.refugio_id
      }
    } catch (error) {
      console.error('Error fetching pet by ID:', error)
      throw error
    }
  }



  static async getAdminPets() {
    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('Usuario no autenticado')
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }

      // Usar MY_PETS para obtener TODAS las mascotas del refugio (disponibles y no disponibles)
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.MY_PETS}`, {
        method: 'GET',
        headers,
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error fetching admin pets')
      }
      
      // Transform the API data to match admin component structure
      console.log('🔍 Ejemplo de mascota del backend:', result.data[0])
      
      return result.data.map(pet => {
        // Manejar en_adopcion con múltiples fallbacks
        const enAdopcion = pet.en_adopcion !== undefined 
          ? pet.en_adopcion 
          : (pet.availableForAdoption !== undefined ? pet.availableForAdoption : true)
        
        return {
          id: pet.id,
          // Campos en español para el backend
          nombre: pet.nombre,
          especie: pet.especie,
          raza: pet.raza,
          edad_anios: pet.edad_anios || pet.edad,
          fecha_nacimiento: pet.fecha_nacimiento,
          sexo: pet.sexo || pet.genero,
          estado_salud: pet.estado_salud,
          en_adopcion: enAdopcion,
          imagen_url: pet.imagen,
          color: pet.color,
          peso: pet.peso,
          tamaño: pet.tamaño,
          descripcion: pet.descripcion && !pet.descripcion.includes('Estado de salud:') ? pet.descripcion : "",
          created_at: pet.updated_at || pet.created_at,
          refugio_id: pet.refugio_id,
          duenio_usuario_id: pet.duenio_usuario_id, // Para filtrar mascotas adoptadas
          // Campos en inglés para compatibilidad con componentes existentes
          name: pet.nombre,
          species: pet.especie,
          breed: pet.raza,
          age: pet.edad || 'Edad no especificada',
          gender: pet.sexo || pet.genero,
          healthStatus: pet.estado_salud,
          availableForAdoption: enAdopcion,
          image: pet.imagen,
          weight: pet.peso,
          size: pet.tamaño,
          description: pet.descripcion && !pet.descripcion.includes('Estado de salud:') ? pet.descripcion : ""
        }
      })
    } catch (error) {
      console.error('Error fetching admin pets:', error)
      throw error
    }
  }

  static async updatePet(petId, petData) {
    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('Usuario no autenticado')
      }

      const headers = {
        'Authorization': `Bearer ${token}`
      }
      
      let body
      
      // Si petData es FormData (incluye imagen), no establecer Content-Type
      if (petData instanceof FormData) {
        body = petData
        // No establecer Content-Type para FormData, el navegador lo hace automáticamente
      } else {
        // Si es un objeto normal, convertir a JSON
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify(petData)
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPDATE_PET(petId)}`, {
        method: 'PUT',
        headers,
        body,
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error updating pet')
      }
      
      return result.data
    } catch (error) {
      console.error('Error updating pet:', error)
      throw error
    }
  }

  static async deletePet(petId) {
    try {
      const token = this.getToken()
      const headers = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.DELETE_PET(petId)}`, {
        method: 'DELETE',
        headers,
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error deleting pet')
      }
      
      return result.data
    } catch (error) {
      console.error('Error deleting pet:', error)
      throw error
    }
  }



  // Authentication methods
  static async login(email, password, userType = null) {
    try {
      console.log('Sending login data:', { email, userType })
      
      const loginData = {
        email,
        password,
      }
      
      // Incluir userType si se proporciona
      if (userType) {
        loginData.userType = userType
      }
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      console.log('Login response status:', response.status)
      
      const result = await response.json()
      console.log('Login response data:', result)

      if (!response.ok) {
        throw new Error(result.message || 'Error al iniciar sesión')
      }

      // Verificar que la respuesta tiene la estructura esperada
      if (!result.success) {
        throw new Error(result.message || 'Error en el login')
      }

      // Guardar token y usuario automáticamente si vienen en la respuesta
      if (result.token) {
        this.setToken(result.token)
      }
      
      if (result.user) {
        this.setUser(result.user)
      }

      console.log('✅ Login successful, data saved')
      return result
    } catch (error) {
      console.error('Error during login:', error)
      throw error
    }
  }

  static async register(userData) {
    try {
      debugLog('Sending registration data:', { ...userData, password: '***hidden***' })
      
      // Validate required fields
      const requiredFields = ['nombre', 'apellido', 'email', 'password']
      const missingFields = requiredFields.filter(field => !userData[field]?.trim())
      
      if (missingFields.length > 0) {
        throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`)
      }


      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.REGISTER_USER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const result = await response.json()

      if (!response.ok) {
        console.log('❌ Error del backend - Status:', response.status)
        console.log('❌ Error del backend - Respuesta:', result)
        
        // Manejo específico de errores
        let errorMessage = 'Error en el registro'
        
        if (response.status === 400) {
          if (result.message && result.message.includes('email ya está registrado')) {
            errorMessage = 'Este email ya está registrado. ¿Ya tienes una cuenta?'
          } else if (result.message && result.message.includes('validación')) {
            errorMessage = 'Los datos ingresados no son válidos. Verifica tu información.'
          } else if (result.error) {
            errorMessage = result.error
          } else if (result.message) {
            errorMessage = result.message
          } else {
            errorMessage = 'Datos de registro inválidos'
          }
        } else {
          errorMessage = result.message || result.error || `Error HTTP ${response.status}`
        }
        
        throw new Error(errorMessage)
      }

      // Verificar que la respuesta tiene la estructura esperada
      if (!result.success) {
        throw new Error(result.message || 'Error en el registro')
      }

      return result
    } catch (error) {
      console.log('🔥 Error capturado en ApiService.register:', error)
      throw handleApiError(error, 'Registration')
    }
  }

  // Nuevo método para registro por tipo de usuario
  static async registerByType(userData, userType) {
    try {
      debugLog(`Sending registration data for ${userType}:`, { ...userData, password: '***hidden***' })
      
      // Determinar el endpoint según el tipo de usuario
      let endpoint = API_ENDPOINTS.REGISTER_USER // default
      switch (userType) {
        case 'usuario':
          endpoint = API_ENDPOINTS.REGISTER_USER
          break
        case 'refugio':
          endpoint = API_ENDPOINTS.REGISTER_SHELTER
          break
        case 'veterinaria':
          endpoint = API_ENDPOINTS.REGISTER_VET
          break
        case 'medico':
          endpoint = API_ENDPOINTS.REGISTER_DOCTOR
          break
        default:
          throw new Error(`Tipo de usuario no válido: ${userType}`)
      }


      
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const result = await response.json()

      if (!response.ok) {
        console.log('❌ Error del backend - Status:', response.status)
        console.log('❌ Error del backend - Respuesta:', result)
        
        // Manejo específico de errores
        let errorMessage = 'Error en el registro'
        
        if (response.status === 400) {
          if (result.message && result.message.includes('email ya está registrado')) {
            errorMessage = 'Este email ya está registrado. ¿Ya tienes una cuenta?'
          } else if (result.message && result.message.includes('validación')) {
            errorMessage = 'Los datos ingresados no son válidos. Verifica tu información.'
          } else if (result.error) {
            errorMessage = result.error
          } else if (result.message) {
            errorMessage = result.message
          } else {
            errorMessage = 'Datos de registro inválidos'
          }
        } else {
          errorMessage = result.message || result.error || `Error HTTP ${response.status}`
        }
        
        throw new Error(errorMessage)
      }

      // Verificar que la respuesta tiene la estructura esperada
      if (!result.success) {
        throw new Error(result.message || 'Error en el registro')
      }

      return result
    } catch (error) {
      console.log('🔥 Error capturado en ApiService.registerByType:', error)
      throw handleApiError(error, 'Registration')
    }
  }

  static async getUserProfile() {
    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PROFILE}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          this.removeToken()
          throw new Error('Token expirado')
        }
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al obtener perfil')
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error getting user profile:', error)
      throw error
    }
  }

  static async updateUserProfile(userData) {
    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPDATE_PROFILE}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        if (response.status === 401) {
          this.removeToken()
          throw new Error('Token expirado')
        }
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al actualizar perfil')
      }

      const result = await response.json()
      
      // Actualizar el usuario almacenado si la respuesta incluye datos actualizados
      if (result.success && result.data) {
        this.setUser(result.data)
      }
      
      return result.data || result
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  static async updatePassword(passwordData) {
    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPDATE_PASSWORD}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      })

      if (!response.ok) {
        if (response.status === 401) {
          this.removeToken()
          throw new Error('Token expirado')
        }
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al actualizar contraseña')
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error updating password:', error)
      throw error
    }
  }

  static async refreshToken() {
    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.REFRESH_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al renovar token')
      }

      const result = await response.json()
      if (result.token) {
        this.setToken(result.token)
      }
      return result
    } catch (error) {
      console.error('Error refreshing token:', error)
      throw error
    }
  }

  static async checkEmailAvailability(email) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CHECK_EMAIL(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al verificar email')
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error checking email availability:', error)
      throw error
    }
  }

  // Token management methods
  static getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dalepata-auth-token')
    }
    return null
  }

  static setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dalepata-auth-token', token)
    }
  }

  static removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dalepata-auth-token')
      localStorage.removeItem('dalepata-user')
    }
  }

  static getUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('dalepata-user')
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  }

  static setUser(user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dalepata-user', JSON.stringify(user))
    }
  }

  static removeUser() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dalepata-user')
    }
  }

  static logout() {
    this.removeToken()
    this.removeUser()
  }

  // Adoption Requests methods
  static async getAdoptionRequests(params = {}) {
    try {
      const token = this.getToken()
      const headers = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      // Construir query params
      const queryParams = new URLSearchParams()
      if (params.estado) queryParams.append('estado', params.estado)
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)

      const queryString = queryParams.toString()
      const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.LIST_ADOPTION_REQUESTS}${queryString ? `?${queryString}` : ''}`

      const response = await fetch(url, {
        method: 'GET',
        headers,
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error fetching adoption requests')
      }
      
      return result.data
    } catch (error) {
      console.error('Error fetching adoption requests:', error)
      throw error
    }
  }

  static async getAdoptionRequestById(requestId) {
    try {
      const token = this.getToken()
      const headers = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.GET_ADOPTION_REQUEST(requestId)}`, {
        method: 'GET',
        headers,
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error fetching adoption request')
      }
      
      return result.data
    } catch (error) {
      console.error('Error fetching adoption request:', error)
      throw error
    }
  }

  static async createAdoptionRequest(petId, formData) {
    try {
      debugLog('Creating adoption request:', { petId, formData: { ...formData, adoptionReason: '***truncated***' } })
      
      const token = this.getToken()
      if (!token) {
        throw new Error('Usuario no autenticado. Por favor, inicia sesión.')
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }

      // Validar datos requeridos en el frontend
      const requiredFields = {
        housingType: 'Tipo de vivienda',
        hasYard: 'Información sobre patio',
        petExperience: 'Experiencia con mascotas',
        currentPets: 'Información sobre mascotas actuales',
        adoptionReason: 'Razón de adopción',
        timeCommitment: 'Tiempo de dedicación'
      }

      const missingFields = Object.keys(requiredFields).filter(field => !formData[field] || (typeof formData[field] === 'string' && !formData[field].trim()))
      
      if (missingFields.length > 0) {
        const missingLabels = missingFields.map(field => requiredFields[field])
        throw new Error(`Campos requeridos faltantes: ${missingLabels.join(', ')}`)
      }

      // Validar longitud mínima de la razón de adopción
      if (formData.adoptionReason.trim().length < 20) {
        throw new Error('La razón de adopción debe tener al menos 20 caracteres')
      }

      console.log('📤 Enviando solicitud de adopción para mascota:', petId)
      console.log('📤 URL completa:', `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CREATE_ADOPTION_REQUEST(petId)}`)
      console.log('📤 Datos del formulario:', {
        ...formData,
        adoptionReason: `${formData.adoptionReason.substring(0, 50)}...`
      })

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CREATE_ADOPTION_REQUEST(petId)}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          housingType: formData.housingType,
          hasYard: formData.hasYard,
          landlordPermission: formData.landlordPermission || false,
          petExperience: formData.petExperience,
          currentPets: formData.currentPets,
          adoptionReason: formData.adoptionReason.trim(),
          timeCommitment: formData.timeCommitment.trim()
        }),
      })

      console.log('📥 Response status:', response.status, response.statusText)
      
      const result = await response.json()
      
      console.log('📥 Response data:', result)

      if (!response.ok) {
        console.log('❌ Error del backend - Status:', response.status)
        console.log('❌ Error del backend - Respuesta:', result)
        
        // Manejo específico de errores
        let errorMessage = 'Error al enviar solicitud de adopción'
        
        if (response.status === 400) {
          if (result.message && result.message.includes('solicitud pendiente')) {
            errorMessage = 'Ya tienes una solicitud pendiente para esta mascota'
          } else if (result.errors && typeof result.errors === 'object') {
            // Errores de validación específicos
            const errorList = Object.values(result.errors).join(', ')
            errorMessage = `Errores de validación: ${errorList}`
          } else if (result.message) {
            errorMessage = result.message
          }
        } else if (response.status === 404) {
          errorMessage = 'Mascota no encontrada o no disponible para adopción'
        } else if (response.status === 401) {
          errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.'
          this.logout()
        } else {
          errorMessage = result.message || result.error || `Error HTTP ${response.status}`
        }
        
        throw new Error(errorMessage)
      }

      // Verificar que la respuesta tiene la estructura esperada
      if (!result.success) {
        throw new Error(result.message || 'Error en la solicitud de adopción')
      }

      console.log('✅ Solicitud de adopción enviada exitosamente')
      return result
    } catch (error) {
      console.error('🔥 Error al crear solicitud de adopción:', error)
      throw error
    }
  }

  static async updateAdoptionRequestStatus(requestId, estado, comentario = '') {
    try {
      const token = this.getToken()
      const headers = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPDATE_ADOPTION_REQUEST_STATUS(requestId)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ estado, comentario }),
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error updating adoption request status')
      }
      
      return result.data
    } catch (error) {
      console.error('Error updating adoption request status:', error)
      throw error
    }
  }

  // Get user's adoption requests
  static async getMyAdoptionRequests() {
    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('No estás autenticado')
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/solicitudes/mis-solicitudes`, {
        method: 'GET',
        headers,
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error fetching adoption requests')
      }
      
      console.log('✅ Solicitudes de adopción obtenidas:', result.data)
      return result.data
    } catch (error) {
      console.error('🔥 Error al obtener solicitudes de adopción:', error)
      throw error
    }
  }

  // Cancel adoption request
  static async cancelAdoptionRequest(requestId) {
    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('No estás autenticado')
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/solicitudes/${requestId}/cancelar`, {
        method: 'PUT',
        headers,
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error canceling adoption request')
      }
      
      console.log('✅ Solicitud cancelada exitosamente')
      return result.data
    } catch (error) {
      console.error('🔥 Error al cancelar solicitud:', error)
      throw error
    }
  }

  // ========== LOST PETS METHODS ==========

  /**
   * Listar todas las mascotas perdidas
   */
  static async fetchLostPets() {
    try {
      const token = this.getToken()
      const headers = {
        'Content-Type': 'application/json',
      }
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/mascotas/perdidas`, {
        method: 'GET',
        headers,
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error fetching lost pets')
      }
      
      // Transform the API data to match our component structure
      return result.data.map(pet => ({
        id: pet.id,
        nombre: pet.nombre,
        name: pet.nombre,
        genero: pet.genero,
        gender: pet.genero,
        edad: pet.edad,
        age: pet.edad,
        imagen: pet.imagen,
        image: pet.imagen,
        especie: pet.especie,
        species: pet.especie,
        raza: pet.raza,
        breed: pet.raza,
        color: pet.color,
        descripcion: pet.descripcion,
        description: pet.descripcion,
        // Datos de pérdida
        perdida_fecha: pet.perdida_fecha,
        lostDate: pet.perdida_fecha,
        perdida_direccion: pet.perdida_direccion,
        location: pet.perdida_direccion,
        perdida_lat: pet.perdida_lat,
        lat: pet.perdida_lat,
        perdida_lon: pet.perdida_lon,
        lon: pet.perdida_lon,
        // Contacto
        reportado_por: pet.reportado_por,
        reportedBy: pet.reportado_por,
        duenio: pet.duenio,
        owner: pet.duenio
      }))
    } catch (error) {
      console.error('Error fetching lost pets:', error)
      throw error
    }
  }

  /**
   * Reportar una mascota propia como perdida
   * @param {number} petId - ID de la mascota
   * @param {object} data - { perdida_direccion, perdida_lat?, perdida_lon?, descripcion? }
   */
  static async reportPetAsLost(petId, data) {
    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('Usuario no autenticado')
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/mascotas/${petId}/reportar-perdida`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error reporting pet as lost')
      }
      
      console.log('✅ Mascota reportada como perdida:', result.data)
      return result
    } catch (error) {
      console.error('🔥 Error al reportar mascota perdida:', error)
      throw error
    }
  }

  /**
   * Reportar avistamiento de mascota perdida
   * @param {object} data - Datos del avistamiento
   */
  static async reportLostPetSighting(data) {
    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('Usuario no autenticado')
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/mascotas/reportar-avistamiento`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error reporting lost pet sighting')
      }
      
      console.log('✅ Avistamiento reportado:', result.data)
      return result
    } catch (error) {
      console.error('🔥 Error al reportar avistamiento:', error)
      throw error
    }
  }

  /**
   * Marcar mascota como encontrada
   * @param {number} petId - ID de la mascota
   * @param {string} comentario - Comentario opcional
   */
  static async markPetAsFound(petId, comentario = '') {
    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('Usuario no autenticado')
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/mascotas/${petId}/marcar-encontrada`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ comentario }),
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error marking pet as found')
      }
      
      console.log('✅ Mascota marcada como encontrada:', result.data)
      return result
    } catch (error) {
      console.error('🔥 Error al marcar mascota como encontrada:', error)
      throw error
    }
  }
}