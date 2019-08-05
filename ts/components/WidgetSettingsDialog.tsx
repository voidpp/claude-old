import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, DialogContentText, Checkbox, FormControlLabel } from '@material-ui/core';
import * as React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { copy } from '../tools';
const uuid = require('uuid/v4');

export type FieldType = 'string' | 'list' | 'boolean';

export interface FormFieldDescriptor {
    name: string,
    label: string,
    type?: FieldType,
    required?: boolean,
    default?: any,
    options?: Array<{label: string, value: string}>,
}

export interface FormNumberFieldDescriptor extends FormFieldDescriptor {
    min?: number,
    max?: number,
}

export interface FormListFieldDescriptor extends FormFieldDescriptor {
    fields: Array<FormFieldDescriptor>,
    addButtonLabel: string,
}

export type Props = {
    show: boolean,
    onClose: () => void
    submit: (data: {}) => void,
    data: {},
    fields: Array<FormFieldDescriptor>,
    title?: React.ReactNode,
    introText?: React.ReactNode,
}

type ListData = {
    id: string,
    rank: number,
}

type ListDataMap = {[s:string]: ListData};

type ListFieldProps = {
    desc: FormListFieldDescriptor,
    data: ListDataMap,
    onChange: (val: ListDataMap) => void,
}

function ListField(props: ListFieldProps) {

    const {desc, data, onChange} = props;
    const {fields, addButtonLabel} = desc;
    const defaultRowData = fields.reduce((obj, field) => {obj[field.name] = field.default; return obj;}, {});

    const addRow = () => {
        const id = uuid();
        const dataList = Object.values(data);
        const rank = dataList.length ? Math.max(...dataList.map(r => r.rank)) + 1 : 0;
        onChange(Object.assign({}, data, {[id]: {id, rank, ...defaultRowData}}))
    }

    const delRow = (rowId: string) => _ => {
        let newData = copy(data);
        delete newData[rowId];
        onChange(newData);
    }

    const updateCell = (rowId: string, name: string) => (val: any) => {
        let newData = copy(data);
        newData[rowId][name] = val;
        onChange(newData);
    }

    const renderCell = (rowData: ListData, desc: FormFieldDescriptor) => {
        return <td key={`${rowData.id}_${desc.name}`}>
            {fieldGenerator[desc.type || typeof rowData[desc.name]](desc, rowData[desc.name], updateCell(rowData.id, desc.name))}
        </td>
    }

    const renderRow = (rowData: ListData) => {
        return <tr key={rowData.id}>
            {fields.map(desc => renderCell(rowData, desc))}
            <td><div onClick={delRow(rowData.id)}><FontAwesomeIcon icon="times" /></div></td>
        </tr>
    }

    return (
        <div>
            <Button variant="contained" size="small" onClick={addRow}>{addButtonLabel}</Button>
            <table>
                <tbody>
                    {Object.values(data).sort((s1, s2) => s1.rank - s2.rank).map(renderRow)}
                </tbody>
            </table>
        </div>
    )

}


type FieldGeneratorCallbackType = (desc: FormFieldDescriptor, value: any, onChange: (val: any) => void) => React.ReactNode;

const fieldGenerator: {[s: string]: FieldGeneratorCallbackType} = {
    list: (desc: FormListFieldDescriptor, value: ListDataMap, onChange: (val: ListDataMap) => void) => {
        return <div key={desc.name as string}>
            <ListField desc={desc} data={value} onChange={onChange} />
        </div>
    },
    string: (desc: FormFieldDescriptor, value: string, onChange: (val: string) => void) => {
        return <TextField
            key={desc.name as string}
            id={'widgetsettings_' + desc.name}
            margin="dense"
            label={desc.label}
            type="text"
            required={desc.required}
            fullWidth
            value={value}
            onChange={ev => onChange(ev.target.value)}
        />
    },
    boolean: (desc: FormFieldDescriptor, value: boolean, onChange: (val: boolean) => void) => {
        return <FormControlLabel label={desc.label} key={desc.name as string}
            control={<Checkbox
                checked={value} // eh...
                onChange={ev => onChange(ev.target.checked)}
                color="primary"
                inputProps={{'aria-label': 'secondary checkbox'}}
            />}
        />
    },
    number: (desc: FormNumberFieldDescriptor, value: number, onChange: (val: number) => void) => {
        return <TextField
            // TODO: min-max
            key={desc.name as string}
            id={'widgetsettings_' + desc.name}
            margin="dense"
            label={desc.label}
            type="number"
            required={desc.required}
            fullWidth
            value={value}
            onChange={ev => onChange(parseInt(ev.target.value))}
        />
    },
}


export default function(props: Props) {

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

    const renderField = (desc: FormFieldDescriptor) => {
        const fieldType = desc.type || typeof data[desc.name];
        const generator = fieldGenerator[fieldType]
        if (!generator) {
            console.error('Undefined type:', fieldType, desc);
            return null;
        }

        return generator(desc, formData[desc.name], (value: any) => {
            setFormData({
                ...formData,
                [desc.name]: value,
            })
        })
    }

    return (
        <Dialog open={show} onClose={closeDialog}>
            <DialogTitle>{title}</DialogTitle>
            <form onSubmit={onSubmit}>
                <DialogContent>
                    {introText ? <DialogContentText>{introText}</DialogContentText> : null}
                    {props.fields.map(renderField)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">Cancel</Button>
                    <Button type="submit" color="primary">Submit</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}