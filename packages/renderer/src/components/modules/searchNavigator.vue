<template>
    <n-card v-if="searchValCache" class="navigator-card" content-style="padding:5px">
        <n-space align="center">
            <div style="display: flex; justify-content: space-between; width: 100%">
                <div>
                    <n-input-number
                        v-model:value="value"
                        style="width: 60px; display: inline-block; margin-right: 12px"
                        size="small"
                        :min="1"
                        :max="searchMatchElListLength"
                        placeholder=""
                        :show-button="false"
                        @keyup.enter="$emit('scroll-to', value - 1)"
                    />
                    <span style="margin-right: 12px">/ {{ searchMatchElListLength }}</span>
                </div>
                <div style="text-align: right">
                    <n-button
                        ghost
                        type="primary"
                        size="small"
                        @click="$emit('scroll-to', value - 1)"
                    >
                        go
                    </n-button>
                </div>
            </div>
        </n-space>
    </n-card>
    <n-button-group
        :style="{ top: searchValCache ? '60px' : '30px' }"
        class="search-navigator"
        vertical
    >
        <n-tooltip placement="left" trigger="hover">
            <template #trigger>
                <n-button
                    v-if="searchValCache"
                    size="small"
                    style="background-color: white"
                    class="search-navigator-item"
                    type="default"
                    @click="$emit('prev')"
                >
                    <n-icon size="20">
                        <ChevronUp />
                    </n-icon>
                </n-button>
            </template>
            scroll to prev result
        </n-tooltip>
        <n-tooltip placement="left" trigger="hover">
            <template #trigger>
                <n-button
                    v-if="searchValCache"
                    size="small"
                    style="background-color: white"
                    class="search-navigator-item"
                    type="default"
                    @click="$emit('next')"
                >
                    <n-icon size="20">
                        <ChevronDown />
                    </n-icon>
                </n-button>
            </template>
            scroll to next result
        </n-tooltip>
        <n-tooltip placement="left" trigger="hover">
            <template #trigger>
                <n-button
                    size="small"
                    style="background-color: white"
                    class="search-navigator-item"
                    type="default"
                    @click="$emit('search')"
                >
                    <n-icon size="20">
                        <SearchOutline />
                    </n-icon>
                </n-button>
            </template>
            search
        </n-tooltip>
        <n-tooltip placement="left" trigger="hover">
            <template #trigger>
                <n-button
                    v-if="searchValCache"
                    size="small"
                    style="background-color: white"
                    class="search-navigator-item"
                    type="default"
                    @click="$emit('clear-search')"
                >
                    <n-icon size="20">
                        <CloseOutline />
                    </n-icon>
                </n-button>
            </template>
            clear search result
        </n-tooltip>
    </n-button-group>
</template>

<script>
import { ChevronUp, ChevronDown, CloseOutline, SearchOutline } from '@vicons/ionicons5';
import { useSearchInjection } from '../pages/Home/useSearch';
import { ref, watch } from 'vue';
export default {
    name: 'SearchNavigator',
    components: {
        ChevronUp,
        ChevronDown,
        CloseOutline,
        SearchOutline,
    },
    emits: ['clear-search', 'prev', 'next', 'search', 'scroll-to'],
    setup() {
        const { searchValCache, searchMatchElListLength, currentResultIndex } =
            useSearchInjection();

        const value = ref(currentResultIndex.value + 1);

        watch(currentResultIndex, (val) => {
            value.value = val + 1;
        });

        return {
            searchValCache,
            searchMatchElListLength,
            currentResultIndex,
            value,
        };
    },
};
</script>

<style scoped>
.search-navigator,
.navigator-card {
    position: fixed;
    right: 5px;
}
.navigator-card {
    top: 12px;
    width: auto;
    display: inline-block;
    height: 40px;
}
</style>