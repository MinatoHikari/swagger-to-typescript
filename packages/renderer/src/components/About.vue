<template>
    <h2 id="versions" style="text-align: center">Lib versions</h2>
    <div>
        <ul id="process-versions" aria-labelledby="versions">
            <li v-for="(version, lib) in versions" :key="lib">
                <strong>{{ lib }}</strong>
                : v{{ version }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
// import { useElectron } from '/@/use/electron';
import { versions } from '#preload';

export default defineComponent({
    name: 'AboutPage',
    setup() {
        // const { versions } = useElectron();
        return { versions: computed(() => versions || {}) };
    },
});
</script>

<style scoped>
div {
    text-align: left;
    display: grid;
    justify-content: center;
}
</style>
