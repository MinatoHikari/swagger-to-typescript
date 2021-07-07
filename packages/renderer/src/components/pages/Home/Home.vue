<template>
    <div style="padding: 24px 0">
        <n-grid x-gap="12" y-gap="1">
            <n-gi span="16" offset="1">
                <n-form ref="formRef" label-placement="left" :model="formData" :rules="rules">
                    <n-form-item :label="'Request-Url'" path="url">
                        <n-input
                            ref="requestInputRef"
                            v-model:value="formData.url"
                            placeholder="swagger api-docs url"
                            type="input"
                            @keyup.enter="request"
                        />
                    </n-form-item>
                </n-form>
            </n-gi>
            <n-gi span="7">
                <n-button type="info" ghost @click="request">request</n-button>
                <n-button style="margin-left: 12px" type="primary" ghost @click="showSearch">
                    search
                </n-button>
            </n-gi>
        </n-grid>
        <n-grid style="margin-top: 24px">
            <n-gi span="22" offset="1">
                <List ref="listRef" />
            </n-gi>
        </n-grid>
    </div>
    <n-modal
        v-model:show="searchVisible"
        style="width: 450px"
        preset="card"
        size="small"
        title="search"
    >
        <n-grid x-gap="12">
            <n-gi span="18">
                <n-input
                    ref="inputRef"
                    v-model:value="searchVal"
                    placeholder="input what you want to find"
                    type="input"
                    @keyup.enter="search"
                />
            </n-gi>
            <n-gi span="6">
                <n-button type="info" ghost @click="search">confirm</n-button>
            </n-gi>
        </n-grid>
    </n-modal>
    <SearchNavigator
        @clear-search="clearSearch"
        @search="showSearch"
        @prev="$refs.listRef.scrollToPrevResult()"
        @next="$refs.listRef.scrollToNextResult()"
        @scroll-to="(e) => $refs.listRef.scrollToTargetIndex(e)"
    />
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, provide, ref, reactive, onMounted } from 'vue';
import { useElectron, useReceiver } from '/@/use/electron';
import type { NForm, NInput } from 'naive-ui';
import { useMessage } from 'naive-ui';
import List from '../../modules/list.vue';
import type { SwaggerApiResult } from '../../../../../../types/swagger';
import { SwaggerApiResultKey } from '../../../../types/home';
import { errorEvent, requestSwaggerEvent } from '../../../../../common/events';
import { useSearch } from '/@/components/pages/Home/useSearch';
import SearchNavigator from '/@/components/modules/searchNavigator.vue';

const { send, invoke } = useElectron();

export default defineComponent({
    name: 'Home',
    components: {
        List,
        SearchNavigator,
    },
    setup() {
        const message = useMessage();

        const listRef = ref<List | null>(null);

        const requestInputRef = ref<NInput | null>(null);

        onMounted(() => {
            requestInputRef.value?.focus();
        });

        const loading = ref(false);
        const formData = ref({
            url: '',
        });
        const formRef = ref<NForm | null>(null);
        const source = ref({});

        provide(SwaggerApiResultKey, source);

        const requestListener = (data: SwaggerApiResult) => {
            loading.value = false;
            message.success('请求成功');
            console.log(data);
            source.value = data;
        };
        useReceiver(requestSwaggerEvent, requestListener);

        const errListener = (err: Error) => {
            console.log(err);
            message.error(err.message);
        };
        useReceiver(errorEvent, errListener);

        const request = async () => {
            listRef.value && (listRef.value.innerCardRefs.length = 0);
            loading.value = true;
            if (formRef.value) {
                formRef.value?.validate((err: string) => {
                    if (!err) {
                        send(requestSwaggerEvent, formData.value.url);
                    }
                });
            }
        };

        const { showSearch, searchVisible, searchVal, clearSearch, search, inputRef } = useSearch();

        return {
            request,
            loading,
            source,
            formData,
            formRef,
            showSearch,
            searchVisible,
            searchVal,
            clearSearch,
            search,
            inputRef,
            requestInputRef,
            listRef,
        };
    },
    data() {
        return {
            rules: {
                url: {
                    required: true,
                },
            },
        };
    },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
    color: #42b983;
}
</style>
