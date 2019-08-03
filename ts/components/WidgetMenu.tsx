import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createStyles, withStyles, WithStyles, Menu, MenuItem } from '@material-ui/core';
import * as React from "react";
import WidgetSettingsDialog, { FormFieldDescriptor } from "./WidgetSettingsDialog";
import { useStore } from "react-redux";
import { removeWidget, updateWidgetConfig } from "../actions";

const styles = () => createStyles({
    body: {
        position: 'absolute',
        top: -5,
        right: 5,
        fontSize: 20,
        cursor: 'pointer',
        opacity: 0.2,
        transition: 'opacity 0.3s',
    },
});

export interface OwnProps<SettingsType> {
    id: string,
    settings: SettingsType,
    settingsFormFields?: Array<FormFieldDescriptor<SettingsType>>,
    dialogTitle?: string,
    dialogText?: React.ReactNode,
}

function WidgetMenu<SettingsType>(props: OwnProps<SettingsType> & WithStyles<typeof styles>) {

    const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
    const [isSettingsDialogShown, showSettingDialog] = React.useState(false);
    const {settingsFormFields = [], classes, settings} = props;

    // typescript + generic component + material-ui.withStyles + redux.connect = HELL
    const store = useStore();

    const submitSettings = (data: SettingsType) => {
        store.dispatch(updateWidgetConfig(props.id, {settings: data}));
    }

    function openMenu(event) {
        setMenuAnchorEl(event.currentTarget);
    }

    function closeMenu() {
        setMenuAnchorEl(null);
    }

    return <div className={classes.body + ' widget-menu'}>
        <span aria-controls="widget-menu" aria-haspopup="true" onClick={openMenu}>
            <FontAwesomeIcon icon="ellipsis-h" />
        </span>

        <Menu
            id="widget-menu"
            anchorEl={menuAnchorEl}
            keepMounted
            open={Boolean(menuAnchorEl)}
            onClose={closeMenu}
        >
            <MenuItem onClick={() => {
                showSettingDialog(true);
                closeMenu();
            }}>Settings</MenuItem>
            <MenuItem onClick={() => store.dispatch(removeWidget(props.id))}>Remove</MenuItem>
        </Menu>

        <WidgetSettingsDialog
            data={settings}
            show={isSettingsDialogShown}
            onClose={() => showSettingDialog(false)}
            submit={submitSettings}
            fields={settingsFormFields}
            title={props.dialogTitle}
            introText={props.dialogText}
        />
    </div>
}

export default withStyles(styles)(WidgetMenu) as <SettingsType>(props: OwnProps<SettingsType>) => JSX.Element;
