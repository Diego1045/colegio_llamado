<template>
  <div class="director">
    <h1>Panel de la Directora</h1>
    <div class="dashboard">
      <div class="card">
        <h2>Generar Códigos</h2>
        <button @click="generateCode">Generar Nuevo Código</button>
      </div>
      <div class="card">
        <h2>Estadísticas</h2>
        <p>Usuarios registrados: {{ userCount }}</p>
        <p>Códigos generados: {{ codeCount }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'DirectorView',
  setup() {
    const userCount = ref(0)
    const codeCount = ref(0)

    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/stats')
        const data = await response.json()
        userCount.value = data.userCount
        codeCount.value = data.codeCount
      } catch (error) {
        console.error('Error al obtener estadísticas:', error)
      }
    }

    const generateCode = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/increment-codes', {
          method: 'POST'
        })
        const data = await response.json()
        codeCount.value = data.codeCount
      } catch (error) {
        console.error('Error al generar código:', error)
      }
    }

    onMounted(() => {
      fetchStats()
    })

    return {
      userCount,
      codeCount,
      generateCode
    }
  }
}
</script>

<style scoped>
.director {
  padding: 20px;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

button {
  background-color: #42b983;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #3aa876;
}
</style>
