<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import { ref } from 'vue';
import * as yup from 'yup';
import { Icon } from '@iconify/vue';
import router from '@/router';
import { useUserStore } from '@/stores/counter'

// Define YUP validation schema
const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required')
});
const userStore = useUserStore();
// Form data
const username = ref('');
const password = ref('');
const valid = ref(false);
const errors = ref<{ username?: string; password?: string }>({});

// Define validation rules
const usernameRules = [
  (v: any) => !!v || 'Username is required'
];
const passwordRules = [
  (v: any) => !!v || 'Password is required'
];

// Validate form
const validateForm = async () => {
  try {
    await schema.validate({ username: username.value, password: password.value }, { abortEarly: false });
    errors.value = {};

    userStore.setUsername(username.value); // Save the username in the store
    router.push('/canciones')
  } catch (err) {
    if (err instanceof yup.ValidationError) {

      errors.value = err.inner.reduce((acc: any, error: yup.ValidationError) => {
        acc[error.path!] = error.message;
        return acc;
      }, {});
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
                <v-text-field v-model="username" :rules="usernameRules" label="First name" hide-details
                  required></v-text-field>

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
                <v-text-field v-model="password" :rules="passwordRules" label="Contraseña" type="password" hide-details
                  required></v-text-field>

              </v-row>
              <v-row cols="12" md="4">
                <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
              </v-row>
              <v-row cols="12" md="4">
                <v-btn class="mt-3" color="success" @click="validateForm">Enviar</v-btn>
              </v-row>
              <v-row cols="12" md="4">
                <RouterLink class="mt-1" to="/register">¿No tienes cuenta? Registrate aqui</RouterLink>
              </v-row>

            </v-col>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>

  </div>
</template>

<style scoped>
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