<script setup lang="ts">
import { ref } from 'vue';

const handleFileChange = (event: Event) => {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
        const midiFile = fileInput.files[0];
        convertMidiToBlob(midiFile);
    }
};

const convertMidiToBlob = (midiFile: File) => {
    const reader = new FileReader();
    reader.onload = function (e) {
        if (e.target && e.target.result) {
            const arrayBuffer = e.target.result as ArrayBuffer;
            const blob = new Blob([arrayBuffer], { type: 'audio/midi' });
            convertBlobToString(blob);
        }
    };
    reader.readAsArrayBuffer(midiFile);
};

const convertBlobToString = (blob: Blob) => {
    const reader = new FileReader();
    reader.onload = function (e) {
        if (e.target && e.target.result) {
            const blobString = e.target.result as string;
            console.log(blobString);
        }
    };
    reader.readAsDataURL(blob);
};
</script>
<template>

    <div>
        <input type="file" @change="handleFileChange" accept=".mid,.midi" />
    </div>


</template>



<style scoped></style>