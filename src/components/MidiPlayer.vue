<script setup lang="ts">
import { ref, onMounted, watch, onBeforeMount } from 'vue';
import MidiPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  song: {
    id: number,
    nombre: string,
    genero: string,
    tempo: string,
    midi: string
  },
  songIsPlaying: boolean
}>();
console.log(props.songIsPlaying)
const emits = defineEmits(['playerReady', 'seekTo']);

const player = ref<MidiPlayer.Player | null>(null);
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundFont = ref<Soundfont.Player | null>(null);

const loadAndPlayMidi = async (midiUrl: string, soundFontName: string) => {
  try {
    if (player.value) {
      player.value.stop();
    }

    player.value = new MidiPlayer.Player(function (event) {
      //console.log(event); // Log MIDI events
    });

    soundFont.value = await Soundfont.instrument(audioContext, soundFontName);

    player.value.on('midiEvent', (event: any) => {
      if (event.name === 'Note on' && event.velocity > 0) {
        soundFont.value?.play(event.noteNumber, audioContext.currentTime, { duration: event.deltaTime / 1000 });
      } else if (event.name === 'Note off' || (event.name === 'Note on' && event.velocity === 0)) {
        // Handle Note off events or Note on events with velocity 0
        // You might want to stop the note here if your soundfont library supports it
      }
    });

    console.log(props.song.midi);

    player.value.stop();
    player.value.loadDataUri(props.song.midi);
    player.value.play();

    emits('playerReady', player.value); // Emit playerReady event
  } catch (error) {
    console.error('Error loading MIDI file or SoundFont:', error);
  }
};
onBeforeMount(() => {
  if (player.value) {
    player.value.stop();
  }
});
watch(() => props.songIsPlaying, (newValue) => {

  console.log(newValue)
  if (player.value) {
    if (newValue == true) {
      player.value.play();
    } else {
      player.value.pause();
    }
  }
});
watch(() => props.song, (newValue) => {
  console.log('*********************************************')
  console.log(newValue)
  props.song.midi = newValue.midi

  loadAndPlayMidi(midiFileUrl, soundFontName);
});

// Example usage: load MIDI file and SoundFont
const midiFileUrl = 'public/midi/Oppressed.mid'; // Replace with your MIDI file URL
const soundFontName = 'electric_piano_1'; // Replace with your SoundFont name
onMounted(() => {
  if (player.value)
    player.value.stop();
  loadAndPlayMidi(midiFileUrl, soundFontName);
});

// Set duration when track is ready
if (player.value)
  player.value.on('endOfTrack', () => {
    const duration = player.value?.getDuration() || 0;
    emits('updateDuration', duration);
  });
;

emits('seekTo', (time: number) => {
  if (player.value) {
    player.value.seek(time);
  }
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