<template>
    <div style="padding: 24px 0">
        <n-grid x-gap="12" y-gap="1">
            <n-gi span="17" offset="1">
                <n-form ref="formRef" label-placement="left" :model="formData" :rules="rules">
                    <n-form-item :label="'Request-Url'" path="url">
                        <n-input
                            v-model:value="formData.url"
                            placeholder="输入swagger的api-docs地址"
                            type="input"
                        />
                    </n-form-item>
                </n-form>
            </n-gi>
            <n-gi span="6">
                <n-button @click="request">request</n-button>
            </n-gi>
        </n-grid>
        <n-grid style="margin-top: 24px">
            <n-gi span="22" offset="1">
                <List />
            </n-gi>
        </n-grid>
    </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, provide, ref, reactive } from 'vue';
import { useElectron, useReceiver } from '/@/use/electron';
import type { NForm } from 'naive-ui';
import { useMessage } from 'naive-ui';
import List from '../modules/list.vue';
import type { SwaggerApiResult } from '../../../../../types/swagger';
import { SwaggerApiResultKey } from '../../../types/home';
import { errorEvent, requestSwaggerEvent } from '../../../../common/events';

const { send, invoke } = useElectron();

export default defineComponent({
    name: 'Home',
    components: {
        List,
    },
    setup() {
        const message = useMessage();

        const loading = ref(false);
        const formData = ref({
            url: '',
        });
        const formRef = ref<typeof NForm>(null);
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
            loading.value = true;
            if (formRef.value) {
                formRef.value?.validate((err: string) => {
                    if (!err) {
                        send(requestSwaggerEvent, formData.value.url);
                    }
                });
            }
        };

        return {
            request,
            loading,
            source,
            formData,
            formRef,
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
