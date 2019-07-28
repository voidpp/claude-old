import * as React from "react";
import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import WidgetList from "./WidgetList";
import ControlBar from "../containers/ControlBar";

const styles = () => createStyles({
    root: {
        height: '100%',
    }
});

export type StateProps = {
    currentDashboardId: number,
}

export default withStyles(styles)(React.memo((props: StateProps & WithStyles<typeof styles>) => {
    const id = props.currentDashboardId;
    return <div className={props.classes.root}>
        <ControlBar dashboardId={id} />
        {id ? <WidgetList dashboardId={id} /> : null}
    </div>
}))
