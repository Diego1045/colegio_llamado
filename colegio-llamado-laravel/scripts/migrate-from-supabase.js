/**
 * Script para migrar datos desde Supabase a Laravel
 * 
 * Este script debe ejecutarse desde el directorio raíz del proyecto Vue.js
 * para tener acceso a la configuración de Supabase.
 * 
 * Uso: node colegio-llamado-laravel/scripts/migrate-from-supabase.js
 */

const { createClient } = require('@supabase/supabase-js');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase (desde el proyecto Vue.js)
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables de entorno de Supabase no encontradas');
    console.log('Asegúrate de que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén configuradas en .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Configuración de MySQL (Laravel)
const mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // Cambiar si tienes contraseña
    database: 'colegio_llamado'
};

async function connectToMySQL() {
    try {
        const connection = await mysql.createConnection(mysqlConfig);
        console.log('✅ Conectado a MySQL');
        return connection;
    } catch (error) {
        console.error('❌ Error conectando a MySQL:', error.message);
        throw error;
    }
}

async function migrateUsers(connection) {
    console.log('\n📋 Migrando usuarios...');
    
    try {
        const { data: users, error } = await supabase
            .from('usuarios')
            .select('*');

        if (error) throw error;

        for (const user of users) {
            const query = `
                INSERT INTO users (id, nombre, apellido, email, role, password, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                nombre = VALUES(nombre),
                apellido = VALUES(apellido),
                role = VALUES(role)
            `;

            await connection.execute(query, [
                user.id,
                user.nombre,
                user.apellido,
                user.email,
                user.rol,
                '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password por defecto
                user.created_at,
                user.updated_at
            ]);
        }

        console.log(`✅ ${users.length} usuarios migrados`);
    } catch (error) {
        console.error('❌ Error migrando usuarios:', error.message);
    }
}

async function migrateEstudiantes(connection) {
    console.log('\n👨‍🎓 Migrando estudiantes...');
    
    try {
        const { data: estudiantes, error } = await supabase
            .from('estudiantes')
            .select('*');

        if (error) throw error;

        for (const estudiante of estudiantes) {
            const query = `
                INSERT INTO estudiantes (id, nombre, apellido, grado, seccion, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                nombre = VALUES(nombre),
                apellido = VALUES(apellido),
                grado = VALUES(grado),
                seccion = VALUES(seccion)
            `;

            await connection.execute(query, [
                estudiante.id,
                estudiante.nombre,
                estudiante.apellido,
                estudiante.grado,
                estudiante.seccion,
                estudiante.created_at,
                estudiante.updated_at
            ]);
        }

        console.log(`✅ ${estudiantes.length} estudiantes migrados`);
    } catch (error) {
        console.error('❌ Error migrando estudiantes:', error.message);
    }
}

async function migratePadresEstudiantes(connection) {
    console.log('\n👨‍👩‍👧‍👦 Migrando relaciones padre-estudiante...');
    
    try {
        const { data: relaciones, error } = await supabase
            .from('padres_estudiantes')
            .select('*');

        if (error) throw error;

        for (const relacion of relaciones) {
            const query = `
                INSERT INTO padres_estudiantes (id, padre_id, estudiante_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                padre_id = VALUES(padre_id),
                estudiante_id = VALUES(estudiante_id)
            `;

            await connection.execute(query, [
                relacion.id,
                relacion.padre_id,
                relacion.estudiante_id,
                relacion.created_at,
                relacion.updated_at || new Date()
            ]);
        }

        console.log(`✅ ${relaciones.length} relaciones padre-estudiante migradas`);
    } catch (error) {
        console.error('❌ Error migrando relaciones:', error.message);
    }
}

async function migrateRegistrosSalida(connection) {
    console.log('\n📞 Migrando registros de salida...');
    
    try {
        const { data: registros, error } = await supabase
            .from('registros_salida')
            .select('*');

        if (error) throw error;

        for (const registro of registros) {
            const query = `
                INSERT INTO registros_salida (id, estudiante_id, padre_id, fecha_hora, estado, motivo, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                estado = VALUES(estado),
                motivo = VALUES(motivo)
            `;

            await connection.execute(query, [
                registro.id,
                registro.estudiante_id,
                registro.padre_id,
                registro.fecha_hora,
                registro.estado,
                registro.motivo,
                registro.created_at,
                registro.updated_at
            ]);
        }

        console.log(`✅ ${registros.length} registros de salida migrados`);
    } catch (error) {
        console.error('❌ Error migrando registros de salida:', error.message);
    }
}

