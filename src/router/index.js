import Vue from 'vue';
import VueRouter from 'vue-router';
import pageHeader from "@/layout/pageHeader.vue";


Vue.use(VueRouter);

const routes = [
  {
    path:'/',
    //redirect:'home',
    meta:{
      auth: false,
      title: 'home'
    },
    component: pageHeader,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

export default router;
