import Swal from 'sweetalert2'

/**
 * Utilidades de SweetAlert2 para toda la aplicación
 * Mantiene un estilo consistente en todas las alertas
 */

// Configuración base para todas las alertas
const baseConfig = {
  customClass: {
    confirmButton: 'bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md',
    cancelButton: 'bg-muted hover:bg-muted/80 text-foreground font-medium py-2 px-4 rounded-md ml-2',
  },
  buttonsStyling: false,
}

export const showSuccess = (title, text) => {
  return Swal.fire({
    ...baseConfig,
    icon: 'success',
    title: title,
    text: text,
    confirmButtonText: 'Aceptar',
    timer: 3000,
    timerProgressBar: true,
  })
}

export const showError = (title, text) => {
  return Swal.fire({
    ...baseConfig,
    icon: 'error',
    title: title,
    text: text,
    confirmButtonText: 'Aceptar',
  })
}

export const showWarning = (title, text) => {
  return Swal.fire({
    ...baseConfig,
    icon: 'warning',
    title: title,
    text: text,
    confirmButtonText: 'Aceptar',
  })
}

export const showInfo = (title, text) => {
  return Swal.fire({
    ...baseConfig,
    icon: 'info',
    title: title,
    text: text,
    confirmButtonText: 'Aceptar',
  })
}

export const showConfirm = async (title, text, confirmText = 'Sí, confirmar', cancelText = 'Cancelar') => {
  const result = await Swal.fire({
    ...baseConfig,
    icon: 'question',
    title: title,
    text: text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
  })
  
  return result.isConfirmed
}

export const showDeleteConfirm = async (itemName) => {
  const result = await Swal.fire({
    ...baseConfig,
    icon: 'warning',
    title: '¿Estás seguro?',
    text: `¿Deseas eliminar ${itemName}? Esta acción no se puede deshacer.`,
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    customClass: {
      ...baseConfig.customClass,
      confirmButton: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium py-2 px-4 rounded-md',
      cancelButton: 'bg-muted hover:bg-muted/80 text-foreground font-medium py-2 px-4 rounded-md ml-2',
    },
  })
  
  return result.isConfirmed
}

export const showLoading = (title = 'Cargando...', text = 'Por favor espera') => {
  Swal.fire({
    title: title,
    text: text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })
}

export const closeLoading = () => {
  Swal.close()
}

// Para usar en formularios con inputs
export const showInputDialog = async (title, inputPlaceholder, inputType = 'text') => {
  const result = await Swal.fire({
    ...baseConfig,
    title: title,
    input: inputType,
    inputPlaceholder: inputPlaceholder,
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
    inputValidator: (value) => {
      if (!value) {
        return 'Este campo es requerido'
      }
    }
  })
  
  return result.isConfirmed ? result.value : null
}

export default {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showConfirm,
  showDeleteConfirm,
  showLoading,
  closeLoading,
  showInputDialog,
}
