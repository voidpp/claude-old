import * as React from "react";
import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import { WidgetConfig } from "../types";
import widgetRegistry from '../widgetRegistry'
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { WidgetListQuery, WidgetListQuery_dashboard_widgets } from "./__generated__/WidgetListQuery";

const styles = () => createStyles({

});

export interface Props {
    dashboardId: number,
}

export default withStyles(styles)(React.memo((props: Props & WithStyles<typeof styles>) => {

    function factory(wconf: WidgetConfig) {
        return React.createElement(widgetRegistry[wconf.type].factory, {
            config: wconf,
            stepSize: 10, //config.stepSize,
            key: wconf.id,
        });
    }

    function factory2(w: WidgetListQuery_dashboard_widgets) {
        return React.createElement(widgetRegistry[w.type].factory, {
            config: w,
            stepSize: 10, //config.stepSize,
            key: w.id,
        });
    }

    console.log(props.dashboardId)


    return (<div>

        <Query<WidgetListQuery>
            query={gql`query WidgetListQuery($id: Int) { dashboard(id: $id) { name, stepSize, widgets { id, type, x, y, width, height, settings } } }`}
            variables={{id: props.dashboardId}}
        >
            {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error :(</p>;

                if (data.dashboard == null)
                    return null;

                return data.dashboard.widgets.map(factory2)
            }}
        </Query>

    </div>)
}))
