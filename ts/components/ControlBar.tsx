import * as React from "react";
import { createStyles, withStyles, WithStyles, Drawer, Button, Divider } from '@material-ui/core';
import { useState } from "react";

import AddWidgetMenu from './AddWidgetMenu'
import DashboardSettingsDialog from "./DashboardSettingsDialog";

export type DispatchProps = {
    addWidget: (type: string) => void,
}

const styles = () => createStyles({
    opener: {
        position: 'fixed',
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        backgroundColor: 'red',
    },
    title: {
        padding: 15,
    },
    menubar: {
        display: 'flex',
        alignItems: 'center',
    },
    spacer: {
        width: 15,
    }
});

export default withStyles(styles)((props: WithStyles<typeof styles> & DispatchProps) => {
    const [opened, setOpened] = useState(false);
    const [dashboardSettingsOpened, setdashboardSettingsOpened] = useState(false);

    const {classes} = props;

    function onAddWidget(type: string) {
        props.addWidget(type);
        setOpened(false);
    }

    function Spacer() {
        return <div className={classes.spacer} />
    }

    return (<div>
        <div className={classes.opener} onClick={() => setOpened(true)} />
        <Drawer anchor="top" open={opened} onClose={() => setOpened(false)}>
            <div className={classes.menubar}>
                <span className={classes.title}>Zsomapell Klod!</span>
                <Button variant="contained" size="small" color="primary" onClick={() => setdashboardSettingsOpened(true)}>Settings</Button>
                <DashboardSettingsDialog
                    opened={dashboardSettingsOpened}
                    onSubmit={() => {}}
                    onClose={() => setdashboardSettingsOpened(false)}
                />
                <Spacer />
                <AddWidgetMenu onAddWidget={onAddWidget} />
            </div>
        </Drawer>
    </div>)
});
