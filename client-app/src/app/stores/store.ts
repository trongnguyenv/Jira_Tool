import IssueStore from './issueStore';
import ModalStore from './modalStore';
import MediumModalStore from './mediumModalStore';
import SmallModalStore from './smallModalStore';
import { createContext, useContext } from 'react';
import UserStore from './userStore';
import CommonStore from './commonStore';
import AccountStore from './accountStore';

interface Store {
    issueStore: IssueStore,
    modalStore: ModalStore,
    smallModalStore: SmallModalStore,
    mediumModalStore: MediumModalStore,
    userStore: UserStore,
    accountStore: AccountStore,
    commonStore: CommonStore
}

export const store: Store = {
    issueStore: new IssueStore(),
    modalStore: new ModalStore(),
    userStore: new UserStore(),
    accountStore: new AccountStore(),
    smallModalStore: new SmallModalStore(),
    commonStore: new CommonStore(),
    mediumModalStore: new MediumModalStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}