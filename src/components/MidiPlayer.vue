<script setup lang="ts">
import { ref, onMounted, watch, onBeforeMount, onBeforeUnmount } from 'vue';
import MidiPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';
import { defineProps, defineEmits } from 'vue';
const delay = ms => new Promise(res => setTimeout(res, ms))
const props = defineProps<{
  song: {
    SongId: number,
    nombre: string,
    genero: string,
    tempo: string,
    midi: string
  },
  songIsPlaying: boolean,
  seekTo: number,
  volume: number
}>();
const emits = defineEmits(['playerReady', 'updateDuration', 'updateCurrentTime']);

const player = ref<MidiPlayer.Player | null>(null);
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundFont = ref<Soundfont.Player | null>(null);
let updateTimeInterval: number | null = null;

const loadAndPlayMidi = async () => {

  if (player.value && player.value.isPlaying()) {
    try {
      player.value.stop();
      console.log('Previous song stopped');
    } catch (error) {
      console.error('Error stopping previous song:', error);
    }
  }
  player.value = null;
  player.value = new MidiPlayer.Player((event) => {
    // Log MIDI events
    console.log(event);
  });
  //soundFont.value = await Soundfont.instrument(audioContext, 'electric_guitar_jazz');
  soundFont.value = null;
  soundFont.value = await Soundfont.instrument(audioContext, 'acoustic_grand_piano');
  player.value.on('midiEvent', async (event: any) => {
    if (event.name === 'Note on' && event.velocity > 0 && props.volume <= 1) {

      soundFont.value?.play(event.noteNumber, audioContext.currentTime, { duration: event.deltaTime / 1000, gain: props.volume });
    } else if (event.name === 'Note off' || (event.name === 'Note on' && event.velocity === 0)) {
      // Handle Note off events or Note on events with velocity 0
      // You might want to stop the note here if your soundfont library supports it
    }
  });
  console.log(props.song.midi)
  player.value.loadDataUri(props.song.midi);
  player.value.play();
  emits('playerReady', player.value); // Emit playerReady event
  const duration = player.value?.getSongTime() || 0;
  console.log(duration)
  emits('updateDuration', duration);
  if (updateTimeInterval) {
    clearInterval(updateTimeInterval);
  }
  updateTimeInterval = setInterval(() => {
    if (player.value) {
      console.log(player.value.getSongTimeRemaining())
      emits('updateCurrentTime', player.value.getSongTimeRemaining());
    }
  }, 500);

};

onBeforeMount(() => {
  if (player.value) {
    player.value.stop();
  }
});

onBeforeUnmount(() => {
  if (updateTimeInterval) {
    clearInterval(updateTimeInterval);
  }
});

watch(() => props.songIsPlaying, (newValue) => {
  if (player.value) {
    if (newValue) {
      player.value.play();
    } else {
      player.value.pause();
    }
  }
});

watch(() => props.song, (newValue) => {
  loadAndPlayMidi();
});

watch(() => props.seekTo, (newValue) => {
  if (player.value) {
    console.log(newValue)
    player.value.skipToSeconds(newValue);
    if (props.songIsPlaying)
      player.value.play();
  }
});

const midiFileUrl = 'public/midi/Oppressed.mid'; // Replace with your MIDI file URL
const soundFontName = 'electric_piano_1'; // Replace with your SoundFont name

onMounted(() => {
  if (player.value) player.value.stop();
  loadAndPlayMidi(midiFileUrl, soundFontName);
});
</script>

<template>
  <div class="hello">
    <!-- Child component template content -->
  </div>
</template>

<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>