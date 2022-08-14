import { ipcRenderer } from 'electron';
import { copyEvent } from '../../../common/events';

export const copy = async (str: string): Promise<void> => {
    ipcRenderer.send(copyEvent, str);
};
