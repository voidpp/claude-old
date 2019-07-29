import { connect } from 'react-redux';
import { State } from '../types';

import DashboardSelector, {DispatchProps, StateProps} from '../components/DashboardSelector';
import { selectDashboard, addDashboard } from '../actions';
import { bindActionCreators } from 'redux';

function mapStateToProps(state: State): StateProps {
    const { currentDashboardId, dashboards } = state;
    return {
        currentDashboardId,
        dashboards,
    }
}

// TODO: typize
const mapDispatchToProps = dispatch => bindActionCreators({selectDashboard, addDashboard}, dispatch)

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(DashboardSelector);
