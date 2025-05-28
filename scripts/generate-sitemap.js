#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

const DOMAIN = 'https://colegio-llamado.captadata.com'
const OUTPUT_PATH = 'public/sitemap.xml'

// Rutas públicas que deben incluirse en el sitemap
const publicRoutes = [
  {
    path: '/',
    changefreq: 'weekly',
    priority: '1.0'
  },
  {
    path: '/login',
    changefreq: 'monthly',
    priority: '0.8'
  }
]

// Función para generar el sitemap XML
function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0]
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`

  // Agregar cada ruta pública
  publicRoutes.forEach(route => {
    sitemap += `    
    <!-- ${route.path === '/' ? 'Página principal' : 'Página de ' + route.path.replace('/', '')} -->
    <url>
        <loc>${DOMAIN}${route.path}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    </url>
`
  })

  sitemap += `    
</urlset>`

  return sitemap
}

// Función principal
function main() {
  try {
    console.log('🚀 Generando sitemap.xml...')
    
    const sitemapContent = generateSitemap()
    
    // Crear directorio public si no existe
    const publicDir = path.dirname(OUTPUT_PATH)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }
    
    // Escribir el archivo sitemap
    fs.writeFileSync(OUTPUT_PATH, sitemapContent, 'utf8')
    
    console.log('✅ Sitemap generado exitosamente en:', OUTPUT_PATH)
    console.log('📊 URLs incluidas:', publicRoutes.length)
    console.log('🌐 Dominio:', DOMAIN)
    
    // Mostrar las URLs incluidas
    console.log('\n📋 URLs en el sitemap:')
    publicRoutes.forEach(route => {
      console.log(`   - ${DOMAIN}${route.path}`)
    })
    
  } catch (error) {
    console.error('❌ Error al generar sitemap:', error.message)
    process.exit(1)
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { generateSitemap, publicRoutes } 