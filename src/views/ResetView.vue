<script setup lang="ts">
import { ref } from 'vue';
import * as yup from 'yup';
import { useForm } from 'vee-validate';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import { useRoute } from 'vue-router';
import router from '@/router';

const route = useRoute();

const { values, errors, handleSubmit, defineField, setFieldTouched } = useForm({
  validationSchema: yup.object({

    confirmationCode: yup.string()
      .required('Ingresar el código de confirmación')
      .min(6, 'El código debe tener al menos 6 caracteres'),
    newPassword: yup.string()
      .required('Ingresar nueva contraseña')
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
      .matches(/[0-9]/, 'La nueva contraseña debe contener al menos 1 número')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'La nueva contraseña debe contener al menos 1 carácter especial')
      .matches(/[A-Z]/, 'La nueva contraseña debe contener al menos 1 letra mayúscula')
      .matches(/[a-z]/, 'La nueva contraseña debe contener al menos 1 letra minúscula'),
    confirmPassword: yup.string()
      .oneOf([yup.ref('newPassword')], 'Las contraseñas deben coincidir')
      .required('Confirmar contraseña'),
  })
});

const [confirmationCode, confirmationCodeAttrs] = defineField('confirmationCode');
const [newPassword, newPasswordAttrs] = defineField('newPassword');
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword');

const errorsValidation = ref<string>('');

const validateForm = handleSubmit(async (values) => {
  const datos = {
    ClientId: import.meta.env.VITE_CLIENT_ID,
    Username: route.query.username,
    ConfirmationCode: values.confirmationCode,
    Password: values.newPassword,
  };

  try {
    const respuesta = await axios.post(
      `https://cognito-idp.us-east-1.amazonaws.com/`,
      JSON.stringify(datos),
      {
        headers: {
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.ConfirmForgotPassword',
          'Content-Type': 'application/x-amz-json-1.1',
        },
      }
    );
    setTimeout(() => {
      toast.success('Contraseña cambiada exitosamente!', {
        "autoClose": 3000,
      });
    }, 800);

    router.push('/login')
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error.response ? error.response.data : error.message);
    toast.error('Error al cambiar la contraseña, inténtalo de nuevo.', {
      "autoClose": 5000,
    });
  }
}, ({ errors }) => {
  if (errors instanceof yup.ValidationError) {
    errorsValidation.value = errors.inner.reduce((acc: any, error: yup.ValidationError) => {
      acc[error.path!] = error.message;
      return acc;
    }, {});
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
                <h1 class="h1">Codigo de Confirmación </h1>
              </v-row>
              <v-row cols="12" md="4">
                <v-text-field v-model="confirmationCode" label="Codigo que enviamos a su email" hide-details required
                  autocomplete="co" @blur="setFieldTouched('email', true)" />
              </v-row>
              <v-row cols="12" md="4">
                <span v-if="errors.confirmationCode" class="error-message">{{ errors.confirmationCode }}</span>
              </v-row>


              <v-row class="v-row">
                <h1 class="h1">Contraseña</h1>
              </v-row>
              <v-row cols="12" md="4">
                <v-text-field v-model="newPassword" label="Contraseña" type="password" hide-details required
                  autocomplete="password" @blur="setFieldTouched('password', true)" />
              </v-row>
              <v-row cols="12" md="4">
                <span v-if="errors.newPassword" class="error-message">{{ errors.newPassword }}</span>
              </v-row>
              <v-row class="v-row">
                <h1 class="h1">Repetir Contraseña</h1>
              </v-row>
              <v-row cols="12" md="4">
                <v-text-field v-model="confirmPassword" label="Repetir Contraseña" type="password" hide-details required
                  autocomplete="new-password" @blur="setFieldTouched('repeatPassword', true)" />
              </v-row>
              <v-row cols="12" md="4">
                <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
              </v-row>

              <v-row cols="12" md="4">
                <span v-if="errorsAxios" class="error-message">{{ errorsAxios.api }}</span>
              </v-row>
              <v-row cols="12" md="4">
                <v-btn class="mt-3" color="success" type="submit">Enviar</v-btn>
              </v-row>

            </v-col>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>


<style scoped>
.recover-password {
  /* Estilos para la página de recuperación de contraseña */
}
</style>


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
