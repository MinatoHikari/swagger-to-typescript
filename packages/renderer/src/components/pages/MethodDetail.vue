<template>
    <div style="padding: 24px 0">
        <n-grid>
            <n-gi span="22" offset="1">
                <n-card
                    size="small"
                    :segmented="{
                        content: 'hard',
                    }"
                >
                    <template #header>
                        <n-grid style="align-items: center">
                            <n-gi span="18">
                                <n-tag style="margin-right: 12px">{{ rest }}</n-tag>
                                <span>{{ path }}</span>
                            </n-gi>
                            <n-gi style="font-size: 15px" span="6">
                                <span>{{ data.summary }}</span>
                            </n-gi>
                        </n-grid>
                    </template>
                </n-card>
            </n-gi>
        </n-grid>
    </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { useSwaggerStore } from '/@/store/swagger';
import { useUtils } from '/@/use/utils';

export default defineComponent({
    name: 'MethodDetail',
    setup() {
        const store = useSwaggerStore();

        const { getDefinitionName } = useUtils();

        console.log(store.$state);

        for (let item in store.data.responses) {
            if (item === '200') {
                const definitionName = getDefinitionName(store.data.responses[item]?.schema?.$ref);
                console.log(store.definitionMap.get(definitionName));
            }
        }

        return {
            ...toRefs(store.$state),
        };
    },
});
</script>

<style scoped></style>
