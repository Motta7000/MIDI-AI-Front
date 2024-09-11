<script setup lang="ts">

import { ref, reactive } from 'vue';
import rawSongs from '../assets/data/songs.json'
import TdCanciones from '../components/TdCanciones.vue'
import router from '@/router';
import axios from 'axios';
import Loading from '@/components/Loading.vue';
import { toast, type ToastOptions } from 'vue3-toastify';
import { useUserStore } from '@/stores/counter'
import { Icon } from '@iconify/vue/dist/iconify.js';
const userStore = useUserStore();

const emit = defineEmits<{
  (e: 'playSong', song: {
    SongId: number,
    S3Id: string,
    nombre: string,
    genero: string,
    tempo: string
  }): void;
  (e: 'downloadSong', song: {
    SongId: number,
    S3Id: string,
    title: string,
    genero: string,
    tempo: string
  }): void
}>();

const songs = reactive({
  array: [] as any[],
  loading: true
})
function playSong(S3Id: number) {
  emit('playSong', songs.value.find((s: { S3Id: number; }) => s.S3Id === S3Id));

}
function downloadSong(S3Id: number) {
  emit('downloadSong', songs.value.find((s: { S3Id: number; }) => s.S3Id === S3Id))
}
async function fetchSongs() {
  try {
    songs.loading = true;
    const awsUrl = import.meta.env.VITE_AWS;
    console.log(`${awsUrl}/songs`)
    const response = await axios.get(`${awsUrl}/songs`, {
      params: {
        UserId: userStore.getUsername()
      }
    });
    songs.array = response.data;
    console.log(songs.array)
    songs.loading = false;
  } catch (error) {
    console.error('Failed to fetch songs:', error);
    toast.error((error as Error).message);
    songs.loading = false;
  }
}
fetchSongs()

</script>
<template>
  <div class="canciones">
    <div class="body-container ">
      <h1 class="h1 pt-5">Mis Canciones</h1>
      <v-btn class="my-3 button" color="success" @click="router.push('/generar')">+ Generar canciones</v-btn>
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
            <th></th>
          </tr>
        </thead>
        <tbody class="t-body">
          <TdCanciones v-if="songs.array.length > 0" @playSong="playSong" @downloadSong="downloadSong"
            v-for="song in songs.array" :song="song" :key="song.id">
          </TdCanciones>
          <div v-else-if="songs.loading == true">
            Cargando
          </div>
          <div v-else>
            No hay Canciones
            <Icon icon="hugeicons:file-not-found" width="384" height="384" />
          </div>
          {{ songs.array.length }}
        </tbody>

      </v-table>
      <Loading v-if="!songs" :white="true">aaa</Loading>
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

@media (max-width: 1024px) {
  .body-container {
    width: 90% !important;
  }
}
</style>