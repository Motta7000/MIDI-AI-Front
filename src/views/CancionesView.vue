<script setup lang="ts">

import { ref } from 'vue';
import rawSongs from '../assets/data/songs.json'
import TdCanciones from '../components/TdCanciones.vue'

const emit = defineEmits<{
  (e: 'playSong', song: {
    id: number,
    nombre: string,
    genero: string,
    tempo: string
  }): void
}>();

const songs = ref(rawSongs)
function playSong(idSong: number) {
  emit('playSong', songs.value.find(s => s.id === idSong))
}
</script>
<template>
  <div class="canciones">

    <div class="body-container ">
      <h1 class="h1 pt-5">Canciones</h1>
      <v-btn class="my-3 button" color="success" @click="">+ Generar canciones</v-btn>
      <v-table density="compact">
        <thead>
          <tr>
            <th class="text-left">
              <h2>Nombre</h2>
            </th>
            <th class="text-left">
              Genero
            </th>
            <th class="text-left">
              Tempo
            </th>
          </tr>
        </thead>
        <tbody>
          <TdCanciones @playSong="playSong" v-for="song in songs" :song="song" :key="song.id"></TdCanciones>
        </tbody>
      </v-table>
    </div>

  </div>

</template>

<style scoped>
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
</style>