import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, DialogContentText, Checkbox, FormControlLabel } from '@material-ui/core';
import * as React from "react";
import { useState } from "react";

export type FieldType = 'text' | 'number' | 'list' | 'checkbox';

export interface FormFieldDescriptor<DataType> {
    name: keyof DataType,
    label: string,
    type?: FieldType,
    required?: boolean,
    fields?: Array<FormFieldDescriptor<DataType>>,
}

export type Props<DataType> = {
    show: boolean,
    onClose: () => void
    submit: (data: DataType) => void,
    data: DataType,
    fields: Array<FormFieldDescriptor<DataType>>,
    title?: React.ReactNode,
    introText?: React.ReactNode,
}

export default function<DataType>(props: Props<DataType>) {

    const {show, onClose, title = 'Widget settings', submit, data, introText} = props;
    const [formData, setFormData] = useState(Object.assign({}, data))

    const onSubmit = (ev: React.SyntheticEvent) => {
        ev.preventDefault();
        submit(formData)
        onClose();
    }

    const closeDialog = () => {
        setFormData(data);
        onClose();
    }

    const fieldGenerator = {
        string: (desc: FormFieldDescriptor<DataType>) => {
            return <TextField
                key={desc.name as string}
                id={'widgetsettings_' + desc.name}
                margin="dense"
                label={desc.label}
                type="text"
                required={desc.required}
                fullWidth
                value={formData[desc.name]}
                onChange={ev => {
                    setFormData({
                        ...formData,
                        [desc.name]: ev.target.value,
                    })
                }}
            />
        },
        boolean: (desc: FormFieldDescriptor<DataType>) => {
            return <FormControlLabel label={desc.label} key={desc.name as string}
                control={<Checkbox
                    checked={!!formData[desc.name]} // eh...
                    onChange={ev => {
                        setFormData({
                            ...formData,
                            [desc.name]: ev.target.checked,
                        })
                    }}
                    color="primary"
                    inputProps={{'aria-label': 'secondary checkbox'}}
                />}
            />
        },
    }

    return (
        <Dialog open={show} onClose={closeDialog}>
            <DialogTitle>{title}</DialogTitle>
            <form onSubmit={onSubmit}>
                <DialogContent>
                    {introText ? <DialogContentText>{introText}</DialogContentText> : null}
                    {props.fields.map(desc => fieldGenerator[typeof data[desc.name]](desc))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">Cancel</Button>
                    <Button type="submit" color="primary">Submit</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
