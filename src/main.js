import { createApp } from 'vue'
import { createPinia } from 'pinia';
import { Quasar, Notify, Loading } from 'quasar';
import App from './App.vue'
import { router } from "./routes/routes.js";
import 'quasar/src/css/index.sass';
import axios from 'axios';
import '@quasar/extras/material-icons/material-icons.css'

const pinia = createPinia()
const app = createApp(App)

app.use(Quasar, {
    plugins: {
        Notify,
        Loading
    },
    config: {
        notify: {
            position: 'top-right',
            timeout: 2000,
            color: 'primary',
            textColor: 'white',
        },
        loading: {
            position: 'center'
        }
    }
});

app.use(router)
app.mount('#app')
app.use(pinia)
