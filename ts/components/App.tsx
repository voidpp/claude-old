import * as React from "react";
import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import WidgetList from "../containers/WidgetList";
import ControlBar from "../containers/ControlBar";

const styles = () => createStyles({
    root: {
        height: '100%',
    }
});

export default withStyles(styles)(React.memo((props: WithStyles<typeof styles>) => {
    return <div className={props.classes.root}>
        <ControlBar />
        <WidgetList />
    </div>
}))
