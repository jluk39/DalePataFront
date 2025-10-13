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
        gender: pet.sexo, // Cambiar de genero a sexo
        location: pet.ubicacion,
        shelter: pet.refugio,
        description: pet.acercaDe,
        image: pet.imagen, // Usar 'imagen' en lugar de 'imagen_url'
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
        description: pet.acercaDe,
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
      const headers = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.LIST_PETS}`, {
        method: 'GET',
        headers,
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error fetching admin pets')
      }
      
      // Transform the API data to match admin component structure
      return result.data.map(pet => ({
        id: pet.id,
        nombre: pet.nombre,
        especie: pet.especie,
        raza: pet.raza,
        edad_anios: pet.edad, // La edad ya viene formateada desde la API (ej: "8 años")
        sexo: pet.sexo,
        estado_salud: pet.estado_salud,
        en_adopcion: pet.en_adopcion,
        imagen_url: pet.imagen, // Usar 'imagen' en lugar de 'imagen_url'
        created_at: pet.updated_at || pet.created_at // Usar updated_at como fecha principal
      }))
    } catch (error) {
      console.error('Error fetching admin pets:', error)
      throw error
    }
  }

  static async createPet(petData) {
    try {
      const token = this.getToken()
      const headers = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CREATE_PET}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(petData),
      })
      
      const result = await this.handleResponse(response)
      
      if (!result.success) {
        throw new Error(result.message || 'Error creating pet')
      }
      
      return result.data
    } catch (error) {
      console.error('Error creating pet:', error)
      throw error
    }
  }

  static async updatePet(petId, petData) {
    try {
      const token = this.getToken()
      const headers = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPDATE_PET(petId)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(petData),
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
        console.log('💾 Saving auth token to localStorage')
        this.setToken(result.token)
      }
      
      if (result.user) {
        console.log('💾 Saving user data to localStorage:', result.user.email)
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

      // Log detallado de la petición
      console.log('🚀 INICIANDO REGISTRO')
      console.log('📤 URL completa:', `${API_CONFIG.BASE_URL}${API_ENDPOINTS.REGISTER_USER}`)
      console.log('📤 Datos enviados (JSON):', JSON.stringify(userData, null, 2))
      console.log('📤 Headers:', {
        'Content-Type': 'application/json'
      })
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.REGISTER_USER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      console.log('📥 Status recibido:', response.status, response.statusText)
      
      const result = await response.json()
      
      console.log('📥 Respuesta completa del backend:', {
        url: `${API_CONFIG.BASE_URL}${API_ENDPOINTS.REGISTER_USER}`,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: result
      })

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

      console.log('🚀 INICIANDO REGISTRO POR TIPO')
      console.log('📤 Tipo de usuario:', userType)
      console.log('📤 URL completa:', `${API_CONFIG.BASE_URL}${endpoint}`)
      console.log('📤 Datos enviados (JSON):', JSON.stringify(userData, null, 2))
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      console.log('📥 Status recibido:', response.status, response.statusText)
      
      const result = await response.json()
      
      console.log('📥 Respuesta completa del backend:', {
        url: `${API_CONFIG.BASE_URL}${endpoint}`,
        status: response.status,
        statusText: response.statusText,
        body: result
      })

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
}