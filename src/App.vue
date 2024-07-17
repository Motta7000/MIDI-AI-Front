<script setup lang="ts">

import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ref, computed, watch } from 'vue';
import { Icon } from '@iconify/vue';
import MidiPlayer from './components/MidiPlayer.vue';
import MidiConverter from './components/MidiConverter.vue'
import { useUserStore } from '@/stores/counter'
import router from './router';

const userStore = useUserStore(); // Access the user store

const storedUsername = computed(() => userStore.username);
const route = useRoute()
const songIsPlaying = ref(false)
const currentPlayingId = ref<number | null>(null);
const songApp = ref()

const playSong = (song: {
  id: number, nombre: string, genero: string, tempo: string
}) => {
  songApp.value = song;
  if (songApp.value) {
    if (currentPlayingId.value === song.id && songIsPlaying.value == true) {
      // If the song is already playing, pause it
      console.log(`Pausing song with id: ${song.id}`);

      songIsPlaying.value = false;
    } else if (currentPlayingId.value === song.id && songIsPlaying.value == false) {
      // If the song is already playing, pause it
      console.log(`Playing song with id: ${song.id}`);

      songIsPlaying.value = true;
    } else {
      // Play the new song and pause the current one
      console.log(`Playing song with id: ${song.id}`);
      currentPlayingId.value = song.id;
      songIsPlaying.value = true;
    }
  }
};

function resumeOrPauseSong() {
  if (songApp.value) {
    console.log('Song inverted!')
    songIsPlaying.value = !songIsPlaying.value;
  }
}
function logOut() {
  router.push('/login')
}

watch(() => route.path, (newPath) => {
  console.log('Route change detected')
  console.log(newPath)
  if (newPath === '/login' || newPath === '/register') {
    songIsPlaying.value = false;
    console.log('SOngisplaying = false')
  }
});
</script>

<template>

  <div class="main-component">
    <div v-if="route.path != '/login' && route.path != '/register'" class="collum-container">
      <div class="top-section">
        <Icon class="icon mt-5" icon="iconamoon:profile" width="70" height="70" />
        <p class="mt-5 px-3">¡Bienvenido {{ storedUsername }}!</p>
        <div @click="logOut()" class="cerrar-container mt-5">
          <Icon icon="bitcoin-icons:exit-outline" width="30" height="30" style="color: white" />
          <p>Cerrar Sesion</p>
        </div>
      </div>
      <div class="bottom-section">

        <h2 class="song-title">{{ songApp?.nombre }}</h2>
        <Icon class="song-icon my-5" icon="entypo:note" width="92" height="92" style="color: white" />
      </div>
    </div>
    <RouterView @playSong="playSong" />
  </div>
  <MidiPlayer @playerReady="onPlayerReady" v-if="songApp" :song="songApp" :songIsPlaying="songIsPlaying" />
  <header class="header" v-if="route.path != '/login' && route.path != '/register'">

    <div class="wrapper ml-5">
      <Icon v-if='!songIsPlaying' @click="resumeOrPauseSong();" icon="carbon:play-outline" width="60" height="60">
      </Icon>
      <Icon v-else @click="resumeOrPauseSong();" icon="material-symbols:pause" width="60" height="60">
      </Icon>
    </div>
  </header>
</template>

<style scoped>
.header {
  width: 100%;

}

.collum-container {
  display: flex;
  flex-direction: column;

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
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
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

    padding-right: calc(var(--section-gap) / 2);
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
</style>
