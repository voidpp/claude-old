import { createStyles, Drawer, withStyles, WithStyles } from '@material-ui/core';
import * as React from "react";
import { useState } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { addWidget } from '../actions';
import AddWidgetMenu from '../components/AddWidgetMenu';
import { State } from '../types';
import DashboardSelector from "./DashboardSelector";

type DispatchProps = {
    addWidget: (dashboardId: string, type: string) => void,
}

type StateProps = {
    currentDashboardId: string,
    currentDashboardHasWidget: boolean,
}

const styles = () => createStyles({
    opener: {
        position: 'fixed',
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        backgroundColor: 'red',
    },
    title: {
        padding: 15,
    },
    menubar: {
        display: 'flex',
        alignItems: 'center',
    },
    spacer: {
        width: 15,
    }
});

const ControlBar = withStyles(styles)((props: StateProps &  WithStyles<typeof styles> & DispatchProps) => {
    const [opened, setOpened] = useState(false);

    const {classes, currentDashboardId, currentDashboardHasWidget} = props;

    function onAddWidget(type: string) {
        props.addWidget(currentDashboardId, type);
        setOpened(false);
    }

    function Spacer() {
        return <div className={classes.spacer} />
    }

    const openDrawer = opened || currentDashboardId == '' || !currentDashboardHasWidget;

    return (<div>
        <div className={classes.opener} onClick={() => setOpened(true)} />
        <Drawer anchor="top" open={openDrawer} onClose={() => setOpened(false)}>
            <div className={classes.menubar}>
                <span className={classes.title}>Zsomapell Klod!</span>

                <DashboardSelector />

                {currentDashboardId ?
                    <React.Fragment>
                        <Spacer />
                        <AddWidgetMenu addWidget={onAddWidget} />
                    </React.Fragment> : null}
            </div>
        </Drawer>
    </div>)
});

function mapStateToProps(state: State): StateProps {
    const { currentDashboardId, widgets } = state;
    return {
        currentDashboardId,
        currentDashboardHasWidget: Object.values(widgets).find(w => w.dashboardId == currentDashboardId) != undefined,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({addWidget}, dispatch);

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(ControlBar);
