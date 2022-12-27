import React, { ChangeEvent, useState } from 'react';
import { Segment, Button, Header, Label} from 'semantic-ui-react';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react-lite';
import { Project } from '../../../models/project';
import { Sprint } from '../../../models/sprint';
import * as Yup from 'yup';
import MyTextInput from '../../../shared/form/MyTextInput';
import MySelectInput from '../../../shared/form/MySelectInput';
import MyMultipleSelectInput from '../../../shared/form/MyMultiSelectInput';
import MyDateInput from '../../../shared/form/MyDateInput';
import { Issue } from '../../../models/issue';
import { Assignee } from '../../../models/assignee';
import { IssueAssignee } from '../../../models/issueAssignee';
import { SprintIssue } from '../../../models/sprintissue';
import { v4 as uuid } from 'uuid';
import { StyledLabelAvatar, AvatarIsActiveLabelBorder } from '../dashboard/Filters/Styles';

export default observer(function UpdateIssueForm() {

    const {issueStore, modalStore} = useStore();
    const {
        selectedIssue,
        allSprints, 
        selectedProject,
        allProjects, 
        closeForm, 
        createIssue, 
        updateIssue,
        updateIssueAndSprint, 
        loading,
        updateSprint,
    } = issueStore;

    const validationSchema = Yup.object({
        name: Yup.string().required('The issue title is a required MyTextInput.')
    })

    var projectAssignees = selectedProject!.assignees;


    const initialState = selectedIssue ?? {
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
        //created_at: null,
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
        delete values_to_push['created_at']
        delete values_to_push['assignees']

        console.log("Selected issue sprint id =");
        console.log(selectedIssue!.sprint_id);

        var source_sprint = selectedProject!.sprints.find(sprint => sprint.id === selectedIssue!.sprint_id);
        console.log("Source sprint =");
        console.log(source_sprint);
        // Case 1: Updating issue but staying in the same sprint
        if(source_sprint!.name === values.sprint){
            console.log("Case 1 fired");
            console.log(source_sprint!.name);
            console.log(values.sprint);
            var existingIssue = {
                ...values,
                original_estimated_duration: estimated_duration
            }
            // Regular issue update, no sprint change required
            updateIssue(existingIssue);

        } 
        
        // Case 2: Updating issue and changing the sprint that it's in as well
        else{
            console.log("Case 2 fired");
            var source_sprint = selectedProject!.sprints.find(sprint => sprint.id === selectedIssue!.sprint_id);
            var destination_sprint = selectedProject!.sprints.find(sprint => sprint.name === values.sprint);

            var existingIssue = {
                ...values,
                sprint_id: destination_sprint!.id,
                original_estimated_duration: estimated_duration
            }

            var source_sprint_issue = {
                sprint_id: source_sprint!.id,
                issue_name: selectedIssue!.name,
                issue_id: selectedIssue!.id
            }

            var destination_sprint_issue = {
                sprint_id: destination_sprint!.id,
                issue_name: selectedIssue!.name,
                issue_id: selectedIssue!.id
            }

            selectedProject!.sprints.map(sprint => {
                if(sprint.id === selectedIssue!.sprint_id){
                sprint.issues = sprint.issues.filter(issue => issue.name !== selectedIssue!.name);
                selectedIssue!.sprint_id = destination_sprint!.id;
                }
                if(sprint.name === values.sprint){
                    sprint.issues.push(existingIssue);
                }
            });

            // Updating both the issue and the sprints
            updateIssueAndSprint(
                source_sprint_issue.sprint_id,
                destination_sprint_issue.sprint_id,
                destination_sprint_issue.issue_name,
                destination_sprint_issue.issue_id,
                selectedIssue!
                );
        }                   
    }

    const formatProjectAssignees = (projectAssignees: Assignee[]) =>
    projectAssignees.map(project_assignee => ({
        key: project_assignee.id,
        value: project_assignee.id,
        text: project_assignee.first_name.concat(' ', project_assignee.second_name)
    }))


    const reformatSprintOptions = (allSprints: Sprint[]) => 
    allSprints.map(sprint => ({
            key: sprint.id,
            value: sprint.name,
            text: sprint.name
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
            <Header content='Update issue' />
            <Formik 
                validationSchema={validationSchema}
                enableReinitialize 
                initialValues={issue} 
                onSubmit={values => handleFormSubmit(values, allSprints)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
             <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
  
                <MyTextInput   placeholder='' label='Summary' name='name' />
                
                <MyTextInput   placeholder='' label='Description' name='description' />
                
                {/*}
                        <MyDateInput
                            placeholderText='Date'
                            name='created_at'
                            title='Finish by'

                        />
                */}

                    <label font-size='3'>
                        Estimated Duration
                    </label>
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
                        <MySelectInput placeholder='' label='Sprint' name='sprint' options={reformatSprintOptions(allSprints)} />
                        <MySelectInput placeholder='' label='Priority' name='priority' options={priorityOptions} />
                        <MySelectInput placeholder='' label='Status' name='status' options={statusOptions} />
                
                        
                        {selectedIssue!.assignees.length > 0 &&
                        <h5>Assigned To</h5>
                        }
                                {selectedIssue!.assignees.map( (user, index) => (
                                    <Label>
                                    <AvatarIsActiveLabelBorder isActive={false} index={index} >
                                        <StyledLabelAvatar 

                                        value={user.id}
                                        //onClick={() => handleClick(selectedProject, user)
                                        size='20' 
                                        name={user.first_name.concat(' ', user.second_name)} 
                                        round='20px'
                                        />
                                    </AvatarIsActiveLabelBorder>
                                    
                                    {user.first_name.concat(' ', user.second_name)}
                                    
                                    </Label>
                                ))
                            }
                        
                                
                        <br/><br/>

                        <MyMultipleSelectInput placeholder='' label='Assign' name='assignees' options={formatProjectAssignees(projectAssignees)} />
                <Button 
                    disabled={isSubmitting || !isValid || !dirty}
                    loading={loading} 
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