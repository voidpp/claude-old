import { connect } from 'react-redux';
import { Dispatcher } from '../types';

import WidgetRemoveButton, {DispatchProps} from '../components/WidgetRemoveButton';
import { removeWidget } from '../actions';

const mapDispatchToProps = (dispatch: Dispatcher): DispatchProps => {
    return {
        removeWidget: id => dispatch(removeWidget(id))
    }
}

export default connect<{}, DispatchProps>(null, mapDispatchToProps)(WidgetRemoveButton);
