import React, { useState, useEffect } from 'react';
import { Segment, Button, Input} from 'semantic-ui-react';
import { useStore } from '../../../../stores/store';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import  "react-quill/dist/quill.snow.css";
import "./login.css";
import Icon from '../../../../layout/Icon';
import { AccountFormValues } from '../../../../models/account';
import SignupForm from './SignupForm';
import queryString from 'query-string';
import { useLocation, useHistory } from 'react-router-dom';


export default observer(function ActivationForm() {

    const { userStore, accountStore, issueStore } = useStore();
    const { loading } = issueStore;
    const [activationError, setError] = useState('');
    const [formType, setFormType] = useState('login');
    var location = useLocation();
    var { accountToActivate, accountActivated } = accountStore;
    const history = useHistory();
    const validationSchema = Yup.object({
        name: Yup.string().required('The issue title is a required MyTextInput.')
    })

    var [emailState, setEmailState] = useState('');
    var [passwordState, setPasswordState] = useState('');

    
    useEffect(() => {
        var querystring = location.search;
        var params = new URLSearchParams(querystring);
        accountStore.getAccountToActivate(params.get('id')!);
      }, []);
      

    function updateEmailState(value: string){
        setEmailState(value);
    }

    function updatePasswordState(value: string){
        setPasswordState(value);
    }

    function activate(){
        if(accountToActivate === null){ return }
        var account: AccountFormValues = {
            email: accountToActivate.email,
            password: passwordState
        }
        accountStore.activate(account).catch(error => setError('Problem activating account'))
    }

    if(accountActivated === false) {
        return (    
            <div 
                className='darkreader' 
                style={{backgroundColor: 'transparent'}}>
                <div style={{
                    width: '100%', 
                    minHeight: '500px',
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
                    <div style={{
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
                            Activate your account
                    </h2>
                    <input 
                        type='email' 
                        name='email' 
                        placeholder='example@company.com' 
                        onChange={(e) => {
                            setError(''); 
                            updateEmailState(e.target.value)
                        }} 
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
                    <br/><br/>
                    <input 
                        type='password' 
                        name='password' 
                        placeholder='password' 
                        onChange={(e) => {
                            setError(''); 
                            updatePasswordState(e.target.value)
                        }}
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
                        }}
                    />
                    <div style={{
                        width: '100%', 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        justifyContent: 'center'
                        }}>
                        <Button  
                            content='Activate' 
                            size='tiny' 
                            loading={loading} 
                            onClick={() => activate()} 
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
                    {
                        activationError.length > 1 &&
                        <label style={{color: 'red'}}>Problem activating.</label>
                    }    
                    <br/><br/>
                </div>
            </div>
        )
    } else return (
        <div className='darkreader' style={{backgroundColor: 'transparent'}}>
            <div style={{
                width: '100%', 
                minHeight: '500px',
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
                <div style={{
                    paddingTop: '0px', 
                    marginTop: '20px', 
                    width: '100%', 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    justifyContent: 'center'
                    }}>
                    <Icon top={0} type='duck' size={40} />
                </div>
                <h2 style={{marginTop: '5px'}}>Activate your account</h2>
                <div style={{
                    paddingTop: '0px', 
                    marginTop: '20px', 
                    width: '100%', 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    justifyContent: 'center'
                    }}>
                All set! Your account has been activated.
                </div>

                <Button  
                    content='Sign in' 
                    size='tiny' 
                    loading={loading} 
                    onClick={() => history.push('/')} 
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
            {
                activationError.length > 1 &&
                <label style={{color: 'red'}}>Problem activating.</label>
            }
            <br/><br/>
        </div>
    )
})