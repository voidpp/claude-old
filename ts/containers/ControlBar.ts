import { connect } from 'react-redux';
import { ThunkDispatcher } from '../types';

import ControlBar, {DispatchProps, OwnProps} from '../components/ControlBar';
import { addWidget } from '../actions';


const mapDispatchToProps = (dispatch: ThunkDispatcher): DispatchProps => {
    return {
        addWidget: type => dispatch(addWidget(type)),
    }
}

export default connect<{}, DispatchProps, OwnProps>(null, mapDispatchToProps)(ControlBar);
