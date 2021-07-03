<template>
    <n-grid>
        <n-gi span="11" offset="1">
            <n-button-group>
                <n-button ghost @click="$router.push('/')">Home</n-button>
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
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AppNavigation',
});
</script>

<style scoped></style>
