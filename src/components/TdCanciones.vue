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

// Reactive reference for controlling the dialog
const dialog = ref(false);

// Function to delete a record, opens the dialog first
async function openDeleteWindow() {
    dialog.value = true;  // Show the dialog when the icon is clicked
}



async function deleteSong() {
    const loadingToastId = ref(null);

    try {
        // Show a loading toast
        loadingToastId.value = toast.loading('Deleting song...', {
            timeout: false, // Keep the toast visible until manually dismissed
        });

        console.log('Deleting Song:');
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

        // Dismiss the loading toast
        toast.remove(loadingToastId.value);

        // Show a success toast
        toast.success('Song deleted successfully!');

        // Emit event to re-fetch songs
        emit('reFetchSongs');
    } catch (error) {
        // Dismiss the loading toast
        toast.dismiss(loadingToastId.value);

        // Show an error toast
        toast.error(`Failed to delete song: ${error.message}`);
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
            <!-- Trigger the delete confirmation dialog on click -->
            <Icon class="icon" @click="openDeleteWindow()" icon="material-symbols:delete-outline" width="25"
                height="25" />
        </td>
    </tr>

    <!-- Confirmation dialog -->
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title class="headline">Confirm Deletion</v-card-title>
            <v-card-text>Are you sure you want to delete this record?</v-card-text>
            <v-card-actions>
                <v-btn color="red darken-1" text @click="dialog = false">Cancel</v-btn>
                <v-btn color="green darken-1" text
                    @click="dialog = false; deleteSong() /* Call your delete function here */">Confirm</v-btn>
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
