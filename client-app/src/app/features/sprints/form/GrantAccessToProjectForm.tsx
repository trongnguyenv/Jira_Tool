import React, { ChangeEvent, useState } from 'react';
import { Segment, Button, Header, Dropdown} from 'semantic-ui-react';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react-lite';
import { Assignee } from '../../../models/assignee';
import * as Yup from 'yup';
import MyMultipleSelectInput from '../../../shared/form/MyMultiSelectInput';
import { Project } from '../../../models/project';
import { ProjectAssignee } from '../../../models/projectAssignee';

export default observer(function GrantUserAccessForm() {

    const {issueStore, userStore, modalStore} = useStore();
    const {
        selectedProject,
        allSprints, 
        allProjects, 
        closeForm, 
        createProject, 
        loading,
        updateSprint,
    } = issueStore;

    const {
        allUsers,
        user_loading
    } = userStore;

    const validationSchema = Yup.object({
        //first_name: Yup.string().required('The issue title is a required MyTextInput.'),
        //second_name: Yup.string().required('The issue title is a required MyTextInput.'),
        //email: Yup.string().email().required('An email is required so the new account holder can activate their account and set a password.')
    })


    const initialState = {
        ProjectIds: [],
        AssigneeIds: []
    }

    const [project, setProject] = useState(initialState);

    function handleFormSubmit(values: any) {
    
        var project_assignees: ProjectAssignee[] = []
        values.ProjectIds.map((current_project_id: any) => {
            console.log("Current project Id =");
            console.log(current_project_id);
            values.AssigneeIds.map((current_assignee_id: any) => {
                console.log("Current assignee id = ");
                console.log(current_assignee_id);
                var project_assignee: ProjectAssignee = {
                    ProjectId: current_project_id,
                    AssigneeId: current_assignee_id
                }
                console.log("Current project assignee = ");
                console.log(project_assignee);
                project_assignees.push(project_assignee);
            })
        })
        console.log("project assignees =");
        console.log(project_assignees);
        userStore.addAssigneesToProjects(project_assignees);
    }

    const reformatProjectOptions = (allProjects: Project[]) => 
        allProjects.map(project => ({
            key: project.id,
            value: project.id,
            text: project.name
        })
    )

    const reformatAssigneeOptions = (allUsers: Assignee[]) => 
        allUsers.map(user => ({
            key: user.id,
            value: user.id,
            text: user.first_name.concat(' ', user.second_name)
        })
    )


    return (
  
        <Segment clearing>
            <Header content='Grant access' />
            Select the users and projects that you want to grant access to.
            <br/><br></br>
            <Formik 
                validationSchema={validationSchema}
                enableReinitialize 
                initialValues={project} 
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
             <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>

                <MyMultipleSelectInput placeholder='Select the users that you want to grant access to' options={reformatAssigneeOptions(allUsers)} label='Users' name='AssigneeIds' />
  
                <MyMultipleSelectInput placeholder='Select the projects that you want to grant user access to' options={reformatProjectOptions(allProjects)} label='Projects' name='ProjectIds' />

                <Button 
                    disabled={isSubmitting || !isValid || !dirty}
                    loading={user_loading} 
                    floated='right' 
                    positive 
                    type='submit' 
                    content='Submit'
                    />
                <Button onClick={modalStore.closeModal} floated='right'  type='button' content='Cancel'/>
     
            </Form>
            )}
            </Formik>
        </Segment>
    )
})