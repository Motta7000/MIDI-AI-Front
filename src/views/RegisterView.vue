<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import { ref, nextTick } from 'vue';
import * as yup from 'yup';
import { Icon } from '@iconify/vue';
import router from '@/router';
import { onBeforeRouteLeave } from 'vue-router';
import { useForm } from 'vee-validate';
import axios from 'axios';
import { toast } from 'vue3-toastify';

const { values, errors, handleSubmit, defineField, setFieldTouched } =
  useForm({
    validationSchema: yup.object({
      username: yup.string().required('Ingresar Nombre'),
      password: yup.string()
        .required('Ingresar Contraseña')
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .matches(/[0-9]/, 'La contraseña debe contener al menos 1 número')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'La contraseña debe contener al menos 1 carácter especial')
        .matches(/[A-Z]/, 'La contraseña debe contener al menos 1 letra mayúscula')
        .matches(/[a-z]/, 'La contraseña debe contener al menos 1 letra minúscula')
        .oneOf([yup.ref('repeatPassword')], 'Las contraseñas deben coincidir'),
      email: yup.string().required('Ingresar E-mail').email('Ingrese un E-mail'),
      repeatPassword: yup.string().required('Repetir contraseña').oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
    })
  })

const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')
const [repeatPassword, repeatPasswordAttrs] = defineField('repeatPassword')
const [email, emailAttrs] = defineField('email')
const errorsAxios = ref<{ username?: string; password?: string; api?: string }>({});
const errorsValidation = ref<string>('')

var formSended = false;
const valid = ref(false);
var loadingId = ref<number>();
const validateForm = handleSubmit(
  async (values) => {
    try {
      loadingId.value = toast.loading('Cargando...')
      formSended = true;
      console.log(values);

      const response = await axios.post(`${import.meta.env.VITE_AWS2}/user-create`, {
        username: username.value,
        password: password.value,
        email: email.value,
      });

      router.push('/login');
      setTimeout(() => {
        toast.success('¡Cuenta creada correctamente!');
      }, 800);
      console.log(username.value, password.value, repeatPassword.value);

    } catch (error) {
      // Handle axios errors here
      toast.remove(loadingId.value)

      if (axios.isAxiosError(error)) {
        console.error('API request failed:', error.response?.data?.message || error.message);

        // Set the error message to show it to the user
        if (error.response?.data?.message == 'User already exists') {
          errorsAxios.value = { api: 'El nombre de usuario ya esta siendo utilizado' }
        } else {
          errorsAxios.value = { api: error.response?.data?.message || error.message };
          console.log(errorsAxios.value)
        }


      } else {
        console.error('Unexpected error:', error);
      }
    }
  },
  ({ errors }) => {
    // Handle validation errors from the schema
    if (errors instanceof yup.ValidationError) {
      errorsValidation.value = errors.inner.reduce((acc: any, error: yup.ValidationError) => {
        acc[error.path!] = error.message;
        return acc;
      }, {});
    }
  },
);

onBeforeRouteLeave((to, from, next) => {
  var confirmed = true;
  console.log(username.value, password.value, repeatPassword.value)
  if (!formSended && (username.value != '' || username.value != undefined || password.value != '' || password.value != undefined || repeatPassword.value != '') && repeatPassword.value != undefined) {
    confirmed = confirm('Tienes cambios sin guardar ¿Estás seguro de que quieres continuar?');
  }
  if (confirmed) {
    next();
  } else {
    next(false);
  }
});
</script>

<template>
  <div class="login">
    <div class="card-login"></div>
    <v-card class="mx-auto rounded-lg" width="400">
      <v-card-text class="body-container pt-4">
        <v-form ref="form" v-model="valid" @submit.prevent="validateForm">
          <v-container>
            <v-col>
              <Icon icon="iconamoon:profile" width="110" height="110" />
              <v-row class="v-row">
                <h1 class="h1">Usuario </h1>
              </v-row>
              <v-row cols="12" md="4">
                <v-text-field v-model="username" label="Nombre de usuario" hide-details required autocomplete="username"
                  @blur="setFieldTouched('username', true)" />
              </v-row>
              <v-row cols="12" md="4">
                <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
              </v-row>
              <v-row class="v-row">
                <h1 class="h1">Email </h1>
              </v-row>
              <v-row cols="12" md="4">
                <v-text-field v-model="email" label="Email" hide-details required autocomplete="email"
                  @blur="setFieldTouched('email', true)" />
              </v-row>
              <v-row cols="12" md="4">
                <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
              </v-row>
              <v-row class="v-row">
                <h1 class="h1">Contraseña</h1>
              </v-row>
              <v-row cols="12" md="4">
                <v-text-field v-model="password" label="Contraseña" type="password" hide-details required
                  autocomplete="password" @blur="setFieldTouched('password', true)" />
              </v-row>
              <v-row cols="12" md="4">
                <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
              </v-row>
              <v-row class="v-row">
                <h1 class="h1">Repetir Contraseña</h1>
              </v-row>
              <v-row cols="12" md="4">
                <v-text-field v-model="repeatPassword" label="Repetir Contraseña" type="password" hide-details required
                  autocomplete="password" @blur="setFieldTouched('repeatPassword', true)" />
              </v-row>
              <v-row cols="12" md="4">
                <span v-if="errors.repeatPassword" class="error-message">{{ errors.repeatPassword }}</span>
              </v-row>

              <v-row cols="12" md="4">
                <span v-if="errorsAxios" class="error-message">{{ errorsAxios.api }}</span>
              </v-row>
              <v-row cols="12" md="4">
                <v-btn class="mt-3" color="success" type="submit">Enviar</v-btn>
              </v-row>
              <v-row cols="12" md="4">
                <RouterLink class="mt-1" to="/login" @click.native="">¿Ya tienes cuenta? Ingresa aquí
                </RouterLink>
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
  background-image: url('../assets/img/register.png');
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
