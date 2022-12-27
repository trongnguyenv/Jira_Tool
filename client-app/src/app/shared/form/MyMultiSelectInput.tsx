import React from 'react';
import { useField } from 'formik';
import { Select, Label, Form, Dropdown } from 'semantic-ui-react';
import {useStore} from '../../stores/store';

interface Props {
    placeholder: string;
    name: string;
    options: any;
    label?: string;
}

export default function MyMultipleSelectInput(props: Props) {

    const {issueStore} = useStore();
    const {selectProject} = issueStore;


    const [field, meta, helpers] = useField(props.name);

    if(props.label === "Projects" || props.label === "Assignees" || props.label == "Projects" || props.label == "Users" || props.label == "Assign"){
        return(
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
                 <Select  
                 clearable
                 fluid multiple selection
                 options={props.options}
                 value={field.value || null}
                 onChange={(e, d) => {helpers.setValue(d.value);}}
                 onBlur={() => helpers.setTouched(true)}
                 placeholder={props.placeholder}
             />
               {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
        )
    }

    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <Select 
                clearable
                options={props.options}
                value={field.value || null}
                onChange={(e, d) => helpers.setValue(d.value)}
                onBlur={() => helpers.setTouched(true)}
                placeholder={props.placeholder}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}