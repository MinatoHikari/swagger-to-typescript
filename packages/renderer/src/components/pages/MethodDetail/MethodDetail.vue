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
                                <span>{{ methodsProperty.summary }}</span>
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
                                        v-for="table in splitRequestParamsList"
                                        :key="table.name"
                                        :title="table.name"
                                        :name="table.name"
                                    >
                                        <Copier
                                            @copy="
                                                copyWrapper(
                                                    $event,
                                                    table.data,
                                                    checkedRequestRowKeys,
                                                )
                                            "
                                        />

                                        <n-data-table
                                            v-model:checked-row-keys="checkedRequestRowKeys"
                                            style="margin-top: 12px"
                                            :columns="columns"
                                            :data="table.data"
                                            :row-key="useRowKey"
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
                                                copyWrapper(
                                                    $event,
                                                    unref(responseType.table),
                                                    checkedRequestRowKeys,
                                                )
                                            "
                                        />

                                        <n-data-table
                                            v-model:checked-row-keys="checkedResponseRowKeys"
                                            style="margin-top: 12px"
                                            :columns="responseType.columns"
                                            :data="responseType.table"
                                            :row-key="useRowKey"
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
import { useSwaggerStore } from '/@/store/swagger';
import { usePropertiesList, useTable, useUtils } from '/@/use/utils';
import { useColumns } from '/@/components/pages/MethodDetail/useTable';
import { useColumns as useResponseDefinitionColumns } from '../Definition/useTable';
import type {
    SwaggerParams,
    SwaggerResponses,
    SwaggerV3Responses,
} from '../../../../../common/swagger';
import { useEvents } from '/@/components/pages/MethodDetail/useEvents';
import { useEvents as useDefinitionEvents } from '/@/components/pages/Definition/useEvents';
import Copier from '/@/components/modules/copier/copier.vue';
import type { SwaggerDefinitionProperty } from '../../../../../common/swagger';
import type { CopyEvent } from '/@/components/modules/copier/type';
import type { Ref, ComputedRef } from 'vue';
import type { SwaggerRequestBodyTableData } from '../../../../../common/swagger';

export default defineComponent({
    name: 'MethodDetail',
    components: {
        Copier,
    },
    setup() {
        const store = useSwaggerStore();

        const { getDefinitionName, filterTable } = useUtils();

        const responseTypeList: Ref<
            {
                code: string;
                table: ComputedRef<(SwaggerDefinitionProperty & { name: string })[]>;
                columns: any[];
                copyType: (
                    e: { structName: Ref<string>; isPartial: Ref<boolean> },
                    list: ({ name: string } & SwaggerDefinitionProperty)[],
                ) => void;
            }[]
        > = ref([]);
        for (let item in store.methodsProperty.responses) {
            let responseCodeItem: { schema?: { $ref: string } };
            const itemWrapper = store.methodsProperty.responses[item];
            if ((itemWrapper as SwaggerV3Responses[keyof SwaggerV3Responses]).content) {
                responseCodeItem = (store.methodsProperty.responses as SwaggerV3Responses)[item]
                    .content['*/*'];
            } else {
                responseCodeItem = (store.methodsProperty.responses as SwaggerResponses)[item];
            }
            if (responseCodeItem.schema && responseCodeItem.schema.$ref) {
                const definitionName = getDefinitionName(responseCodeItem.schema.$ref);
                const responseType = store.definitionMap.get(definitionName);
                if (responseType) {
                    const propertiesList = usePropertiesList(responseType);
                    console.log('responseType', responseType);
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
            const result: Array<SwaggerRequestBodyTableData> = [];
            console.log(store.methodsProperty);
            if (store.methodsProperty.parameters) {
                const sourceArr = store.methodsProperty.parameters;
                for (let i = 0; i < sourceArr.length; i++) {
                    if (i === 0 || sourceArr[i].in !== sourceArr[i - 1].in) {
                        result.push({
                            name: sourceArr[i].in,
                            data: [],
                        });
                    }
                    (result[result.length - 1].data as SwaggerParams[]).push(sourceArr[i]);
                }
            }
            if (store.methodsProperty.requestBody) {
                const content = store.methodsProperty.requestBody.content;
                const keys = Object.keys(content);

                for (let key of keys) {
                    result.push({
                        name: `requestBody[${key}]`,
                        data: [],
                    });
                    if (content[key].schema && content[key].schema?.$ref) {
                        const definitionName = getDefinitionName(
                            content[key].schema?.$ref as string,
                        );
                        const requestType = store.definitionMap.get(definitionName);
                        if (requestType) {
                            const item = {
                                ...requestType,
                                schema: content[key].schema,
                                in: key,
                                name: definitionName,
                                required: true,
                            } as SwaggerParams;
                            result[result.length - 1].data.push(item);
                        }
                    }
                }
            }
            console.log('result', result);
            return result;
        });

        const columns = useColumns();

        const { copyType } = useEvents();

        const { checkedRowKeys: checkedRequestRowKeys, useRowKey } = useTable();
        const { checkedRowKeys: checkedResponseRowKeys } = useTable();

        const copyWrapper = (
            e: CopyEvent,
            table: (SwaggerDefinitionProperty & { name: string })[],
            keys: string[],
        ) => {
            copyType(e, filterTable(table as SwaggerParams[], keys));
        };

        return {
            ...storeToRefs(store),
            splitRequestParamsList,
            getDefinitionName,
            columns,
            copyWrapper,
            responseTypeList,
            checkedRequestRowKeys,
            checkedResponseRowKeys,
            filterTable,
            useRowKey,
            unref,
        };
    },
});
</script>

<style scoped>
.list-table-sm:not(:nth-of-type(1)) {
    margin-top: 12px;
}
</style>
