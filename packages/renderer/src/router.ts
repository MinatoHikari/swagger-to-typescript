import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '/@/components/pages/Home/Home.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('/@/components/About.vue'),
    },
    {
        path: '/methodDetail',
        name: 'MethodDetail',
        component: () => import('/@/components/pages/MethodDetail/MethodDetail.vue'),
    },
    {
        path: '/definition/:name',
        name: 'Definition',
        component: () => import('/@/components/pages/Definition/Definition.vue'),
    },
];

export default createRouter({
    routes,
    history: createWebHashHistory(),
});
