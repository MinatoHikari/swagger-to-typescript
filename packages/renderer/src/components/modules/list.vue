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
                        <n-list-item v-for="(mths, path) of getPathsObj(tag[0])" :key="path">
                            <n-card
                                v-for="method in Object.keys(mths)"
                                :key="method + path"
                                :ref="(el) => setRefList(el, path, mths[method].summary)"
                                size="small"
                                :style="{
                                    borderColor: matchSearch([path, mths[method].summary])
                                        ? '#16a058'
                                        : '',
                                }"
                                hoverable
                                class="list-card-sm"
                                style="cursor: pointer"
                                @click="toDetail(tag[0], method, path, mths[method])"
                            >
                                <n-grid>
                                    <n-gi span="18">
                                        <n-tag style="margin-right: 12px">{{ method }}</n-tag>
                                        <span v-if="matchSearch([path])">
                                            <span>{{ path.split(searchValCache)[0] }}</span>
                                            <span style="color: #f2a531">{{ searchValCache }}</span>
                                            <span>{{ path.split(searchValCache)[1] }}</span>
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
                                            <span v-if="matchSearch([mths[method].summary])">
                                                <span>
                                                    {{
                                                        mths[method].summary.split(
                                                            searchValCache,
                                                        )[0]
                                                    }}
                                                </span>
                                                <span style="color: #f2a531">
                                                    {{ searchValCache }}
                                                </span>
                                                <span>
                                                    {{
                                                        mths[method].summary.split(
                                                            searchValCache,
                                                        )[1]
                                                    }}
                                                </span>
                                            </span>
                                            <span v-else>{{ mths[method].summary }}</span>
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
import { defineComponent, inject, onBeforeUpdate, ref, watch } from 'vue';
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
import { useSearchResult } from '/@/components/pages/Home/useSearch';
import type { NCard } from 'naive-ui';
import type { ComponentPublicInstance } from '@vue/runtime-core';

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

        const innerCardRefs = ref<
            { el: ComponentPublicInstance | null; path: string; summary: string }[]
        >([]);

        const setRefList = (el: ComponentPublicInstance | null, path: string, summary: string) => {
            if (el)
                innerCardRefs.value.push({
                    el,
                    path,
                    summary,
                });
        };

        watch(
            source,
            (val) => {
                console.log(innerCardRefs.value);

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

        const {
            searchValCache,
            matchSearch,
            scrollToNextResult,
            scrollToPrevResult,
            scrollToTargetIndex,
        } = useSearchResult(innerCardRefs);

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
            toDetail,
            searchValCache,
            matchSearch,
            innerCardRefs,
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
