import {createApp} from 'vue'
import App from './App.vue'
import router from './router';
import { createVuetify } from 'vuetify';
import { VDataTable } from 'vuetify/components/VDataTable'
import '@mdi/font/css/materialdesignicons.min.css';



//import '@/style/index.less';
//import '@/assets/main.css';


import 'vuetify/dist/vuetify.min.css'; 
const vuetify = createVuetify(
  {
    components:{
      VDataTable,
    },
  }
);
createApp(App).use(router).use(vuetify).mount('#app');

