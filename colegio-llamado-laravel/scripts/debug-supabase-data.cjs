/**
 * Script para debuggear los datos de Supabase
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://opilvbrjhhnindxraktj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9waWx2YnJqaGhuaW5keHJha3RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NDQ1MzQsImV4cCI6MjA2MTEyMDUzNH0.jMHnlzAmTokaj41MunB2Zdlu7uXstCW_AVJfCnZeqN4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugTables() {
    console.log('🔍 Investigando tablas en Supabase...\n');

    // Intentar diferentes nombres de tabla para usuarios
    const userTableNames = ['usuarios', 'users', 'user', 'auth.users'];
    
    for (const tableName of userTableNames) {
        try {
            console.log(`Probando tabla: ${tableName}`);
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .limit(1);
            
            if (!error && data) {
                console.log(`✅ Tabla encontrada: ${tableName}`);
                console.log('Estructura:', Object.keys(data[0] || {}));
                console.log('Total registros:', data.length);
            }
        } catch (err) {
            console.log(`❌ ${tableName}: ${err.message}`);
        }
    }

    // Verificar estados en registros_salida
    try {
        console.log('\n🔍 Verificando estados en registros_salida...');
        const { data: registros, error } = await supabase
            .from('registros_salida')
            .select('estado')
            .limit(50);

        if (!error && registros) {
            const estados = [...new Set(registros.map(r => r.estado))];
            console.log('Estados encontrados:', estados);
        }
    } catch (err) {
        console.log('Error:', err.message);
    }

    // Verificar estructura de todas las tablas
    const tables = ['estudiantes', 'padres_estudiantes', 'registros_salida', 'codigos_invitacion', 'configuracion', 'stats'];
    
    for (const table of tables) {
        try {
            console.log(`\n📋 Tabla: ${table}`);
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .limit(1);
            
            if (!error && data && data.length > 0) {
                console.log('Campos:', Object.keys(data[0]));
            } else {
                console.log('Sin datos o error:', error?.message);
            }
        } catch (err) {
            console.log('Error:', err.message);
        }
    }
}

debugTables().catch(console.error);