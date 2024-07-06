<template>
    <div class="hello">
       

    </div>
</template>

<script  lang="ts" >
import MidiPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';

// Initialize MIDI player
const Player = new MidiPlayer.Player(function(event) {
  console.log(event); // Log MIDI events
  
});

// Function to load MIDI file from URL and play
const loadAndPlayMidi = async (midiUrl: string, soundFontName: string) => {
  try {
    // Load MIDI file
    const response = await fetch(midiUrl);
    const midiData = await response.arrayBuffer();
    const byteArray = new Uint8Array(midiData);

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
    Player.loadDataUri('data:audio/midi;base64,' + btoa(String.fromCharCode.apply(null, Array.from(byteArray))));
    Player.play();
  } catch (error) {
    console.error('Error loading MIDI file or SoundFont:', error);
  }
};

// Example usage: load MIDI file and SoundFont
const midiFileUrl = 'public/midi/Oppressed.mid'; // Replace with your MIDI file URL
const soundFontName = 'electric_piano_1'; // Replace with your SoundFont name

loadAndPlayMidi(midiFileUrl, soundFontName);


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }
</style>