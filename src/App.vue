<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { ref, computed, watch } from 'vue';
import { Icon } from '@iconify/vue';
import MidiPlayer from './components/MidiPlayer.vue';
import { useUserStore } from '@/stores/counter';
import router from './router';
import axios from 'axios';
import { downloadFile } from './functions/functions';

const userStore = useUserStore();
const storedUsername = computed(() => userStore.username);

const route = useRoute();
const songIsPlaying = ref(false);
const currentPlayingId = ref<number | null>(null);
const songApp = ref();
const songData = ref()
const currentTime = ref(0);
const songDuration = ref(0);
const seekTo = ref(0);
const volume = ref(1)
const volumeInput = ref(100)
const aux = ref()

const playSong = async (song: { S3Id: string, nombre: string, genero: string, tempo: string, midi: string, SongId: number }) => {
  console.log(song)
  songData.value = song;
  if (song) {
    if (currentPlayingId.value === song.SongId && songIsPlaying.value) {
      songIsPlaying.value = false;  // Pausa la cancion
    } else if (currentPlayingId.value === song.SongId && !songIsPlaying.value) {
      songIsPlaying.value = true;   // Inicia la cancion
    } else {
      // Comenzamos a reproducir la cancion
      currentPlayingId.value = song.SongId;
      songIsPlaying.value = true;

      aux.value = await fetchSongMidi(song.S3Id, 'user1234')
      songApp.value = { midi: '' }
      songApp.value.midi = aux.value.base64_content
      console.log(songApp.value)
    }
  }
};

const downloadSong = async (song: { S3Id: string, title: string, genero: string, tempo: string, midi: string, SongId: number }) => {
  aux.value = await fetchSongMidi(song.S3Id, 'user1234')
  aux.value = aux.value.base64_content
  downloadFile(aux.value, song.title + ".mid")
}
async function fetchSongMidi(object_key: string, UserId: string) {
  try {
    const awsUrl = import.meta.env.VITE_AWS;
    console.log(`${awsUrl}/songs`)
    const response = await axios.post(`${awsUrl}/songs`, {
      UserId: 'user1234',
      object_key: object_key
    });
    // Ensure the response type is handled as a binary stream
    // Convert ArrayBuffer to Blob
    return response.data

  } catch (error) {
    console.error('Failed to fetch songs:', error);
  }
}
function blobToBase64(blob: Blob): Promise<string> {
  console.log("a")
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      // The result contains the base64 string with the data URL prefix
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };

    reader.onerror = () => {
      reject(new Error('Failed to convert Blob to base64'));
    };

    reader.readAsDataURL(blob); // Read the Blob as a Data URL
  });
}

function resumeOrPauseSong() {
  if (songApp.value) {
    songIsPlaying.value = !songIsPlaying.value;
  }
}

function logOut() {
  router.push('/login');
  userStore.clearUsername();
}

watch(() => route.path, (newPath) => {
  if (newPath === '/login' || newPath === '/register') {
    songIsPlaying.value = false;
  }
});

function onSliderChange() {
  if (songApp.value) {
    seekTo.value = currentTime.value;
  }
}

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function onUpdateCurrentTime(remainingSeconds: number) {
  console.log(remainingSeconds)
  currentTime.value = songDuration.value - remainingSeconds;
}
function updateDuration(duration: number) {
  console.log(duration)
  songDuration.value = duration;
}
function onVolumeChange(event: Event) {
  // console.log(vol)
  // vol = vol / 100
  volume.value = volumeInput.value / 100
  console.log(volume.value)
}
</script>

