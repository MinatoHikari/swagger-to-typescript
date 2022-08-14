<script lang="ts" setup>
import { useElectron } from '/@/use/electron';
const { versions } = useElectron();
</script>

<template>
    <n-grid>
        <n-gi :span="23" offset="1">
            <ul id="process-versions">
                <li v-for="(version, lib) in versions" :key="lib">
                    <strong>{{ lib }}</strong>
                    <span>: v{{ version }}</span>
                </li>
            </ul>
            <code>packages/renderer/src/components/ElectronVersions.vue</code>
        </n-gi>
    </n-grid>
</template>

<style scoped>
ul {
    list-style: none;
}
li {
    display: flex;
    flex-wrap: nowrap;
}
</style>
