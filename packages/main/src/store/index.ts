import Store from 'electron-store';
import type { HomeListItem } from '../../../renderer/src/components/pages/Home/useList';

export type StoreType = {
    sourceList?: Omit<HomeListItem, 'type' | 'key'>[];
};

const store = new Store<StoreType>();

export default store;
