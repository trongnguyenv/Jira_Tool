import React from 'react';
import { useField } from 'formik';
import { Select, Label, Form } from 'semantic-ui-react';
import {useStore} from '../../stores/store';

interface Props {
    placeholder: string;
    name: string;
    options: any;
    label?: string;
}

export default function MySelectInput(props: Props) {

    const {issueStore} = useStore();
    const {selectProject} = issueStore;


    const [field, meta, helpers] = useField(props.name);

    if(props.label === "Project"){
        return(
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
                 <Select 
                 clearable
                 options={props.options}
                 value={field.value || null}
                 onChange={(e, d) => {helpers.setValue(d.value); if(typeof(d.value) === "string") selectProject(d.value);}}
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