import React, { useState, useEffect, useRef } from 'react';
import { Button, Label} from 'semantic-ui-react';
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import  "react-quill/dist/quill.snow.css";
import "./login/login.css";
import Icon from '../../../layout/Icon';
import { AccountFormValues } from '../../../models/account';
import { Invitation } from '../../../models/invitation';
import { v4 as uuid } from 'uuid';


export default observer(function InviteCollaboratorForm() {

    const { userStore, accountStore, issueStore, commonStore } = useStore();
    const { loading } = issueStore;
    const [loginError, setError] = useState('');
    const [formType, setFormType] = useState('login');
    var [emailState, setEmailState] = useState('');
    var [passwordState, setPasswordState] = useState('');
    var [userAlreadyInvited, setUserAlreadyInvited] = useState(false);
    var [userAlreadyCollaborator, setUserAlreadyCollaborator] = useState(false);
    var [inviteSent, setInviteSent] = useState(false);

    const form = useRef<HTMLFormElement>(null);

    function invite(e: any, form: any, emailState: string){

        var account_dto: AccountFormValues = {
            email: emailState,
            password: 'placeholder'
        }

        // If user is already a collaborator, display message and exit out
        var userBeingInvited = accountStore.allAccounts!
            .filter(account => account.email !== null)
            .find(account => account.email.toLowerCase() === emailState.toLowerCase());

        console.log("Found user being invited");
        console.log(userBeingInvited);
    
        if(userBeingInvited){
            console.log("User is being invited");
            var assignee_ids: string[] = [];
            console.log(issueStore.selectedProject!.assignees);
            issueStore.selectedProject!.assignees.map(assignee => {
                console.log(assignee.id_app_user!);
                assignee_ids.push(assignee.id_app_user!);
            });
            if(assignee_ids.includes(userBeingInvited.id!)){
                setUserAlreadyCollaborator(true);
                return;
            }
        }

        // If user is already invited, display message and exit out
        var isUserAlreadyInvited = accountStore.allInvites!
            .filter(invite => 
                invite.invitee_account_email !== null
            )
            .filter(invite => 
                invite.invitee_account_email.toLowerCase() === emailState.toLowerCase()
            )
            .filter(invite => 
                invite.project_to_collaborate_on_id === issueStore.selectedProject!.id
            );

        if(isUserAlreadyInvited.length > 0){
            setUserAlreadyInvited(true);
            return;
        }

        // Send the invite
        var invitation: Invitation = {
            id: uuid().toString(),
            inviter_account_id: commonStore.account_id!,
            invitee_account_email: emailState,
            invitation_status: 'Pending',
            project_to_collaborate_on_id: issueStore.selectedProject!.id
        }
        accountStore.invite(e, form, account_dto, invitation)
            .catch(error => setError('Invalid email or password'));
        setInviteSent(true);
    }
    
    const validationSchema = Yup.object({
        name: Yup.string().required('The issue title is a required MyTextInput.')
    })

    function updateEmailState(value: string){
        setUserAlreadyCollaborator(false);
        setUserAlreadyInvited(false);
        setEmailState(value);
    }

    function updatePasswordState(value: string){
        setPasswordState(value);
    }

    function handleSubmit(e: any){
        e.preventDefault();
        console.log("Email state =");
        console.log(emailState);
        invite(e, form, emailState);
    }


    if(inviteSent) return (
        <div className='darkreader' style={{backgroundColor: 'transparent'}}>
            <form ref={form} onSubmit={(e) => handleSubmit(e)}>
                <div 
                    style={{
                        width: '100%', 
                        minHeight: '200px',
                        backgroundColor: 'transparent',
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        justifyContent: 'center',
                        padding: '15px', 
                        backgroundRepeat: 'no-repeat', 
                        backgroundPosition: 'center',
                        backgroundSize: 'cover', 
                        position: 'relative', 
                        zIndex: '1'
                    }}>
                    <div 
                        style={{
                            paddingTop: '0px', 
                            marginTop: '20px', 
                            width: '100%', 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            justifyContent: 'center'
                        }}>
                        <Icon 
                            top={0} 
                            type='duck' 
                            size={40} 
                            />
                    </div>
                    <h2 
                        style={{marginTop: '5px'}}>
                        Invite sent
                    </h2>
                    <div 
                        style={{
                            paddingTop: '0px', 
                            marginTop: '20px', 
                            marginBottom: '20px', 
                            width: '100%', 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            justifyContent: 'center'
                        }}>
                    <p>
                        An email has been sent to the email address you provided with a link to join this project. If the person you have invited to work on the project is not registered with Shmira they will be sent a link to create an account.
                    </p>
                    </div>
                </div>
            </form>
        </div>
    )
        
        
     if(!inviteSent) return (
        <div 
            className='darkreader' 
            style={{backgroundColor: 'transparent'}}>
            <form 
                ref={form} 
                onSubmit={(e) => handleSubmit(e)}
                >
                <div 
                    style={{
                        width: '100%', 
                        minHeight: '200px',
                        backgroundColor: 'transparent',
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        justifyContent: 'center',
                        padding: '15px', 
                        backgroundRepeat: 'no-repeat', 
                        backgroundPosition: 'center',
                        backgroundSize: 'cover', 
                        position: 'relative', 
                        zIndex: '1'
                    }}>
                        <div 
                            style={{
                                paddingTop: '0px', 
                                marginTop: '20px', 
                                width: '100%', 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                justifyContent: 'center'
                            }}>
                            <Icon 
                                top={0} 
                                type='duck' 
                                size={40} 
                            />
                        </div>
                        <h2 style={{marginTop: '5px'}}>
                            Invite a collaborator
                        </h2>
                        <div 
                            style={{
                                paddingTop: '0px', 
                                marginTop: '20px', 
                                marginBottom: '20px', 
                                width: '100%', 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                justifyContent: 'center'
                            }}>
                            <p>
                                If the person you are inviting doesn't have an account with Shmira they will be sent an invite to register an acccount, and will have access to this project upon registration.
                            </p>
                        </div>
                        <input 
                            type='email' 
                            name='to_email' 
                            placeholder='example@company.com' 
                            onChange={(e) => {setError(''); updateEmailState(e.target.value)}} 
                            style={{
                                border: '0.5px solid', 
                                marginBottom: '10px', 
                                color: 'white', 
                                backgroundColor: 'transparent', 
                                position: 'relative', 
                                width: '100%', 
                                lineHeight: '1.2', 
                                height: '45px', 
                                display: 'block', 
                                fontSize: '16px', 
                                padding: '0 5px 0 5px'
                            }}/>
                        {
                            userAlreadyInvited && !userAlreadyCollaborator &&
                            <Label>This user has already been invited to collaborate on this project.</Label>
                        }
                        {
                            userAlreadyCollaborator &&
                            <Label>This user is already assigned to your project.</Label>
                        }
                        <br/><br/>
                        <div style={{
                                width: '100%', 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                justifyContent: 'center'
                            }}>
                            <Button 
                                type='submit' 
                                content='Send invite' 
                                size='tiny' 
                                loading={loading}
                                style={{
                                    marginTop: '10px', 
                                    marginBottom: '10px', 
                                    position: 'relative', 
                                    clear: 'both', 
                                    float: 'right', 
                                    lineHeight: '1.2', 
                                    height: '32px'
                                }}
                            />
                        </div>
                            <input
                                type="hidden"
                                className="form-control"
                                name="from_name"
                                defaultValue=""
                                />
                             <input
                                type="hidden"
                                className="form-control"
                                name="project_name"
                                defaultValue=""
                                />
                            <input
                                type="hidden"
                                className="form-control"
                                name="accept_invitation_link"
                                defaultValue=""
                                />
                        <br/><br/>
                    </div>
            </form>
        </div>
            )
        return(<></>)
})