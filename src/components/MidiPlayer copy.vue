<template>
  <div id="player">
    <button @click="togglePlayPause">{{ isPlaying ? 'Pause' : 'Play' }}</button>
    <div id="progressBar" @click="seek">
      <div id="progress" :style="{ width: progress + '%' }"></div>
    </div>
    <div id="volumeControl">
      <label for="volume">Volume: </label>
      <input id="volume" type="range" min="0" max="1" step="0.01" v-model="volume" @input="adjustVolume" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import MIDI from 'midi.js';
console.log(MIDI)
const isPlaying = ref<boolean>(false);
const progress = ref<number>(0);
const volume = ref<number>(1);
let player: any;
let gainNode: GainNode;

const togglePlayPause = () => {
  if (isPlaying.value) {
    player.pause();
  } else {
    player.resume();
  }
  isPlaying.value = !isPlaying.value;
};

const seek = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const rect = target.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const percent = offsetX / rect.width;
  const currentTime = percent * player.endTime;

  player.currentTime = currentTime;
  progress.value = percent * 100;
};

const adjustVolume = () => {
  if (gainNode) {
    gainNode.gain.value = volume.value;
  }
};

onMounted(() => {
  try {
    MIDI.loadPlugin({
      soundfontUrl: "./soundfont/",
      instrument: "acoustic_grand_piano",
      onprogress: (state: string, progress: number) => {
        console.log(state, progress);
      },
      onsuccess: () => {
        player = MIDI.Player;
        gainNode = MIDI.WebAudio.getContext().createGain();
        gainNode.connect(MIDI.WebAudio.getContext().destination);
        MIDI.WebAudio.connect(gainNode);


        player.setAnimation((data: { now: number; end: number }) => {
          const percent = data.now / data.end;
          progress.value = percent * 100;
        });


        MIDI.Player.loadFile("public/midi/rufus.mid", player.start);
      },
    });
  }
  catch (e) {
    throw 'Error en la ejecucion del reproductor' + e
  }
});
</script>

<style scoped>
#progressBar {
  width: 100%;
  height: 20px;
  background-color: #ddd;
  position: relative;
  cursor: pointer;
  margin: 10px 0;
}

#progress {
  height: 100%;
  width: 0;
  background-color: #4caf50;
}

#volumeControl {
  margin: 10px 0;
}

#volume {
  width: 100%;
}
</style>