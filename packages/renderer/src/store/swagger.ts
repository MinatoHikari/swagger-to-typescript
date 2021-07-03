import { defineStore } from 'pinia';
import type { SwaggerDefinition, SwaggerMethodsProperty } from '../../../../types/swagger';

export const useSwaggerStore = defineStore({
    id: 'swagger',
    state: () => ({
        rest: '',
        path: '',
        data: {} as SwaggerMethodsProperty,
        definitionMap: new Map<string, SwaggerDefinition>(),
    }),
});
