<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { Icon } from '@iconify/vue';
import ModalGenerarCancion from '../components/GenerarCancionCard.vue';
import Loading from '@/components/Loading.vue';

const search = ref<string | null>(null);
const rawGenres = ref<any[]>([]);
const loading = ref<boolean>(true)

const fetchGenres = async () => {
  try {
    const response = await axios.get('https://groljy9hi7.execute-api.us-east-1.amazonaws.com/getGenres');
    rawGenres.value = response.data.genres;
    console.log(rawGenres.value)
  } catch (error) {
    console.error('Error fetching genres:', error);
  }
  finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchGenres();
});

const filteredGenres = computed(() => {
  if (!search.value) {
    return rawGenres.value;
  }
  return rawGenres.value.filter(genre =>
    genre.GenreTitle.toLowerCase().includes(search.value!.toLowerCase())
  );
});

const emit = defineEmits<{}>();

</script>

<template>
  <div class="canciones">
    <div class="flex-title py-5">
      <p>
        <RouterLink to="/canciones">Mis Canciones</RouterLink> -> Generar Cancion
      </p>
      <h1 class="h1">Generar Cancion</h1>
      <h1 class="h1"></h1>
      <h1 class="h1"></h1>
    </div>
    <div class="body-container">
      <div class="search-container">
        <v-text-field v-model="search" label="Género" hide-details required></v-text-field>
        <Icon icon="pepicons-pencil:loop" width="72" height="72" style="color: white" />
      </div>
      <div v-if="filteredGenres && filteredGenres.length > 0" class="grid pt-5">
        <ModalGenerarCancion v-for="genre in filteredGenres" :key="genre.id" :genre="genre" class="mx-auto my-8 v-card"
          elevation="16" max-width="344" />
      </div>
      <Loading :white="true" v-else>

      </loading>
    </div>
  </div>
</template>

<style scoped>
.v-modal:hover {
  transform: scale(1);
}

.v-card {
  margin: 0 !important;
  transition: 0.5s all;
}

.v-card:hover {
  transition: 0.5s all;
  transform: scale(1.05);
  cursor: pointer;
}

.v-text-field {
  height: 0.5rem;

}

.search-container {
  display: flex;
}

.flex-title {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.flex-td {
  display: flex;
  align-items: center;
}

.button {
  width: 15rem;
  margin: auto;
}

.h1 {
  text-align: center;
  justify-self: center;
}

.body-container {
  margin: 0 auto;
  width: 70%;
  display: flex;
  flex-direction: column;
}

.canciones {
  width: 100%;
  height: 88vh;
  display: flex;
  flex-direction: column;
  background: rgb(43, 43, 43);
  background: linear-gradient(200deg, #0029FF, #00168B);
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

@media (max-width: 1024px) {
  .flex-title {
    flex-direction: column;
  }

  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
