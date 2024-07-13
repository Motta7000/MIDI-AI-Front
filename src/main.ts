
import './assets/main.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import piniaPersistedState from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
}})
const pinia = createPinia()
pinia.use(piniaPersistedState)

const app = createApp(App)
app.use(vuetify)
app.use(pinia)
app.use(router)

app.mount('#app')
