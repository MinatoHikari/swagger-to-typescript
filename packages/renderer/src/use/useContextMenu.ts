import { useElectron } from '/@/use/electron';
import { checkElementEvent } from '../../../common/events';

const { send } = useElectron();

const mode = import.meta.env.MODE;

const checkElement = 'check-element';
const copy = 'copy';

export const useContextMenu = () => {
    const x = ref(0);
    const y = ref(0);
    const showContextMenu = ref(false);

    const options = [
        {
            label: '检查元素',
            key: checkElement,
        },
    ];

    if (mode !== 'development') options.shift();

    const listener = (e: MouseEvent) => {
        e.preventDefault();
        showContextMenu.value = false;
        nextTick().then(() => {
            x.value = e.clientX;
            y.value = e.clientY;
            showContextMenu.value = true;
        });
    };

    window.addEventListener('contextmenu', listener);
    onUnmounted(() => {
        window.removeEventListener('contextmenu', listener);
    });

    const onClickOutside = (e: MouseEvent) => {
        if (e.button !== 2) showContextMenu.value = false;
    };

    const select = (key: string) => {
        if (key === checkElement) {
            send(checkElementEvent, {
                x: x.value,
                y: y.value,
            });
        }
        showContextMenu.value = false;
    };

    return {
        x,
        y,
        showContextMenu,
        onClickOutside,
        select,
        options,
    };
};
