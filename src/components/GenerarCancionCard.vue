<script setup lang="ts">
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';
import * as yup from 'yup';
import { useForm } from 'vee-validate';
import { toast, type ToastOptions } from 'vue3-toastify';
import router from '@/router';


const { values, errors, handleSubmit, defineField } =
    useForm({
        validationSchema: yup.object({
            // usuario: yup.string().eusuario().required(),
            bpm: yup.number().optional().nullable().typeError("Ingresar un numero").moreThan(0, 'El número debe ser mayor que 0'),
        })
    })
const [bpm, bpmAttrs] = defineField('bpm')

const props = defineProps<{
    genre: {
        id: number,
        nombre: string,
        descripcion: string
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
        router.push('/canciones')
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 3 seconds
        toast.success('La Cancion fue generada exitosamente')

    },
    ({ errors }) => {
        console.log(errors)
    },
);
</script>
<template>
    <v-card class="v-card card" @click="dialogVisible = true">
        <v-card-item>
            <v-card-title>
                {{ props.genre.nombre }}
            </v-card-title>
            <v-card-subtitle>
                Mas de 1000 archivos midi
            </v-card-subtitle>
        </v-card-item>
        <v-card-text>
            {{ props.genre.descripcion }}
        </v-card-text>
    </v-card>

    <v-dialog class="v-dialog" v-model="dialogVisible" max-width="500">
        <v-card class="flex-container" min-height="300">

            <v-card-title class="v-card-title">
                Generar Cancion de {{ props.genre.nombre }}
            </v-card-title>

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
