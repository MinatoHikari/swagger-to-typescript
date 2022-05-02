import { useUtils } from '/@/use/utils';
import { useElectron } from '/@/use/electron';
import { useMessage } from 'naive-ui';
import type { Ref } from 'vue';
import type { SwaggerDefinitionProperty } from '../../../../../common/swagger';

export const useEvents = (oName: string, requiredList: string[] | undefined) => {
    const { getDefinitionChildType } = useUtils();

    const { copy } = useElectron();

    const { success } = useMessage();

    const isRequired = (name: string) => {
        if (!requiredList) return '?';
        return requiredList.includes(name) ? '' : '?';
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
        list: ({ name: string } & SwaggerDefinitionProperty)[],
    ) => {
        console.log(list);
        const structList: string[] = [];
        let str = '';

        if (e.structName.value) {
            str += `${getStructName(e.structName)} {\n`;
        } else {
            str += `${oName} {\n`;
        }

        for (const item of list) {
            if (item.description) str += `  // ${item.description}\n`;
            str += `  ${item.name}${isRequired(item.name)}: ${getDefinitionChildType(item)}\n`;
        }
        str += '}';
        console.log('str: ', str);
        copy(str).then(() => success('copied'));
    };

    return {
        copyType,
    };
};
