import { Account, AccountFormValues } from '../models/account';
import { makeAutoObservable, runInAction } from 'mobx';
import { Assignee } from '../models/assignee';
import { Invitation } from '../models/invitation';
import { store } from './store';
import agent from '../api/agent';
import emailjs from '@emailjs/browser';

export default class AccountStore {
    inviteRegistry = new Map<string, Invitation>();
    accountRegistry = new Map<string, Account>();
    account: Account | null = null;
    assignee: Assignee | null = null;
    someone_is_logged_in = false;
    loading = false;
    activateYourAccount = false;
    accountActivated = false;
    accountsLoading = true;
    loginLoading = false;
    accountToActivate: Account | null = null;
    uploading = false;

    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn() {
        return !!this.account;
    }

    get allInvites() {
        return Array.from(this.inviteRegistry.values());
    }

    get allAccounts() {
        return Array.from(this.accountRegistry.values());
    }

    loadInvites = async () => {
        try {
           const invites = await agent.Invites.list();
           runInAction(() => {
            invites.forEach((invite: Invitation) => {
                this.inviteRegistry.set(invite.id, invite);
             });
           })
        } catch (error) {
            console.log(error);
        }
    }

    loadAccounts = async () => {
        try {
           const accounts = await agent.Accounts.list();
           runInAction(() => {
            accounts.forEach((account: Account) => {
                this.accountRegistry.set(account.id!, account);
             })
           })
           if(store.commonStore.account_id !== null){
            this.account = this.accountRegistry.get(store.commonStore.account_id)!;
           }
           this.accountsLoading = false;
        } catch (error) {
            console.log(error);
        }
    }

    

    login = async (creds: AccountFormValues) => {
        try {
            this.loginLoading = true;
            const user = await agent.Accounts.login(creds);
            const user_assignee = await agent.Assignees.findByAppUserId(user.id);
            const projects = await agent.Projects.list();
            store.commonStore.setAssigneeId(user_assignee.id);
            store.commonStore.setAccountId(user.id);
            store.commonStore.setEmail(user.email);
            runInAction(() => {
                store.issueStore.selectProjectByAssignee(user_assignee.id, projects, user.token);
                this.someone_is_logged_in = true;
                this.account = user;
                this.assignee = user_assignee;
                this.loginLoading = false;
                store.commonStore.setToken(user.token);
                console.log(this.account);
            })
        } catch(error) {
            throw error;
        }
    }

    getAccountToActivate = async (account_id: string) => {
        try {
            const user = await agent.Accounts.getactivate(account_id);
            runInAction(() => {
                this.accountToActivate = user;
            })
        } catch (error) {
            throw error;
        }
    }

    activate = async (account: AccountFormValues) => {
        try {
            await agent.Accounts.postactivate(account);
            runInAction(() => {
                this.accountActivated = true;
            })
        } catch(error) {
            throw error;
        }
    }

    sendActivationEmail = (e: any, form: any, generated_link: string) => {

        form.current.activation_link.value = generated_link;
        
        emailjs.sendForm('service_7m3qndt', 'template_ru53d0d', form.current!, 'h6qjStMC9UbCDPPvC')
            .then((result: any) => {
                console.log(result.text);
            }, (error: any) => {
                console.log(error.text);
            });
        
    };

    sendCollaborationEmail = (e: any, form: any, generated_link: string, user_sending_invite: Account) => {

        form.current.from_name.value = user_sending_invite.first_name.concat(' ', user_sending_invite.second_name);
        form.current.project_name.value = store.issueStore.selectedProject!.name;
        form.current.accept_invitation_link.value = generated_link;

        emailjs.sendForm('service_7m3qndt', 'template_6oi9y9r', form.current!, 'h6qjStMC9UbCDPPvC')
            .then((result: any) => {
                console.log(result.text);
            }, (error: any) => {
                console.log(error.text);
            });
        
    };

    sendRegisterAndCollaborateEmail = (e: any, form: any, generated_link: string) => {

        form.current.activation_link.value = generated_link;
        
        emailjs.sendForm('service_7m3qndt', 'template_ru53d0d', form.current!, 'h6qjStMC9UbCDPPvC')
            .then((result: any) => {
                console.log(result.text);
            }, (error: any) => {
                console.log(error.text);
            });
        
    };

    invite = async (e: any, form: any, invitee_email: AccountFormValues, invitation: Invitation) => {
        try {
            var isUserRegistered = await agent.Accounts.checkAccountRegistrationStatusByEmail(invitee_email);
            var user_sending_invite = await agent.Accounts.details(invitation.inviter_account_id);
            await agent.Invites.create(invitation)
            runInAction(() => {
                if(isUserRegistered === "User registered"){
                    var base_link = "https://www.shmira.com.au";
                    var generated_link = base_link.concat('/invites/accept/', invitation.id);
                    this.sendCollaborationEmail(e, form, generated_link, user_sending_invite);
                } else {
                    console.log("Strawberry");
                    //sendRegisterAndCollaborateEmail(e, form)
                }
            })
        } catch (error) {
            throw (error);
        }
    }

    acceptInvitation = async (invite_id: string) => {
        try {
            await agent.Invites.accept(invite_id);
            runInAction(() => {
                this.loadInvites();
            })
        } catch( error ) {
            throw(error);
        }
    }

    declineInvitation = async (invite_id: string) => {
        try {
            await agent.Invites.decline(invite_id);
            runInAction(() => {
                this.inviteRegistry.delete(invite_id);
                this.loadInvites();
            })
        } catch( error ) {
            throw(error);
        }
    }

    updateAccountInformation = async (account: Account) => {
        try {
            await agent.Accounts.update(account);
            await this.loadAccounts();
            await store.issueStore.loadProject(store.issueStore.selectedProject!.id);
            runInAction(() => {
             //   
            })
        } catch(error) {
            console.log(error);
        }
    }


    logout = () => {
        window.location.reload();
        store.commonStore.setToken(null);
        window.localStorage.removeItem('jwt');
        this.account = null;
        this.someone_is_logged_in = false;     
    }

    register = async (creds: AccountFormValues, e: any, form: any) => {
        this.loading = true;
        try {
            var user = await agent.Accounts.register(creds);
            var assignee = await agent.Assignees.findByAppUserId(user.id);
            runInAction(() => {
                var base_link = "https://www.shmira.com.au";
                var generated_link = base_link.concat("/activate?id=".concat(user.id));
                this.sendActivationEmail(e, form, generated_link);
                this.loading = false;
                this.activateYourAccount = true;
            })
            //store.commonStore.setToken(account.token);
        } catch (error) {
            this.loading = false;
            throw error;
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Accounts.uploadPhoto(file);
            const image = response.data;
            await store.issueStore.loadProjects();
            runInAction(() => {
                this.uploading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.uploading = false;
            })
        }
    }

    

}