<script setup lang="ts">
import MidiPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';
import { defineProps } from 'vue';
const props = defineProps<{
  song: {
    id: number,
    nombre: string,
    genero: string,
    tempo: string,
    midi: string
  }
}>();
console.log(props)
// Initialize MIDI player
const Player = new MidiPlayer.Player(function (event) {
  console.log(event); // Log MIDI events

});

// Function to load MIDI file from URL and play
const loadAndPlayMidi = async (midiUrl: string, soundFontName: string) => {
  try {


    // Load SoundFont and create instrument
    const audioContext = new AudioContext();
    const soundFont = await Soundfont.instrument(audioContext, soundFontName);

    // Function to handle MIDI events and trigger sound
    Player.on('midiEvent', (event: any) => {
      console.log(event)
      if (event.name === 'Note on') {
        soundFont.play(event.noteNumber, audioContext.currentTime, { duration: event.deltaTime / 1000 });
      } else if (event.name === 'Note off') {
        soundFont.stop(event.noteNumber, audioContext.currentTime);
      }
    });

    // Load MIDI data and play
    //  Player.loadDataUri('data:audio/midi;base64,' + btoa(String.fromCharCode.apply(null, Array.from(byteArray))));
    console.log(props.song.midi)
    Player.loadDataUri(props.song.midi)
    Player.play();
  } catch (error) {
    console.error('Error loading MIDI file or SoundFont:', error);
  }
};

// Example usage: load MIDI file and SoundFont
const midiFileUrl = 'public/midi/Oppressed.mid'; // Replace with your MIDI file URL
const soundFontName = 'electric_piano_1'; // Replace with your SoundFont name
playSong()
function playSong() {
  console.log('Play song')
  loadAndPlayMidi(midiFileUrl, soundFontName);
}
</script>

<template>
  <div class="hello">


  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>