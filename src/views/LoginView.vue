<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'

</script>
<template>
  <div class="login">
    <div class="card-login">

    </div>
    <v-card class="mx-auto" prepend-icon="$vuetify" width="400">


      <v-card-text style="" class="body-container  pt-4">

        <v-form v-model="valid">
          <v-container>
            <v-col>
              <v-row class="v-row">
                <h1 class="h1">
                  Usuario
                </h1>
              </v-row>
              <v-row cols="12" md="4">
                <v-text-field v-model="firstname" :counter="10" :rules="nameRules" label="First name" hide-details
                  required></v-text-field>
              </v-row>
              <v-row class="v-row">
                <h1 class="h1">
                  Contraseña
                </h1>
              </v-row>
              <v-row cols="12" md="4">
                <v-text-field v-model="lastname" :counter="10" :rules="nameRules" label="Contraseña" hide-details
                  required></v-text-field>
              </v-row>
              <v-row cols="12" md="4">
                <v-btn color="success">a</v-btn>
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
  background: linear-gradient(180deg, rgb(29, 29, 29) 0%, rgba(0, 0, 0, 1) 100%);
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