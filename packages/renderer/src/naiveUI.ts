import {
    NButton,
    NInput,
    create,
    NGrid,
    NGi,
    NCard,
    NList,
    NListItem,
    NTag,
    NP,
    NButtonGroup,
    NSpace,
    NForm,
    NFormItem,
    NDropdown,
} from 'naive-ui';
import type { App } from 'vue';

export const installNaive = (app: App<Element>): void => {
    const naive = create({
        componentPrefix: 'n',
        components: [
            NButton,
            NInput,
            NGrid,
            NGi,
            NCard,
            NList,
            NListItem,
            NTag,
            NP,
            NButtonGroup,
            NSpace,
            NForm,
            NFormItem,
            NDropdown,
        ],
    });

    app.use(naive);
};
