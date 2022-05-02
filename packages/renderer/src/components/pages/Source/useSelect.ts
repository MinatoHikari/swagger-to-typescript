import { computed, onActivated, ref, watch } from 'vue';
import type { SelectOption } from 'naive-ui';
import { useSwaggerStore } from '/@/store/swagger';
import { requestApiSourcesEvent, requestSwaggerEvent } from '../../../../../common/events';
import { useElectron, useReceiver } from '/@/use/electron';
import type { SwaggerApiResources } from '../../../../../common/swagger';

const { send, invoke } = useElectron();

export const useSelect = () => {
    const store = useSwaggerStore();

    const resourceOptions = ref<SelectOption[]>([]);

    const requestSources = () => {
        if (store.sourceUrl[0]) send(requestApiSourcesEvent, store.sourceUrl[0]);
    };

    const requestListener = (data: SwaggerApiResources[]) => {
        console.log(data);
        resourceOptions.value = data.map((item) => {
            return {
                label: item.name,
                value: item.location,
            };
        });
        console.log(resourceOptions.value);
    };
    useReceiver(requestApiSourcesEvent, requestListener);

    onActivated(() => {
        requestSources();
    });

    return {
        resourceOptions,
        requestSources,
    };
};
