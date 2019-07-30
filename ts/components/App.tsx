import * as React from "react";
import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import Dashboard from "./Dashboard";
import ControlBar from "../containers/ControlBar";
import { DashboardConfig, WidgetConfigList } from "../types";

const styles = () => createStyles({
    root: {
        height: '100%',
    }
});

export type StateProps = {
    dashboardConfig: DashboardConfig,
    widgetConfigs: WidgetConfigList,
}

export default withStyles(styles)(React.memo((props: StateProps & WithStyles<typeof styles>) => {
    return <div className={props.classes.root}>
        <ControlBar />
        {props.dashboardConfig ? <Dashboard config={props.dashboardConfig} widgets={props.widgetConfigs} /> : null}
    </div>
}))
