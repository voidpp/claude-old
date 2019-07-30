import { Button, Menu, MenuItem, Divider, ListItemIcon, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@material-ui/core";
import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DashboardConfigMap } from "../types";
// import { dialogTransition } from "./tools";

export type DispatchProps = {
    selectDashboard: (id: string) => void,
    addDashboard: (name: string, stepSize: number) => void,
}

export type StateProps = {
    currentDashboardId: string,
    dashboards: DashboardConfigMap,
}

export default function DashboardSelector(props: StateProps & DispatchProps) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [createDashboardDialogIsShown, showCreateDashboardDialog] = React.useState(false);
    const [name, setName] = React.useState('');
    const [stepSize, setStepSize] = React.useState(10);

    function openMenu(event) {
        setAnchorEl(event.currentTarget);
    }

    function closeMenu() {
        setAnchorEl(null);
    }

    function chooseMenu(id: string) {
        props.selectDashboard(id)
        closeMenu()
    }

    function closeDialog() {
        showCreateDashboardDialog(false)
        setName('')
        setStepSize(10)
    }

    function openDialog() {
        showCreateDashboardDialog(true)
        closeMenu()
    }

    const submit = (ev: React.SyntheticEvent) => {
        ev.preventDefault();
        props.addDashboard(name, stepSize);
        closeDialog();
    }

    const dashboards = Object.values(props.dashboards);

    return (
        <React.Fragment>
            <Button aria-controls="DashboardSelector" aria-haspopup="true" variant="contained" size="small" color="primary"
                onClick={openMenu}>
                dashboards
            </Button>
            <Menu
                id="DashboardSelector"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={closeMenu}
            >
                <MenuItem key={0} onClick={openDialog}>Create new dashboard</MenuItem>
                {dashboards.length ? <Divider /> : null}
                {dashboards.map(d =>
                    <MenuItem key={d.id} onClick={chooseMenu.bind(this, d.id)}>
                        <ListItemIcon>
                            {d.id == props.currentDashboardId ? <FontAwesomeIcon icon="check" /> : <span />}
                        </ListItemIcon>
                        {d.name}
                    </MenuItem>
                )}
            </Menu>
            <Dialog
                open={createDashboardDialogIsShown}
                onClose={closeDialog}
                aria-labelledby="form-dialog-title"
                // TransitionComponent={dialogTransition}
            >
                <DialogTitle id="form-dialog-title">Create new dashboard</DialogTitle>
                <form onSubmit={submit}>
                    <DialogContent>
                        <TextField autoFocus margin="dense" id="name" label="Name" type="text" required fullWidth
                            value={name}
                            onChange={ev => setName(ev.target.value)}
                        />
                        <TextField autoFocus margin="dense" id="stepSize" label="Step size" type="number" required fullWidth
                            value={stepSize}
                            onChange={ev => setStepSize(parseInt(ev.target.value))}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDialog} color="primary">Cancel</Button>
                        <Button type="submit" color="primary">Submit</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment>
    )
}
