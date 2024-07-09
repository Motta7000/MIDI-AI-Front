<script setup lang="ts">

import { Icon } from '@iconify/vue';
const props = defineProps<{
    song: {
        id: number,
        nombre: string,
        genero: string,
        tempo: string
    }
}>();
const emit = defineEmits<{
    (e: 'playSong', id: number): void
}>();
</script>

<template>
    <tr>
        <td class="flex-td">
            <Icon @click="emit('playSong', props.song.id);" icon="carbon:play-outline" width="44" height="44"></Icon>{{
                props.song?.nombre }}
        </td>
        <td>{{ props.song?.genero }}</td>
        <td>{{ props.song?.tempo }}</td>
    </tr>
</template>

<style scoped>
.flex-td {
    display: flex;
    align-items: center;
}
</style>