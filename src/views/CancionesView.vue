<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import MidiPlayer from '../components/MidiPlayer.vue'

const songIsPlaying = ref(false)
</script>
<template>
    <div class="about">
      <h1>This is the Canciones Page</h1>
      <MidiPlayer v-if="songIsPlaying" />
    </div>
  </template>
  
  <style>
  @media (min-width: 1024px) {
    .about {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  }
  </style>
  