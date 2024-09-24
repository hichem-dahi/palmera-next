// src/plugins/vuetify.ts
import { createVuetify } from 'vuetify'

import { VDateInput } from 'vuetify/labs/VDateInput'
import { VNumberInput } from 'vuetify/labs/VNumberInput'

import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, md } from 'vuetify/iconsets/md'

import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure your project is capable of handling css files

export default createVuetify({
  components: { ...components, VDateInput, VNumberInput },
  directives,
  icons: {
    defaultSet: 'md',
    aliases,
    sets: {
      md
    }
  }
})
