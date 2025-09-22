/**
 * Script para migrar datos desde Supabase a Laravel con SQLite
 * 
 * Este script migra los datos desde Supabase al backend de Laravel usando SQLite.
 * 
 * Uso: node colegio-llamado-laravel/scripts/migrate-from-supabase-sqlite.js
 */

const { createClient } = require('@supabase/supabase-js');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = 'https://opilvbrjhhnindxraktj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9waWx2YnJqaGhuaW5keHJha3RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NDQ1MzQsImV4cCI6MjA2MTEyMDUzNH0.jMHnlzAmTokaj41MunB2Zdlu7uXstCW_AVJfCnZeqN4';

const supabase = createClient(supabaseUrl, supabaseKey);

// Ruta a la base de datos SQLite de Laravel
const dbPath = path.join(__dirname, '../database/database.sqlite');

function connectToSQLite() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('❌ Error conectando a SQLite:', err.message);
                reject(err);
            } else {
                console.log('✅ Conectado a SQLite');
                resolve(db);
            }
        });
    });
}

function runQuery(db, query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
}

function mapEstado(supabaseEstado) {
    const estadoMap = {
        'pendiente': 'pendiente',
        'anunciado': 'confirmada',
        'completado': 'confirmada'
    };
    return estadoMap[supabaseEstado] || 'pendiente';
}

async function migrateUsers(db) {
    console.log('\n📋 Migrando usuarios...');
    
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('*');

        if (error) throw error;

        let migrated = 0;
        for (const user of users) {
            try {
                const query = `
                    INSERT OR REPLACE INTO users (id, nombre, apellido, email, role, password, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;

                await runQuery(db, query, [
                    user.id,
                    user.nombre,
                    user.apellido,
                    user.email,
                    user.role, // Cambié de user.rol a user.role
                    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password por defecto
                    user.created_at,
                    user.updated_at || new Date().toISOString()
                ]);
                migrated++;
            } catch (err) {
                console.warn(`⚠️ Error migrando usuario ${user.email}:`, err.message);
            }
        }

        console.log(`✅ ${migrated}/${users.length} usuarios migrados`);
    } catch (error) {
        console.error('❌ Error migrando usuarios:', error.message);
    }
}

async function migrateEstudiantes(db) {
    console.log('\n👨‍🎓 Migrando estudiantes...');
    
    try {
        const { data: estudiantes, error } = await supabase
            .from('estudiantes')
            .select('*');

        if (error) throw error;

        let migrated = 0;
        for (const estudiante of estudiantes) {
            try {
                const query = `
                    INSERT OR REPLACE INTO estudiantes (id, nombre, apellido, grado, seccion, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

                await runQuery(db, query, [
                    estudiante.id,
                    estudiante.nombre,
                    estudiante.apellido,
                    estudiante.grado,
                    estudiante.seccion,
                    estudiante.created_at,
                    estudiante.updated_at || new Date().toISOString()
                ]);
                migrated++;
            } catch (err) {
                console.warn(`⚠️ Error migrando estudiante ${estudiante.nombre}:`, err.message);
            }
        }

        console.log(`✅ ${migrated}/${estudiantes.length} estudiantes migrados`);
    } catch (error) {
        console.error('❌ Error migrando estudiantes:', error.message);
    }
}

async function migratePadresEstudiantes(db) {
    console.log('\n👨‍👩‍👧‍👦 Migrando relaciones padre-estudiante...');
    
    try {
        const { data: relaciones, error } = await supabase
            .from('padres_estudiantes')
            .select('*');

        if (error) throw error;

        let migrated = 0;
        for (const relacion of relaciones) {
            try {
                const query = `
                    INSERT OR REPLACE INTO padres_estudiantes (id, padre_id, estudiante_id, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?)
                `;

                await runQuery(db, query, [
                    relacion.id,
                    relacion.padre_id,
                    relacion.estudiante_id,
                    relacion.created_at,
                    relacion.updated_at || new Date().toISOString()
                ]);
                migrated++;
            } catch (err) {
                console.warn(`⚠️ Error migrando relación:`, err.message);
            }
        }

        console.log(`✅ ${migrated}/${relaciones.length} relaciones padre-estudiante migradas`);
    } catch (error) {
        console.error('❌ Error migrando relaciones:', error.message);
    }
}

