import { connect } from 'react-redux';
import { Dispatcher } from '../types';

import WidgetFrame, {DispatchProps, OwnProps} from '../components/WidgetFrame';
import { updateWidgetConfig } from '../actions';

const mapDispatchToProps = (dispatch: Dispatcher): DispatchProps => {
    return {
        updateWidgetConfig: (id, config) => dispatch(updateWidgetConfig(id, config))
    }
}

export default connect<{}, DispatchProps, OwnProps>(null, mapDispatchToProps)(WidgetFrame);
