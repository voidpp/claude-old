import { connect } from 'react-redux';

import App, {StateProps} from '../components/App';

import { State } from '../types';

function mapStateToProps(state: State): StateProps {
    const { currentDashboardId, dashboards, widgets } = state;
    return {
        dashboardConfig: dashboards[currentDashboardId],
        widgetConfigs: Object.values(widgets).filter(w => w.dashboardId == currentDashboardId),
    }
}

export default connect<StateProps>(mapStateToProps)(App);
