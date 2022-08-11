import type { Ref } from 'vue';

export interface CopyEvent {
    structName: Ref<string>;
    isPartial: Ref<boolean>;
}
