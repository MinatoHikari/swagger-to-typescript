import { ref } from 'vue';
import type List from '/@/components/modules/list/list.vue';

export const useList = () => {
    const listRef = ref<InstanceType<typeof List> | null>(null);
    const clearListRef = () => {
        listRef.value && listRef.value.innerCardRefsMap.clear();
    };
    const scrollToPref = () => listRef.value?.scrollToPrevResult();
    const scrollToNext = () => listRef.value?.scrollToNextResult();
    const scrollToTargetIndex = (e: number) => listRef.value?.scrollToTargetIndex(e);

    return {
        listRef,
        scrollToPref,
        scrollToNext,
        scrollToTargetIndex,
        clearListRef,
    };
};
