<script setup lang="ts">
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
    genre: {
        id: number,
        nombre: string,
    }
}>();

const emit = defineEmits<{
    (e: 'playSong', id: number): void
}>();
const dialogVisible = ref(false)

</script>
<template>
    <v-card class="v-card" @click="dialogVisible = true">
        <v-card-item>
            <v-card-title>
                {{ props.genre.nombre }}
            </v-card-title>
            <v-card-subtitle>
                Mas de 1000 archivos midi
            </v-card-subtitle>
        </v-card-item>
        <v-card-text>
            El rock es un genero musical el cual proviene de bla bla
        </v-card-text>
    </v-card>

    <v-dialog class="v-dialog" v-model="dialogVisible" max-width="500">
        <v-card>
            <v-card-title>
                Generar Cancion de {{ props.genre.nombre }}
            </v-card-title>
            <v-card-text>
                BPM
            </v-card-text>
            <v-col>
                <v-text-field v-model="username" :rules="usernameRules" label="BPM" hide-details
                    required></v-text-field>
            </v-col>



            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="dialogVisible = false">Close Dialog</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.v-dialog {
    transform: none;
}

.v-dialog:hover {
    transform: none;
}
</style>
