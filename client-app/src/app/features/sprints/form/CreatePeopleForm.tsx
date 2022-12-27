import React, { useState } from 'react';
import { Segment, Button, Header, Dropdown} from 'semantic-ui-react';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react-lite';
import { ProjectAssignee } from '../../../models/projectAssignee';
import * as Yup from 'yup';
import MyTextInput from '../../../shared/form/MyTextInput';
import MyMultipleSelectInput from '../../../shared/form/MyMultiSelectInput';
import { v4 as uuid } from 'uuid';
import { Project } from '../../../models/project';

export default observer(function NewUserForm() {

    const {issueStore, modalStore, userStore} = useStore();
    const { 
        allProjects
    } = issueStore;

    const {
        createUser, user_loading
    } = userStore;

    const validationSchema = Yup.object({
        first_name: Yup.string().required('The issue title is a required MyTextInput.'),
        second_name: Yup.string().required('The issue title is a required MyTextInput.'),
        email: Yup
                .string()
                .email()
                .required('An email is required so the new account holder can activate their account and set a password.')
    })


    const initialState = {
        id: '',
        first_name: '',
        second_name: '',
        email: '',
        projects: []
    }

    const [project, setProject] = useState(initialState);

    function handleFormSubmit(values: any) {
    
        var new_user = {
            ...values,
            id: uuid()
        }

        delete new_user['projects']

        var project_assignees: ProjectAssignee[] = [];
        values.projects.map((project: string) => {
            var current_project = allProjects.find(p => p.name === project);
            var current_project_id = current_project!.id;

            var project_assignee = {
                ProjectId: current_project_id,
                AssigneeId: new_user.id
            }
            project_assignees.push(project_assignee);
        })
        createUser(new_user, project_assignees);
    }

    
    const reformatProjectOptions = (allProjects: Project[]) =>     
        allProjects.map(project => ({
                key: project.id,
                value: project.name,
                text: project.name
        }))


    return (
  
        <Segment clearing>
            <Header content='Create an account' />
            We will send the new account holder an email so they can activate their account and set a password.
            <br/><br></br>
            <Formik 
                validationSchema={validationSchema}
                enableReinitialize 
                initialValues={project} 
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
             <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
  
                <MyTextInput   
                    placeholder='' 
                    label='First Name' 
                    name='first_name' 
                    />

                <MyTextInput   
                    placeholder='' 
                    label='Second Name' 
                    name='second_name' 
                    />

                <MyTextInput 
                    placeholder='' 
                    label='Email' 
                    name='email' 
                    />
                
                <MyMultipleSelectInput 
                    placeholder='Select the projects that you want to give this user access to' 
                    options={reformatProjectOptions(allProjects)} 
                    label='Projects' 
                    name='projects' 
                    />

                <Button 
                    disabled={isSubmitting || !isValid || !dirty}
                    loading={user_loading} 
                    floated='right' 
                    positive 
                    type='submit' 
                    content='Submit'
                    />
                <Button 
                    onClick={() => {
                        modalStore.closeModal; 
                        modalStore.closeModal; 
                        modalStore.closeModal;
                    }} 
                    floated='right'  
                    type='button' 
                    content='Cancel'
                    />
            </Form>
            )}
            </Formik>
        </Segment>
    )
})