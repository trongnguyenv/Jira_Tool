import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Form } from 'formik';
import { Select } from 'semantic-ui-react';
import NewUserForm from './CreatePeopleForm';
import GrantUserAccessForm from './GrantAccessToProjectForm';



export default observer(function PeopleForm() {

    const peopleFormOptions = [
        {key: '0', value: 'Create', text: 'Create an account for a new starter'},
        {key: '1', value: 'Add to Project', text: 'Give someone access to a project'}
    ]

    const [selectedPeopleFormOption, setSelectedPeopleFormOption] = useState();

    const handlePeopleFormSelectedOption = function(e: any, value: any){
        setSelectedPeopleFormOption(value);
    }

    return(
        <>
        <h3>I want to...</h3>
            <Select placeholder='' 
                    name='peopleFormSelectedOption' 
                    label='I want to...' 
                    options={peopleFormOptions} 
                    onChange={(e, {value}) => handlePeopleFormSelectedOption(e, value)} />
                    
            {
                selectedPeopleFormOption === "Create" && <NewUserForm />

            }
            {
                selectedPeopleFormOption === "Add to Project" && <GrantUserAccessForm />

            }
        </>    
            
      
    )
});