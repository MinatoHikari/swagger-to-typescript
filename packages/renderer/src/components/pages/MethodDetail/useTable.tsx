import type { SwaggerParams } from '../../../../../common/swagger';
import { useUtils } from '/@/use/utils';

export const useColumns = () => {
    const { getDefinitionName, baseTypeMap } = useUtils();

    const router = useRouter();

    const toDefinition = (name: string) => {
        return router.push(`/definition/${name}`);
    };

    return [
        {
            title: 'Name',
            key: 'name',
        },
        {
            title: 'Type',
            key: 'type',
            render(row: SwaggerParams) {
                if (row.type) {
                    return <div>{baseTypeMap.value.get(row.type)}</div>;
                } else {
                    const definitionName = getDefinitionName(row.schema?.$ref as string);
                    return (
                        <n-button
                            onClick={() => toDefinition(definitionName)}
                            text={true}
                            color={'#2180f0'}
                        >
                            {definitionName}
                        </n-button>
                    );
                }
            },
        },
        {
            title: 'Required',
            key: 'required',
            render(row: SwaggerParams) {
                return <div>{row.required ? 'true' : 'false'}</div>;
            },
        },
        {
            title: 'Mode',
            key: 'in',
        },
        {
            title: 'Description',
            key: 'description',
        },
        {
            type: 'selection',
        },
    ];
};
