import React, { useState } from 'react';
import { Segment, Button, Header} from 'semantic-ui-react';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react-lite';
import { Project } from '../../../models/project';
import { Sprint } from '../../../models/sprint';
import * as Yup from 'yup';
import MyTextInput from '../../../shared/form/MyTextInput';
import MySelectInput from '../../../shared/form/MySelectInput';
import { Assignee } from '../../../models/assignee';
import { IssueAssignee } from '../../../models/issueAssignee';
import { v4 as uuid } from 'uuid';
import MyMultipleSelectInput from '../../../shared/form/MyMultiSelectInput';

export default observer(function CreateIssueForm() {

    const useForceUpdate = () => {
        const [, setTick] = useState(0);
        const update = React.useCallback(() => {
          setTick((tick) => tick + 1);
        }, []);
        return update;
      };

    const update = useForceUpdate();

    const {issueStore, modalStore, userStore} = useStore();
    const {
        allSprints, 
        allProjects, 
        selectedProject,
        createIssue, 
        updateIssue, 
        loading,
        updateSprint,
    } = issueStore;

    const {
        allUsers
    } = userStore;

    const validationSchema = Yup.object({
        name: Yup.string().required('The issue title is a required MyTextInput.')
    })

    var projectAssignees = selectedProject!.assignees;


    const initialState = {
        id: '',
        name: '',
        description: '',
        description_text: '',
        status: '',
        priority: '',
        days: '',
        hours: '',
        minutes: '',
        original_estimated_duration: '',
        sprint: '',
        assignees: []
    }


    function calculateIssueTimespan(values: any) {
        var days, hours, minutes;

        values.days === null ? days = 0 : days = values.days;
        values.hours === null ? hours = 0 : hours = values.hours;
        values.minutes === null ? minutes = 0 : minutes = values.minutes;
        
        if(minutes >= 60){
            var minutes_to_hours = Math.floor(minutes / 60);
            minutes = (minutes % 60);
            hours = hours + minutes_to_hours;
        }

        if(hours >= 24){
            var hours_to_days = Math.floor(hours / 24);
            hours = (hours % 24);
            days = days + hours_to_days;
        }

        let estimated_duration = days + "." + hours + ':' + minutes + ':' + '00';
        return(estimated_duration)
    }

    const [issue, setIssue] = useState(initialState);

    function handleFormSubmit(values: any, allSprints: Sprint[]) {

       var estimated_duration = calculateIssueTimespan(values);
       
       let values_to_push = {...values};

        delete values_to_push['days']
        delete values_to_push['hours']
        delete values_to_push['minutes']
        delete values_to_push['sprint']
        delete values_to_push['project']
        delete values_to_push['created_at']
        delete values_to_push['assignees']

        if(values_to_push.id.length === 0) {

            let newIssue = {
                ...values_to_push,
                id: uuid(),
                original_estimated_duration: estimated_duration
            };

            if(values.sprint == null) {
                values.sprint = "Backlog";
            }
            
            var sprint: Sprint; 
            selectedProject!.sprints.forEach(current_sprint => {
                if(current_sprint.name === values.sprint){
                    sprint = current_sprint;
                    let sprintIssue = {
                        sprint_id: sprint.id,
                        issue_name: newIssue.name,
                        issue_id: newIssue.id
                    }
                    var issue_assignees: IssueAssignee[] = [];
                    values.assignees.map( (assignee: any) => {
                        var issue_assignee = {
                            AssigneeId: assignee,
                            IssueId: newIssue.id
                        }
                        console.log("Issue assignee:");
                        console.log(issue_assignee);
                        issue_assignees.push(issue_assignee);
                    })

                    var issue_assignee_dto: Assignee[] = [];
                    issue_assignees.map(assignee => {
                        var found_assignee = allUsers.find(user => user.id === assignee.AssigneeId);
                        issue_assignee_dto.push(found_assignee!);
                    })

                    let frontend_issue_representation = {
                        ...newIssue,
                        assignees: issue_assignee_dto
                    }

                    createIssue(newIssue, sprint!.id, sprintIssue, issue_assignees);
                
                }
            })     
        } else {
            let existingIssue = {
                ...values,
                original_estimated_duration: estimated_duration
            }
            updateIssue(existingIssue);
        }

    }

    const reformatProjectOptions = (allProjects: Project[]) => 
    allProjects.map(project => ({
            key: project.id,
            value: project.name,
            text: project.name
        }))

    const reformatSprintOptions = (allSprints: Sprint[]) => 
    allSprints.map(sprint => ({
            key: sprint.id,
            value: sprint.name,
            text: sprint.name
        }))

    const formatProjectAssignees = (projectAssignees: Assignee[]) =>
    projectAssignees.map(project_assignee => ({
        key: project_assignee.id,
        value: project_assignee.id,
        text: project_assignee.first_name.concat(' ', project_assignee.second_name)
    }))

    const statusOptions = [
        {key: '0', value: 'To Do', text: 'To Do'},
        {key: '1', value: 'In Progress', text: 'In Progress'},
        {key: '2', value: 'Review', text: 'Review'},
        {key: '3', value: 'Done', text: 'Done'}
    ]
    
    const priorityOptions = [
        {key: '0', value: 'Low', text: 'Low'},
        {key: '1', value: 'Medium', text: 'Medium'},
        {key: '2', value: 'High', text: 'High'}
    ]
    return (
  
        <Segment clearing>
            <Header content='Create issue' />
            <Formik 
                validationSchema={validationSchema}
                enableReinitialize 
                initialValues={issue} 
                onSubmit={values => handleFormSubmit(values, allSprints)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
             <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
  
                {/* Select Project Name */}
                <MySelectInput 
                    placeholder='' 
                    label='Project' 
                    name='project' 
                    options={reformatProjectOptions(allProjects)} 
                    />

                {/* Enter issue name */}
                <MyTextInput   
                    placeholder='' 
                    label='Summary' 
                    name='name' 
                    />
                
                {/* Enter description */}
                <MyTextInput   
                    placeholder='' 
                    label='Description' 
                    name='description' 
                    />
                
                {/* Estimated duration */}
                <label font-size='3'>
                    Estimated Duration
                </label>

                {/* Days, hours minutes (estimated duration) */}
                <div className='inline fields'>
                    
                    <label>Days</label>
                    <Field type='number' placeholder='0d' name='days' />
                    <label>  </label>
                    
                    <label>Hours</label>
                    <Field  type='number' placeholder='0h' name='hours' />
                    <label>  </label>

                    <label>Minutes</label>
                    <Field  type='number' placeholder='0m' name='minutes' />
                    
                </div>
                
                {/* Select sprint */}
                <MySelectInput 
                    placeholder='' 
                    label='Sprint' 
                    name='sprint' 
                    options={reformatSprintOptions(allSprints)} 
                    />

                {/* Select issue priority (low, medium, high) */}
                <MySelectInput 
                    placeholder='' 
                    label='Priority' 
                    name='priority' 
                    options={priorityOptions} 
                    />

                {/* Select issue status (to do, in progress, in review, done) */}
                <MySelectInput 
                    placeholder='' 
                    label='Status' 
                    name='status' 
                    options={statusOptions} 
                    />
                
                {/* Select assignees */}
                <MyMultipleSelectInput 
                    placeholder='' 
                    label='Assign' 
                    name='assignees' 
                    options={formatProjectAssignees(projectAssignees)} 
                    />

                {/* Create issue */}
                <Button 
                    disabled={isSubmitting || !isValid || !dirty}
                    loading={loading} 
                    floated='right' 
                    positive 
                    type='submit' 
                    content='Submit'
                    />

                {/* Close modal (cancel) */}
                <Button 
                    onClick={modalStore.closeModal} 
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