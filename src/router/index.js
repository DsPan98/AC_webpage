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

    // children:[
    //   {
    //     path: 'home',
    //     name: 'home',
    //     meta:{
    //       auth: true,
    //       title: '首页'
    //     },
    //     component: () => import('@/views/HomeView.vue'),
    //   },
    //   {
    //     path: 'about',
    //     name: 'about',
    //     meta:{
    //       auth: true,
    //       title: '关于'
    //     },
    //     component: ()=> import('@/views/about/index.vue'),
    //   },
    //   {
    //     path: 'newsAndEvent',
    //     name: 'newsAndEvent',
    //     meta:{
    //       auth: true,
    //       title: '新闻与活动'
    //     },
    //     component: ()=> import('@/views/newsAndEvent/index.vue'),
    //   },
    //   {
    //     path: 'research',
    //     name: 'research',
    //     meta:{
    //       auth: true,
    //       title: '研究'
    //     },
    //     component: ()=> import('@/views/research/index.vue'),
    //   },
    //   {
    //     path: 'map',
    //     name: 'map',
    //     meta:{
    //       auth: true,
    //       title: '地图'
    //     },
    //     component:()=>import('@/views/map/index.vue'),
    //   },
    //   {
    //     path:'articles', 
    //     name:'articles',
    //     meta:{
    //       auth: true,
    //       title:'章程'
    //     },
    //     component:() => import('@/views/articles/index.vue'),
    //   },
    //   {
    //     path:'declaration', 
    //     name:'declaration',
    //     meta:{
    //       auth: true,
    //       title:'宣言'
    //     },
    //     component:() => import('@/views/declaration/index.vue'),
    //   },
    //   {
    //     path:'news',
    //     name:'news',
    //     meta:{
    //       auth:true,
    //       title:'新闻列表',
    //     },
    //     component:() => import('@/views/news/index.vue'),
    //   },
    //   {
    //     path:'newsDetail',
    //     name:'newsDetail',
    //     meta:{
    //       auth:true,
    //       title:'新闻详情',
    //     },
    //     component:() => import('@/views/news/newsDetail.vue'),
    //   },
    //   {
    //     path:'events',
    //     name:'events',
    //     meta:{
    //       auth:true,
    //       title:'活动列表',
    //     },
    //     component:() => import('@/views/events/index.vue'),
    //   },
    //   {
    //     path:'eventsDetail',
    //     name:'eventsDetail',
    //     meta:{
    //       auth:true,
    //       title:'活动详情',
    //     },
    //     component:() => import('@/views/events/eventsDetail.vue'),
    //   },
    //   {
    //     path:'exhibitions',
    //     name:'exhibitions',
    //     meta:{
    //       auth:true,
    //       title:'展览列表',
    //     },
    //     component:() => import('@/views/exhibitions/index.vue'),
    //   },
    //   {
    //     path:'exhibitionsDetail',
    //     name:'exhibitionsDetail',
    //     meta:{
    //       auth:true,
    //       title:'展览详情',
    //     },
    //     component:() => import('@/views/exhibitions/exhibitionsDetail.vue'),
    //   },
    //   {
    //     path:'join',
    //     name:'join',
    //     meta:{
    //       auth:true,
    //       title:'加入',
    //     },
    //     component:() => import('@/views/join/index.vue'),
    //   },
    //   {
    //     path:'genebank',
    //     name:'genebank',
    //     meta:{
    //       auth:true,
    //       title:'基因库',
    //     },
    //     component:() => import('@/views/genebank/index.vue'),
    //   },
    //   {
    //     path:'workStation',
    //     name:'workStation',
    //     meta:{
    //       auth:true,
    //       title:'工作站',
    //     },
    //     component:() => import('@/views/workStation/index.vue'),
    //   },

    // ]
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
