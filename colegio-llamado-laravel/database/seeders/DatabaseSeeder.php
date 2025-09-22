<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Estudiante;
use App\Models\CodigoInvitacion;
use App\Models\Configuracion;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crear usuario administrador por defecto
        $admin = User::create([
            'nombre' => 'Administrador',
            'apellido' => 'Sistema',
            'email' => 'admin@colegio.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Crear algunos códigos de invitación
        for ($i = 0; $i < 10; $i++) {
            CodigoInvitacion::generar();
        }

        // Configuraciones por defecto
        $configuraciones = [
            [
                'clave' => 'nombre_colegio',
                'valor' => 'Colegio Llamado',
                'descripcion' => 'Nombre oficial del colegio'
            ],
            [
                'clave' => 'horario_inicio',
                'valor' => '07:00',
                'descripcion' => 'Hora de inicio del horario escolar'
            ],
            [
                'clave' => 'horario_fin',
                'valor' => '17:00',
                'descripcion' => 'Hora de fin del horario escolar'
            ],
            [
                'clave' => 'timezone',
                'valor' => 'America/Guatemala',
                'descripcion' => 'Zona horaria del colegio'
            ],
            [
                'clave' => 'max_llamadas_por_dia',
                'valor' => '3',
                'descripcion' => 'Máximo número de llamadas por estudiante por día'
            ],
        ];

        foreach ($configuraciones as $config) {
            Configuracion::create($config);
        }

        // Crear algunos estudiantes de ejemplo
        $estudiantes = [
            [
                'nombre' => 'Juan',
                'apellido' => 'Pérez',
                'grado' => '1ro',
                'seccion' => 'A'
            ],
            [
                'nombre' => 'María',
                'apellido' => 'González',
                'grado' => '2do',
                'seccion' => 'B'
            ],
            [
                'nombre' => 'Carlos',
                'apellido' => 'López',
                'grado' => '3ro',
                'seccion' => 'A'
            ],
        ];

        foreach ($estudiantes as $estudianteData) {
            Estudiante::create($estudianteData);
        }

        $this->command->info('Base de datos poblada exitosamente!');
        $this->command->info('Usuario admin creado: admin@colegio.com / admin123');
        $this->command->info('Códigos de invitación generados: 10');
    }
}