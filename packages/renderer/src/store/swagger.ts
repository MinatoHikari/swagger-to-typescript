import { defineStore } from 'pinia';
import type { SwaggerDefinition, SwaggerMethodsProperty } from '../../../common/swagger';

export const useSwaggerStore = defineStore({
    id: 'swagger',
    state: () => ({
        title: '',
        method: '',
        path: '',
        sourceUrl: [] as string[],
        methodsProperty: {} as SwaggerMethodsProperty,
        definitionMap: new Map<string, SwaggerDefinition>(),
    }),
});
