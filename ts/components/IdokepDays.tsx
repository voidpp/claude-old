import {createStyles, withStyles, WithStyles} from '@material-ui/core';
import * as moment from 'moment';
import * as React from "react";
import {CommonWidgetProps, BaseWidgetSettings, IdokepDaysResponse, IdokepDayData} from "../types";
import WidgetFrame from "../containers/WidgetFrame";
import WidgetMenu from "./WidgetMenu";
import {useInterval} from './tools';
import api from '../api';
import { WidgetStyle } from '../tools';
import {LineChart, Line, YAxis, XAxis} from 'recharts';

const baseFontRatio = 0.06;

const styles = () => createStyles<string, CommonWidgetProps<Settings>>({
    body: {
        fontSize: WidgetStyle.getRelativeSize(baseFontRatio).height,
    },
    header: {
        paddingTop: '0.6em',
        display: 'flex',
        justifyContent: 'space-around',
        '& > div': {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
        },
    },
    weatherImage: {
        width: '2.5em',
    },
    precipitation: {
        fontSize: '0.7em',
        textAlign: 'center',
    }
});

export class Settings extends BaseWidgetSettings {
    city: string = 'Budapest';
    pollInterval: number = 60*10;
    showCity: boolean = false;
    days: number = 7;
}

function CustomizedLabel(props) {
    const {x, y, stroke, value} = props;
    // TODO fill color! (use theme)
    return <text x={x} y={y} dy={'-0.5em'} fill={"white"} textAnchor="middle">{value}</text>
}

export default withStyles(styles)((props: CommonWidgetProps<Settings> & WithStyles<typeof styles>) => {

    moment.locale('en-gb');

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
                <div>{moment(props.day.date).format('dd')}</div>
                <div><img className={classes.weatherImage} src={props.day.img} /></div>
                {props.day.precipitation.probability ? <div className={classes.precipitation}>
                        <div>{`${props.day.precipitation.value}mm`}</div>
                        <div>{`(${props.day.precipitation.probability}%)`}</div>
                    </div> : null}
            </div>
        )
    }

    const baseForMargin = config.height * baseFontRatio;
    const vertMargin = config.width / config.settings.days / 2;

    return (
        <WidgetFrame config={config} dashboardConfig={dashboardConfig} >
            <div className={classes.body}>
                <div className={classes.header}>
                    {displayData.map(day => <DayInfoCell key={day.date} day={day} />)}
                </div>
                <LineChart
                    data={displayData}
                    width={config.width}
                    height={config.height - (config.height * 0.53)}
                    margin={{
                        top: baseForMargin * 1.3,
                        right: vertMargin,
                        bottom: baseForMargin * 0.2,
                        left: vertMargin,
                    }}
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
