import { computed, ref } from 'vue';
import type {
    SwaggerDefinition,
    SwaggerDefinitionProperty,
    SwaggerParameter,
    SwaggerParams,
} from '../../../../types/swagger';

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

    return {
        getDefinitionName,
        baseTypeMap,
        getParamsType,
        getDefinitionChildType,
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
