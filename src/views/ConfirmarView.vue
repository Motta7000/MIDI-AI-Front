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

    confirmationCode: yup.string()
      .required('Ingresar el código de confirmación')
      .length(6, 'El código debe tener 6 caracteres')
  })
});

const [confirmationCode, confirmationCodeAttrs] = defineField('confirmationCode');

const errorsValidation = ref<string>('');

var formSended = false;
const valid = ref(false);
var loadingId = ref<number>();
const validateForm = handleSubmit(
  async (values) => {
    const datos = {
      ClientId: import.meta.env.VITE_CLIENT_ID, // Asegúrate de tener correctamente configurado el CLIENT_ID
      Username: route.query.username,
      ConfirmationCode: values.confirmationCode,
    };
    const input = JSON.stringify(datos)
    console.log(input)

    try {
      const respuesta = await axios.post(
        `https://cognito-idp.us-east-1.amazonaws.com/`,
        input,
        {
          headers: {
            'X-Amz-Target': 'AWSCognitoIdentityProviderService.ConfirmSignUp',
            'Content-Type': 'application/x-amz-json-1.1',
          }
        }
      );
      setTimeout(() => {
        toast.success('Usuario confirmado con exito');
      }, 800);
      router.push('/login')
    } catch (error) {
      console.error(error)
      console.error('Error al confirmar el registro:', error.response ? error.response.data : error.message);
      toast.error(error.response.data.message)
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
                <p class="h1 mb-1 mt-1">Le enviamos a su mail {{ route.query.mail ? "'" + route.query.mail + "'" : null
                  }}
                  un codigo de confirmación, por
                  favor ingresarlo</p>
              </v-row>


              <v-row class="v-row">
                <h1 class="h1 ">Código de Confirmación</h1>
              </v-row>
              <v-row cols="12" md="4">
                <v-text-field v-model="confirmationCode" label="Código de Confirmación" hide-details required
                  autocomplete="off" @blur="setFieldTouched('codigoConfirmacion', true)" />
              </v-row>
              <v-row cols="12" md="4">
                <span v-if="errors.confirmationCode" class="error-message">{{ errors.confirmationCode }}</span>
              </v-row>

              <v-row cols="12" md="4">
                <span v-if="erroresAxios" class="error-message">{{ erroresAxios.api }}</span>
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
.error-message {
  color: rgb(255, 60, 60);
}

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
