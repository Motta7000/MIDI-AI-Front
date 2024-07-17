<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import { ref, nextTick } from 'vue';
import * as yup from 'yup';
import { Icon } from '@iconify/vue';
import router from '@/router';
import { onBeforeRouteLeave } from 'vue-router';
import { useForm } from 'vee-validate';

const { values, errors, handleSubmit, defineField, setFieldTouched } =
  useForm({
    validationSchema: yup.object({
      username: yup.string().required('Ingresar Nombre'),
      password: yup.string().required('Ingresar Contraseña').oneOf([yup.ref('repeatPassword')], 'Las contraseñas deben coincidir'),
      repeatPassword: yup.string().required('Repetir contraseña').oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
    })
  })

const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')
const [repeatPassword, repeatPasswordAttrs] = defineField('repeatPassword')

var formSended = false;
const valid = ref(false);

const validateForm = handleSubmit(
  async values => {
    formSended = true;
    console.log(values)
    errors.value = {};
    router.push('/login')
    alert('Validation succeeded');
    console.log(username.value, password.value, repeatPassword.value)
  },
  ({ errors }) => {
    console.log(errors)
  },
)

onBeforeRouteLeave((to, from, next) => {
  var confirmed = true;
  if (!formSended && (username.value != '' || password.value != '' || repeatPassword.value != '')) {
    confirmed = confirm('You have unsaved changes. Are you sure you want to leave?');
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
                <h1 class="h1">Usuario {{ values }}</h1>
              </v-row>
              <v-row cols="12" md="4">
                <v-text-field v-model="username" label="Nombre de usuario" hide-details required autocomplete="username"
                  @blur="setFieldTouched('username', true)" />
              </v-row>
              <v-row cols="12" md="4">
                <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
              </v-row>
              <v-row class="v-row">
                <h1 class="h1">Contraseña</h1>
              </v-row>
              <v-row cols="12" md="4">
                <v-text-field v-model="password" label="Contraseña" type="password" hide-details required
                  autocomplete="new-password" @blur="setFieldTouched('password', true)" />
              </v-row>
              <v-row cols="12" md="4">
                <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
              </v-row>
              <v-row class="v-row">
                <h1 class="h1">Repetir Contraseña</h1>
              </v-row>
              <v-row cols="12" md="4">
                <v-text-field v-model="repeatPassword" label="Repetir Contraseña" type="password" hide-details required
                  autocomplete="new-password" @blur="setFieldTouched('repeatPassword', true)" />
              </v-row>
              <v-row cols="12" md="4">
                <span v-if="errors.repeatPassword" class="error-message">{{ errors.repeatPassword }}</span>
              </v-row>
              <v-row cols="12" md="4">
                <v-btn class="mt-3" color="success" type="submit">Enviar</v-btn>
              </v-row>
              <v-row cols="12" md="4">
                <RouterLink class="mt-1" to="/login" @click.native="confirmNavigation">¿Ya tienes cuenta? Ingresa aquí
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
