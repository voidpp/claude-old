
import * as React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';

type Props = {
    opened: boolean,
    onSubmit: () => void,
    onClose: () => void,
}

export default class DashboardSettingsDialog extends React.Component<Props> {

    render() {
        return <Dialog
            open={this.props.opened}
            onClose={this.props.onClose}
            aria-labelledby="form-dialog-title"
            // TransitionComponent={dialogTransition}
        >
            <DialogTitle id="form-dialog-title">Add time entry</DialogTitle>
            <DialogContent>
                <DialogContentText>DialogContentText</DialogContentText>
                content
            </DialogContent>
            <DialogActions>
                <Button onClick={this.props.onClose} color="primary">Cancel</Button>
                <Button type="submit" color="primary">Submit</Button>
            </DialogActions>
        </Dialog>
    }
}
