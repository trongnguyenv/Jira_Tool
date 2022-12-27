import { useState } from 'react';
import { Button, Header} from 'semantic-ui-react';
import { Formik, Form } from 'formik';
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import MyTextInput from '../../../shared/form/MyTextInput';
import { v4 as uuid } from 'uuid';

export default observer(function SprintForm() {

    const {issueStore, modalStore, smallModalStore} = useStore();
    const {
        selectedProject,
        createSprint, 
        loading,
        updateSprint,
    } = issueStore;

    const validationSchema = Yup.object({
        name: Yup.string().required('Please give your sprint a name.')
    })


    const initialState = {
        id: '',
        name: '',
        description: '',
        issues: []
    }



    const [sprint, setSprint] = useState(initialState);

    function handleFormSubmit(values: any) {
    
    var new_sprint = {
        ...values,
        id: uuid()
    }

      var newProjectSprint = {
        project_id: selectedProject!.id,
        sprint_id: new_sprint.id,
        sprint_name: new_sprint.name
      }
      createSprint(new_sprint, newProjectSprint);
    }


    return (
  
        <div style={{clear: 'both'}}>
            <Header content='Create sprint' />
            <Formik 
                validationSchema={validationSchema}
                enableReinitialize 
                initialValues={sprint} 
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
             <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
  
                <MyTextInput   placeholder='' label='Sprint Name' name='name' />
                
                <MyTextInput   placeholder='' label='Description' name='description' />
                
            <div style={{marginBottom: '10px', paddingBottom: '8px'}}>
                <Button 
                    disabled={isSubmitting || !isValid || !dirty}
                    loading={loading} 
                    floated='right'  
                    type='submit' 
                    content='Create'
                    size='tiny'
                    color='blue'
                    />
                <Button size='tiny' onClick={smallModalStore.closeSmallModal} floated='right'  type='button' content='Cancel'/>
            </div>
            </Form>
            )}
            </Formik>
        </div>
    )
})