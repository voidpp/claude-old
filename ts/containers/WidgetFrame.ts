import { connect } from 'react-redux';
import { ThunkDispatcher } from '../types';

import WidgetFrame, {DispatchProps} from '../components/WidgetFrame';
import { updateWidgetConfig } from '../actions';

const mapDispatchToProps = (dispatch: ThunkDispatcher): DispatchProps => {
    return {
        updateWidgetConfig: (id, config) => dispatch(updateWidgetConfig(id, config))
    }
}

export default connect<{}, DispatchProps>(null, mapDispatchToProps)(WidgetFrame);
