import * as React from "react";
import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import Dashboard from "./Dashboard";
import ControlBar from "../containers/ControlBar";
import { DashboardConfig } from "../types";

const styles = () => createStyles({
    root: {
        height: '100%',
    }
});

export type StateProps = {
    currentDashboard: DashboardConfig,
}

export default withStyles(styles)(React.memo((props: StateProps & WithStyles<typeof styles>) => {
    return <div className={props.classes.root}>
        <ControlBar />
        {props.currentDashboard ? <Dashboard config={props.currentDashboard} /> : null}
    </div>
}))
