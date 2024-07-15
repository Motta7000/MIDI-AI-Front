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


</script>
<template>
    <v-card @click="openDialog">
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

    <v-dialog v-model="dialogVisible" max-width="500">
        <v-card>
            <v-card-title>
                {{ selectedGenre?.nombre }}
            </v-card-title>
            <v-card-text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="dialogVisible = false">Close Dialog</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped></style>
