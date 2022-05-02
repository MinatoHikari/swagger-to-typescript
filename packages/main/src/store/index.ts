import Store from 'electron-store';
import type { StoreType } from '../../../common/store';

const store = new Store<StoreType>();

export default store;
