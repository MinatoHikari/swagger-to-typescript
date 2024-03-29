import type { SwaggerMethod, SwaggerPath } from '../../../../../common/swagger';
import type { ComponentPublicInstance, Ref } from 'vue';

export const useHelper = (
    setRefList: (
        el: ComponentPublicInstance | Element | null,
        path: string,
        summary: string,
        method: string,
    ) => void,
    tags: Ref<Map<string, SwaggerPath>>,
) => {
    const getPathsObj = (name: string) => tags.value.get(name) ?? ({} as SwaggerPath);
    const getMethodsKeyList = (methods: SwaggerMethod) => Object.keys(methods);
    const getMethod = (methods: SwaggerMethod, key: string) => methods[key as keyof SwaggerMethod];
    const setCardRefWrapper =
        (path: string, summary: string, method: string) =>
        (el: ComponentPublicInstance | Element | null) => {
            setRefList(el, path, summary, method);
        };

    return {
        getPathsObj,
        getMethodsKeyList,
        getMethod,
        setCardRefWrapper,
    };
};
