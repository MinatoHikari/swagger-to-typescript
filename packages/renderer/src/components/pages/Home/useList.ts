import { useElectron, useReceiver } from '/@/use/electron';
import { electronStoreGetEvent, electronStoreSetEvent } from '../../../../../common/events';
import type { StoreType } from '../../../../../common/store';
import { useSwaggerStore } from '/@/store/swagger';
import type { HomeListItem } from '../../../../../common/pages';

const { send, invoke } = useElectron();

export enum Suffix {
    Default = '/swagger-ui.html',
}

const getDefault = (keyNum: number) => {
    return {
        name: '',
        source: '',
        type: 'default',
        key: `${keyNum}`,
        suffix: Suffix.Default,
    } as HomeListItem;
};

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
                suffix: i.suffix,
            };
        });
        if (list.value.length === 0) {
            list.value.push(getDefault(keyNum));
            keyNum++;
        }
    };
    useReceiver(electronStoreGetEvent, sourceListener);

    const list = ref<HomeListItem[]>([]);

    const getSourceList = () => {
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
                suffix: i.suffix,
            })),
        });
        list.value[index].type = 'default';
    };

    const edit = (index: number) => {
        list.value[index].type = 'edit';
    };

    const add = () => {
        list.value.push(getDefault(keyNum));
        keyNum++;
    };

    const enter = (index: number) => {
        store.sourceUrl[0] = {
            url: list.value[index].source,
            version: list.value[index].suffix === Suffix.Default ? 'v2' : 'v3',
        };
        router.push('/source');
    };

    const deleteItem = (index: number) => {
        const res = list.value.filter((i, curIndex) => curIndex !== index);
        console.log(
            res.map((i) => ({
                name: i.name,
                source: i.source,
                suffix: i.suffix,
            })),
        );
        send<{
            key: keyof StoreType;
            data: Omit<HomeListItem, 'type' | 'key'>[];
        }>(electronStoreSetEvent, {
            key: 'sourceList',
            data: res.map((i) => ({
                name: i.name,
                source: i.source,
                suffix: i.suffix,
            })),
        });
        list.value = res;
    };

    return {
        list,
        getSourceList,
        save,
        edit,
        add,
        enter,
        deleteItem,
    };
}
