import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import * as React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { updateWidgetConfig } from '../actions';
import Dashboard from "../components/Dashboard";
import { DashboardConfig, State, UpdateWidgetConfigAction, WidgetConfigList } from "../types";
import ControlBar from "./ControlBar";

const styles = () => createStyles({
    root: {
        height: '100%',
    }
});

type StateProps = {
    dashboardConfig: DashboardConfig,
    widgetConfigs: WidgetConfigList,
}

type DispatchProps = {
    updateWidgetConfig: UpdateWidgetConfigAction,
}

const App = withStyles(styles)(React.memo((props: StateProps & DispatchProps & WithStyles<typeof styles>) => {

    const {dashboardConfig, widgetConfigs, updateWidgetConfig} = props;

    return <div className={props.classes.root}>
        <ControlBar />
        {dashboardConfig ? <Dashboard config={dashboardConfig} widgets={widgetConfigs} updateWidgetConfig={updateWidgetConfig} /> : null}
    </div>
}))

function mapStateToProps(state: State): StateProps {
    const { currentDashboardId, dashboards, widgets } = state;
    return {
        dashboardConfig: dashboards[currentDashboardId],
        widgetConfigs: Object.values(widgets).filter(w => w.dashboardId == currentDashboardId),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({updateWidgetConfig}, dispatch)

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(App);
