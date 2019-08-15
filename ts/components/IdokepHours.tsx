import {createStyles, withStyles, WithStyles} from '@material-ui/core';
import * as React from "react";
import {CommonWidgetProps, BaseWidgetSettings, IdokepHoursResponse, IdokepHourData} from "../types";
import WidgetFrame from "../containers/WidgetFrame";
import WidgetMenu from "./WidgetMenu";
import api from '../api';
import { IfComp, useInterval } from './tools';

export type ShowableRows = 'image' | 'precipitationValue' | 'precipitationProbability' | 'temperatureChart';

type Props = CommonWidgetProps<Settings>;

const styles = () => createStyles({
    body: {
        display: 'grid',
        gridTemplateColumns: (p: Props) => `repeat(${p.config.settings.hours/3}, 1fr)`,
        gridTemplateRows: 'repeat(4, min-content) auto',
        justifyItems: 'center',
        padding: '1em 0',
        height: '100%',
    },
    hour: {
        gridRowStart: 1,
    },
    image: {
        gridRowStart: 2,
        '& img': {
            width: 48,
        }
    },
    precipitationProbability: {
        gridRowStart: 3,
    },
    precipitationValue: {
        gridRowStart: 4,
    },
    temperatureChart: {
        gridRowStart: 5,
        display: 'flex',
        flexDirection: 'column',
        width: '60%',
        '& .text': {
            textAlign: 'center',
        },
        '& .bar': {

            backgroundColor: 'grey',
        }
    },
});


export class Settings extends BaseWidgetSettings {
    city: string = 'Budapest';
    pollInterval: number = 60*10;
    showCity: boolean = false;
    hours: number = 24;
    rowsToShow: {[key in ShowableRows]: boolean} = {
        image: true,
        precipitationProbability: true,
        precipitationValue: true,
        temperatureChart: true,
    };
}

export default withStyles(styles)((props: Props & WithStyles<typeof styles>) => {

    const { config, classes, dashboardConfig } = props;
    const { rowsToShow } = config.settings;

    const [data, setData] = React.useState<IdokepHoursResponse>([]);

    function fetchData(settings: Settings = config.settings) {
        api.getIdokepHours(settings.city).then(setData);
    }

    function onBeforeSettingsSubmit(settings: Settings) {
        if (settings.city != config.settings.city)
            fetchData(settings)
    }

    useInterval(fetchData, config.settings.pollInterval * 1000);

    React.useEffect(fetchData, []);

    const displayData = data.slice(0, config.settings.hours / 3);

    const temps = displayData.map(d => d.temp);

    const maxTemp = Math.max(...temps) + 1;
    const minTemp = Math.min(...temps) - 1;

    let cells = [];
    let idx = 0;

    for (const hourData of displayData) {
        cells.push(
            <div key={idx++} className={classes.hour}>{hourData.hour}h</div>,
            <div key={idx++} className={classes.image}><img src={hourData.img}/></div>,
            <div key={idx++} className={classes.temperatureChart}>
                <div style={{flexGrow: 1}} />
                <div className="text">{hourData.temp}</div>
                <div className="bar" style={{height: `${(hourData.temp - minTemp)/(maxTemp-minTemp)*100}%`}}/>
            </div>,
        )
    }

    return (
        <WidgetFrame config={config} dashboardConfig={dashboardConfig} >
            <div className={classes.body}>
                {...cells}
            </div>
            <WidgetMenu id={config.id} settings={config.settings} settingsFormFields={[]} />
        </WidgetFrame>
    )
});
