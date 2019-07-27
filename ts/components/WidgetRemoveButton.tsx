import * as React from "react";
import { createStyles, withStyles, WithStyles } from '@material-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const styles = () => createStyles({
    body: {
        fontSize: 20,
        cursor: 'pointer',
    }
});

export interface DispatchProps {
    removeWidget: (id: number) => void
}

export interface OwnProps {
    id: number,
}

export default withStyles(styles)(React.memo((props: OwnProps & DispatchProps & WithStyles<typeof styles>) => {
    return <span onClick={() => props.removeWidget(props.id)} className={props.classes.body}>
        <FontAwesomeIcon icon="times" />
    </span>
}))
