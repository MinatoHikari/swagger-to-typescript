<template>
    <n-grid>
        <n-gi span="24">
            <div v-for="tag in tags" :key="tag[0]" class="list-card">
                <n-card
                    :title="`${tag[0]}`"
                    hoverable
                    size="small"
                    :segmented="{
                        content: 'hard',
                    }"
                >
                    <n-list>
                        <n-list-item v-for="(mths, path) in getPathsObj(tag[0])" :key="path">
                            <n-card
                                v-for="method in getMethodsKeyList(mths)"
                                :key="method + path"
                                :ref="
                                    setCardRefWrapper(
                                        path.toString(),
                                        getMethod(mths, method).summary,
                                        method,
                                    )
                                "
                                size="small"
                                :style="{
                                    borderColor: matchSearch([
                                        path.toString(),
                                        getMethod(mths, method).summary,
                                    ])
                                        ? '#16a058'
                                        : '',
                                }"
                                hoverable
                                class="list-card-sm"
                                style="cursor: pointer"
                                @click="
                                    toDetail(
                                        tag[0],
                                        method,
                                        path.toString(),
                                        getMethod(mths, method),
                                    )
                                "
                            >
                                <n-grid>
                                    <n-gi span="18">
                                        <n-tag style="margin-right: 12px">{{ method }}</n-tag>
                                        <span v-if="matchSearch([path.toString()])">
                                            <TextSpliter
                                                :split-str="searchValCache"
                                                :content="path.toString()"
                                            />
                                        </span>
                                        <span v-else>{{ path }}</span>
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
                                            <span
                                                v-if="
                                                    matchSearch([getMethod(mths, method).summary])
                                                "
                                            >
                                                <TextSpliter
                                                    :split-str="searchValCache"
                                                    :content="getMethod(mths, method).summary"
                                                />
                                            </span>
                                            <span v-else>
                                                {{ getMethod(mths, method).summary }}
                                            </span>
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
import type { ComponentInternalInstance } from 'vue';
import {
    defineComponent,
    inject,
    onBeforeUpdate,
    onRenderTracked,
    onUpdated,
    ref,
    watch,
} from 'vue';
import { SwaggerApiResultKey } from '../../../../types/home';
import type {
    SwaggerApiResult,
    SwaggerDefinitions,
    SwaggerMethod,
    SwaggerPath,
} from '../../../../../../types/swagger';
import type { SwaggerMethodsProperty } from '/@/../../../types/swagger';
import { useRouter } from 'vue-router';
import { useSwaggerStore } from '/@/store/swagger';
import { useSearchResult } from '/@/components/pages/Home/useSearch';
import type { NCard } from 'naive-ui';
import type { ComponentPublicInstance } from '@vue/runtime-core';
import { useHelper } from '/@/components/modules/list/useHelper';
import TextSpliter from '../textSpliter.vue';

export default defineComponent({
    name: 'List',
    components: { TextSpliter },
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

        const innerCardRefsMap = ref<
            Map<
                string,
                { el: ComponentPublicInstance | Element | null; path: string; summary: string }
            >
        >(new Map());

        const setRefList = (
            el: ComponentPublicInstance | Element | null,
            path: string,
            summary: string,
            method: string,
        ) => {
            if (el) {
                innerCardRefsMap.value.set(`${path}____${method}`, {
                    el,
                    path,
                    summary,
                });
            }
        };

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
                    store.definitionMap.set(key as string, source.value.definitions[key]);
                }
            },
            { deep: true },
        );

        const { setCardRefWrapper, getMethodsKeyList, getPathsObj, getMethod } = useHelper(
            setRefList,
            tags,
        );

        const {
            searchValCache,
            matchSearch,
            scrollToNextResult,
            scrollToPrevResult,
            scrollToTargetIndex,
        } = useSearchResult(innerCardRefsMap);

        const toDetail = (
            title: string,
            method: string,
            path: string,
            data: SwaggerMethodsProperty,
        ) => {
            store.$patch({
                title,
                method,
                path,
                data,
            });
            router.push('/methodDetail');
        };

        return {
            source,
            tags,
            getPathsObj,
            getMethodsKeyList,
            getMethod,
            setCardRefWrapper,
            toDetail,
            searchValCache,
            matchSearch,
            innerCardRefsMap,
            setRefList,
            scrollToNextResult,
            scrollToPrevResult,
            scrollToTargetIndex,
        };
    },
});
</script>

<style scoped>
.list-card:not(:nth-of-type(1)) {
    margin-top: 24px;
}
.list-card-sm:not(:nth-of-type(1)) {
    margin-top: 12px;
}
</style>
