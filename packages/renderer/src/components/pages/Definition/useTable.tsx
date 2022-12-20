import type { SwaggerParams } from '../../../../../common/swagger';
import { useUtils } from '/@/use/utils';
import type { SwaggerDefinitionProperty } from '../../../../../common/swagger';
import { NButton } from 'naive-ui';

export const useColumns = (requiredList: string[] | undefined) => {
    const { getDefinitionName, baseTypeMap } = useUtils();

    const router = useRouter();

    const toDefinition = (name: string) => {
        return router.push(`/definition/${name}`);
    };

    const isRequired = (name: string) => (requiredList ? requiredList.includes(name) : false);

    return [
        {
            title: 'Name',
            key: 'name',
        },
        {
            title: 'Type',
            key: 'type',
            render(row: { name: string } & SwaggerDefinitionProperty) {
                console.log(row);
                if (row.type) {
                    if (row.type === 'array') {
                        const definitionName = getDefinitionName(row.items?.$ref as string);
                        return (
                            <span>
                                <span>{'Array<'}</span>
                                <NButton
                                    onClick={() => toDefinition(definitionName)}
                                    text={true}
                                    color={'#2180f0'}
                                >
                                    {`${definitionName}`}
                                </NButton>
                                <span>{'>'}</span>
                            </span>
                        );
                    }
                    return <div>{baseTypeMap.value.get(row.type)}</div>;
                } else {
                    const definitionName = getDefinitionName(row.$ref as string);
                    return (
                        <NButton
                            onClick={() => toDefinition(definitionName)}
                            text={true}
                            color={'#2180f0'}
                        >
                            {definitionName}
                        </NButton>
                    );
                }
            },
        },
        {
            title: 'Required',
            key: 'name',
            render(row: SwaggerParams) {
                return <div>{isRequired(row.name) ? 'true' : 'false'}</div>;
            },
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
