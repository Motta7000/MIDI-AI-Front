<template>
    <div class="hello">
        <h1>MIDI Player</h1>

        <button @click="stop" v-if="playing">Stop</button>

        <form @submit.prevent="play">
            <div class="form-group">
                <label >Song</label>
                <select v-model="song">
                    <option :value="option" v-for="option in songs" :key="option.name">{{ option.name }}</option>
                </select>
            </div>

            <div class="form-group">
                <label for="">Instrument</label>
                <select v-model="instrument">
                    <option :value="option" v-for="option in instruments" :key="option.name">{{ option.name }}</option>
                </select>
            </div>

            <button :disabled="playing || !song || !instrument">
                Play
            </button>
        </form>
    </div>
</template>

<script  lang="ts" >
import MidiPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';

// Initialize MIDI player
const Player = new MidiPlayer.Player(function(event) {
  console.log(event); // Log MIDI events
});
// Example usage: load MIDI file and SoundFont
const midiFileUrl = 'public/midi/Oppressed.mid'; // Replace with your MIDI file URL
const soundFontUrl = 'https://musical-artifacts.com/artifacts/4284/cloudcones.sf2'; // Replace with your SoundFont URL
// Function to load MIDI file from URL and play
const loadAndPlayMidi = async (midiUrl: string, soundFontUrl: string) => {
  try {
    // Load MIDI file
    const response = await fetch(midiUrl);
    const midiData = await response.arrayBuffer();
    const byteArray = new Uint8Array(midiData);

    // Load SoundFont
    const soundFont = await Soundfont.instrument(new AudioContext(), soundFontUrl);

    // Set SoundFont to player
    Player.setSoundFont(soundFont);

    // Load MIDI data and play
    Player.loadDataUri('data:audio/midi;base64,' + btoa(String.fromCharCode.apply(null, byteArray)));
    Player.play();
  } catch (error) {
    console.error('Error loading MIDI file or SoundFont:', error);
  }
};



loadAndPlayMidi(midiFileUrl, soundFontUrl);

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }
</style>