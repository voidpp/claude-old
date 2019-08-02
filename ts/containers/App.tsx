import * as React from "react";
import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import Dashboard from "../components/Dashboard";
import ControlBar from "./ControlBar";
import { DashboardConfig, WidgetConfigList } from "../types";

const styles = () => createStyles({
    root: {
        height: '100%',
    }
});

type StateProps = {
    dashboardConfig: DashboardConfig,
    widgetConfigs: WidgetConfigList,
}

const App = withStyles(styles)(React.memo((props: StateProps & WithStyles<typeof styles>) => {
    return <div className={props.classes.root}>
        <ControlBar />
        {props.dashboardConfig ? <Dashboard config={props.dashboardConfig} widgets={props.widgetConfigs} /> : null}
    </div>
}))

import { connect } from 'react-redux';


import { State } from '../types';

function mapStateToProps(state: State): StateProps {
    const { currentDashboardId, dashboards, widgets } = state;
    return {
        dashboardConfig: dashboards[currentDashboardId],
        widgetConfigs: Object.values(widgets).filter(w => w.dashboardId == currentDashboardId),
    }
}

export default connect<StateProps>(mapStateToProps)(App);
