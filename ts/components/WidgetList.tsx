import * as React from "react";
import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import { AppConfig } from "../types";
import WidgetFrame from "../containers/WidgetFrame";

const styles = () => createStyles({

});

export interface StateProps {
    config: AppConfig,
}

export default withStyles(styles)(React.memo((props: StateProps & WithStyles<typeof styles>) => {
    const {config} = props;
    return <div>{config.widgets.map(w => <WidgetFrame stepSize={config.stepSize} config={w} key={w.id.toString()} />)}</div>
}))
