<script setup lang="ts">

import { Icon } from '@iconify/vue';
const props = defineProps<{
    song: {
        S3Id: number,
        SongId: number,
        nombre: string,
        genre: string,
        BPM: string,
        createAt: number,
        title: string
    }
}>();
const emit = defineEmits<{
    (e: 'playSong', S3Id: number): void;
    (e: 'downloadSong', S3Id: number): void;
}>();
</script>

<template>
    <tr>
        <td class="flex-td">
            <Icon class="icon" @click="emit('playSong', props.song.S3Id);" icon="carbon:play-outline" width="37"
                height="37">
            </Icon>{{
                props.song?.title }}
        </td>
        <td>{{ props.song?.genre }}</td>
        <td>{{ props.song?.BPM }}</td>
        <td class="td-icon">
            <Icon class="icon" @click="emit('downloadSong', props.song.S3Id);" icon="material-symbols:download"
                width="25" height="25" />
        </td>
    </tr>
</template>

<style scoped>
.icon {
    transition: all 0.25s;
}

.icon:hover {
    transform: scale(1.10);
    cursor: pointer;
    transition: all 0.25s;
}

.icon:active {
    transform: scale(1);
    transition: all 0.00001s;
}

.flex-td {
    display: flex;
    align-items: center;
}

.td-icon {}
</style>