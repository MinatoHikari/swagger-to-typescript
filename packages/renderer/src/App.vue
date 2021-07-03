<template>
    <app-navigation />
    <NMessageProvider>
        <router-view v-slot="{ Component, route }">
            <keep-alive :include="['Home']">
                <component :is="Component" :key="route.path" />
            </keep-alive>
        </router-view>
    </NMessageProvider>
    <n-dropdown
        class="context-menu"
        placement="bottom-start"
        :x="x"
        :y="y"
        :options="options"
        :show="showContextMenu"
        :on-clickoutside="onClickOutside"
        @select="select"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppNavigation from '/@/components/AppNavigation.vue';
import { NMessageProvider } from 'naive-ui';
import { useContextMenu } from '/@/use/useContextMenu';

export default defineComponent({
    name: 'App',
    components: {
        AppNavigation,
        NMessageProvider,
    },
    setup() {
        const contextMenu = useContextMenu();

        return {
            ...contextMenu,
        };
    },
});
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 30px;
}
</style>
