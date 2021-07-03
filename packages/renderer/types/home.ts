import type { InjectionKey, Ref } from 'vue';
import type { SwaggerApiResult } from '../../../types/swagger';

export const SwaggerApiResultKey: InjectionKey<Readonly<Ref<SwaggerApiResult>>> =
    Symbol('swaggerApiResult');
