import React, { useState, useRef } from 'react';
import { Segment, Button, Input, Label} from 'semantic-ui-react';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { useStore } from '../../../../stores/store';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import  "react-quill/dist/quill.snow.css";
import "./login.css";
import Icon from '../../../../layout/Icon';
import SignUpButton from '../../../../layout/SignUpButton';
import GoogleSignUpButton from '../../../../layout/GoogleSignUpButton';
import { GithubLoginButton } from 'react-social-login-buttons';
import { GoogleLoginButton } from 'react-social-login-buttons';
import { AppleLoginButton } from 'react-social-login-buttons';
import { AccountFormValues } from '../../../../models/account';
import emailjs from '@emailjs/browser';


interface Props {
    formType: string;
    setFormType: Function;
  }

export default observer(function SignupForm({formType, setFormType}: Props) {

  
    const { userStore, accountStore, issueStore } = useStore();
    const { loading } = issueStore;
    const { activateYourAccount } = accountStore;
    const [signupError, setError] = useState('');
    const validationSchema = Yup.object({
        name: Yup.string().required('The issue title is a required MyTextInput.')
    })

    var [emailState, setEmailState] = useState('');
    var [firstNameState, setFirstNameState] = useState('');
    var [secondNameState, setSecondNameState] = useState('');

    const form = useRef<HTMLFormElement>(null);

    function updateEmailState(value: string){
        setEmailState(value);
    }

    
    function register(e: any, form: any){
        var account: AccountFormValues = {
            email: emailState,
            first_name: firstNameState,
            second_name: secondNameState,
            user_name: emailState
        }
        console.log("Trying to create account:");
        console.log(account);
        accountStore.register(account, e, form).catch(error => setError('This email has already been registered.'))
    }

    function handleSubmit(e: any) {
        e.preventDefault();
        register(e, form);
    }
    


    return (
        <div className='darkreader' style={{backgroundColor: 'transparent'}}>
                        
        {
            activateYourAccount === false &&
            <form ref={form} onSubmit={(e) => handleSubmit(e)}>
        <div style={{width: '100%', minHeight: '500px',
                    backgroundColor: 'transparent',
                    display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
                    padding: '15px', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
                    backgroundSize: 'cover', position: 'relative', zIndex: '1'}}>
            <div style={{paddingTop: '0px', marginTop: '20px', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}} >
                <Icon top={0} type='duck' size={40} />
            </div>
           <h2 style={{marginTop: '12px'}}>Welcome to Shmira</h2>
            <input type='text' name='first_name' placeholder='first name' onChange={(e) => {setError(''); setFirstNameState(e.target.value)}} 
                style={{border: '0.5px solid', marginBottom: '10px', color: 'white', backgroundColor: 'transparent', position: 'relative', width: '100%', lineHeight: '1.2', height: '45px', display: 'block', fontSize: '16px', padding: '0 5px 0 5px'}} />
            <br/><br/>
            <input type='text' name='second_name' placeholder='surname' onChange={(e) => {setError(''); setSecondNameState(e.target.value)}} 
                style={{border: '0.5px solid', marginBottom: '0px', color: 'white', backgroundColor: 'transparent', position: 'relative', width: '100%', lineHeight: '1.2', height: '45px', display: 'block', fontSize: '16px', padding: '0 5px 0 5px'}} />
            <br/>
            We will send you an email to confirm your account.
            <input type='email' name='to_email' placeholder='example@company.com' onChange={(e) => {setError(''); updateEmailState(e.target.value)}} 
                style={{border: '0.5px solid', marginBottom: '10px', color: 'white', backgroundColor: 'transparent', position: 'relative', width: '100%', lineHeight: '1.2', height: '45px', display: 'block', fontSize: '16px', padding: '0 5px 0 5px'}} />
            {
                signupError === "This email has already been registered." &&
            <Label style={{height: '26px', lineHeight: "1.2", color: 'red'}}><span style={{paddingBottom: '3px'}}>This email has already been registered.</span></Label>
            }
            <br/><br/>
            <div style={{width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
            <Button type='submit' content='Sign Up' size='tiny' loading={loading} 
            style={{marginTop: '10px', marginBottom: '10px', position: 'relative', clear: 'both', float: 'right'
                    , lineHeight: '1.2', height: '32px'}}
            />
            </div>
            <input
                    type="hidden"
                    className="form-control"
                    name="activation_link"
                    defaultValue=""
                />
            <hr style={{width: '100%', borderColor: 'grey'}} />
            <div style={{textAlign: 'center', paddingTop: '0px', marginTop: '0px', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}} >
                <GoogleLoginButton iconSize='20px' style={{textAlign: 'center', fontSize: '12px', height: '37px'}}>
                    <span style={{display: 'table', margin:'auto'}}>Sign up with Google</span>
                </GoogleLoginButton>
            </div>
            <div style={{textAlign: 'center', paddingTop: '0px', marginTop: '0px', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}} >
                <SignUpButton onClick={() => setFormType('login')} iconSize='20px' style={{textAlign: 'center', fontSize: '12px', height: '37px'}}>
                    <span style={{display: 'table', margin:'auto'}}>Already have an account? Log in</span>
                </SignUpButton>
            </div>
            
            {/*
            <div style={{textAlign: 'center', paddingTop: '0px', marginTop: '0px', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}} >
                <AppleLoginButton iconSize='20px' style={{textAlign: 'center', fontSize: '12px', height: '37px'}}>
                    <span style={{display: 'table', margin:'auto'}}>Sign up with Apple</span>
                </AppleLoginButton>
            </div>
            <div style={{textAlign: 'center', paddingTop: '0px', marginTop: '0px', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}} >
                <GithubLoginButton iconSize='20px' style={{textAlign: 'center', fontSize: '12px', height: '37px'}}>
                    <span style={{display: 'table', margin:'auto'}}>Sign up with Github</span>
                </GithubLoginButton>
            </div>
            */}
            <br/><br/>
        </div>

        </form>                    
        }
        {
            activateYourAccount === true &&
            <div style={{width: '100%', height: '100px',
                    backgroundColor: 'transparent',
                    display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
                    padding: '15px', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
                    backgroundSize: 'cover', position: 'relative', zIndex: '1'}}>
            <div style={{paddingTop: '0px', marginTop: '20px', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}} >
                <Icon top={0} type='duck' size={40} />
            </div>
            <div style={{marginTop: '23px', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
           <h2 style={{top: '12px'}}>Thanks!</h2>
           </div>
           <div style={{marginTop: '20px', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
           <h5 style={{top: '60px'}}>Check your emails for a link to activate your account.</h5>
           </div>
        </div>

        }
        
        </div>

    )
})