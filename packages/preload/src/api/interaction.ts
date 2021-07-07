import { clipboard } from 'electron';

export default {
    copy: async (str: string): Promise<void> => {
        clipboard.writeText(str);
    },
};
