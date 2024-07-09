<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import MidiPlayer from './components/MidiPlayer.vue';
import MidiConverter from './components/MidiConverter.vue'
const songIsPlaying = ref(false)
const currentPlayingId = ref<number | null>(null);
const songApp = ref()
const playSong = (song: {
  id: number,
  nombre: string,
  genero: string,
  tempo: string
}) => {
  songApp.value = song;
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
};
function resumeOrPauseSong() {
  console.log('Song Resumed!')
  songIsPlaying.value = !songIsPlaying.value;
}
</script>

<template>


  <RouterView @playSong="playSong" />
  <header>

    <MidiPlayer v-if="songIsPlaying && songApp" :song="songApp" />
    <div class="wrapper">
      <Icon v-if='!songIsPlaying' @click="resumeOrPauseSong" icon="carbon:play-outline" width="44" height="44"></Icon>
      <Icon v-else @click="resumeOrPauseSong" icon="material-symbols:pause" width="44" height="44"></Icon>
      <h1>{{ currentPlayingId }}</h1>
      <h1>{{ songApp?.nombre }}</h1>
    </div>
  </header>
</template>

<style scoped>
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
