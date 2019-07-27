import { connect } from 'react-redux';
import { State } from '../types';

import WidgetList, {StateProps} from '../components/WidgetList';

function mapStateToProps(state: State): StateProps {
    const { config } = state;
    return {
        config,
    }
}

export default connect<StateProps>(mapStateToProps)(WidgetList);
