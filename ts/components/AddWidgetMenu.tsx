import { Button, Menu, MenuItem } from "@material-ui/core";
import * as React from "react";
import widgetRegistry from "../widgetRegistry";

export type OwnProps = {
    addWidget: (type: string) => void,
}

export default function AddWidgetMenu(props: OwnProps) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    return (
        <React.Fragment>
            <Button aria-controls="simple-menu" aria-haspopup="true" variant="contained" size="small" color="primary"
                    onClick={handleClick}>
                add widget
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {Object.keys(widgetRegistry).map(k => (
                    <MenuItem key={k} onClick={props.addWidget.bind(this, k)}>{widgetRegistry[k].title}</MenuItem>
                ))}
            </Menu>
        </React.Fragment>
    )
}
