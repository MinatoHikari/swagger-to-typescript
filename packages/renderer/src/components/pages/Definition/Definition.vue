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
                    <Copier @copy="copyWrapper" />

                    <n-data-table
                        v-model:checked-row-keys="checkedRowKeys"
                        style="margin-top: 12px"
                        :columns="columns"
                        :data="propertiesList"
                        :row-key="useRowKey"
                    />
                </n-card>
            </n-gi>
        </n-grid>
    </div>
</template>

<script lang="tsx">
import { usePropertiesList, useTable, useUtils } from '/@/use/utils';
import { useSwaggerStore } from '/@/store/swagger';
import type { SwaggerDefinition, SwaggerDefinitionProperty } from '../../../../../common/swagger';
import { useColumns } from '/@/components/pages/Definition/useTable';
import Copier from '/@/components/modules/copier/copier.vue';
import { useEvents } from '/@/components/pages/Definition/useEvents';
import type { CopyEvent } from '/@/components/modules/copier/type';

export default defineComponent({
    name: 'DefinitionPage',
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

        const { checkedRowKeys, useRowKey } = useTable();

        const { filterTable } = useUtils();

        const copyWrapper = (e: CopyEvent) => {
            copyType(e, filterTable(propertiesList.value, checkedRowKeys.value));
        };

        return {
            name,
            propertiesList,
            columns,
            useRowKey,
            checkedRowKeys,
            copyWrapper,
        };
    },
});
</script>

<style scoped></style>
