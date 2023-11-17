import Vue from 'vue'
import App from './App.vue'
//import store from './store'
import router from './router';
import VueI18n from 'vue-i18n'
//for internationalization if needed
import zh from './components/lang/zh';
import en from './components/lang/en';
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

import '@/style/index.less';
//import '@/style/mainWebStyle.css';
import '@/assets/main.css';

import { register } from 'swiper/element/bundle';
register();


///testing here
Vue.use(VueI18n)
// Vue.use(ElementUI);
const i18n = new VueI18n({
  locale: 'en',    // 语言标识
  fallbackLocale: 'zh',//没有英文的时候默认中文语言
  silentFallbackWarn: true,//抑制警告
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'zh': Object.assign(zh, zhLocale),   // 中文语言包
    'en': Object.assign(en, enLocale)    // 英文语言包
  },
})

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value) // 在注册Element时设置i18n的处理方法
})


new Vue({
  router,
  //  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');

