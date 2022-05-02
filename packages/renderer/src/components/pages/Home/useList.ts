import {ref} from 'vue';
import {useElectron, useReceiver} from '/@/use/electron';
import {electronStoreGetEvent, electronStoreSetEvent} from '../../../../../common/events';
import type {StoreType} from '../../../../../common/store';
import {useRouter} from 'vue-router';
import {useSwaggerStore} from '/@/store/swagger';
import type {HomeListItem} from '../../../../../common/pages';

const { send, invoke } = useElectron();

export function useList() {
    const router = useRouter();
    const store = useSwaggerStore();

    let keyNum = 0;
    const sourceListener = (data: HomeListItem[]) => {
        console.log(data);
        list.value = data.map((i) => {
            const currentKey = keyNum;
            keyNum++;
            return {
                name: i.name ?? '',
                source: i.source ?? '',
                type: 'default',
                key: `${currentKey}`,
            };
        });
        if (list.value.length === 0) {
            list.value.push({
                name: '',
                source: '',
                type: 'default',
                key: `${keyNum}`,
            });
            keyNum++;
        }
    };
    useReceiver(electronStoreGetEvent, sourceListener);

    const list = ref<HomeListItem[]>([]);

    const getSourceList = () => {
        console.log(1);
        send<keyof StoreType>(electronStoreGetEvent, 'sourceList');
    };

    const save = (index: number) => {
        send<{
            key: keyof StoreType;
            data: Omit<HomeListItem, 'type' | 'key'>[];
        }>(electronStoreSetEvent, {
            key: 'sourceList',
            data: list.value.map((i) => ({
                name: i.name,
                source: i.source,
            })),
        });
        list.value[index].type = 'default';
    };

    const edit = (index: number) => {
        list.value[index].type = 'edit';
    };

    const add = () => {
        list.value.push({
            name: '',
            source: '',
            type: 'edit',
            key: `${keyNum}`,
        });
        keyNum++;
    };

    const enter = (index: number) => {
        store.sourceUrl[0] = list.value[index].source;
        router.push('/source');
    };

    return {
        list,
        getSourceList,
        save,
        edit,
        add,
        enter,
    };
}
