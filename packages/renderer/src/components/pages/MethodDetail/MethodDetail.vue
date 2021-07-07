<template>
    <div style="padding: 24px 0">
        <n-grid>
            <n-gi span="22" offset="1">
                <h2 style="margin-top: 0">{{ title }}</h2>
            </n-gi>
        </n-grid>
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
                                <n-tag style="margin-right: 12px">{{ method }}</n-tag>
                                <span>{{ path }}</span>
                            </n-gi>
                            <n-gi style="font-size: 15px" span="6">
                                <span>{{ data.summary }}</span>
                            </n-gi>
                        </n-grid>
                    </template>
                    <n-grid y-gap="12">
                        <n-gi span="24">
                            <n-card
                                title="Request params"
                                size="small"
                                :segmented="{
                                    content: 'hard',
                                }"
                            >
                                <n-collapse>
                                    <n-collapse-item
                                        v-for="(table, index) in splitRequestParamsList"
                                        :key="index"
                                        :title="table[0].in"
                                        :name="table[0].in"
                                    >
                                        <Copier @copy="(e) => copyType(e, table)" />

                                        <n-data-table
                                            style="margin-top: 12px"
                                            :columns="columns"
                                            :data="table"
                                        />
                                    </n-collapse-item>
                                </n-collapse>
                            </n-card>
                        </n-gi>
                        <n-gi span="24">
                            <n-card
                                title="ResponseType"
                                size="small"
                                :segmented="{
                                    content: 'hard',
                                }"
                            >
                                <n-collapse>
                                    <n-collapse-item
                                        v-for="(responseType, index) in responseTypeList"
                                        :key="index"
                                        :title="responseType.code"
                                        :name="responseType.code"
                                    >
                                        <Copier
                                            @copy="
                                                (e) => responseType.copyType(e, responseType.table)
                                            "
                                        />

                                        <n-data-table
                                            style="margin-top: 12px"
                                            :columns="responseType.columns"
                                            :data="responseType.table"
                                        />
                                    </n-collapse-item>
                                </n-collapse>
                            </n-card>
                        </n-gi>
                    </n-grid>
                </n-card>
            </n-gi>
        </n-grid>
    </div>
</template>

<script lang="tsx">
import type { Ref } from 'vue';
import { computed, defineComponent, ref, toRefs } from 'vue';
import { useSwaggerStore } from '/@/store/swagger';
import { usePropertiesList, useUtils } from '/@/use/utils';
import { useColumns } from '/@/components/pages/MethodDetail/useColumns';
import { useColumns as useResponseDefinitionColumns } from '../Definition/useColumns';
import type { SwaggerDefinition, SwaggerParams } from '../../../../../../types/swagger';
import { useEvents } from '/@/components/pages/MethodDetail/useEvents';
import { useEvents as useDefinitionEvents } from '/@/components/pages/Definition/useEvents';
import Copier from '/@/components/modules/copier.vue';
import type { SwaggerDefinitionProperty } from '../../../../../../types/swagger';

export default defineComponent({
    name: 'MethodDetail',
    components: {
        Copier,
    },
    setup() {
        const store = useSwaggerStore();

        const { getDefinitionName } = useUtils();

        console.log(store.$state);

        const responseTypeList: Ref<
            {
                code: string;
                table: Ref<(SwaggerDefinitionProperty & { name: string })[]>;
                columns: any[];
                copyType: (...args: any) => void;
            }[]
        > = ref([]);
        for (let item in store.data.responses) {
            const responseCodeItem = store.data.responses[item];
            if (responseCodeItem.schema && responseCodeItem.schema.$ref) {
                const definitionName = getDefinitionName(responseCodeItem.schema.$ref);
                const responseType = store.definitionMap.get(definitionName);
                if (responseType) {
                    const propertiesList = usePropertiesList(responseType);
                    const columns = useResponseDefinitionColumns(responseType.required);
                    const { copyType } = useDefinitionEvents(
                        `${definitionName}`
                            .replace(/«/g, '<')
                            .replace(/»/g, '>')
                            .replace(/List/g, 'Array')
                            .replace(/long/g, 'number'),
                        responseType.required,
                    );
                    responseTypeList.value.push({
                        code: item,
                        table: propertiesList,
                        columns,
                        copyType,
                    });
                }
            }
        }

        const splitRequestParamsList = computed(() => {
            const result: Array<SwaggerParams[]> = [];
            const sourceArr = store.data.parameters;
            for (let i = 0; i < sourceArr.length; i++) {
                if (i === 0 || sourceArr[i].in !== sourceArr[i - 1].in) {
                    result.push([] as SwaggerParams[]);
                }
                result[result.length - 1].push(sourceArr[i]);
            }
            return result;
        });

        const columns = useColumns();

        const { copyType } = useEvents();

        return {
            ...toRefs(store.$state),
            splitRequestParamsList,
            getDefinitionName,
            columns,
            copyType,
            responseTypeList,
        };
    },
});
</script>

<style scoped>
.list-table-sm:not(:nth-of-type(1)) {
    margin-top: 12px;
}
</style>