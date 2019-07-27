import * as React from "react";
import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import { WidgetBaseProps } from "../types";

const styles = () => createStyles({
    body: {
        // fontSize: '25.5vw',
    }
});

type Settings = {
    showDate: boolean,
}

export interface OwnProps extends WidgetBaseProps {
    settings: Settings,
}

export default withStyles(styles)(React.memo((props: OwnProps & WithStyles<typeof styles>) => {
    return <div className={props.classes.body}>
        13:42
    </div>
}))
