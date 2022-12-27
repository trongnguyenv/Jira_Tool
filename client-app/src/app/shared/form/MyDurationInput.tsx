import React from 'react'
import { useField } from 'formik';
import { Form, Label} from 'semantic-ui-react';

interface Props {
    placeholder: string[];
    name: string[];
    label?: string[];
}

export default function MyDurationInput(props: Props) {
    const [field1, meta1] = useField(props.name[0]);
    const [field2, meta2] = useField(props.name[1]);
    const [field3, meta3] = useField(props.name[2]);
    return (
        <Form.Group>
             <Form.Field error={meta1.touched && !!meta1.error}>
            <label>Days</label>
            <input type='number' placeholder='0d' name='days'/>
            {meta1.touched && meta1.error ? (
                <Label basic color='red'>{meta1.error}</Label>
            ) : null}
            </Form.Field>
            <Form.Field error={meta2.touched && !!meta2.error}>
            <label>Hours</label>
            <input type='number' placeholder='0h' name='hours'/>
            {meta2.touched && meta2.error ? (
                <Label basic color='red'>{meta2.error}</Label>
            ) : null}
            </Form.Field>
            <Form.Field error={meta3.touched && !!meta3.error}>
            <label>Minutes</label>
            <input type='number' placeholder='0m' name='minutes'/>
            {meta3.touched && meta3.error ? (
                <Label basic color='red'>{meta3.error}</Label>
            ) : null}
            </Form.Field>
        </Form.Group>
    )
}