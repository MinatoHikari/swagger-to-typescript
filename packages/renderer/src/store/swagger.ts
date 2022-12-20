import type { SwaggerDefinition, SwaggerMethodsProperty } from '../../../common/swagger';

export const useSwaggerStore = defineStore({
    id: 'swagger',
    state: () => ({
        title: '',
        method: '',
        path: '',
        sourceUrl: [] as { url: string; version: 'v2' | 'v3' }[],
        methodsProperty: {} as SwaggerMethodsProperty,
        definitionMap: new Map<string, SwaggerDefinition>(),
    }),
});
