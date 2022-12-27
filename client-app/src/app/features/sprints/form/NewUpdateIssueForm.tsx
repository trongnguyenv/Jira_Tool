import React, { useState } from 'react';
import { Button, Label, Grid, Dropdown, Input, TextArea} from 'semantic-ui-react';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react-lite';
import { Sprint } from '../../../models/sprint';
import { Issue } from '../../../models/issue';
import { Comment } from '../../../models/comment';
import * as Yup from 'yup';
import { Assignee } from '../../../models/assignee';
import { StyledLabelAvatar, StyledAvatar, AvatarIsActiveLabelBorder } from '../dashboard/Filters/Styles';
import {InvisibleTextInput, StyledInput} from '../../../shared/form/Styles';
import ReactQuill from 'react-quill';
import  "react-quill/dist/quill.snow.css";
import parse from 'html-react-parser';
import Icon from '../../../layout/Icon/index';
import IssuePriorityIcon from '../../../layout/IssuePriorityIcon';
import IssueTypeIcon from '../../../layout/IssueTypeIcon';
import {StyledLabel} from './Styles';
import {HoverDiv} from './Styles';
import UpdateIssueFormTrackingWidget from './UpdateIssueFormTimeTrackingWidget';
import moment from 'moment';
import "quill-mention/dist/quill.mention.css";
import "quill-mention";
import { v4 as uuid } from 'uuid';


