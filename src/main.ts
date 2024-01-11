import { createApp } from 'vue'
import App from './app/App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from '@/app/shared/router/app.router';
import components from '@/app/shared/components';

loadFonts();

const app = createApp(App);

components.forEach(component => app.component(component.name, component));

app
  .use(router)
  .use(vuetify)
  .mount('#app');