async function migrateCodigosInvitacion(connection) {
    console.log('\n🎫 Migrando códigos de invitación...');
    
    try {
        const { data: codigos, error } = await supabase
            .from('codigos_invitacion')
            .select('*');

        if (error) throw error;

        for (const codigo of codigos) {
            const query = `
                INSERT INTO codigos_invitacion (id, codigo, estado, usado_por, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                estado = VALUES(estado),
                usado_por = VALUES(usado_por)
            `;

            await connection.execute(query, [
                codigo.id,
                codigo.codigo,
                codigo.estado,
                codigo.usado_por,
                codigo.created_at,
                codigo.updated_at
            ]);
        }

        console.log(`✅ ${codigos.length} códigos de invitación migrados`);
    } catch (error) {
        console.error('❌ Error migrando códigos de invitación:', error.message);
    }
}

async function migrateConfiguracion(connection) {
    console.log('\n⚙️ Migrando configuración...');
    
    try {
        const { data: configs, error } = await supabase
            .from('configuracion')
            .select('*');

        if (error) throw error;

        for (const config of configs) {
            const query = `
                INSERT INTO configuracion (id, clave, valor, descripcion, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                valor = VALUES(valor),
                descripcion = VALUES(descripcion)
            `;

            await connection.execute(query, [
                config.id,
                config.clave,
                config.valor,
                config.descripcion,
                config.created_at,
                config.updated_at
            ]);
        }

        console.log(`✅ ${configs.length} configuraciones migradas`);
    } catch (error) {
        console.error('❌ Error migrando configuración:', error.message);
    }
}

async function migrateStats(connection) {
    console.log('\n📊 Migrando estadísticas...');
    
    try {
        const { data: stats, error } = await supabase
            .from('stats')
            .select('*');

        if (error) throw error;

        for (const stat of stats) {
            const query = `
                INSERT INTO stats (id, fecha, total_estudiantes, total_padres, llamadas_realizadas, llamadas_confirmadas, llamadas_rechazadas, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                total_estudiantes = VALUES(total_estudiantes),
                total_padres = VALUES(total_padres),
                llamadas_realizadas = VALUES(llamadas_realizadas),
                llamadas_confirmadas = VALUES(llamadas_confirmadas),
                llamadas_rechazadas = VALUES(llamadas_rechazadas)
            `;

            await connection.execute(query, [
                stat.id,
                stat.fecha,
                stat.total_estudiantes,
                stat.total_padres,
                stat.llamadas_realizadas,
                stat.llamadas_confirmadas,
                stat.llamadas_rechazadas,
                stat.created_at,
                stat.updated_at
            ]);
        }

        console.log(`✅ ${stats.length} estadísticas migradas`);
    } catch (error) {
        console.error('❌ Error migrando estadísticas:', error.message);
    }
}

async function main() {
    console.log('🚀 Iniciando migración de Supabase a Laravel...\n');

    let connection;
    
    try {
        connection = await connectToMySQL();
        
        // Ejecutar migraciones en orden
        await migrateUsers(connection);
        await migrateEstudiantes(connection);
        await migratePadresEstudiantes(connection);
        await migrateRegistrosSalida(connection);
        await migrateCodigosInvitacion(connection);
        await migrateConfiguracion(connection);
        await migrateStats(connection);
        
        console.log('\n✅ ¡Migración completada exitosamente!');
        console.log('\n📋 Próximos pasos:');
        console.log('1. Verificar los datos en la base de datos MySQL');
        console.log('2. Actualizar las contraseñas de los usuarios');
        console.log('3. Probar la autenticación en Laravel');
        console.log('4. Actualizar el frontend para usar las APIs de Laravel');
        
    } catch (error) {
        console.error('\n❌ Error durante la migración:', error.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Conexión a MySQL cerrada');
        }
    }
}

// Ejecutar migración
main().catch(console.error);