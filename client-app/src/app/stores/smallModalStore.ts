import {makeAutoObservable} from 'mobx';
import { store } from './store';

interface Modal {
    open: boolean;
    body: JSX.Element | null;
}

export default class SmallModalStore {

    smallModal: Modal = {
        open: false,
        body: null
    }

    constructor() {
        makeAutoObservable(this)
    }

    openSmallModal = (content: JSX.Element) => {
        this.smallModal.open = true;
        this.smallModal.body = content;
    }

    closeSmallModal = () => {
        this.smallModal.open = false;
        this.smallModal.body = null;
    }
}