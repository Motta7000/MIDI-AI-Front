<script setup lang="ts">

import { Icon } from '@iconify/vue';
const props = defineProps<{
    song: {
        SongId: number,
        nombre: string,
        genre: string,
        BPM: string
    }
}>();
const emit = defineEmits<{
    (e: 'playSong', SongId: number): void
}>();
</script>

<template>
    <tr>
        <td class="flex-td">
            <Icon @click="emit('playSong', props.song.SongId);" icon="carbon:play-outline" width="44" height="44">
            </Icon>{{
                props.song?.S3Id }}
        </td>
        <td>{{ props.song?.genre }}</td>
        <td>{{ props.song?.BPM }}</td>
    </tr>
</template>

<style scoped>
.flex-td {
    display: flex;
    align-items: center;
}
</style>