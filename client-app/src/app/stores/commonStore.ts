import { makeAutoObservable, reaction } from 'mobx';
import { store } from './store';

export default class CommonStore {
    token: string | null = window.localStorage.getItem('jwt');
    assignee_id: string | null = window.localStorage.getItem('assignee_id');
    account_id: string | null = window.localStorage.getItem('account_id');
    email: string | null = window.localStorage.getItem('email');
    appLoaded = false;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.token,
            token => {
                if (token) {
                    window.localStorage.setItem('jwt', token)
                } else {
                    window.localStorage.removeItem('jwt')
                }
            }
        )
        
        reaction(
            () => this.assignee_id,
            assignee_id => {
                if (assignee_id) {
                    window.localStorage.setItem('assignee_id', assignee_id)
                } else {
                    window.localStorage.removeItem('assignee_id')
                }
            }
        )

        reaction(
            () => this.account_id,
            account_id => {
                if (account_id) {
                    window.localStorage.setItem('account_id', account_id)
                } else {
                    window.localStorage.removeItem('account_id')
                }
            }
        )

        reaction(
            () => this.email,
            email => {
                if (email) {
                    window.localStorage.setItem('email', email)
                } else {
                    window.localStorage.removeItem('email')
                }
            }
        )
    }

    loadInitial = () => {
        store.issueStore.loadProjectsInitial();
        store.accountStore.loadInvites();
        store.accountStore.loadAccounts();
        store.issueStore.loadIssues();
        store.issueStore.loadSprints();
        store.userStore.loadUsers();
    }

    logout = () => {
        this.setToken(null);
        this.setAssigneeId(null)
        window.localStorage.removeItem('jwt');
        window.localStorage.removeItem('assignee_id');
        window.localStorage.removeItem('account_id');
    }

    setAssigneeId = (assignee_id: string | null) => {
        this.assignee_id = assignee_id;
    }

    setAccountId = (account_id: string | null) => {
        this.account_id = account_id;
    }

    setToken = (token: string | null) => {
        this.token = token;
    }

    setEmail = (email: string | null) => {
        this.email = email;
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }

}