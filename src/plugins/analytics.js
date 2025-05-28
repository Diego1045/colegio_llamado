// Google Analytics 4 Configuration
// Para activar: agregar VITE_GA_MEASUREMENT_ID en .env

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

export function initializeAnalytics() {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    console.log('Google Analytics no configurado o ejecutándose en servidor')
    return
  }

  // Cargar Google Analytics 4
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  // Configurar gtag
  window.dataLayer = window.dataLayer || []
  function gtag() {
    dataLayer.push(arguments)
  }
  window.gtag = gtag

  gtag('js', new Date())
  gtag('config', GA_MEASUREMENT_ID, {
    // Configuración para aplicaciones SPA
    page_title: document.title,
    page_location: window.location.href,
    // Configuración de privacidad
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  })

  console.log('Google Analytics 4 inicializado:', GA_MEASUREMENT_ID)
}

// Función para trackear eventos personalizados
export function trackEvent(eventName, parameters = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'engagement',
      event_label: parameters.label || '',
      value: parameters.value || 0,
      ...parameters
    })
  }
}

// Función para trackear cambios de página en SPA
export function trackPageView(pagePath, pageTitle) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: pageTitle
    })
  }
}

// Eventos específicos para la aplicación escolar
export const schoolEvents = {
  // Eventos de autenticación
  login: (userRole) => trackEvent('login', { 
    method: 'email',
    user_role: userRole 
  }),
  
  logout: () => trackEvent('logout'),
  
  // Eventos de gestión de estudiantes
  studentCallRequest: (studentId) => trackEvent('student_call_request', {
    student_id: studentId,
    event_category: 'student_management'
  }),
  
  studentCallApproved: (studentId) => trackEvent('student_call_approved', {
    student_id: studentId,
    event_category: 'student_management'
  }),
  
  // Eventos de geolocalización
  locationVerified: () => trackEvent('location_verified', {
    event_category: 'security'
  }),
  
  locationDenied: () => trackEvent('location_denied', {
    event_category: 'security'
  }),
  
  // Eventos de navegación
  pageView: (pageName) => trackEvent('page_view', {
    page_name: pageName,
    event_category: 'navigation'
  })
}

// Configuración de consentimiento de cookies (GDPR)
export function initializeCookieConsent() {
  if (typeof window !== 'undefined' && window.gtag) {
    // Configuración por defecto (sin consentimiento)
    window.gtag('consent', 'default', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
      'functionality_storage': 'granted',
      'security_storage': 'granted'
    })
  }
}

// Función para actualizar consentimiento cuando el usuario acepta
export function updateCookieConsent(granted = true) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      'analytics_storage': granted ? 'granted' : 'denied',
      'ad_storage': 'denied' // Mantenemos siempre denegado para ads
    })
  }
}