async function migrateRegistrosSalida(db) {
    console.log('\n📞 Migrando registros de salida...');
    
    try {
        const { data: registros, error } = await supabase
            .from('registros_salida')
            .select('*');

        if (error) throw error;

        let migrated = 0;
        for (const registro of registros) {
            try {
                const query = `
                    INSERT OR REPLACE INTO registros_salida (id, estudiante_id, padre_id, fecha_hora, estado, motivo, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;

                await runQuery(db, query, [
                    registro.id,
                    registro.estudiante_id,
                    registro.padre_id,
                    registro.fecha_hora,
                    mapEstado(registro.estado), // Mapear el estado correctamente
                    registro.motivo,
                    registro.created_at,
                    registro.updated_at || new Date().toISOString()
                ]);
                migrated++;
            } catch (err) {
                console.warn(`⚠️ Error migrando registro:`, err.message);
            }
        }

        console.log(`✅ ${migrated}/${registros.length} registros de salida migrados`);
    } catch (error) {
        console.error('❌ Error migrando registros de salida:', error.message);
    }
}

async function migrateCodigosInvitacion(db) {
    console.log('\n🎫 Migrando códigos de invitación...');
    
    try {
        const { data: codigos, error } = await supabase
            .from('codigos_invitacion')
            .select('*');

        if (error) throw error;

        let migrated = 0;
        for (const codigo of codigos) {
            try {
                const query = `
                    INSERT OR REPLACE INTO codigos_invitacion (id, codigo, estado, usado_por, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;

                await runQuery(db, query, [
                    codigo.id,
                    codigo.codigo,
                    codigo.estado,
                    codigo.usado_por,
                    codigo.created_at,
                    codigo.updated_at || new Date().toISOString()
                ]);
                migrated++;
            } catch (err) {
                console.warn(`⚠️ Error migrando código:`, err.message);
            }
        }

        console.log(`✅ ${migrated}/${codigos.length} códigos de invitación migrados`);
    } catch (error) {
        console.error('❌ Error migrando códigos de invitación:', error.message);
    }
}

async function migrateConfiguracion(db) {
    console.log('\n⚙️ Migrando configuración...');
    
    try {
        const { data: configs, error } = await supabase
            .from('configuracion')
            .select('*');

        if (error) throw error;

        let migrated = 0;
        for (const config of configs) {
            try {
                const query = `
                    INSERT OR REPLACE INTO configuracion (id, clave, valor, descripcion, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;

                await runQuery(db, query, [
                    config.id,
                    config.clave,
                    config.valor,
                    config.descripcion,
                    config.created_at,
                    config.updated_at || new Date().toISOString()
                ]);
                migrated++;
            } catch (err) {
                console.warn(`⚠️ Error migrando configuración:`, err.message);
            }
        }

        console.log(`✅ ${migrated}/${configs.length} configuraciones migradas`);
    } catch (error) {
        console.error('❌ Error migrando configuración:', error.message);
    }
}

async function migrateStats(db) {
    console.log('\n📊 Migrando estadísticas...');
    
    try {
        const { data: stats, error } = await supabase
            .from('stats')
            .select('*');

        if (error) throw error;

        let migrated = 0;
        for (const stat of stats) {
            try {
                const query = `
                    INSERT OR REPLACE INTO stats (id, fecha, total_estudiantes, total_padres, llamadas_realizadas, llamadas_confirmadas, llamadas_rechazadas, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                await runQuery(db, query, [
                    stat.id,
                    stat.fecha,
                    stat.total_estudiantes,
                    stat.total_padres,
                    stat.llamadas_realizadas,
                    stat.llamadas_confirmadas,
                    stat.llamadas_rechazadas,
                    stat.created_at,
                    stat.updated_at || new Date().toISOString()
                ]);
                migrated++;
            } catch (err) {
                console.warn(`⚠️ Error migrando estadística:`, err.message);
            }
        }

        console.log(`✅ ${migrated}/${stats.length} estadísticas migradas`);
    } catch (error) {
        console.error('❌ Error migrando estadísticas:', error.message);
    }
}

async function main() {
    console.log('🚀 Iniciando migración de Supabase a Laravel (SQLite)...\n');

    let db;
    
    try {
        db = await connectToSQLite();
        
        // Ejecutar migraciones en orden
        await migrateUsers(db);
        await migrateEstudiantes(db);
        await migratePadresEstudiantes(db);
        await migrateRegistrosSalida(db);
        await migrateCodigosInvitacion(db);
        await migrateConfiguracion(db);
        await migrateStats(db);
        
        console.log('\n✅ ¡Migración completada exitosamente!');
        console.log('\n📋 Próximos pasos:');
        console.log('1. Verificar los datos en la base de datos SQLite');
        console.log('2. Probar la autenticación en Laravel');
        console.log('3. Actualizar el frontend para usar las APIs de Laravel');
        
    } catch (error) {
        console.error('\n❌ Error durante la migración:', error.message);
    } finally {
        if (db) {
            db.close((err) => {
                if (err) {
                    console.error('❌ Error cerrando la base de datos:', err.message);
                } else {
                    console.log('\n🔌 Conexión a SQLite cerrada');
                }
            });
        }
    }
}

// Ejecutar migración
main().catch(console.error);