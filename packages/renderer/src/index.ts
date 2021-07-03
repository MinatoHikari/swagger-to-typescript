import { createApp } from 'vue';
import App from '/@/App.vue';
import router from '/@/router';
import { createPinia } from 'pinia';
import { installNaive } from './naiveUI';
import 'vfonts/Lato.css';

const app = createApp(App);
installNaive(app);

app.use(router).use(createPinia()).mount('#app');
