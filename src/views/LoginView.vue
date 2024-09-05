<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import { ref } from 'vue';
import * as yup from 'yup';
import { Icon } from '@iconify/vue';
import router from '@/router';
import { useUserStore } from '@/stores/counter'
// Define YUP validation schema
const show1 = ref(false)
const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required')
});
const userStore = useUserStore();
// Form data
const username = ref('');
const password = ref('');
const valid = ref(false);
const errors = ref<{ username?: string; password?: string; api?: string }>({});

// Define validation rules
const usernameRules = [
  (v: any) => !!v || 'Username is required'
];
const passwordRules = [
  (v: any) => !!v || 'Password is required'
];

// Validate form
import axios from 'axios';

const validateForm = async () => {
  try {
    // Validate the form input using the schema
    await schema.validate({ username: username.value, password: password.value }, { abortEarly: false });
    errors.value = {};

    // Send a POST request to the API for user authentication
    const response = await axios.post(`${import.meta.env.VITE_AWS2}/user`, {
      username: username.value,
      password: password.value
    });

    // If the response is successful, save the username and navigate to the canciones page
    if (response.status === 200) {
      userStore.setUsername(username.value); // Save the username in the store
      router.push('/canciones');
    }
    else {

    }
  } catch (err) {
    // Handle validation errors from the schema
    if (err instanceof yup.ValidationError) {
      errors.value = err.inner.reduce((acc: any, error: yup.ValidationError) => {
        acc[error.path!] = error.message;
        return acc;
      }, {});
    }

    // Handle errors from the API
    if (axios.isAxiosError(err)) {
      console.error('Login failed:', err.response?.data.message || err.message);

      // Show the error message to the user, e.g., setting an `apiError` variable
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

                <v-text-field v-model="password" :append-icon="show1 ? 'iconamoon:profile' : 'iconamoon:profile'"
                  :rules="passwordRules" :type="show1 ? 'text' : 'password'" hint="At least 8 characters"
                  label="Password" name="input-10-1" counter @click:append="show1 = !show1">
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