<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import { ref } from 'vue';
import * as yup from 'yup';
import { Icon } from '@iconify/vue';
import router from '@/router';
import { useUserStore } from '@/stores/counter'
import { toast } from 'vue3-toastify';

const show1 = ref(false)
const schema = yup.object().shape({
  username: yup.string().required('Campo Obligatorio'),
  password: yup.string().required('Campo Obligatorio')
});
const userStore = useUserStore();

const username = ref('');
const password = ref('');
const valid = ref(false);
const errors = ref<{ username?: string; password?: string; api?: string }>({});

const usernameRules = [
  (v: any) => !!v || 'Username is required'
];
const passwordRules = [
  (v: any) => !!v || 'Password is required'
];

import axios from 'axios';
var loadingId = ref<number>();
const validateForm = async () => {
  try {
    loadingId.value = toast.loading('Cargando...')
    await schema.validate({ username: username.value, password: password.value }, { abortEarly: false });
    errors.value = {};

    const response = await axios.post(`${import.meta.env.VITE_AWS2}/user`, {
      username: username.value,
      password: password.value
    });

    if (response.status === 200) {
      setTimeout(() => {
        toast.success('¡Sesión iniciada correctamente!');
      }, 800);
      userStore.setUsername(username.value);
      router.push('/canciones');

    }
    else {

    }
  } catch (err) {
    toast.remove(loadingId.value)
    if (err instanceof yup.ValidationError) {
      errors.value = err.inner.reduce((acc: any, error: yup.ValidationError) => {
        acc[error.path!] = error.message;
        return acc;
      }, {});
    }

    if (axios.isAxiosError(err)) {
      console.error('Login failed:', err.response?.data.message || err.message);

      errors.value = { api: err.response?.data.message || err.message };
    }
  }
};

</script>
<template>
  <div class="login">
    <div class="card-login">

    </div>
    <v-card class="mx-auto rounded-lg" width="400">
      <v-card-text style="" class="body-container  pt-4">

        <v-form ref="form" v-model="valid" @submit.prevent="validateForm">
          <v-container>
            <v-col>
              <Icon icon="iconamoon:profile" width="110" height="110" />

              <v-row class="v-row">
                <h1 class="h1">
                  Usuario
                </h1>
              </v-row>
              <v-row cols="12" md="4">
                <v-text-field v-model="username" :rules="usernameRules" label="Nombre de Usuario" hide-details required
                  @keyup.enter="validateForm"></v-text-field>

              </v-row>
              <v-row cols="12" md="4">
                <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
              </v-row>
              <v-row class="v-row">
                <h1 class="h1">
                  Contraseña
                </h1>
              </v-row>
              <v-row cols="12" md="4">

                <v-text-field v-model="password" :append-icon="show1 ? 'iconamoon:profile' : 'iconamoon:profile'"
                  :rules="passwordRules" :type="show1 ? 'text' : 'password'" hint="At least 8 characters"
                  label="Contraseña" name="input-10-1" counter @click:append="show1 = !show1"
                  @keyup.enter="validateForm">
                </v-text-field>


              </v-row>
              <v-row cols="12" md="4">
                <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
              </v-row>
              <v-row cols="12" md="4">
                <span v-if="errors.api" class="error-message">{{ errors.api }}</span>
              </v-row>
              <v-row cols="12" md="4">
                <v-btn class="mt-3" color="success" @click="validateForm">Enviar</v-btn>
              </v-row>
              <v-row cols="12" md="4">
                <RouterLink class="mt-1" to="/register">¿No tienes cuenta? Registrate aqui</RouterLink>
              </v-row>
              <v-row cols="12" md="4">
                <RouterLink class="mt-1" to="/forgot">¿No Recuerdas tu Contraseña? Recuperala Aqui</RouterLink>
              </v-row>

            </v-col>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>

  </div>
</template>

<style scoped>
.error-message {
  color: rgb(255, 60, 60);
}

.v-row {
  justify-content: center;
}

.h1 {
  text-align: center;

}

.body-container {
  text-align: center;
  background: rgb(43, 43, 43);
  background: linear-gradient(180deg, rgb(19, 19, 19) 0%, rgba(0, 0, 0, 1) 100%);
}

.login {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: url('../assets//img/login.png');
  background-size: cover;

}

@media (min-width: 1024px) {
  .login {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>