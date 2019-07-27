import * as React from "react";
import { createStyles, withStyles, WithStyles, Button, Drawer, Menu, MenuItem } from '@material-ui/core';
import { red } from "@material-ui/core/colors";
import { useState } from "react";

import AddWidgetMenu from './AddWidgetMenu'

export type DispatchProps = {
    addWidget: (type: string) => void,
}

const styles = () => createStyles({
    opener: {
        position: 'fixed',
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        backgroundColor: red[700],
    },
    title: {
        padding: 15,
    },
    menubar: {
        display: 'flex',
        alignItems: 'center',
    }
});

export default withStyles(styles)((props: WithStyles<typeof styles> & DispatchProps) => {
    const [opened, setOpened] = useState(false);
    const {classes} = props;

    function onAddWidget(type: string) {
        props.addWidget(type);
        setOpened(false);
    }

    return (<div>
        <div className={classes.opener} onClick={() => setOpened(true)} />
        <Drawer anchor="top" open={opened} onClose={() => setOpened(false)}>
            <div className={classes.menubar}>
                <span className={classes.title}>Zsomapell Klod!</span>
                <AddWidgetMenu onAddWidget={onAddWidget} />
            </div>
        </Drawer>
    </div>)
});
