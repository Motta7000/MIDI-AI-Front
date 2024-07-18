<script setup lang="ts">
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';
import * as yup from 'yup';
import { useForm } from 'vee-validate';
import { toast, type ToastOptions } from 'vue3-toastify';

toast.success('hola')
const { values, errors, handleSubmit, defineField } =
    useForm({
        validationSchema: yup.object({
            // usuario: yup.string().eusuario().required(),
            bpm: yup.number().typeError("Ingresar un numero").moreThan(0, 'El número debe ser mayor que 0').required('Ingresar bpm'),
        })
    })
const [bpm, bpmAttrs] = defineField('bpm')

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
        <v-card class="flex-container" min-height="300">

            <v-card-title class="v-card-title">
                Generar Cancion de {{ props.genre.nombre }}
            </v-card-title>

            <v-col class="v-col pt-5" cols="12" md="8" sm="6">
                <v-text-field class="v-text-field" v-model="bpm" :rules="usernameRules" label="BPM" hide-details
                    required></v-text-field>
                <v-card-text class="error-text">{{ errors.bpm }} </v-card-text>

            </v-col>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="dialogVisible = false">Generar</v-btn>
            </v-card-actions>


        </v-card>
    </v-dialog>
</template>

<style scoped>
.v-col {}

.error-text {
    color: rgb(255, 0, 0);
}

.v-card-title {
    font-size: 25px;
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
