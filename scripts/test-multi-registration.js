/**
 * Script de prueba para el registro multi-tipo
 * Verifica que todos los endpoints de registro funcionen correctamente
 */

const API_BASE_URL = 'http://localhost:3001/api'

// Ejemplos de datos para cada tipo de usuario
const testData = {
  usuario: {
    nombre: "Juan Carlos",
    apellido: "Pérez",
    email: "juan.perez@test.com",
    password: "123456",
    telefono: "+54 11 1234-5678"
  },
  
  refugio: {
    nombre: "Refugio Patitas Felices",
    email: "refugio@patitasfelices.com",
    password: "refugio123",
    telefono: "+54 11 2345-6789",
    direccion: "Av. San Martín 1234, Buenos Aires",
    tipo_organizacion: "Refugio",
    capacidad: 50
  },
  
  veterinaria: {
    nombre: "Clínica Veterinaria San Luis",
    email: "clinica@sanluisvet.com",
    password: "clinica123",
    telefono: "+54 11 3456-7890",
    direccion: "Plaza Central 789, Buenos Aires",
    especialidades: "Cirugía, Medicina General, Dermatología",
    horarios: "Lun-Vie 8:00-18:00, Sáb 8:00-12:00"
  },
  
  medico: {
    nombre: "Dr. Ana García",
    email: "ana.garcia@veterinario.com",
    password: "doctor123",
    telefono: "+54 11 4567-8901",
    especialidad: "Cirugía",
    matricula: "VET-12345",
    veterinaria_id: 1
  }
}

const endpoints = {
  usuario: '/auth/register/usuario',
  refugio: '/auth/register/refugio', 
  veterinaria: '/auth/register/veterinaria',
  medico: '/auth/register/medico'
}

async function testRegistration(userType, userData) {
  console.log(`\n🧪 Probando registro de ${userType}...`)
  console.log('📤 Datos:', JSON.stringify(userData, null, 2))
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoints[userType]}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    
    const result = await response.json()
    
    if (response.ok) {
      console.log(`✅ ${userType} registrado exitosamente:`)
      console.log('📥 Respuesta:', JSON.stringify(result, null, 2))
      
      if (result.token) {
        console.log('🔑 Token recibido:', result.token.substring(0, 50) + '...')
      }
    } else {
      console.log(`❌ Error registrando ${userType}:`)
      console.log('📥 Error:', JSON.stringify(result, null, 2))
    }
    
    return { success: response.ok, result }
    
  } catch (error) {
    console.log(`🔥 Error de conexión para ${userType}:`, error.message)
    return { success: false, error: error.message }
  }
}

async function runTests() {
  console.log('🚀 Iniciando pruebas de registro multi-tipo')
  console.log('🎯 Backend URL:', API_BASE_URL)
  
  const results = {}
  
  // Probar cada tipo de usuario
  for (const [userType, userData] of Object.entries(testData)) {
    // Agregar timestamp al email para evitar duplicados
    const testUserData = {
      ...userData,
      email: userData.email.replace('@', `+${Date.now()}@`)
    }
    
    results[userType] = await testRegistration(userType, testUserData)
    
    // Pausa entre pruebas
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  // Resumen final
  console.log('\n📊 RESUMEN DE PRUEBAS:')
  console.log('='.repeat(50))
  
  for (const [userType, result] of Object.entries(results)) {
    const status = result.success ? '✅ ÉXITO' : '❌ FALLO'
    console.log(`${status} - ${userType.toUpperCase()}`)
    
    if (!result.success && result.error) {
      console.log(`   Error: ${result.error}`)
    }
  }
  
  const successCount = Object.values(results).filter(r => r.success).length
  const totalCount = Object.keys(results).length
  
  console.log(`\n🎯 Resultado final: ${successCount}/${totalCount} tipos registrados exitosamente`)
  
  if (successCount === totalCount) {
    console.log('🎉 ¡Todos los tipos de usuario pueden registrarse correctamente!')
  } else {
    console.log('⚠️  Algunos tipos de usuario tienen problemas de registro')
  }
}

// Ejecutar si se llama directamente
if (typeof window === 'undefined') {
  runTests().catch(console.error)
}

module.exports = { testData, testRegistration, runTests }