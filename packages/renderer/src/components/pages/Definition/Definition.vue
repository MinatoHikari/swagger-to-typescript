<template>
    <div style="padding: 24px 0">
        <n-grid>
            <n-gi span="22" offset="1">
                <n-card
                    :title="name"
                    size="small"
                    :segmented="{
                        content: 'hard',
                    }"
                >
                    <Copier @copy="(e) => copyType(e, propertiesList)" />

                    <n-data-table
                        style="margin-top: 12px"
                        :columns="columns"
                        :data="propertiesList"
                    />
                </n-card>
            </n-gi>
        </n-grid>
    </div>
</template>

<script lang="tsx">
import { computed, defineComponent, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { usePropertiesList, useUtils } from '/@/use/utils';
import { useSwaggerStore } from '/@/store/swagger';
import type { SwaggerDefinition, SwaggerDefinitionProperty } from '../../../../../../types/swagger';
import { useColumns } from '/@/components/pages/Definition/useColumns';
import Copier from '/@/components/modules/copier.vue';
import { useEvents } from '/@/components/pages/Definition/useEvents';

export default defineComponent({
    name: 'Definition',
    components: {
        Copier,
    },
    setup() {
        const route = useRoute();

        const store = useSwaggerStore();

        const name = computed(() => route.params.name as string);

        const definitionData = store.definitionMap.get(name.value) as SwaggerDefinition;

        const propertiesList = usePropertiesList(definitionData);

        const columns = useColumns(definitionData.required);

        const { copyType } = useEvents(name.value, definitionData.required);

        return {
            name,
            propertiesList,
            columns,
            copyType,
        };
    },
});
</script>

<style scoped></style>