import * as React from "react";
import { createStyles, withStyles, WithStyles, Drawer, Button, Divider, MenuItem } from '@material-ui/core';
import { useState } from "react";

import AddWidgetMenu from './AddWidgetMenu'
import DashboardSettingsDialog from "./DashboardSettingsDialog";
import DashboardSelector from "../containers/DashboardSelector";
import { Query } from "react-apollo";
import gql from "graphql-tag";

export type DispatchProps = {
    addWidget: (type: string) => void,
}

export type OwnProps = {
    dashboardId: number,
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

export default withStyles(styles)((props: OwnProps &  WithStyles<typeof styles> & DispatchProps) => {
    const [opened, setOpened] = useState(false);

    const {classes, dashboardId} = props;

    function onAddWidget(type: string) {
        props.addWidget(type);
        setOpened(false);
    }

    function Spacer() {
        return <div className={classes.spacer} />
    }

    return (<div>
        <div className={classes.opener} onClick={() => setOpened(true)} />
        <Drawer anchor="top" open={opened || dashboardId == 0} onClose={() => setOpened(false)}>
            <div className={classes.menubar}>
                <span className={classes.title}>Zsomapell Klod!</span>

                <DashboardSelector currentDashboardId={dashboardId} />

                {dashboardId ?
                    <React.Fragment>
                        <Spacer />
                        <AddWidgetMenu onAddWidget={onAddWidget} />
                    </React.Fragment> : null}
            </div>
        </Drawer>
    </div>)
});
