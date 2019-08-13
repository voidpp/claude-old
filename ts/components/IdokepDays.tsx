import {createStyles, withStyles, WithStyles} from '@material-ui/core';
import * as React from "react";
import {CommonWidgetProps, BaseWidgetSettings, IdokepDaysResponse, IdokepDayData} from "../types";
import WidgetFrame from "../containers/WidgetFrame";
import WidgetMenu from "./WidgetMenu";
import {useInterval} from './tools';
import api from '../api';
import { WidgetStyle } from '../tools';
import {LineChart, Line, YAxis, XAxis} from 'recharts';
import {PureComponent} from "react";

const styles = () => createStyles<string, CommonWidgetProps<Settings>>({
    body: {
        fontSize: 16,
    },
    header: {
        paddingTop: 10,
        display: 'grid',
        gridTemplateColumns: p => `repeat(${p.config.settings.days}, 1fr)`,
        '& > div': {
            textAlign: 'center',
            '& img': {
                width: 40,
            },
        },
    },
});


export class Settings extends BaseWidgetSettings {
    city: string = 'Budapest';
    pollInterval: number = 60*10;
    showCity: boolean = false;
    days: number = 7;
}

function CustomizedLabel(props) {

    const {x, y, stroke, value} = props;

   	return <text x={x} y={y} dy={-8} fill={"white"} fontSize={16} textAnchor="middle">{value}</text>

}

export default withStyles(styles)((props: CommonWidgetProps<Settings> & WithStyles<typeof styles>) => {

    const { config, classes, dashboardConfig } = props;

    const [data, setData] = React.useState<IdokepDaysResponse>([]);

    function fetchData(settings: Settings = config.settings) {
        api.getIdokepDays(settings.city).then(setData);
    }

    function onBeforeSettingsSubmit(settings: Settings) {
        if (settings.city != config.settings.city)
            fetchData(settings)
    }

    useInterval(fetchData, config.settings.pollInterval * 1000);

    React.useEffect(fetchData, []);

    const displayData = data.slice(0, config.settings.days);

    function DayInfoCell(props: {day: IdokepDayData}) {
        return (
            <div>
                <div>{props.day.day}</div>
                <div><img src={props.day.img} /></div>
            </div>
        )
    }


    return (
        <WidgetFrame config={config} dashboardConfig={dashboardConfig} >
            <div className={classes.body}>
                <div className={classes.header}>
                    {displayData.map(day => <DayInfoCell key={day.date} day={day} />)}
                </div>
                <LineChart
                    data={displayData}
                    width={config.width}
                    height={config.height-90}
                    margin={{ top: 30, right: 30, bottom: 5, left: 30 }}
                >
                    <YAxis type="number" domain={['dataMin', 'dataMax']} hide />
                    <Line type="monotone" dataKey="max" stroke="red" strokeWidth={3} label={CustomizedLabel} />
                    <Line type="monotone" dataKey="min" stroke="blue" strokeWidth={3} label={CustomizedLabel} />
                </LineChart>
            </div>
            <WidgetMenu id={config.id} onBeforeSubmit={onBeforeSettingsSubmit} settings={config.settings} settingsFormFields={[{
                name: 'city',
                label: 'City',
            }, {
                name: 'days',
                label: 'Days to show',
            }, {
                name: 'pollInterval',
                label: 'Interval',
            }, {
                name: 'showCity',
                label: 'Show city name',
            }]} />
        </WidgetFrame>
    )
});
