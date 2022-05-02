<template>
    <n-grid>
        <n-gi span="11" offset="1">
            <n-button-group>
                <n-button ghost @click="$router.push('/')">Home</n-button>
                <n-button v-if="showSource" ghost @click="$router.push('/source')">Source</n-button>
                <n-button round @click="$router.push('/about')">About</n-button>
            </n-button-group>
        </n-gi>
        <n-gi span="10" offset="1">
            <n-space justify="end">
                <n-button v-if="$route.path !== '/'" ghost @click="$router.back()">Back</n-button>
            </n-space>
        </n-gi>
    </n-grid>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useSwaggerStore } from '/@/store/swagger';

export default defineComponent({
    name: 'AppNavigation',
    setup() {
        const store = useSwaggerStore();

        return {
            showSource: computed(() => store.sourceUrl.length > 0),
        };
    },
});
</script>

<style scoped></style>
