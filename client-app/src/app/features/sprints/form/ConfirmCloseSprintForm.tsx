import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react-lite';
import { ProjectSprintAndBacklog } from '../../../models/projectSprintAndBacklog';
import * as Yup from 'yup';
import  "react-quill/dist/quill.snow.css";

export default observer(function ConfirmCloseSprintForm() {

    const {issueStore, smallModalStore } = useStore();
    const {
        selectedIssue,
        selectedProject,
        selectedSprint
    } = issueStore;


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

    const [issue, setIssue] = useState(initialState);

    function handleCloseSprint() {
        var project_sprint: ProjectSprintAndBacklog = {
            project_id: selectedProject!.id,
            sprint_id: selectedSprint!.id,
            backlog_id: selectedProject!.sprints.find(sprint => sprint.name === "Backlog")!.id
        }
        issueStore.closeSprintAndPushIssuesToBacklog(project_sprint);
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

                <h5>Are you sure you want to complete the sprint? Any remaining tickets will be moved to the backlog.</h5>
                
                <Button size='tiny' color='blue' content='Complete' onClick={() => handleCloseSprint() } float='center' />
                <Button size='tiny' content='Cancel' onClick={() => smallModalStore.closeSmallModal} float='center' />

            </Form>
            )}
            </Formik>
           

        </div>
    )
})