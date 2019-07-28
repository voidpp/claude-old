import { connect } from 'react-redux';
import { ThunkDispatcher } from '../types';

import DashboardSelector, {DispatchProps} from '../components/DashboardSelector';
import { selectDashboard } from '../actions';

const mapDispatchToProps = (dispatch: ThunkDispatcher): DispatchProps => {
    return {
        selectDashboard: id => dispatch(selectDashboard(id))
    }
}

export default connect<{}, DispatchProps>(null, mapDispatchToProps)(DashboardSelector);
