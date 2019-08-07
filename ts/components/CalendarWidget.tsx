
import {createStyles, withStyles, WithStyles} from '@material-ui/core';
import * as React from "react";
import {CommonWidgetProps} from "../types";
import WidgetFrame from "./WidgetFrame";
import WidgetMenu from "./WidgetMenu";
import {useInterval} from "./tools";
import {useState} from "react";
import * as moment from 'moment';


const styles = () => createStyles({
    body: {
        padding: 5,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    currentDateRow: {
        textAlign: 'center',
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
        justifyItems: 'center',
        alignItems: 'center',
        justifyContent: 'stretch',
    },
});


export type Settings = {
    dateFormat: string, // for currentDateRow
    locale: string, // use a list...
}

export default withStyles(styles)((props: CommonWidgetProps<Settings> & WithStyles<typeof styles>) => {

    moment.locale('en-gb');

    const now = moment(new Date().getTime())

    const today = () => {
        return now.format('YYYY-MM-DD');
    };

    const { config, classes, stepSize, updateWidgetConfig } = props;
    const [currentDate, setCurrentDate] = useState(today());

    useInterval(() => {
        const newVal = today();
        if (currentDate != newVal)
            setCurrentDate(newVal);
    }, 1000);

    console.log('render calendar')

    const firstDayOfWeekForMonth = parseInt(now.startOf('month').format('E'))

    let cyc = now.clone();
    cyc.subtract(firstDayOfWeekForMonth-1, 'd');

    let days = [];
    let nextMonthStart = now.clone().add(1, 'M').startOf('month');

    while(days.length < 100) {
        if (cyc.isAfter(nextMonthStart) && cyc.format('E') == '1')
            break;

        days.push([cyc.format('M'), cyc.format('D')])
        cyc.add(1, 'd')

    }

    const currentMonth = now.format('M')

    return (
        <WidgetFrame config={config} stepSize={stepSize} updateWidgetConfig={updateWidgetConfig}>
            <div className={classes.body}>
                <div className={classes.currentDateRow}>{now.format('MMMM')}</div>
                <div className={classes.weekRow}>
                    {moment.weekdaysShort(true).map(name => <div key={name}>{name}</div>)}
                </div>
                <div className={classes.daysGrid}>
                    {days.map(([m, d]) => <div style={{opacity: currentMonth == m ? 1 : 0.2}} key={`${m}.${d}`}>{d}</div>)}
                </div>
            </div>
            <WidgetMenu id={config.id} settings={config.settings} settingsFormFields={[]} />
        </WidgetFrame>
    )
});
