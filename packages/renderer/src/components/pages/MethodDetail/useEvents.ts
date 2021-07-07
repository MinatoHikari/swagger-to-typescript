import type { SwaggerParams } from '../../../../../../types/swagger';
import { useUtils } from '/@/use/utils';
import { useElectron } from '/@/use/electron';
import { useMessage } from 'naive-ui';
import { useSwaggerStore } from '/@/store/swagger';
import type { Ref } from 'vue';
import { computed } from 'vue';

export const useEvents = () => {
    const { getParamsType } = useUtils();

    const { copy } = useElectron();

    const { success } = useMessage();

    const store = useSwaggerStore();

    const isRequired = (isPartial: Ref<boolean>, required: boolean) => {
        if (isPartial.value) return '?';
        return required ? '' : '?';
    };

    const getStructName = (structName: Ref<string>) => {
        return structName.value
            .split(' ')
            .map((i) => {
                if (i) return i[0].toUpperCase() + i.slice(1);
            })
            .join('');
    };

    const copyType = (
        e: { structName: Ref<string>; isPartial: Ref<boolean> },
        list: SwaggerParams[],
        isResponse = false,
    ) => {
        console.log(list);
        const structList: string[] = [];
        let str = '';

        if (e.structName.value) {
            str += `${getStructName(e.structName)} {\n`;
        } else {
            str += `${store.method}${store.path
                .split('/')
                .map((i) => {
                    if (i) return i[0].toUpperCase() + i.slice(1);
                })
                .join('')} {\n`;
        }

        for (const item of list) {
            if (item.description) str += `  // ${item.description}\n`;
            str += `  ${item.name}${isRequired(e.isPartial, item.required)}: ${getParamsType(
                item,
            )}\n`;
        }
        str += '}';
        console.log('str: ', str);
        copy(str).then(() => success('copied'));
    };

    return {
        copyType,
    };
};
