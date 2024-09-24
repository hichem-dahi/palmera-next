import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import vuetify from './plugins/vuetify' // Import the vuetify plugin
import router from './router'

import App from './App.vue'

import fr from './locales/fr.json'
import ar from './locales/ar.json'

const app = createApp(App)

// Create the i18n instance with the default locale set to French
const i18n = createI18n({
  locale: 'fr', // Set French as the default language
  fallbackLocale: 'ar', // Optionally, fallback to Arabic
  messages: {
    fr: fr, // French translations
    ar: ar // Arabic translations
  }
})
app.use(i18n)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
