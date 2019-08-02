import { Button, Menu, MenuItem } from "@material-ui/core";
import * as React from "react";
import widgetRegistry from "../widgetRegistry";
import { State } from "../types";
import { addWidget } from '../actions';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

type DispatchProps = {
    addWidget: (dashboardId: string, widgetType: string) => void,
}

type StateProps = {
    currentDashboardId: string,
}

function AddWidgetMenu(props: StateProps & DispatchProps) {
    const dbId = props.currentDashboardId;

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
                    <MenuItem key={k} onClick={props.addWidget.bind(this, dbId, k)}>{widgetRegistry[k].title}</MenuItem>
                ))}
            </Menu>
        </React.Fragment>
    )
}

function mapStateToProps(state: State): StateProps {
    const { currentDashboardId } = state;
    return {
        currentDashboardId,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({addWidget}, dispatch);

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(AddWidgetMenu);
