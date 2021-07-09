import type { SwaggerMethod, SwaggerPath } from '../../../../../../types/swagger';
import type { ComponentPublicInstance } from '@vue/runtime-core';
import type { ComponentInternalInstance, Ref } from 'vue';

export const useHelper = (
    setRefList: (el: ComponentInternalInstance | Element | null, path: string, summary: string) => void,
    tags: Ref<Map<string, SwaggerPath>>,
) => {
    const getPathsObj = (name: string) => tags.value.get(name) ?? ({} as SwaggerPath);
    const getMethodsKeyList = (methods: SwaggerMethod) => Object.keys(methods);
    const getMethod = (methods: SwaggerMethod, key: string) => methods[key as keyof SwaggerMethod];
    const setCardRefWrapper =
        (path: string, summary: string) => (el: ComponentInternalInstance | Element | null) => {
            setRefList(el, path, summary);
        };

    return {
        getPathsObj,
        getMethodsKeyList,
        getMethod,
        setCardRefWrapper,
    };
};
