<template>
    <n-grid>
        <n-gi span="24">
            <n-space justify="end" align="center">
                <n-checkbox v-model:checked="isPartial">Partial</n-checkbox>
                <n-input v-model:value="structName" placeholder="custom struct name" type="input" />

                <n-button type="info" ghost @click="copy">copy type</n-button>
                <n-tooltip>
                    check for excluded rows
                    <template #trigger>
                        <n-icon style="position: relative; top: 2px" size="20px">
                            <QuestionCircle24Regular />
                        </n-icon>
                    </template>
                </n-tooltip>
            </n-space>
        </n-gi>
    </n-grid>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { QuestionCircle24Regular } from '@vicons/fluent';

export default defineComponent({
    name: 'CopierComponent',
    components: {
        QuestionCircle24Regular,
    },
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
