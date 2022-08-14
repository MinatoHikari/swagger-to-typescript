import type {
    SwaggerDefinition,
    SwaggerDefinitionProperty,
    SwaggerParameter,
    SwaggerParams,
} from '../../../common/swagger';

export const useUtils = () => {
    const getDefinitionName = ($ref: string) => {
        if (!$ref) return '';
        const arr = $ref.split('/');
        return arr[arr.length - 1];
    };

    const baseTypeMap = ref(
        new Map<string, string>([
            ['string', 'string'],
            ['integer', 'number'],
            ['file', 'File'],
            ['number', 'number'],
            ['boolean', 'boolean'],
        ]),
    );

    const getParamsType = (item: SwaggerParams) => {
        if (item.type && baseTypeMap.value.has(item.type)) return baseTypeMap.value.get(item.type);
        if (item.type === 'array' && item.items && item.items.$ref)
            return `Array<${getDefinitionName(item.items.$ref)}>`;
        if (!item.type && item.schema && item.schema.$ref) {
            return getDefinitionName(item.schema.$ref);
        }
    };

    const getDefinitionChildType = (item: SwaggerDefinitionProperty) => {
        if (item.type && baseTypeMap.value.has(item.type)) return baseTypeMap.value.get(item.type);
        if (item.type === 'array' && item.items && item.items.$ref)
            return `Array<${getDefinitionName(item.items.$ref)}>`;
        if (!item.type && item.$ref) {
            return getDefinitionName(item.$ref);
        }
    };

    const filterTable = <T extends { name: string }>(list: T[], checkedKeys: string[]) => {
        return list.filter((i) => !checkedKeys.includes(i.name));
    };

    return {
        getDefinitionName,
        baseTypeMap,
        getParamsType,
        getDefinitionChildType,
        filterTable,
    };
};

export const usePropertiesList = (definitionData: SwaggerDefinition) => {
    return computed(() => {
        const list: ({ name: string } & SwaggerDefinitionProperty)[] = [];
        for (const key in definitionData.properties) {
            list.push({
                name: key,
                ...definitionData.properties[key],
            });
        }
        return list;
    });
};

export const useTable = () => {
    const useRowKey = (row: SwaggerParams) => row.name;
    const checkedRowKeys = ref<string[]>([]);

    return { useRowKey, checkedRowKeys };
};
