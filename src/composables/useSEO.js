import { ref, onMounted, onUnmounted } from 'vue'

export function useSEO() {
  const defaultMeta = {
    title: 'Colegio Llamado - Sistema de Gestión de Salida Escolar',
    description: 'Sistema seguro de gestión de llamado y salida de estudiantes para colegios. Utiliza geolocalización y autenticación para garantizar la seguridad de los alumnos.',
    keywords: 'colegio, gestión escolar, salida estudiantes, seguridad escolar, geolocalización, sistema educativo, llamado alumnos',
    ogTitle: 'Colegio Llamado - Sistema de Gestión de Salida Escolar',
    ogDescription: 'Sistema seguro de gestión de llamado y salida de estudiantes para colegios.',
    ogImage: 'https://colegio-llamado.captadata.com/og-image.jpg',
    twitterTitle: 'Colegio Llamado - Sistema de Gestión de Salida Escolar',
    twitterDescription: 'Sistema seguro de gestión de llamado y salida de estudiantes para colegios.'
  }

  const currentMeta = ref({ ...defaultMeta })

  const updateMeta = (meta = {}) => {
    currentMeta.value = { ...defaultMeta, ...meta }
    
    // Actualizar title
    if (meta.title) {
      document.title = meta.title
    }
    
    // Actualizar meta tags
    updateMetaTag('description', currentMeta.value.description)
    updateMetaTag('keywords', currentMeta.value.keywords)
    
    // Actualizar Open Graph
    updateMetaTag('og:title', currentMeta.value.ogTitle, 'property')
    updateMetaTag('og:description', currentMeta.value.ogDescription, 'property')
    updateMetaTag('og:image', currentMeta.value.ogImage, 'property')
    
    // Actualizar Twitter Cards
    updateMetaTag('twitter:title', currentMeta.value.twitterTitle)
    updateMetaTag('twitter:description', currentMeta.value.twitterDescription)
    updateMetaTag('twitter:image', currentMeta.value.ogImage)
  }

  const updateMetaTag = (name, content, attribute = 'name') => {
    let element = document.querySelector(`meta[${attribute}="${name}"]`)
    
    if (element) {
      element.setAttribute('content', content)
    } else {
      element = document.createElement('meta')
      element.setAttribute(attribute, name)
      element.setAttribute('content', content)
      document.head.appendChild(element)
    }
  }

  const setPageMeta = (pageMeta) => {
    updateMeta(pageMeta)
  }

  const resetMeta = () => {
    updateMeta(defaultMeta)
  }

  // Configuraciones específicas por página
  const pageConfigs = {
    login: {
      title: 'Iniciar Sesión - Colegio Llamado',
      description: 'Accede de forma segura al sistema de gestión de salida escolar. Autenticación con geolocalización para padres y administradores.',
      ogTitle: 'Iniciar Sesión - Colegio Llamado',
      ogDescription: 'Accede de forma segura al sistema de gestión de salida escolar.',
      twitterTitle: 'Iniciar Sesión - Colegio Llamado',
      twitterDescription: 'Accede de forma segura al sistema de gestión de salida escolar.'
    },
    dashboard: {
      title: 'Panel de Control - Colegio Llamado',
      description: 'Panel de control del sistema de gestión escolar. Monitorea y gestiona la salida de estudiantes de forma segura.',
      ogTitle: 'Panel de Control - Colegio Llamado',
      ogDescription: 'Panel de control del sistema de gestión escolar.',
      twitterTitle: 'Panel de Control - Colegio Llamado',
      twitterDescription: 'Panel de control del sistema de gestión escolar.'
    },
    estudiantes: {
      title: 'Mis Estudiantes - Colegio Llamado',
      description: 'Gestiona y solicita la salida de tus hijos del colegio de forma segura con verificación de ubicación.',
      ogTitle: 'Mis Estudiantes - Colegio Llamado',
      ogDescription: 'Gestiona la salida de tus hijos del colegio de forma segura.',
      twitterTitle: 'Mis Estudiantes - Colegio Llamado',
      twitterDescription: 'Gestiona la salida de tus hijos del colegio de forma segura.'
    },
    director: {
      title: 'Panel Director - Colegio Llamado',
      description: 'Panel administrativo para directores. Supervisa y gestiona todas las solicitudes de salida de estudiantes.',
      ogTitle: 'Panel Director - Colegio Llamado',
      ogDescription: 'Panel administrativo para directores del colegio.',
      twitterTitle: 'Panel Director - Colegio Llamado',
      twitterDescription: 'Panel administrativo para directores del colegio.'
    }
  }

  const setPageSEO = (pageName) => {
    const config = pageConfigs[pageName]
    if (config) {
      setPageMeta(config)
    }
  }

  return {
    currentMeta,
    updateMeta,
    setPageMeta,
    resetMeta,
    setPageSEO,
    pageConfigs
  }
} 