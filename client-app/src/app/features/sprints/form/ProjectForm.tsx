import React, { ChangeEvent, useState } from 'react';
import { Segment, Button, Header} from 'semantic-ui-react';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react-lite';
import { Project } from '../../../models/project';
import { ProjectAssignee } from '../../../models/projectAssignee';
import { Sprint } from '../../../models/sprint';
import { Assignee } from '../../../models/assignee';
import * as Yup from 'yup';
import MyTextInput from '../../../shared/form/MyTextInput';
import MyMultipleSelectInput from '../../../shared/form/MyMultiSelectInput';
import MySelectInput from '../../../shared/form/MySelectInput';
import MyDateInput from '../../../shared/form/MyDateInput';
import { Issue } from '../../../models/issue';
import { SprintIssue } from '../../../models/sprintissue';
import { v4 as uuid } from 'uuid';

export default observer(function ProjectForm() {

    const {issueStore, userStore, mediumModalStore} = useStore();
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
        allUsers, user_loading
    } = userStore;

    const validationSchema = Yup.object({
        name: Yup.string().required('Please enter a project name.')
    })


    const initialState = {
        id: '',
        name: '',
        description: '',
        assignees: []
    }

    const reformatAssigneeOptions = (allUsers: Assignee[]) => 
    allUsers.map(user => ({
            key: user.id,
            value: user.id,
            text: user.first_name.concat(' ', user.second_name)
        }))



    const [project, setProject] = useState(initialState);

    function handleFormSubmit(values: any) {
    console.log(values);
      
      var new_project: any = {
        ...values,
        id: uuid()
      }

      var newProjectSprint = {
        project_id: new_project.id,
        sprint_name: "Backlog",
        sprint_id: uuid()
      }

      delete new_project['assignees']

      var newProjectAssignees: ProjectAssignee[] = [];
      values.assignees.map( (project_assignee: any) => {
        var new_project_assignee: ProjectAssignee = {
            AssigneeId: project_assignee,
            ProjectId: new_project.id
        }
        newProjectAssignees.push(new_project_assignee);
      })

      createProject(new_project, newProjectSprint, newProjectAssignees);
    }


    return (
  
        <div style={{clear: 'both'}}>
            <Header content='Create a new project' />
            <Formik 
                validationSchema={validationSchema}
                enableReinitialize 
                initialValues={project} 
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
             <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
  
                <MyTextInput   placeholder='' label='Project Name' name='name' />
                
                <MyTextInput   placeholder='' label='Description' name='description' />

                <MyMultipleSelectInput placeholder='' label='Assignees' name='assignees' options={reformatAssigneeOptions(allUsers)} />
                <div style={{clear: 'both', marginBottom: '20px', paddingBottom: '10px'}}>
                    <Button 
                        disabled={isSubmitting || !isValid || !dirty}
                        loading={loading} 
                        floated='right' 
                        color='blue' 
                        type='submit' 
                        size='tiny'
                        content='Submit'
                        />
                    <Button  size='tiny' onClick={mediumModalStore.closeMediumModal} floated='right'  type='button' content='Cancel'/>
                </div>
     
            </Form>
            )}
            </Formik>
        </div>
    )
})