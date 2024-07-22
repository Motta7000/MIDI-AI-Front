<script setup lang="ts">
import { ref, computed } from 'vue';
import rawGenres from '../assets/data/genres.json';
import { Icon } from '@iconify/vue';
import ModalGenerarCancion from '../components/GenerarCancionCard.vue';

const search = ref<string | null>(null);

const filteredGenres = computed(() => {
  if (!search.value) {
    return rawGenres;
  }
  return rawGenres.filter(genre =>
    genre.nombre.toLowerCase().includes(search.value!.toLowerCase())
  );
});
const emit = defineEmits<{

}>();

</script>

<template>
  <div class="canciones">
    <div class="flex-title py-5">
      <p>
        <RouterLink to="/canciones">Canciones</RouterLink> -> Generar Cancion
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
      <div class="grid pt-5">
        <ModalGenerarCancion v-for="genre in filteredGenres" :key="genre.id" :genre="genre" class="mx-auto my-8 v-card"
          elevation="16" max-width="344" />
      </div>
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
}
</style>
