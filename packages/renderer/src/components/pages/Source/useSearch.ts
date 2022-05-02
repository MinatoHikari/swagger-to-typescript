import type { InjectionKey, Ref, ComponentInternalInstance } from 'vue';
import { inject, nextTick, provide, readonly, ref, watch } from 'vue';
import type { ComponentPublicInstance } from '@vue/runtime-core';
import type { NInput } from 'naive-ui';
import { useReceiver } from '/@/use/electron';
import { closeSearchShortcut, searchShortcut } from '../../../../../common/events';
import List from '/@/components/modules/list/list.vue';

export type SearchMatchList = {
    el: ComponentPublicInstance | null;
    path: string;
    summary: string;
}[];

export const SearchKey: InjectionKey<Readonly<Ref<string>>> = Symbol('search');
export const SetMatchKey: InjectionKey<(index: number) => number> = Symbol('setSearchMatchList');
export const MatchKey: InjectionKey<Readonly<Ref<number>>> = Symbol('SearchMatchList');
export const SetResultIndexKey: InjectionKey<(index: number) => number> = Symbol('setResultIndex');
export const ResultIndexKey: InjectionKey<Readonly<Ref<number>>> = Symbol('ResultIndex');

export const useProvider = () => {
    const searchValCache = ref('');
    const searchMatchElListLength = ref(0);
    const setSearchMatchListLength = (number: number) => (searchMatchElListLength.value = number);
    const currentResultIndex = ref(0);
    const setCurrentResultIndex = (index: number) => (currentResultIndex.value = index);

    provide(SearchKey, readonly(searchValCache));
    provide(SetMatchKey, setSearchMatchListLength);
    provide(MatchKey, readonly(searchMatchElListLength));
    provide(SetResultIndexKey, setCurrentResultIndex);
    provide(ResultIndexKey, readonly(currentResultIndex));

    return {
        searchValCache,
        searchMatchElListLength,
        setSearchMatchListLength,
        currentResultIndex,
        setCurrentResultIndex,
    };
};

export const useSearch = () => {
    const { searchValCache } = useProvider();

    const inputRef = ref<typeof NInput | null>(null);

    const searchVisible = ref(false);

    const searchVal = ref('');

    const showSearch = () => {
        searchVisible.value = true;
        nextTick(() => {
            inputRef.value?.focus();
        });
    };

    const clearSearch = () => {
        searchValCache.value = '';
    };

    const search = () => {
        searchValCache.value = searchVal.value;
        searchVisible.value = false;
    };

    const handleSearchShortCut = () => {
        showSearch();
    };

    const handleEscape = () => {
        searchVisible.value = false;
    };

    useReceiver(searchShortcut, handleSearchShortCut);
    useReceiver(closeSearchShortcut, handleEscape);

    return {
        showSearch,
        searchVisible,
        searchVal,
        clearSearch,
        search,
        searchValCache,
        inputRef,
    };
};

export const useSearchInjection = () => {
    const searchValCache = inject(SearchKey, ref(''));
    const setSearchMatchListLength = inject(SetMatchKey, (list: number) => 0);
    const searchMatchElListLength = inject(MatchKey, ref(0));
    const setCurrentResultIndex = inject(SetResultIndexKey, (list: number) => 0);
    const currentResultIndex = inject(ResultIndexKey, ref(0));

    return {
        searchValCache,
        setSearchMatchListLength,
        searchMatchElListLength,
        setCurrentResultIndex,
        currentResultIndex,
    };
};

export const useSearchResult = (
    elMap: Ref<
        Map<
            string,
            { el: ComponentPublicInstance | Element | null; path: string; summary: string }
        >
    >,
) => {
    const { searchValCache, setSearchMatchListLength, setCurrentResultIndex, currentResultIndex } =
        useSearchInjection();

    const matchSearch = (strList: string[]) => {
        if (!searchValCache.value) return false;
        let result = false;
        for (const str of strList) {
            if (str.includes(searchValCache.value)) result = true;
        }
        return result;
    };

    const getOffsetTop = (el: HTMLElement | null, total: Ref<number>) => {
        if (!el) return;
        total.value += el.offsetTop;
        if (el.offsetParent) getOffsetTop(el.offsetParent as HTMLElement, total);
    };

    const ScrollTo = (el: HTMLElement | null, total: Ref<number>, index: number) => {
        getOffsetTop(el, total);

        if (searchMatchElList.value[index])
            window.scrollTo({
                top: total.value,
            });
    };

    const scrollToTargetIndex = (number: number) => {
        if (!searchValCache.value) return;
        const total = ref(0);
        let target = number;
        if (target < 0) target = 0;
        if (target >= searchMatchElList.value.length) target = searchMatchElList.value.length - 1;
        setCurrentResultIndex(target);
        ScrollTo(
            searchMatchElList.value[currentResultIndex.value]?.el?.$el as HTMLElement,
            total,
            target,
        );
    };

    const searchMatchElList: Ref<
        { el: ComponentPublicInstance | null; path: string; summary: string }[]
    > = ref([]);

    const scrollToNextResult = () => {
        if (!searchValCache.value) return;
        const total = ref(0);
        setCurrentResultIndex(currentResultIndex.value + 1);
        console.log(currentResultIndex.value);
        if (currentResultIndex.value >= searchMatchElList.value.length) setCurrentResultIndex(0);
        ScrollTo(
            searchMatchElList.value[currentResultIndex.value]?.el?.$el as HTMLElement,
            total,
            currentResultIndex.value,
        );
    };

    const scrollToPrevResult = () => {
        if (!searchValCache.value) return;
        const total = ref(0);
        setCurrentResultIndex(currentResultIndex.value - 1);
        console.log(currentResultIndex.value);
        if (currentResultIndex.value < 0) {
            const targetIndex = searchMatchElList.value.length - 1;
            setCurrentResultIndex(targetIndex >= 0 ? targetIndex : 0);
        }
        ScrollTo(
            searchMatchElList.value[currentResultIndex.value]?.el?.$el as HTMLElement,
            total,
            currentResultIndex.value,
        );
    };

    watch(searchValCache, () => {
        setCurrentResultIndex(0);

        searchMatchElList.value.length = 0;
        elMap.value.forEach((value, key, map) => {
            if (matchSearch([value.summary, value.path]))
                searchMatchElList.value.push(
                    value as {
                        el: ComponentPublicInstance;
                        path: string;
                        summary: string;
                    },
                );
        });
        setSearchMatchListLength(searchMatchElList.value.length);

        const total = ref(0);
        ScrollTo(searchMatchElList.value[0]?.el?.$el as HTMLElement, total, 0);
    });

    return {
        searchValCache,
        matchSearch,
        scrollToNextResult,
        scrollToPrevResult,
        scrollToTargetIndex,
    };
};
