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
import { SwaggerApiResultKey } from '../../../../types/home';
import type {
    SwaggerApiResult,
    SwaggerDefinitions,
    SwaggerMethod,
    SwaggerPath,
    SwaggerV3ApiResult,
} from '../../../../../common/swagger';
import type { SwaggerMethodsProperty } from '../../../../../common/swagger';
import { useSwaggerStore } from '/@/store/swagger';
import { useSearchResult } from '/@/components/pages/Source/useSearch';
import type { ComponentPublicInstance } from 'vue';
import { useHelper } from '/@/components/modules/list/useHelper';
import TextSpliter from '../textSpliter.vue';

export default defineComponent({
    name: 'ListComponent',
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
                version: 'v2',
            } as SwaggerApiResult | SwaggerV3ApiResult),
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
                console.log(source);
                tags.value = new Map<string, SwaggerPath>();
                for (let item of val.tags) {
                    tags.value.set(item.name, {});
                }
                let keys = Object.keys(val.paths);
                for (let key of keys) {
                    const methodKeys = Object.keys(val.paths[key]) as [keyof SwaggerMethod];
                    const property = val.paths[key];
                    if (property) {
                        const name = property[methodKeys[0]].tags[0];
                        const itemObj = tags.value.get(name);
                        itemObj && (itemObj[key] = property);
                    }
                }
                let definitionKeys: (keyof SwaggerDefinitions)[] = [];
                let definitions: SwaggerDefinitions;
                if (source.value.version == 'v2') {
                    definitions = (val as SwaggerApiResult).definitions;
                } else {
                    definitions = (val as SwaggerV3ApiResult).components.schemas;
                }
                definitionKeys = Object.keys(definitions) as (keyof SwaggerDefinitions)[];
                for (let key of definitionKeys) {
                    store.definitionMap.set(key as string, definitions[key]);
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
            methodsProperty: SwaggerMethodsProperty,
        ) => {
            console.log('methodsProperty', methodsProperty);
            store.$patch({
                title,
                method,
                path,
                methodsProperty,
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
