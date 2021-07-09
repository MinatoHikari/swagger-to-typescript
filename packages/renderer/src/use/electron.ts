import { onActivated, onDeactivated, onBeforeUnmount, ref, getCurrentInstance } from 'vue';

export function useElectron(): Readonly<ElectronApi> {
    return window.electron;
}

const { receive, invoke, send, sendSync } = useElectron();

export const useReceiver = (channel: string, func: (...args: any) => any) => {
    const vm = getCurrentInstance();
    let invoked = false;
    let listenerCache = Symbol();

    listenerCache = receive(channel, func);

    const invokeListener = () => {
        invoke(channel, listenerCache);
        invoked = true;
    };

    const restore = () => {
        listenerCache = receive(channel, func);
        invoked = false;
    };

    onActivated(() => {
        if (invoked) {
            restore();
        }
    }, vm);

    onDeactivated(() => {
        if (!invoked) {
            invokeListener();
        }
    }, vm);

    onBeforeUnmount(() => {
        if (!invoked) {
            invokeListener();
        }
    }, vm);

    const invoker = () => {
        if (!invoked) {
            invokeListener();
        }
    };

    return [invoker];
};
