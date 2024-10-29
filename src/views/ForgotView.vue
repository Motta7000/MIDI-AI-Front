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
import { useRoute } from 'vue-router';

const route = useRoute();

const { values, errors, handleSubmit, defineField, setFieldTouched } = useForm({
  validationSchema: yup.object({

    username: yup.string()
      .required('Ingrese su nombre de usuario')
  })
});

const [username, usernameAttrs] = defineField('username');

const errorsValidation = ref<string>('');

var formSended = false;
const valid = ref(false);
var loadingId = ref<number>();
const validateForm = handleSubmit(
  async (values) => {
    const datos = {
      ClientId: import.meta.env.VITE_CLIENT_ID,
      Username: values.username,
    };

    try {
      const respuesta = await axios.post(
        `https://cognito-idp.us-east-1.amazonaws.com/`,
        JSON.stringify(datos),
        {
          headers: {
            'X-Amz-Target': 'AWSCognitoIdentityProviderService.ForgotPassword',
            'Content-Type': 'application/x-amz-json-1.1',
          },
        }
      );
      console.log(respuesta.data)
      setTimeout(() => {
        toast.info('Se envió el código de verificación al mail: ' + respuesta.data.CodeDeliveryDetails.Destination, {
          "autoClose": 15000,
        });
      }, 800);
      router.push(`/reset?username=${encodeURIComponent(username.value)}`);
    } catch (error) {
      console.error('Error al iniciar el restablecimiento:', error.response ? error.response.data : error.message);
    }

  },
  ({ errors }) => {
    if (errors instanceof yup.ValidationError) {
      errorsValidation.value = errors.inner.reduce((acc: any, error: yup.ValidationError) => {
        acc[error.path!] = error.message;
        return acc;
      }, {});
    }
  },
);

async function confirmarRegistro() {

}


</script>

<template>
  <div class="login">
    <div class="card-login"></div>
    <v-card class="mx-auto rounded-lg" width="400">
      <v-card-text class="body-container pt-4">
        <v-form ref="formulario" v-model="valido" @submit.prevent="validateForm">
          <v-container>
            <v-col>
              <Icon icon="mdi:password-reset" width="110" height="110" />
              <v-row class="v-row">
                <p class="h1 mb-1 mt-1">Le enviaremos a su mail un codigo para que pueda reiniciar su contraseña</p>
              </v-row>

              <v-row class="v-row">
                <h1 class="h1 ">Nombre de Usuario</h1>
              </v-row>
              <v-row cols="12" md="4">
                <v-text-field v-model="username" label="" hide-details required autocomplete="off"
                  @blur="setFieldTouched('codigoConfirmacion', true)" />
              </v-row>
              <v-row cols="12" md="4">
                <span v-if="errors.username" class="mensaje-error">{{ errors.username }}</span>
              </v-row>

              <v-row cols="12" md="4">
                <span v-if="erroresAxios" class="mensaje-error">{{ erroresAxios.api }}</span>
              </v-row>
              <v-row cols="12" md="4">
                <v-btn class="mt-3" color="success" type="submit">Confirmar</v-btn>
              </v-row>

            </v-col>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>


<style scoped>
.mb-1 {
  margin-bottom: 0.2rem !important;
}

.mt-1 {
  margin-top: 0.2rem !important;
}

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
