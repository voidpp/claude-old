
import {createStyles, withStyles, WithStyles} from '@material-ui/core';
import * as React from "react";
import {CommonWidgetProps} from "../types";
import WidgetFrame from "./WidgetFrame";
import WidgetMenu from "./WidgetMenu";
import {useInterval} from "./tools";
import {useState} from "react";
import * as moment from 'moment';
import {Moment} from "moment";
import * as classNames from 'classnames';
import {WidgetStyle} from "../tools";

type Props = CommonWidgetProps<Settings>;

const bodyPadding = 5;

const gridTemplateRows = (props: Props) => {
    return `repeat(7, ${(props.config.width - 2 * bodyPadding) / 7}px)`;
}

const styles = () => createStyles({
    body: {
        padding: bodyPadding,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        fontSize: WidgetStyle.getRelativeSize(0.06),
    },
    currentDateRow: {
        textAlign: 'center',
        paddingBottom: '0.5em',
    },
    weekRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        justifyItems: 'center',
    },
    daysGrid: {
        flexGrow: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        // gridTemplateRows: gridTemplateRows,
        justifyItems: 'stretch',
        alignItems: 'stretch',
        '& > div': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: WidgetStyle.getRelativeSize(0.06),
        },
    },
    notCurrentMonthDay: {
        opacity: 0.2,
    },
    currentDay: {
        borderRadius: 5,
        backgroundColor: WidgetStyle.getThemeProp('backgroundColor'),
    }
});


export type Settings = {
    dateFormat: string, // for currentDateRow
    locale: string, // use a list...
}

export default withStyles(styles)((props: Props & WithStyles<typeof styles>) => {

    moment.locale('en-gb');

    const now = moment(new Date().getTime())

    const today = () => {
        return now.format('YYYY-MM-DD');
    };

    const { config, classes, dashboardConfig, updateWidgetConfig } = props;
    const [currentDate, setCurrentDate] = useState(today());

    useInterval(() => {
        const newVal = today();
        if (currentDate != newVal)
            setCurrentDate(newVal);
    }, 1000);

    const firstDayOfWeekForMonth = parseInt(now.clone().startOf('month').format('E'))

    let cyc = now.clone().startOf('month');
    cyc.subtract(firstDayOfWeekForMonth-1, 'd');

    let days = [];
    let nextMonthStart = now.clone().add(1, 'M').startOf('month');

    while(days.length < 100) {
        if (cyc.isAfter(nextMonthStart) && cyc.format('E') == '1')
            break;

        days.push(cyc.clone());
        cyc.add(1, 'd')

    }

    const currentMonth = now.format('M');

    const renderDay = (day: Moment) => {
        const month = day.format('M');
        const dayNumber = day.format('D');
        const className = classNames({
            [classes.notCurrentMonthDay]: currentMonth != month,
            [classes.currentDay]: dayNumber == now.format('D'),
        });
        return (
            <div className={className} key={`${month}.${dayNumber}`}>{dayNumber}</div>
        )
    };

    return (
        <WidgetFrame config={config} dashboardConfig={dashboardConfig} updateWidgetConfig={updateWidgetConfig}>
            <div className={classes.body}>
                <div className={classes.currentDateRow}>{now.format('MMMM')}</div>
                <div className={classes.weekRow}>
                    {moment.weekdaysShort(true).map(name => <div key={name}>{name}</div>)}
                </div>
                <div className={classes.daysGrid}>
                    {days.map(renderDay)}
                </div>
            </div>
            <WidgetMenu id={config.id} settings={config.settings} settingsFormFields={[]} />
        </WidgetFrame>
    )
});
