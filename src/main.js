import {createApp} from 'vue'
import App from './App.vue'
import router from './router';
import { createVuetify } from 'vuetify';
// import { VDataTable} from 'vuetify/components/VDataTable';
// import{ VAppBar } from 'vuetify/components/VAppBar';
// import{ VApp } from 'vuetify/components/VApp';
import '@mdi/font/css/materialdesignicons.min.css';
import { VDataTable, VAppBar, VApp, VAppBarNavIcon, VAppBarTitle, VIcon, VBtn } from 'vuetify/components';
import 'vuetify/dist/vuetify.min.css';



//import '@/style/index.less';
//import '@/assets/main.css';


import 'vuetify/dist/vuetify.min.css'; 
const vuetify = createVuetify(
  {
    components:{
      VDataTable,
      VAppBar,
      VApp,
      VAppBarNavIcon,
      VAppBarTitle,
      VIcon,
      VBtn,
    },
  }
);
createApp(App).use(router).use(vuetify).mount('#app');

