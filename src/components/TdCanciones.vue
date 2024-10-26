<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import axios from 'axios';
import { useUserStore } from '@/stores/counter'
import { toast } from 'vue3-toastify';
const userStore = useUserStore();

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
    (e: 'reFetchSongs'): void;
}>();

const dialog = ref(false);

async function openDeleteWindow() {
    dialog.value = true;
}

async function deleteSong() {
    type ToastId = string | number;
    const loadingToastId = ref<ToastId | null>(null);

    try {
        loadingToastId.value = toast.loading('Borrando Canción...', {
        });
        console.log('Eliminando canción');
        console.log({
            UserId: userStore.getUsername(),
            SongId: props.song.SongId,
        });

        const res = await axios.delete(`${import.meta.env.VITE_AWS}/songs`, {
            data: {
                UserId: userStore.getUsername(),
                SongId: props.song.SongId,
            },
        });

        toast.remove(loadingToastId.value);

        toast.success('Canción eliminada correctamente');

        emit('reFetchSongs');
    } catch (error) {
        if (loadingToastId.value) {
            toast.remove(loadingToastId.value);
        }

        if (axios.isAxiosError(error)) {
            toast.error(`No se pudo borrar la canción: ${error.response?.data.message || 'Error desconocido'}`);
        } else if (error instanceof Error) {
            toast.error(`No se pudo borrar la canción: ${error.message}`);
        } else {
            toast.error('Error desconocido');
        }

        console.error('Error:', error);
    }
}


</script>

<template>
    <tr>
        <td class="flex-td">
            <Icon class="icon" @click="emit('playSong', props.song.S3Id);" icon="carbon:play-outline" width="37"
                height="37"></Icon>
            {{ props.song?.title }}
        </td>
        <td>{{ props.song?.genre }}</td>
        <td>{{ props.song?.BPM }}</td>
        <td class="td-icon">
            <Icon class="icon" @click="emit('downloadSong', props.song.S3Id);" icon="material-symbols:download"
                width="25" height="25" />
            <Icon class="icon" @click="openDeleteWindow()" icon="material-symbols:delete-outline" width="25"
                height="25" />
        </td>
    </tr>

    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title class="headline">Eliminar "{{ props.song?.title }}"</v-card-title>
            <v-card-text>¿Estas Seguro que deseas eliminar esta canción?</v-card-text>
            <v-card-actions>
                <v-btn color="red darken-1" text @click="dialog = false">Cancelar</v-btn>
                <v-btn color="green darken-1" text @click="dialog = false; deleteSong()">Si</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
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
