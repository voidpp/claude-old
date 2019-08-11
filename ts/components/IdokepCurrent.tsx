import {createStyles, withStyles, WithStyles} from '@material-ui/core';
import * as React from "react";
import {CommonWidgetProps, BaseWidgetSettings, IdokepCurrentResponse} from "../types";
import WidgetFrame from "../containers/WidgetFrame";
import WidgetMenu from "./WidgetMenu";
import { useInterval } from './tools';
import api from '../api';
import { WidgetStyle } from '../tools';

const styles = () => createStyles({
    body: {
        fontSize: WidgetStyle.getRelativeSize(0.3).width,
    },
    value: {
        textAlign: 'center',
    },
    img: {
        textAlign: 'center',
        marginTop: '-0.2em',
        '& img': {
            width: WidgetStyle.getRelativeSize(0.9).width
        },
    },
});


export class Settings extends BaseWidgetSettings {
    city: string = 'Budapest';
    pollInterval: number = 60*10;
}

export default withStyles(styles)((props: CommonWidgetProps<Settings> & WithStyles<typeof styles>) => {

    const { config, classes, dashboardConfig } = props;

    const [data, setData] = React.useState<IdokepCurrentResponse>();

    function fetchData(settings: Settings = config.settings) {
        api.getIdokepCurrent(settings.city).then(setData);
    }

    useInterval(fetchData, config.settings.pollInterval * 1000);

    React.useEffect(fetchData, []);

    return (
        <WidgetFrame config={config} dashboardConfig={dashboardConfig} >
            <div className={classes.body}>
                {data ? (<React.Fragment>
                    <div className={classes.value}>{data.value}°C</div>
                    <div className={classes.img}><img src={data.img} /></div>
                    </React.Fragment>) : null}
            </div>
            <WidgetMenu id={config.id} settings={config.settings} settingsFormFields={[]} />
        </WidgetFrame>
    )
});
