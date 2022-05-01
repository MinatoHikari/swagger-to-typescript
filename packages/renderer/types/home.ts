import type { InjectionKey, Ref } from 'vue';
import type { SwaggerApiResult } from '../../common/swagger';

export const SwaggerApiResultKey: InjectionKey<Readonly<Ref<SwaggerApiResult>>> =
    Symbol('swaggerApiResult');
