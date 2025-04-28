import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
const port = 3000;

// Configuración de Supabase
const supabaseUrl = 'https://opilvbrjhhnindxraktj.supabase.co';
const supabaseKey = 'TU_LLAVE_DE_SUPABASE';
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar base de datos
async function initializeDatabase() {
  // Verificar si la tabla existe
  const { data: tableExists } = await supabase
    .from('stats')
    .select('id')
    .limit(1);

  if (!tableExists || tableExists.length === 0) {
    // Crear tabla si no existe
    await supabase
      .from('stats')
      .insert([
        { id: 1, userCount: 0, codeCount: 0 }
      ]);
  }
}

// Endpoints
app.get('/api/stats', async (req, res) => {
  try {
    await initializeDatabase();
    const { data, error } = await supabase
      .from('stats')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

app.post('/api/increment-users', async (req, res) => {
  try {
    const { data: currentStats, error: fetchError } = await supabase
      .from('stats')
      .select('userCount')
      .eq('id', 1)
      .single();

    if (fetchError) throw fetchError;

    const { data, error } = await supabase
      .from('stats')
      .update({ userCount: currentStats.userCount + 1 })
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error al incrementar usuarios:', error);
    res.status(500).json({ error: 'Error al incrementar usuarios' });
  }
});

app.post('/api/increment-codes', async (req, res) => {
  try {
    const { data: currentStats, error: fetchError } = await supabase
      .from('stats')
      .select('codeCount')
      .eq('id', 1)
      .single();

    if (fetchError) throw fetchError;

    const { data, error } = await supabase
      .from('stats')
      .update({ codeCount: currentStats.codeCount + 1 })
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error al incrementar códigos:', error);
    res.status(500).json({ error: 'Error al incrementar códigos' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
}); 