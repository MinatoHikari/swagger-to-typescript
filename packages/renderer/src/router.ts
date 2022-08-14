import Source from '/@/components/pages/Source/Source.vue';
import Home from '/@/components/pages/Home/Home.vue';
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: Home,
    },
    {
        path: '/source',
        name: 'SourcePage',
        component: Source,
    },
    {
        path: '/about',
        name: 'AboutPage',
        component: () => import('/@/components/AboutPage.vue'),
    },
    {
        path: '/methodDetail',
        name: 'MethodDetailPage',
        component: () => import('/@/components/pages/MethodDetail/MethodDetail.vue'),
    },
    {
        path: '/definition/:name',
        name: 'DefinitionPage',
        component: () => import('/@/components/pages/Definition/Definition.vue'),
    },
];

export default createRouter({
    routes,
    history: createWebHashHistory(),
});
