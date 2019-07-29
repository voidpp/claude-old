import * as React from "react";
import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import { WidgetConfig, DashboardConfig } from "../types";
import widgetRegistry from '../widgetRegistry'

const styles = () => createStyles({

});

export interface Props {
    config: DashboardConfig,
}

export default withStyles(styles)(React.memo((props: Props & WithStyles<typeof styles>) => {

    function factory(wconf: WidgetConfig) {
        return React.createElement(widgetRegistry[wconf.type].factory, {
            config: wconf,
            stepSize: 10, //config.stepSize,
            key: wconf.id,
        });
    }

    return (<div>{[].map(factory)}</div>)
}))
