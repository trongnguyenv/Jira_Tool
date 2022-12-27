import {makeAutoObservable} from 'mobx';
import { store } from './store';

interface Modal {
    open: boolean;
    body: JSX.Element | null;
}

export default class MediumModalStore {

    mediumModal: Modal = {
        open: false,
        body: null
    }

    constructor() {
        makeAutoObservable(this)
    }

    openMediumModal = (content: JSX.Element) => {
        this.mediumModal.open = true;
        this.mediumModal.body = content;
    }

    closeMediumModal = () => {
        this.mediumModal.open = false;
        this.mediumModal.body = null;
    }
}