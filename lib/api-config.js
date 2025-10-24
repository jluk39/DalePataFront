// API Configuration and utilities
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3
}

export const API_ENDPOINTS = {
  // Health check
  HEALTH: '/health',
  
  // Authentication
  LOGIN: '/auth/login',
  REGISTER_USER: '/auth/register/usuario',
  REGISTER_SHELTER: '/auth/register/refugio',
  REGISTER_VET: '/auth/register/veterinaria',
  REGISTER_DOCTOR: '/auth/register/medico',
  PROFILE: '/auth/profile',
  UPDATE_PROFILE: '/auth/profile',
  UPDATE_PASSWORD: '/auth/change-password',
  REFRESH_TOKEN: '/auth/refresh-token',
  CHECK_EMAIL: (email) => `/auth/check-email/${encodeURIComponent(email)}`,
  
  // Pets
  LIST_PETS: '/listarMascotas',
  GET_PET: (id) => `/mascotas/${id}`,
  MY_PETS: '/mascotas/mis-mascotas',
  CREATE_PET: '/mascotas',
  UPDATE_PET: (id) => `/mascotas/${id}`,
  DELETE_PET: (id) => `/mascotas/${id}`,

  // Adoption Requests
  LIST_ADOPTION_REQUESTS: '/solicitudes',
  GET_ADOPTION_REQUEST: (id) => `/solicitudes/${id}`,
  CREATE_ADOPTION_REQUEST: (mascota_id) => `/solicitudes/mascota/${mascota_id}`,
  UPDATE_ADOPTION_REQUEST_STATUS: (id) => `/solicitudes/${id}/estado`,

}

// Debug helper
export const debugLog = (message, data = null) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API Debug] ${message}`, data || '')
  }
}

// Error handler helper
export const handleApiError = (error, context = '') => {
  const message = error instanceof Error ? error.message : 'Error desconocido'
  console.error(`[API Error${context ? ` - ${context}` : ''}]:`, message)
  
  // You can add more sophisticated error handling here
  // like sending to error tracking service
  
  return new Error(message)
}