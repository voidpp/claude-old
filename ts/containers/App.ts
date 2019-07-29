import { connect } from 'react-redux';

import App, {StateProps} from '../components/App';

import { State } from '../types';

function mapStateToProps(state: State): StateProps {
    const { currentDashboardId, dashboards } = state;
    return {
        currentDashboard: dashboards[currentDashboardId],
    }
}

export default connect<StateProps>(mapStateToProps)(App);
