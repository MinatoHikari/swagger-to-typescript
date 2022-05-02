import type {HomeListItem} from './pages';

export type StoreType = {
    sourceList?: Omit<HomeListItem, 'type' | 'key'>[];
};
