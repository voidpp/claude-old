import { Button, Menu, MenuItem, Divider, ListItemIcon } from "@material-ui/core";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import * as React from "react";
import { DashboardSelectorQuery } from "./__generated__/DashboardSelectorQuery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type DispatchProps = {
    selectDashboard: (id: number) => void,
}

export type Props = {
    currentDashboardId: number,
}

export default function DashboardSelector(props: Props & DispatchProps) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function chooseMenu(id: string) {
        props.selectDashboard(parseInt(id))
        handleClose()
    }

    function onNewDashboardClick() {
        alert('TODO')
    }

    return (
        <React.Fragment>
            <Button aria-controls="DashboardSelectorQuery" aria-haspopup="true" variant="contained" size="small" color="primary"
                    onClick={handleClick}>
                dashboards
            </Button>
            <Menu
                id="DashboardSelectorQuery"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem key={0} onClick={onNewDashboardClick}>Create new dashboard</MenuItem>
                <Query<DashboardSelectorQuery> query={gql`query DashboardSelectorQuery { dashboards { id, name } }`} >
                    {({ loading, error, data }) => {
                        if (loading) return <p>Loading...</p>;
                        if (error) return <p>Error :(</p>;
                        return (
                            <React.Fragment>
                                {data.dashboards.length ? <Divider/> : null}
                                {data.dashboards.map(d =>
                                    <MenuItem key={d.id} onClick={chooseMenu.bind(this, d.id)}>
                                        <ListItemIcon>
                                            {parseInt(d.id) == props.currentDashboardId ? <FontAwesomeIcon icon="check" /> : <span/>}
                                        </ListItemIcon>
                                        {d.name}
                                    </MenuItem>
                                )}
                            </React.Fragment>
                        )
                    }}
                </Query>
            </Menu>
        </React.Fragment>
    )
}
