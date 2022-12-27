import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react-lite';
import { Sprint } from '../../../models/sprint';
import * as Yup from 'yup';
import { v4 as uuid } from 'uuid';
import {InvisibleTextInput, StyledInput} from '../../../shared/form/Styles';
import ReactQuill from 'react-quill';
import  "react-quill/dist/quill.snow.css";
import parse from 'html-react-parser';

export default observer(function AddDatesToSprintForm() {

    const {issueStore, modalStore} = useStore();
    const {
        selectedProject,
        createSprint, 
        loading,
        selectedSprint,
        updateSprint,
    } = issueStore;

    const validationSchema = Yup.object({
        name: Yup.string().required('The issue title is a required MyTextInput.')
    })

    const initialState = {
        id: '',
        name: '',
        description: '',
        date_start: '',
        date_end: '',
        issues: []
    }

    const [sprint, setSprint] = useState(initialState);
    var [sprint_name, setSprintName] = useState('Give this sprint a name');
    var [sprint_description, setSprintDescription] = useState('Describe the goal for this sprint');
    var [sprint_start_date, setSprintStartDate] = useState('');
    var [sprint_end_date, setSprintEndDate] = useState('');
    var [sprint_title_edit_state, setSprintTitleEditState] = useState(false);
    var [sprint_description_edit_state, setSprintDescriptionEditState] = useState(false);

    function toggleSprintDescriptionEditState() {
        setSprintDescriptionEditState(!sprint_description_edit_state);
    }

    function toggleSprintTitleEditState() {
        setSprintTitleEditState(!sprint_title_edit_state);
    }

    function handleUpdateSprintDates(selectedSprint: any) {
        
        var updated_sprint_details: any = {
            ...selectedSprint
        }

        delete updated_sprint_details['issues'];
        updated_sprint_details.date_start = sprint_start_date;
        updated_sprint_details.date_end = sprint_end_date;
        updated_sprint_details.description = sprint_description;
        updateSprint(updated_sprint_details);
    }

    function handleFormSubmit(values: any) {
        
        var new_sprint = {
            ...values,
            id: uuid()
        }
        
        var newProjectSprint = {
            project_name: selectedProject!.name,
            sprint_name: values.name
        }
        
        selectedProject!.sprints.push(new_sprint);
        createSprint(new_sprint, newProjectSprint);
    }

    function handleAddSprintDates() {
        
        var current_sprint: Partial<Sprint> = {
            ...selectedSprint!
        }
        
        current_sprint.date_start = new Date(sprint_start_date).toISOString();
        current_sprint.date_end = new Date(sprint_end_date).toISOString();
        selectedSprint!.date_start = new Date(sprint_start_date).toISOString();
        selectedSprint!.date_end = new Date(sprint_end_date).toISOString();
        var updated_sprint: any = current_sprint;
        delete updated_sprint['issues'];
        updateSprint(updated_sprint);
        modalStore.closeModal();
    }

    function updateSprintDescription(sprint_description: string) {
        
        var current_sprint: Partial<Sprint> = {
            ...selectedSprint!
        }

        delete current_sprint['issues'];
        current_sprint.description = sprint_description;
        var updated_sprint: any = current_sprint;
        selectedSprint!.description = sprint_description;
        updateSprint(updated_sprint);
    }

    function updateSprintTitle(sprint_title: string) {
        
        var current_sprint: Partial<Sprint> = {
            ...selectedSprint!
        }

        delete current_sprint['issues'];
        current_sprint.name = sprint_title;
        var updated_sprint: any = current_sprint;
        selectedSprint!.name = sprint_title;
        updateSprint(updated_sprint);
        modalStore.closeModal();
    }

    
    return (
  
        <div>
            <Formik 
                enableReinitialize 
                initialValues={sprint} 
                onSubmit={values => console.log(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
            <Form 
                className='ui form'  
                autoComplete='off'
                >
                {!sprint_title_edit_state &&
                <InvisibleTextInput 
                    fontsize={20} 
                    onClick={() => toggleSprintTitleEditState()}>
                    <h1 style={{
                            paddingTop: "10px", 
                            paddingBottom: "10px", 
                            paddingLeft: "5px"
                        }}> 
                        {selectedSprint!.name} 
                    </h1>
                </InvisibleTextInput>
                }

                {sprint_title_edit_state &&
                <StyledInput 
                    defaultValue={selectedSprint!.name} 
                    autoFocus 
                    onChange={(e: any) => setSprintName(e.target.value)}
                    onBlur={() => {
                        updateSprintTitle(sprint_name); 
                        toggleSprintTitleEditState();
                    }}
                />    
                }       

                {!sprint_description_edit_state && 
                <InvisibleTextInput 
                    style={{
                        display: "flex", 
                        maxHeight: "700px", 
                        minHeight: "300px"
                    }} 
                    fontsize={14} 
                    onClick={() => toggleSprintDescriptionEditState()}>
                    
                    <div style={{
                        paddingTop: "20px", 
                        marginBottom: "20px", 
                        marginLeft: "12px",
                        marginRight: "12px"
                        }}> 
                        {parse(selectedSprint!.description)} 
                    </div>
                
                </InvisibleTextInput>
                }
                {
                    sprint_description_edit_state &&
                    <>
                        <ReactQuill 
                            style={{
                                minHeight: "300px", 
                                maxHeight: "700px"
                                }} 
                            theme="snow" 
                            defaultValue={selectedSprint!.description} 
                            onChange={setSprintDescription}
                        /> 
                        <br/>
                        <Button 
                            size="mini" 
                            content="Save" 
                            color="blue" 
                            onClick={() => {
                                updateSprintDescription(sprint_description); 
                                toggleSprintDescriptionEditState()
                            }}
                        />
                    </>
                }     
            
                <div className='inline fields' >
                    <label>Start Date</label>
                    <Field 
                        style={{
                            width: '18%'
                        }} 
                        type='date' 
                        placeholder='' 
                        name='start_date' 
                        onChange={(e: any) => setSprintStartDate(e.target.value)} 
                    />
                    <label 
                        style={{
                            marginLeft: '25px'
                        }}>
                        End Date
                    </label>
                    <Field 
                        style={{
                            width: '18%'
                        }} 
                        type='date' 
                        placeholder='' 
                        name='end_date' 
                        onChange={(e: any) => setSprintEndDate(e.target.value)}
                    />

                    <Button 
                        style={{
                            marginLeft: '200px'
                        }}
                        loading={loading} 
                        floated='right' 
                        positive 
                        onClick={() => {handleAddSprintDates(); modalStore.closeModal}}
                        content='Submit'
                    />
                    <Button 
                        onClick={modalStore.closeModal} 
                        floated='right'  
                        type='button' 
                        content='Cancel'
                    />
                </div>
                <div />
            </Form>
            )}
            </Formik>
        </div>
    )
})