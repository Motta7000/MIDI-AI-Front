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
        try {
            const VITE_AWS3 = import.meta.env.VITE_AWS3;
            let bpmInput: number = 100;
            values.bpm == null || values.bpm == undefined ? bpmInput = 100 : bpmInput = bpm.value;
            console.log({
                UserId: userStore.getUsername(),
                SongId: Date.now(),
                title: values.title,
                genre: props.genre.GenreTitle.replace(/\s+/g, '-'),
                bpm: bpmInput
            })
            const loadingToastId = toast.loading('Generando Canción...', {
                autoClose: false, // Prevent it from closing automatically
                closeOnClick: false, // Don't allow users to close it
            });
            const response = await axios.post(`${VITE_AWS3}/generateSong`, {
                UserId: userStore.getUsername(),
                SongId: Date.now(),
                title: values.title,
                genre: props.genre.GenreTitle.replace(/\s+/g, '-'),
                bpm: bpmInput
            });
            console.log('Response:', response);
            router.push('/canciones');
            var seconds = 1
            seconds = seconds * 1000
            await new Promise(resolve => setTimeout(resolve, seconds));
            toast.remove(loadingToastId);
            toast.success(response.data.message);
            // Navigate after successful submission

        } catch (error: unknown) {
            toast.remove();
            console.error('Error details:', error);

            if (axios.isAxiosError(error)) {
                // The error is an AxiosError
                console.error('Response data:', error.response?.data);
                console.error('Response status:', error.response?.status);
                console.error('Response headers:', error.response?.headers);
                toast.error(`Error: ${error.response?.data.message || 'Something went wrong'}`);
            } else if (error instanceof Error) {
                // The error is a standard Error
                console.error('Error message:', error.message);
                toast.error(`Error: ${error.message}`);
            } else {
                // Handle unknown error types
                console.error('An unknown error occurred:', error);
                toast.error('An unknown error occurred');
            }
        }
    },
    ({ errors }) => {
        console.log('Validation errors:', errors);
        const errorMessages = Object.values(errors).join(', ');
        toast.error(errorMessages);
    }
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
