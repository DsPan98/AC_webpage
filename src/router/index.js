//import Vue from 'vue';
//import VueRouter from 'vue-router';
import pageHeader from "@/layout/pageHeader.vue";
import { createRouter, createWebHistory } from 'vue-router';

//no longer required for routers in vue3
//Vue.use(VueRouter);

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

const router = new createRouter({
  history: createWebHistory(),
  base: import.meta.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

export default router;