export default observer(function NewUpdateIssueForm() {

    const {issueStore, userStore, commonStore} = useStore();
    const {
        selectedIssue,
        selectedProject,
        updateIssue,
        updateIssueAndSprint, 
    } = issueStore;

    const { 
        allUsers
    } = userStore;

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
        sprint: '',
        assignees: []
    }

    const validationSchema = Yup.object({
        name: Yup.string().required('The issue title is a required MyTextInput.')
    })

    var projectAssignees = selectedProject!.assignees;

    var [quillDescriptionEditText, setQuillDescriptionEditText] = useState("");
    var [selectedAssignees, setSelectedAssignees] = useState();
    var [selectedReporter, setSelectedReporter] = useState();
    const [issue, setIssue] = useState(initialState);
    const [issueTitle, setIssueTitleState] = useState("")
    var [description_edit_state, setDescriptionEditState] = useState(false);
    var [issue_title_edit_state, setIssueTitleEditState] = useState(false);
    var [log_time_edit_state, setLogTimeEditState] = useState(false);
    var [selectedIssueLoggedDays, setSelectedIssueLoggedDays] = useState(0);
    var [selectedIssueLoggedHours, setSelectedIssueLoggedHours] = useState(0);
    var [selectedIssueLoggedMinutes, setSelectedIssueLoggedMinutes] = useState(0);
    var [selectedIssueRemainingDays, setSelectedIssueRemainingDays] = useState(0);
    var [selectedIssueRemainingHours, setSelectedIssueRemainingHours] = useState(0);
    var [selectedIssueRemainingMinutes, setSelectedIssueRemainingMinutes] = useState(0);
    var [comment_edit_state, setCommentEditState] = useState(false);
    var [comment_state, setCommentState] = useState("");

    function toggleLogTimeEditState() {
        setLogTimeEditState(!log_time_edit_state);
    }

    function calculateIssueTimespan(input_days: any, input_hours: any, input_minutes: any) {
        var days, hours, minutes;
        console.log("Input days"); console.log(input_days);
        console.log("Input hours"); console.log(input_hours);
        console.log("Input minutes"); console.log(input_minutes);
        input_days === 0 ? days = 0 : days = input_days;
        input_hours === 0 ? hours = 0 : hours = input_hours;
        input_minutes === 0 ? minutes = 0 : minutes = input_minutes;
        
        if(minutes >= 60){
            var minutes_to_hours = Math.floor(minutes / 60);
            minutes = (minutes % 60);
            hours = parseInt(hours) + minutes_to_hours;
        }

        if(hours >= 24){
            var hours_to_days = Math.floor(hours / 24);
            hours = (hours % 24);
            days = parseInt(days) + hours_to_days;
        }

        let estimated_duration = days + "." + hours + ':' + minutes + ':' + '00';
        return(estimated_duration)
    }

    const formatProjectAssignees = (projectAssignees: Assignee[], issue: Issue) => {
        
        var unassigned_assignees: string[] = [];
        var all_assignee_ids: string[] = [];
        var assigned_assignees: string[] = [];

        projectAssignees.map(assignee => {
            all_assignee_ids.push(assignee.id);
        })

        issue.assignees.map(assignee => {
            assigned_assignees.push(assignee.id);
        })

        all_assignee_ids.map(assignee => {
            if(!assigned_assignees.includes(assignee))
            unassigned_assignees.push(assignee);
        })

        var assignees_to_display: Assignee[] = [];

        projectAssignees.map(pa => {
            if(unassigned_assignees.includes(pa.id)){
                assignees_to_display.push(pa);
            }
        })

        return(
            assignees_to_display!.map( (project_assignee, index) => ({
                key: project_assignee.id,
                value: project_assignee.id,
                text: project_assignee.first_name.concat(' ', project_assignee.second_name),
                content: 
                    ( 
                        <HoverDiv onClick={() => addAssigneeToIssue(project_assignee.id)}>
                            <AvatarIsActiveLabelBorder 
                                isActive={false} 
                                index={index} 
                                >

                            <StyledLabelAvatar 
                                value={project_assignee.id}
                                size='20' 
                                name={
                                    project_assignee.first_name
                                        .concat(' ', project_assignee.second_name)
                                } 
                                round='20px'
                                src={project_assignee.photo?.url}
                                />
                            </AvatarIsActiveLabelBorder>
                            {
                                project_assignee.first_name
                                    .concat(' ', project_assignee.second_name)
                            }
                        </HoverDiv>
                    )

            }))
        )
    }

    const formatProjectReporters = (projectReporters: Assignee[], issue: Issue) => {
        
        var unassigned_reporters: string[] = [];
        var all_assignee_ids: string[] = [];
        var assigned_reporter: string;

        projectReporters.map(reporter => {
            all_assignee_ids.push(reporter.id);
        })

        assigned_reporter = issue.reporter_id;

        all_assignee_ids.map(assignee_id => {
            if(assignee_id !== assigned_reporter){
                unassigned_reporters.push(assignee_id);
            }
        })

        var assignees_to_display: Assignee[] = [];

        projectReporters.map(pr => {
            if(unassigned_reporters.includes(pr.id)){
                assignees_to_display.push(pr);
            }
        })

        return(
            assignees_to_display!.map( (project_assignee, index) => ({
                key: project_assignee.id,
                value: project_assignee.id,
                text: project_assignee.first_name.concat(' ', project_assignee.second_name),
                content: 
                    ( 
                        <HoverDiv onClick={() => addReporterToIssue(project_assignee.id)}>
                            <AvatarIsActiveLabelBorder 
                                isActive={false} 
                                index={index} 
                                >
                            <StyledLabelAvatar 
                                value={project_assignee.id}
                                size='20' 
                                name={
                                    project_assignee.first_name
                                        .concat(' ', project_assignee.second_name)
                                } 
                                round='20px'
                                src={project_assignee.photo?.url}
                                />
                            </AvatarIsActiveLabelBorder>
                            {
                                project_assignee.first_name
                                    .concat(' ', project_assignee.second_name)
                            }
                        </HoverDiv>
                    )
            }))
        )
    }

    const reformatSprintOptions = (allSprints: Sprint[]) => 
    selectedProject!.sprints.map(sprint => ({
            key: sprint.id,
            value: sprint.id,
            text: sprint.name,
            content: (
                <HoverDiv onClick={(() => handleSprintChange(sprint.id))}>
                    <StyledLabel>{sprint.name}</StyledLabel>
                </HoverDiv>
            )
        }))

    function handleSprintChange(sprint_id: string) {

        var sprint_issue_to_remove = {
            sprint_id: selectedIssue!.sprint_id,
            issue_id: selectedIssue!.id,
            issue_name: selectedIssue!.name
        }

        var sprint_issue_to_add = {
            sprint_id: sprint_id,
            issue_id: selectedIssue!.id,
            issue_name: selectedIssue!.name
        }

        selectedIssue!.sprint_id = sprint_id;

        selectedIssue!.updated_at = moment.tz(moment(), 'Australia/Sydney').toISOString(true);

        updateIssueAndSprint(
            sprint_issue_to_remove.sprint_id,
            sprint_issue_to_add.sprint_id,
            sprint_issue_to_add.issue_name,
            sprint_issue_to_add.issue_id,
            selectedIssue!
            );
    }

    const issueTypeOptions = [
        {
            key: '0', 
            value: 'Story', 
            text: 'Story', 
            content: 
                (
                    <HoverDiv 
                        style={{display: 'inline-block'}} 
                        onClick={() => changeIssueType('Story')}
                        >
                        <IssueTypeIcon color='#65BA43'type='story' size={14} />
                        <div style={{
                            paddingLeft: '7px', 
                            alignContent: 'center', 
                            display: 'inline-block'
                            }}>
                            Story
                        </div> 
                    </HoverDiv> 
                )
        },
        {
            key: '1', 
            value: 'Bug', 
            text: 'Bug', 
            content: 
                (
                    <HoverDiv 
                        style={{display: 'inline-block'}} 
                        onClick={() => changeIssueType('Bug')}
                        >
                        <IssueTypeIcon 
                            color='#E44D42'  
                            type='bug' 
                            size={14} 
                            />
                        <div style={{
                            paddingLeft: '7px', 
                            alignContent: 'center', 
                            display: 'inline-block'
                            }}>
                            Bug
                        </div> 
                    </HoverDiv> 
                )
            },
        {
            key: '2', 
            value: 'Task', 
            text: 'Task', 
            content: 
                (
                    <HoverDiv 
                        style={{display: 'inline-block'}} 
                        onClick={() => changeIssueType('Task')}
                        >
                        <IssueTypeIcon 
                            color='#4FADE6' 
                            type='task' 
                            size={14} 
                            />
                        <div style={{
                            paddingLeft: '7px', 
                            alignContent: 'center', 
                            display: 'inline-block'
                            }}>
                            Task
                        </div>
                    </HoverDiv> 
                )
        }
    ]

    function renderSelectedIssueType() {

        if(selectedIssue!.issue_type == "Story"){
            return(
                <StyledLabel style={{display: 'inline-block'}} >
                    <IssueTypeIcon 
                        color='#65BA43'
                        type='story' 
                        size={14} 
                        />
                    <div style={{
                        paddingLeft: '7px', 
                        alignContent: 'center',
                        display: 'inline-block'
                        }}>
                        Story
                    </div> 
                </StyledLabel> 
            )
        }

        if(selectedIssue!.issue_type == "Bug"){
            return(
                <StyledLabel style={{display: 'inline-block'}} >
                    <IssueTypeIcon 
                        color='#E44D42'  
                        type='bug' 
                        size={14} 
                        />
                    <div style={{
                        paddingLeft: '7px', 
                        alignContent: 'center', 
                        display: 'inline-block'
                        }}>
                        Bug
                    </div> 
                </StyledLabel>
            )
        }
        if(selectedIssue!.issue_type == "Task"){
            return(
                <StyledLabel style={{display: 'inline-block'}} >
                    <IssueTypeIcon 
                        color='#4FADE6' 
                        type='task' 
                        size={14} 
                        />
                    <div style={{
                        paddingLeft: '7px', 
                        alignContent: 'center', 
                        display: 'inline-block'
                        }}>
                        Task
                    </div>
                </StyledLabel> 
            )
        }
    }

    const statusOptions = [
        {
            key: '0', 
            value: 'To Do', 
            text: 'To Do', 
            content: 
                (  
                    <HoverDiv onClick={() => changeIssueStatus('To Do')}>
                        <Label 
                            style={{minWidth: '80px'}} 
                            color='blue'
                            >
                            To Do
                        </Label>
                    </HoverDiv> 
                )
        },
        {
            key: '1', 
            value: 'In Progress', 
            text: 'In Progress',
            content: 
                (  
                    <HoverDiv onClick={() => changeIssueStatus('In Progress')}>
                        <Label 
                            style={{minWidth: '80px'}} 
                            color='green'
                            >
                            In Progress
                        </Label>
                    </HoverDiv> 
                )
        },
        {
            key: '2', 
            value: 'Review', 
            text: 'Review',
            content: 
                (  
                    <HoverDiv onClick={() => changeIssueStatus('Review')}>
                        <Label 
                            style={{minWidth: '80px'}} 
                            color='purple'>
                            In Review
                        </Label>
                    </HoverDiv> 
                )
        },
        {
            key: '3', 
            value: 'Done', 
            text: 'Done',
            content: 
                (  
                    <HoverDiv onClick={() => changeIssueStatus('Done')}>
                        <Label 
                            style={{alignText: 'center', minWidth: '80px'}}>
                            Done
                        </Label>
                    </HoverDiv> 
                )
        }
    ]
    
    const priorityOptions = [
        {
            key: '0', 
            value: 'Low', 
            text: 'Low', 
            content: 
                (
                    <StyledLabel 
                        style={{minWidth: '90px'}} 
                        onClick={() => {changeIssuePriority("Low")}}> 
                        
                        <IssuePriorityIcon priority="Low"/>
                        <p style={{
                            paddingBottom: "3px", 
                            paddingLeft: "5px", 
                            display: "inline-block"
                            }}>
                            Low
                        </p>
                    </StyledLabel>
                )
        },
        {
            key: '1', 
            value: 'Medium', 
            text: 'Medium', 
            content: 
                (
                    <StyledLabel 
                        style={{minWidth: '90px'}} 
                        onClick={() => {changeIssuePriority("Medium")}}> 
                        <IssuePriorityIcon priority="Medium" />
                        <p style={{
                            paddingBottom: "3px", 
                            paddingLeft: "5px", 
                            display: "inline-block"
                        }}>
                            Medium
                        </p>
                    </StyledLabel>
                )
        },
        {
            key: '2', 
            value: 'High', 
            text: 'High', 
            content: 
                (
                    <StyledLabel 
                        style={{minWidth: '90px'}} 
                        onClick={() => {changeIssuePriority("High")}}> 
                        <IssuePriorityIcon priority="High" />
                        <p style={{
                            paddingBottom: "3px", 
                            paddingLeft: "5px", 
                            display: "inline-block"
                            }}>
                            High
                        </p>
                    </StyledLabel>
                ) 
        }
    ]

    const updateIssueDescription = () => {
        
        var current_issue: Partial<Issue> = {
            ...selectedIssue!
        }

        delete current_issue['assignees']

        if(quillDescriptionEditText === ""){
            return
        }

        current_issue.description = quillDescriptionEditText;

        var updatedIssue: any = current_issue;

        selectedIssue!.description = quillDescriptionEditText;

        selectedIssue!.updated_at = moment.tz(
            moment(), 'Australia/Sydney'
            ).toISOString(true);
        
        updateIssue(updatedIssue);
    }


    const changeIssueType = (issue_type: string) => {
        
        var current_issue: Partial<Issue> = {
            ...selectedIssue!
        }

        delete current_issue['assignees']

        current_issue.issue_type = issue_type;

        var updatedIssue: any = current_issue;

        selectedIssue!.issue_type = issue_type;

        selectedIssue!.updated_at = moment.tz(
            moment(), 'Australia/Sydney'
            ).toISOString(true);
        
        updateIssue(updatedIssue);
    }


    const removeReporterFromIssue = (user_id: string) => {

        selectedIssue!.reporter_id = "";

        var updated_issue: any = {
            ...selectedIssue!
        } 

        selectedIssue!.updated_at = moment.tz(
            moment(), 'Australia/Sydney'
            ).toISOString(true);

        delete updated_issue['assignees'];

        updated_issue.reporter = "";

        issueStore.updateIssue(updated_issue);

    }

    const addReporterToIssue = (user_id: string) => {

        selectedIssue!.reporter_id = user_id;

        var updated_issue: any = {
            ...selectedIssue!
        } 

        selectedIssue!.updated_at = moment.tz(
            moment(), 'Australia/Sydney'
            ).toISOString(true);

        delete updated_issue['assignees'];

        issueStore.updateIssue(updated_issue);

    }

    const changeIssueStatus = (status: string) => {

        selectedIssue!.status = status;
        selectedIssue!.updated_at = moment.tz(
            moment(), 'Australia/Sydney'
            ).toISOString(true);

        var updated_issue: any = {
            ...selectedIssue!
        } 

        delete updated_issue['assignees'];

        issueStore.updateIssue(updated_issue);

    }

    const changeIssuePriority = (priority: string) => {

        selectedIssue!.priority = priority;

        selectedIssue!.updated_at = moment.tz(
            moment(), 'Australia/Sydney'
            ).toISOString(true);

        var updated_issue: any = {
            ...selectedIssue!
        } 

        delete updated_issue['assignees'];

        issueStore.updateIssue(updated_issue);

    }

    const removeAssigneeFromIssue = (user_id: string) => {

        selectedIssue!.assignees = selectedIssue!.assignees
            .filter(
                assignee => 
                    assignee.id.toString().toLowerCase() !== user_id
            );

        selectedIssue!.updated_at = moment.tz(
            moment(), 'Australia/Sydney'
            ).toISOString(true);

        var issue_assignee_to_remove = {
            AssigneeId: user_id,
            IssueId: selectedIssue!.id
        }

        var updated_issue: any = {
            ...selectedIssue!
        } 

        issueStore.removeAssigneeFromIssue(issue_assignee_to_remove);

    }


    const addAssigneeToIssue = (assignee_id: string) => {
        var assignee_to_add = allUsers
            .find(
                assignee => 
                    assignee
                        .id
                        .toString()
                        .toLowerCase() === assignee_id.toLowerCase()
        );

        selectedIssue!.assignees.push(assignee_to_add!);

        selectedIssue!.updated_at = moment.tz(
            moment(), 'Australia/Sydney'
            ).toISOString(true);

        var issue_assignee_to_add = {
            AssigneeId: assignee_id,
            IssueId: selectedIssue!.id
        }

        issueStore.addAssigneeToIssue(issue_assignee_to_add);

    }

    const updateIssueTitle = () => {
        
        var current_issue: Partial<Issue> = {
            ...selectedIssue!
        }

        delete current_issue['assignees']

        if(issueTitle === ""){
            toggleIssueTitleEditor(issue_title_edit_state);
            return
        }
        current_issue.name = issueTitle;

        var updatedIssue: any = current_issue;

        selectedIssue!.name = issueTitle;
        selectedIssue!.updated_at = moment.tz(
            moment(), 'Australia/Sydney'
            ).toISOString(true);
        
        updateIssue(updatedIssue);

        toggleIssueTitleEditor(issue_title_edit_state);
    }

    
    

    const extractTimespanObject = (timespan: string) => {
        var days = timespan.substring(0, timespan.indexOf('.'));
        
        if(days === null || days === ''){days = '0';}
       
        
        var hours = timespan
            .substring(timespan.indexOf('.') + 1, timespan.indexOf(':'));
        
        if(hours === null){ hours = '0'; }
        
        var timespan_minus_days_and_hours = timespan
            .substring(timespan.indexOf(':') + 1, timespan.length);
        
        var minutes = timespan_minus_days_and_hours
            .substring(0, timespan_minus_days_and_hours.indexOf(":"));
        
        if(minutes === null){ minutes = '0'; }
       
        var time_span: any = {
            days: days,
            hours: hours,
            minutes: minutes
        };

        return (time_span);
    }

    const resetTimeState = () => {
        setSelectedIssueLoggedMinutes(0);
        setSelectedIssueLoggedHours(0);
        setSelectedIssueLoggedDays(0);
        setSelectedIssueRemainingMinutes(0);
        setSelectedIssueRemainingHours(0);
        setSelectedIssueRemainingDays(0);
    }

    const addTimeSpans = (first_time_span: any, second_time_span: any) => {
        var first_timespan_obj = extractTimespanObject(first_time_span);
        var second_timespan_obj = extractTimespanObject(second_time_span);

        var total_days = parseInt(first_timespan_obj.days) + 
            parseInt(second_timespan_obj.days);

        var total_hours = parseInt(first_timespan_obj.hours) + 
            parseInt(second_timespan_obj.hours);

        var total_minutes = parseInt(first_timespan_obj.minutes) + 
            parseInt(second_timespan_obj.minutes);

        if(total_minutes >= 60){
            var minutes_to_hours = Math.floor(total_minutes / 60);
            total_minutes = (total_minutes % 60);
            total_hours = total_hours + minutes_to_hours;
        }

        if(total_hours >= 24){
            var hours_to_days = Math.floor(total_hours / 24);
            total_hours = (total_hours % 24);
            total_days = total_days + hours_to_days;
        }

        let finalTimespan = total_days + 
            "." + 
            total_hours + 
            ':' + 
            total_minutes + 
            ':' + 
            '00';

        console.log("First time span");
        console.log(first_time_span);
        console.log("Second time span");
        console.log(second_time_span);
        console.log("Final timespan");
        console.log(finalTimespan);

        return( finalTimespan )
    }
      

    const updateLoggedTime = () => {
        var current_issue: Partial<Issue> = {
            ...selectedIssue!
        }

        delete current_issue['assignees'];
        
        var time_logged = calculateIssueTimespan(
            selectedIssueLoggedDays, 
            selectedIssueLoggedHours, 
            selectedIssueLoggedMinutes
            );
        console.log("updateLoggedTime:: Time logged =");
        console.log(time_logged);
        current_issue.time_logged = addTimeSpans(
            time_logged, 
            current_issue.time_logged
            );
        console.log("updateLoggedTime:: Time added =");
        console.log(current_issue.time_logged);


        var time_remaining = calculateIssueTimespan(
            selectedIssueRemainingDays, 
            selectedIssueRemainingHours, 
            selectedIssueRemainingMinutes
            );

        console.log("Time remaining =");
        current_issue.time_remaining = time_remaining;

        var updatedIssue: any = current_issue;

        selectedIssue!.time_logged = current_issue.time_logged;
        selectedIssue!.time_remaining = current_issue.time_remaining;
        selectedIssue!.updated_at = moment.tz(
            moment(), 
            'Australia/Sydney'
            ).toISOString(true);

        resetTimeState();

        updateIssue(updatedIssue);

        toggleLogTimeEditState();
    }

    const toggleDescriptionEditor = (description_edit_state: boolean) => {
        setDescriptionEditState(!description_edit_state);
    }

    const toggleIssueTitleEditor = (issue_title_edit_state: boolean) => {
        setIssueTitleEditState(!issue_title_edit_state);
    }

    const handleChangeAssignees = (e: any) => {
        setSelectedAssignees(e.target.value);
    }

    const handleChangeReporter = (e: any) => {
        setSelectedReporter(e.target.value);
    }

    function submitComment() {

        var comment_to_send = {
            Id: uuid(),
            commenter_assignee_id: commonStore.assignee_id!,
            comment: comment_state,
            comment_posted: moment.tz(
                moment().subtract(moment.duration("11:00:00")), 
                'Australia/Sydney'
            ).toISOString(true)
        }

        var comment_to_add = {
            ...comment_to_send,
            comment_posted: moment.tz(
                moment(), 'Australia/Sydney')
                    .toISOString(true)
        }
        selectedIssue!.comments!.push(comment_to_add);
        issueStore.addCommentToIssue(selectedIssue!.id, comment_to_send);
    }


    function parseTimeSpan(timespan: string) {
        var days = timespan.substring(0, timespan.indexOf('.'));
        
        if(days === null){days = '0';}
        var days_string = '';
        if(days === '001'){ days_string = 'day'; } else { days_string = 'days'}
        
        var hours = timespan
            .substring(timespan.indexOf('.') + 1, timespan.indexOf(':'));
        
        if(hours === null){ hours = '0'; }
        var hours_string = '';
        if(hours === '01'){ hours_string = 'hour' } else ( hours_string = 'hours' );

        
        var timespan_minus_days_and_hours = timespan
            .substring(timespan.indexOf(':') + 1, timespan.length);
        
        var minutes = timespan_minus_days_and_hours
            .substring(0, timespan_minus_days_and_hours.indexOf(":"));
        
        if(minutes === null){ minutes = '0'; }
        var minutes_string = '';
        if(minutes === '01') { minutes_string = 'minute'} else { minutes_string = 'minutes'}
        var time_span = '';

        if(days === '0' && hours === '0'){
            time_span = minutes.concat(' ', minutes_string);
        }
        else if(days === '0'){
            time_span = hours.concat(
                ' ', 
                hours_string, 
                ' ', 
                minutes, 
                ' ', 
                minutes_string
            );
        }
        else { 
            time_span = days.concat(
                ' ', 
                days_string, 
                ' ', 
                parseInt(hours).toString(), 
                ' ', 
                hours_string, 
                ' ', 
                parseInt(minutes).toString(), 
                ' ', 
                minutes_string);  
        }
        return(time_span);
    }

    const handleLogTimeEditDivClick = () => {
        if(log_time_edit_state === false){
            toggleLogTimeEditState;
        }
    }

   

    return (
  
        <div >
            <Formik 
                validationSchema={validationSchema}
                enableReinitialize 
                initialValues={issue} 
                onSubmit={values => console.log(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
             <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                <Grid>
                <Grid.Column width={10}>
                    {renderSelectedIssueType()}
                    <div style={{display: 'inline-block'}}>
                    <Dropdown 
                        downward 
                        multiple
                        closeOnChange
                        placeholder='' 
                        value='' 
                        label='Status' 
                        name='status' 
                        options={issueTypeOptions}
                        //onChange={(e) => handleChangeAssignees(e)} 
                        />
                    </div>
                    
                    {!issue_title_edit_state &&
                    <InvisibleTextInput 
                        style={{cursor: 'pointer'}} 
                        fontsize={20} 
                        onClick={() => 
                            toggleIssueTitleEditor(issue_title_edit_state)
                        }>
                    <h1 style={{
                            paddingTop: "10px", 
                            paddingBottom: "10px", 
                            paddingLeft: "5px"
                            }}>
                            {selectedIssue!.name} 
                        </h1>
                    </InvisibleTextInput>
                    }
                    {issue_title_edit_state &&
                    <StyledInput 
                        defaultValue={selectedIssue!.name} 
                        autoFocus 
                        onChange={(e: any) => 
                            setIssueTitleState(e.target.value)
                        }
                        onBlur={() => {updateIssueTitle();}}
                    />      
                    }                
                    
                    <h5 style={{
                        marginLeft: '10px', 
                        marginBottom: '0px', 
                        paddingBottom: '0px'
                        }}>
                        Description
                    </h5>
                    {!description_edit_state && 
                    <InvisibleTextInput 
                        style={{
                            marginTop: '4px', 
                            paddingTop: '0px', 
                            cursor: 'pointer', 
                            display: "flex", 
                            maxHeight: "700px", 
                            minHeight: "200px"
                        }} 
                        fontsize={14} 
                        onClick={() => 
                            toggleDescriptionEditor(description_edit_state)
                        }>  
                        <div style={{
                            paddingTop: "8px", 
                            marginBottom: "20px", 
                            marginLeft: "12px", 
                            marginRight: "12px"
                            }}>
                            {parse(selectedIssue!.description)} 
                        </div>   
                    </InvisibleTextInput>
                    }
                    {
                        description_edit_state &&
                        <>
                            <ReactQuill style={{
                                minHeight: "300px", 
                                maxHeight: "700px"
                                }} 
                                theme="snow" 
                                defaultValue={selectedIssue!.description} 
                                onChange={setQuillDescriptionEditText}
                            />
                            
                            <br/>
                            <Button 
                                size="mini" 
                                content="Save" 
                                color="blue" 
                                onClick={() => {
                                    updateIssueDescription(); 
                                    toggleDescriptionEditor(description_edit_state)
                                }}/>
                            <Button 
                                size="mini" 
                                content="Cancel" 
                                onClick={() => 
                                    toggleDescriptionEditor(description_edit_state)
                                }/>
                        </>
                    }

                    <h5>Comments</h5>
                    {
                        selectedIssue!.comments!.map(comment => 
                            (
                                <div style={{width: '100%'}}>
                                    <div style={{
                                        verticalAlign: 'top', 
                                        display: 'inline-block'
                                        }}> 
                                        <StyledAvatar 
                                            size="30" 
                                            round="16px" 
                                            src={selectedProject!.assignees
                                                    .find(assignee => 
                                                        assignee.id === comment.commenter_assignee_id
                                                    )!.photo?.url
                                            }
                                            name={
                                                selectedProject!.assignees
                                                    .find(assignee => 
                                                        assignee.id === comment.commenter_assignee_id
                                                    )!.first_name
                                                        .concat(" ", selectedProject!.assignees
                                                            .find(assignee => 
                                                                assignee.id === comment.commenter_assignee_id
                                                            )!.second_name
                                                        )
                                            }
                                        />
                                    </div>
                                    <div 
                                        style={{
                                            paddingLeft: '15px', 
                                            display: 'inline-block', 
                                            width: '90%'
                                        }}>
                                        <h5>{selectedProject!.assignees
                                            .find(
                                                assignee => assignee.id === comment.commenter_assignee_id
                                            )!.first_name
                                                .concat(' ', selectedProject!.assignees
                                                    .find(assignee => 
                                                        assignee.id === comment.commenter_assignee_id)!
                                                            .second_name, 
                                                            '    ', 
                                                            moment(comment.comment_posted)
                                                            .fromNow()
                                                )
                                            }</h5>
                                        <p>{comment.comment}</p>
                                        <br/>
                                    </div>
                                </div>
                                
                            )
                        )
                    }
                    <div style={{marginTop: '20px'}}></div>
                    <div style={{display: "inline-block"}}>
                        <StyledAvatar 
                            style={{paddingTop: "12px"}} 
                            size="30" 
                            round="16px" 
                            src={
                                selectedProject!.assignees
                                    .find(assignee => 
                                        assignee.id_app_user === commonStore.account_id
                                    )?.photo?.url
                            }
                        name={
                            selectedProject!.assignees
                                .find(assignee => 
                                    assignee.id_app_user === commonStore.account_id
                                )!.first_name
                                .concat(
                                    " ", 
                                    selectedProject!.assignees
                                        .find(assignee => 
                                            assignee.id_app_user === commonStore.account_id
                                        )!.second_name
                                )
                        }
                        />
                    </div>
                    <div style={{
                        display: "inline-block", 
                        paddingLeft: "15px", 
                        width: "90%"
                        }}>
                        <TextArea 
                            onChange={(e) => setCommentState(e.target.value)} 
                            placeholder="Add a comment..."/>
                    </div>

                    <div style={{
                        marginTop: '10px', 
                        marginRight: '30px', 
                        float: 'right', 
                        display: 'inline-block'
                        }}>
                        <Button 
                            size='tiny' 
                            content='Comment' 
                            color='blue' 
                            onClick={() => submitComment()}
                        />
                    </div>
                </Grid.Column>
                <Grid.Column width={6}>
                <div style={{paddingTop: "10px"}}></div>
                <Label>{selectedIssue!.status}</Label>
                <Dropdown 
                    downward 
                    multiple
                    closeOnChange
                    placeholder='' 
                    value='' 
                    label='Status' 
                    name='status' 
                    options={statusOptions}
                    //onChange={(e) => handleChangeAssignees(e)} 
                    />
                <br/>
                <h5>ASSIGNEES</h5>
                {selectedIssue!.assignees.map( (user, index) => (
                    <StyledLabel 
                        style={{
                            marginBottom: "6px", 
                            marginRight: "4px"
                        }} 
                        onClick={() => {
                            removeAssigneeFromIssue(user.id); 
                        }}>
                    <AvatarIsActiveLabelBorder 
                        isActive={false} 
                        index={index} 
                        >
                        <StyledLabelAvatar 
                            value={user.id}
                            size='25' 
                            name={user.first_name
                                .concat(' ', user.second_name)
                            } 
                            round='25px'
                            src={selectedProject!.assignees
                                .find(assignee => 
                                    assignee.id === user.id
                                )!.photo?.url
                            }
                        />
                    </AvatarIsActiveLabelBorder>
                    
                    {user.first_name.concat(' ', user.second_name)}
                    <Icon style={{marginLeft: "10px"}} type='close' />
                    </StyledLabel>
                    ))
                }
                <div></div>
                <Dropdown 
                    multiple 
                    downward 
                    placeholder='+ Add more' 
                    value='' 
                    label='Assign' 
                    name='assignees' 
                    options={
                        formatProjectAssignees(projectAssignees, 
                        selectedIssue!
                    )} 
                    onChange={(e) => handleChangeAssignees(e)} 
                    />

                <h5>REPORTER</h5>
                 {selectedIssue!.reporter_id !== null && 
                 selectedIssue!.reporter_id.length !== 0 &&
                    <StyledLabel 
                        style={{
                            marginBottom: "6px", 
                            marginRight: "4px"
                        }} 
                        onClick={() => {
                            removeReporterFromIssue(selectedIssue!.reporter_id); 
                        }}
                        >
                        <AvatarIsActiveLabelBorder 
                            isActive={false} 
                            index={1} 
                            >
                            <StyledLabelAvatar 
                                value={selectedIssue!.reporter_id}
                                size='25' 
                                name={
                                    selectedProject!.assignees
                                        .find(assignee => 
                                            assignee.id === selectedIssue!.reporter_id
                                        )!.first_name
                                        .concat(
                                            ' ', 
                                            selectedProject!.assignees
                                                .find(assignee => 
                                                    assignee.id === selectedIssue!.reporter_id
                                                )!.second_name
                                        )
                                } 
                                round='25px'
                                src={
                                    selectedProject!.assignees
                                        .find(assignee => 
                                            assignee.id === selectedIssue!.reporter_id
                                        )!.photo?.url
                                }
                            />
                        </AvatarIsActiveLabelBorder>
                    
                        {
                            selectedProject!.assignees
                                .find(assignee => 
                                    assignee.id === selectedIssue!.reporter_id
                                )!.first_name
                                .concat(
                                    ' ', 
                                    selectedProject!.assignees
                                        .find(assignee => 
                                            assignee.id === selectedIssue!.reporter_id
                                        )!.second_name
                                )
                        } 
                        <Icon style={{marginLeft: "10px"}} type='close' />
                    </StyledLabel>
                       
                }
                <div></div>
                <Dropdown 
                    downward 
                    multiple
                    closeOnChange
                    placeholder='Select reporter' 
                    value='' 
                    label='Assign' 
                    name='reporter' 
                    options={
                        formatProjectReporters(projectAssignees, selectedIssue!)
                    } 
                    onChange={(e) => handleChangeReporter(e)} 
                    />
                <div></div>
                   
                <br/>

                <InvisibleTextInput 
                    onClick={toggleLogTimeEditState} 
                    fontsize={12} 
                    style={{cursor: 'pointer'}} 
                    >
                    <div style={{
                        paddingTop: '10px', 
                        paddingBottom: '10px'
                        }}>
                        <h5 style={{
                            marginLeft: "0px", 
                            marginBottom: "5px"
                            }}>LOG TIME
                        </h5> 
                        
                        <UpdateIssueFormTrackingWidget/>
                    </div>
                </InvisibleTextInput>

                {/* LOG TIME */}
                    {log_time_edit_state &&
                        <>
                            <div className='inline fields'>
                        
                                <label>Days</label>
                                <Field 
                                    type='number' 
                                    placeholder='0d' 
                                    name='days_logged ' 
                                    onChange={(e: any) => 
                                        setSelectedIssueLoggedDays(e.target.value)
                                    }
                                />
        
                                <label>Hours</label>
                                <Field  
                                    type='number' 
                                    placeholder='0h' 
                                    name='hours_logged' 
                                    onChange={(e: any) => 
                                        setSelectedIssueLoggedHours(e.target.value)} />
                                

                                <label>Minutes</label>
                                <Field  
                                    type='number' 
                                    placeholder='0m' 
                                    name='minutes_logged' 
                                    onChange={(e: any) => 
                                        setSelectedIssueLoggedMinutes(e.target.value)
                                    }
                                />
                        
                            </div>                        
                            
                            <h5>Time Remaining</h5>
                            <div className='inline fields'>
                            
                                <label>Days</label>
                                <Field 
                                    type='number' 
                                    placeholder='0d' 
                                    name='days_remaining' 
                                    onChange={(e: any) => 
                                        setSelectedIssueRemainingDays(e.target.value)
                                    }/>
                            
                        
                                <label>Hours</label>
                                <Field  
                                    type='number' 
                                    placeholder='0h' 
                                    name='hours_remaining' 
                                    onChange={(e: any) => 
                                        setSelectedIssueRemainingHours(e.target.value)
                                    }/>
                                
                                <label>Minutes</label>
                                <Field  
                                    type='number' 
                                    placeholder='0m' 
                                    name='minutes_remaining' 
                                    onChange={(e: any) => 
                                        setSelectedIssueRemainingMinutes(e.target.value)
                                    }
                                />

                            </div>

                            <Button 
                                size="mini" 
                                content="Save" 
                                color="blue" 
                                onClick={() => { 
                                    updateLoggedTime(); 
                                    toggleLogTimeEditState
                                }}
                            />

                            <Button 
                                size="mini" 
                                content="Cancel" 
                                onClick={() => 
                                    toggleLogTimeEditState()
                                } 
                            />

                            <br/><br/>
                                
                        </>
                    }
                    <div style={{width: '100%', marginTop: '20px'}}>
                        <div style={{ width: '100%' }}>
                            <h5 style={{verticalAlign: 'top'}}>SPRINT</h5>
                            <StyledLabel>
                                <p style={{
                                    verticalAlign: 'top', 
                                    paddingBottom: "3px", 
                                    paddingTop:"3px"
                                    }}>
                                    {selectedProject!.sprints
                                        .find(sprint => 
                                            sprint.id === selectedIssue!.sprint_id
                                        )!.name}
                                </p>
                            </StyledLabel>
                        <Dropdown 
                            downward 
                            multiple
                            closeOnChange
                            placeholder='' 
                            value='' 
                            label='Sprint' 
                            name='sprint' 
                            options={
                                reformatSprintOptions(selectedProject!.sprints)
                            } 
                            />
                    </div>
                    <div style={{marginTop: '20px', width: '100%'}}>
                        <h5>PRIORITY</h5>
                        <StyledLabel> 
                            <IssuePriorityIcon priority={selectedIssue!.priority}/>
                            <p style={{
                                paddingBottom: "3px", 
                                paddingLeft: "5px", 
                                display: "inline-block"
                            }}>{selectedIssue!.priority}
                            </p>
                        </StyledLabel>
                        <Dropdown 
                            downward 
                            multiple
                            closeOnChange
                            placeholder='' 
                            value='' 
                            label='Priority' 
                            name='priority' 
                            options={priorityOptions}
                            />
                    </div>
                </div>
                <p style={{
                    marginTop: '30px', 
                    fontSize: '13px', 
                    color: 'grey'
                    }}>
                    {'Created '.concat(moment(selectedIssue!.created_at).fromNow())}
                </p>
                <p style={{
                    marginTop: '15px', 
                    fontSize: '13px', 
                    color: 'grey'
                    }}>
                    {'Last updated '.concat(moment(selectedIssue!.updated_at)?.fromNow())}
                </p>
                
            </Grid.Column>   
            </Grid>   
        </Form>
        )}
        </Formik>
    </div>
)})