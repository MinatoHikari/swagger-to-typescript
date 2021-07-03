<template>
    <n-grid>
        <n-gi span="24">
            <div v-for="tag in tags" :key="tag[0]" class="list-card">
                <n-card
                    :title="tag[0]"
                    hoverable
                    :segmented="{
                        content: 'hard',
                    }"
                >
                    <n-list>
                        <n-list-item v-for="(mths, path) of getPathsObj(tag[0])" :key="path">
                            <n-card
                                v-for="rest in Object.keys(mths)"
                                :key="rest"
                                size="small"
                                hoverable
                                style="cursor: pointer"
                                @click="toDetail(rest, path, mths[rest])"
                            >
                                <n-grid>
                                    <n-gi span="18">
                                        <n-tag style="margin-right: 12px">{{ rest }}</n-tag>
                                        <span>{{ path }}</span>
                                    </n-gi>
                                    <n-gi span="6">
                                        <div
                                            style="
                                                height: 100%;
                                                display: flex;
                                                align-items: center;
                                                font-size: 13px;
                                            "
                                        >
                                            {{ mths[rest].summary }}
                                        </div>
                                    </n-gi>
                                </n-grid>
                            </n-card>
                        </n-list-item>
                    </n-list>
                </n-card>
            </div>
        </n-gi>
    </n-grid>
</template>

<script lang="ts">
import { defineComponent, inject, ref, watch } from 'vue';
import { SwaggerApiResultKey } from '../../../types/home';
import type {
    SwaggerApiResult,
    SwaggerDefinitions,
    SwaggerMethod,
    SwaggerPath,
} from '../../../../../types/swagger';
import type { SwaggerMethodsProperty } from '../../../../../types/swagger';
import { useRouter } from 'vue-router';
import { useSwaggerStore } from '/@/store/swagger';

export default defineComponent({
    name: 'List',
    setup() {
        const router = useRouter();
        const store = useSwaggerStore();

        const source = inject(
            SwaggerApiResultKey,
            ref({
                swagger: '',
                definitions: {},
                paths: {},
                tags: [],
                basePath: '/',
                host: '',
            } as SwaggerApiResult),
        );

        const tags = ref(new Map<string, SwaggerPath>());

        watch(
            source,
            (val) => {
                tags.value = new Map<string, SwaggerPath>();
                for (let item of val.tags) {
                    tags.value.set(item.name, {});
                }
                let keys = Object.keys(source.value.paths);
                for (let key of keys) {
                    const methodKeys = Object.keys(source.value.paths[key]) as [
                        keyof SwaggerMethod,
                    ];
                    const property = source.value.paths[key];
                    if (property) {
                        const name = property[methodKeys[0]].tags[0];
                        const itemObj = tags.value.get(name);
                        itemObj && (itemObj[key] = property);
                    }
                }
                let definitionKeys = Object.keys(
                    source.value.definitions,
                ) as (keyof SwaggerDefinitions)[];
                for (let key of definitionKeys) {
                    store.definitionMap.set(key, source.value.definitions[key]);
                }
            },
            { deep: true },
        );

        const getPathsObj = (name: string) => tags.value.get(name) ?? {};

        const toDetail = (rest: string, path: string, data: SwaggerMethodsProperty) => {
            store.$patch({
                rest,
                path,
                data,
            });
            router.push('/methodDetail');
        };

        return {
            source,
            tags,
            getPathsObj,
            toDetail,
        };
    },
});
</script>

<style scoped>
.list-card:not(:nth-of-type(1)) {
    margin-top: 24px;
}
</style>
