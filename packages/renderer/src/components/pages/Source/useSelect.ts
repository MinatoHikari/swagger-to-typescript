import { computed, onActivated, ref, watch } from 'vue';
import type { SelectOption } from 'naive-ui';
import { useSwaggerStore } from '/@/store/swagger';
import { requestApiSourcesEvent, requestSwaggerEvent } from '../../../../../common/events';
import { useElectron, useReceiver } from '/@/use/electron';
import type { SwaggerApiResources } from '../../../../../common/swagger';
import type { SwaggerApiV3Resources } from '../../../../../common/swagger';

const { send, invoke } = useElectron();

export const useSelect = () => {
    const store = useSwaggerStore();

    const resourceOptions = ref<SelectOption[]>([]);
    const currentVersion = ref<'v2' | 'v3'>('v2');

    const requestSources = () => {
        const { url, version } = store.sourceUrl[0];
        currentVersion.value = version;
        if (store.sourceUrl[0]) send(requestApiSourcesEvent, url, version);
    };

    const requestListener = (data: SwaggerApiResources[] | SwaggerApiV3Resources) => {
        console.log(data);
        if (Array.isArray(data)) {
            resourceOptions.value = data.map((item) => {
                return {
                    label: item.name,
                    value: item.location,
                };
            });
        } else {
            resourceOptions.value = data.urls.map((item) => {
                return {
                    label: item.name,
                    value: item.url,
                };
            });
        }
    };
    useReceiver(requestApiSourcesEvent, requestListener);

    onActivated(() => {
        requestSources();
    });

    return {
        resourceOptions,
        requestSources,
        currentVersion,
    };
};
