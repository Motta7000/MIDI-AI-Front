<script setup lang="ts">
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';
import * as yup from 'yup';
import { useForm } from 'vee-validate';
import { toast, type ToastOptions } from 'vue3-toastify';
import router from '@/router';
import axios from 'axios';
import { useUserStore } from '@/stores/counter'
const userStore = useUserStore();

const { values, errors, handleSubmit, defineField } =
    useForm({
        validationSchema: yup.object({
            // usuario: yup.string().eusuario().required(),
            bpm: yup.number()
                .nullable()
                .transform((value, originalValue) => originalValue.trim() === '' ? null : value)
                .typeError("Ingresar un número")
                .moreThan(0, 'El número debe ser mayor que 0'),
            title: yup.string()
                .required('El nombre del archivo es obligatorio')
                .max(255, 'El nombre del archivo no puede exceder los 255 caracteres') // Límite común en muchos sistemas de archivos
                .matches(/^[^\\/:*?"<>|]+$/, 'El nombre del archivo contiene caracteres no válidos')
                .test('sin-espacios-puntos-finales', 'El nombre del archivo no puede terminar con espacios o puntos', (value) => {
                    return value ? !/[. ]$/.test(value) : true;
                })
        })
    })
const [bpm, bpmAttrs] = defineField('bpm')
const [title, titleAttrs] = defineField('title')

const props = defineProps<{
    genre: {
        Description: any;
        GenreTitle: string;
        id: number,
        nombre: string
    }
}>();

const emit = defineEmits<{
    (e: 'playSong', id: number): void;

}>();
const dialogVisible = ref(false)
const onSubmit = handleSubmit(
    async values => {
        //Aca iria el fetch
        dialogVisible.value = false;
        const VITE_AWS3 = import.meta.env.VITE_AWS3;
        router.push('/canciones')
        const response = await axios.post(`${VITE_AWS3}/prod/generateSong`, {
            UserId: userStore.getUsername,
            SongId: Date.now(),
            title: values.title,
            genre: props.genre.GenreTitle.replace(/\s+/g, '-'),
            bpm: values.bpm
        });
        console.log(response)
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 3 seconds
        toast.success('La Cancion fue generada exitosamente')

    },
    ({ errors }) => {
        console.log(errors)
        const errorMessages = Object.values(errors).join(', ');
        toast.error(errorMessages);
    },
);
</script>
<template>
    <v-card class="v-card card" @click="dialogVisible = true">
        <v-card-item>
            <v-card-title>
                {{ props.genre.GenreTitle }}
            </v-card-title>
            <v-card-subtitle>
                Mas de 1000 archivos midi
            </v-card-subtitle>
        </v-card-item>
        <v-card-text>
            {{ props.genre.Description }}
        </v-card-text>
    </v-card>

    <v-dialog class="v-dialog" v-model="dialogVisible" max-width="500">
        <v-card class="flex-container" min-height="300">

            <v-card-title class="v-card-title">
                Generar Cancion de {{ props.genre.GenreTitle }}
            </v-card-title>
            <v-col class="v-col pt-5" cols="12" md="8" sm="6">
                <v-text-field class="v-text-field" v-model="title" label="Título" hide-details required></v-text-field>
                <v-card-text class="error-text">{{ errors.title }} </v-card-text>
            </v-col>
            <v-col class="v-col pt-5" cols="12" md="8" sm="6">
                <v-text-field class="v-text-field" v-model="bpm" label="BPM" hide-details required></v-text-field>
                <v-card-text class="error-text">{{ errors.bpm }} </v-card-text>
            </v-col>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="onSubmit">Generar</v-btn>
            </v-card-actions>


        </v-card>
    </v-dialog>
</template>

<style scoped>
.card {
    max-height: 300px;
    min-height: 200px;
}

.v-col {}

.error-text {
    color: rgb(255, 0, 0);
}

.v-card-title {
    font-size: 25px;
    text-wrap: wrap;
    text-align: center;
}

.flex-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}

.v-text-field {}

.v-dialog {
    transform: none;
}

.v-dialog:hover {
    transform: none;
}
</style>