<template>
  <div class="main-component">
    <div v-if="route.path != '/login' && route.path != '/register'" class="collum-container">
      <div class="top-section">
        <Icon class="icon mt-5 margin-top" icon="iconamoon:profile" width="70" height="70" />
        <p class="mt-5 px-3 margin-top">¡Bienvenido {{ storedUsername }}!</p>
        <div @click="logOut()" class="cerrar-container mt-5 margin-top">
          <Icon icon="bitcoin-icons:exit-outline" width="30" height="30" style="color: white" />
          <p>Cerrar Sesion</p>
        </div>
      </div>
    </div>
    <RouterView class="router-view" @playSong="playSong" @downloadSong="downloadSong" />
  </div>
  <MidiPlayer :volume="volume" @updateDuration="updateDuration" @playerReady="" @updateCurrentTime="onUpdateCurrentTime"
    v-if="songApp" :song="songApp" :songIsPlaying="songIsPlaying" :seekTo="seekTo" />
  <header class="header" v-if="route.path != '/login' && route.path != '/register'">
    <div class="left-section">
      <div class="bottom-section">
        <Icon class="song-icon my-5 mr-1" icon="entypo:note" width="32" height="32" style="color: white" />
        <h2 class="song-title">{{ songData?.title }}</h2>
      </div>
    </div>
    <div class="center-section">
      <div class="wrapper">
        <Icon v-if='!songIsPlaying' @click="resumeOrPauseSong();" icon="carbon:play-outline" width="45" height="45" />
        <Icon v-else @click="resumeOrPauseSong();" icon="material-symbols:pause" width="45" height="45" />
      </div>
      <div class="time-slider-container">
        <input class="time-slider" type="range" min="0" :max="songDuration" v-model="currentTime"
          @input="onSliderChange" />
        <div>{{ currentTime ? formatTime(currentTime) : '00:00' }} / {{ formatTime(songDuration) }}</div>
      </div>
    </div>
    <div class="right-section">
      <Icon v-if="volumeInput == 0" icon="uil:volume-mute" width="45" height="45" />
      <Icon v-if="volumeInput <= 20 && volumeInput > 0" icon="uil:volume-off" width="45" height="45" />
      <Icon v-if="volumeInput <= 40 && volumeInput > 20" icon="uil:volume-down" width="45" height="45" />
      <Icon v-if="volumeInput <= 60 && volumeInput > 40" icon="uil:volume" width="45" height="45" />
      <Icon v-if="volumeInput > 60" icon="uil:volume-up" width="45" height="45" />
      <input class="volume" type="range" :min="0" :max="100" v-model="volumeInput" @input="onVolumeChange" />
    </div>
  </header>
</template>

<style scoped>
.router-view {
  overflow: auto;
}

.time-slider {
  flex: 1;
}

.time-text {}

.volume {
  flex: 0.5;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.left-section {
  flex: 1;
}

.center-section {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.time-slider-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  width: 100%;

}

.right-section {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;

}

.collum-container {
  display: flex;
  flex-direction: column;
  min-width: 150px;
  min-height: 100%;
}

.top-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;

}

.bottom-section {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 20px;
}

.song-icon {
  justify-self: end;
}

.song-title {
  justify-self: end;
}

.cerrar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.5s all;
  user-select: none;
}

.cerrar-container:hover {
  transform: scale(1.05);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {}

.collum-container {
  background-color: #08080881;

  color: #fff;
  width: 12vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.main-component {
  display: flex;
  background: rgb(43, 43, 43);
  background: linear-gradient(200deg, #0029FF, #00168B);
  width: 100vw;
  height: 90vh;
}

.wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-items: center;
}

header {
  line-height: 1.5;
  height: 12vh;
  width: 100vw;
  background-color: black;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;

    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}

@media (max-width: 600px) {


  .song-title {
    font-size: 12px;
  }

  .main-component {
    flex-direction: column;
  }

  .margin-top {
    margin-top: 0 !important;
  }

  .collum-container {

    width: 100%;
    min-height: auto;
  }

  .top-section {
    flex-direction: row;
  }

  .collum-container-phone {
    display: block
  }

  .left-section {
    flex: 0.2;
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
  }

  .song-icon {
    display: none;
  }

  .center-section {
    margin: 20px;
  }

  .right-section {
    display: none;
  }
}
</style>
