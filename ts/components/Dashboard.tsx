import * as React from "react";
import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import { WidgetConfig, DashboardConfig, WidgetConfigList, UpdateWidgetConfigAction } from "../types";
import widgetRegistry from '../widgetRegistry'

const styles = () => createStyles({
    body: {
        height: '100%',
    }
});

export interface Props {
    config: DashboardConfig,
    widgets: WidgetConfigList,
    updateWidgetConfig: UpdateWidgetConfigAction,
}

export default withStyles(styles)(React.memo((props: Props & WithStyles<typeof styles>) => {

    function factory(wconf: WidgetConfig) {
        return React.createElement(widgetRegistry[wconf.type].factory, { // TODO: factory type is 'any'
            config: wconf,
            dashboardConfig: props.config,
            key: wconf.id,
            updateWidgetConfig: props.updateWidgetConfig,
        });
    }

    return (
        <div className={props.classes.body} style={{background: props.config.background || ''}} >
            {props.widgets.map(factory)}
        </div>
    )
}))
