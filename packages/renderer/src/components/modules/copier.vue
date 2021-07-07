<template>
    <n-grid>
        <n-gi span="24">
            <n-space justify="end" align="center">
                <n-checkbox v-model:checked="isPartial">Partial</n-checkbox>
                <n-input v-model:value="structName" placeholder="custom struct name" type="input" />

                <n-button type="info" ghost @click="copy">copy type</n-button>
            </n-space>
        </n-gi>
    </n-grid>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'Copier',
    props: [],
    emits: ['copy'],
    setup(props, { emit }) {
        const structName = ref('');
        const isPartial = ref(false);

        const copy = () => {
            emit('copy', {
                structName,
                isPartial,
            });
        };

        return {
            structName,
            isPartial,
            copy,
        };
    },
});
</script>

<style scoped></style>
