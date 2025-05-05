import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { seedUsers } from './usersSeeder.js'
import actualizarRegistrosSalida from './actualizarRegistrosSalida.js'

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Cargar variables de entorno desde el directorio raíz del proyecto
dotenv.config({ path: resolve(__dirname, '../../.env') })

async function runSeeders() {
    try {
        console.log('Iniciando seeders...')

        // Ejecutar migraciones primero
        console.log('Ejecutando migraciones...')
        await actualizarRegistrosSalida()

        // Luego ejecutar seeders
        console.log('Ejecutando seeders de datos...')
        await seedUsers()

        console.log('Seeders y migraciones completados exitosamente')
    } catch (error) {
        console.error('Error al ejecutar los seeders:', error)
        process.exit(1)
    }
}

runSeeders() 