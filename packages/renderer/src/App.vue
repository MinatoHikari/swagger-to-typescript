<template>
    <app-navigation />
    <NDialogProvider>
        <NMessageProvider>
            <router-view v-slot="{ Component, route }">
                <keep-alive :include="['SourcePage', 'HomePage']">
                    <component :is="Component" :key="route.path" />
                </keep-alive>
            </router-view>
        </NMessageProvider>
    </NDialogProvider>

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
    <n-back-top :right="10" :bottom="20" :show="ScrollY > 180">
        <n-icon size="24">
            <ArrowUpload20Regular />
        </n-icon>
    </n-back-top>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppNavigation from '/@/components/AppNavigation.vue';
import { NDialogProvider, NMessageProvider } from 'naive-ui';
import { useContextMenu } from '/@/use/useContextMenu';
import { ArrowUpload20Regular } from '@vicons/fluent';
import { useWindowScroll } from '@vueuse/core';

export default defineComponent({
    name: 'App',
    components: {
        AppNavigation,
        NMessageProvider,
        NDialogProvider,
        ArrowUpload20Regular,
    },
    setup() {
        const contextMenu = useContextMenu();

        const { y: ScrollY } = useWindowScroll();

        return {
            ...contextMenu,
            ScrollY,
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
body,
html {
    position: relative;
}
</style>
