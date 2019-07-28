import * as React from "react";
import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import { AppConfig, WidgetConfig } from "../types";
import WidgetFrame from "../containers/WidgetFrame";
import widgetRegistry from '../widgetRegistry'

const styles = () => createStyles({

});

export interface StateProps {
    config: AppConfig,
}

export default withStyles(styles)(React.memo((props: StateProps & WithStyles<typeof styles>) => {
    const {config} = props;

    function factory(wconf: WidgetConfig) {
        return React.createElement(widgetRegistry[wconf.type].factory, {
            config: wconf,
            stepSize: config.stepSize,
            key: wconf.id,
        });
    }

    return <div>{config.widgets.map(factory)}</div>
}))
