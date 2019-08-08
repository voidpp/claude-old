import { createStyles, Link, withStyles, WithStyles } from '@material-ui/core';
import * as moment from 'moment';
import * as React from "react";
import { CommonWidgetProps } from "../types";
import WidgetFrame from "./WidgetFrame";
import WidgetMenu from "./WidgetMenu";

const styles = () => createStyles({
    body: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    clock: {
        textAlign: 'center',
        lineHeight: '90%',
        fontFamily: 'Digital7',
        fontSize: (props: CommonWidgetProps<Settings>) => props.config.height * 0.8,
    },
    date: {
        textAlign: 'center',
        lineHeight: '95%',
        fontWeight: 'bold',
        fontSize: (props: CommonWidgetProps<Settings>) => props.config.height * 0.17,
    },
});

type Settings = {
    showDate: boolean,
    timeFormat: string,
    dateFormat: string,
}

type State = {
    time: string,
}

class ClockWidget extends React.Component<CommonWidgetProps<Settings> & WithStyles<typeof styles>, State> {

    private timerId: number;

    constructor(props) {
        super(props);
        this.timerId = 0;
        this.state = {
            time: this.now,
        }
    }

    private get now(): string {
        return moment(new Date().getTime()).format(this.props.config.settings.timeFormat);
    }

    componentDidMount() {
        this.timerId = window.setInterval(() => {
            const now = this.now;
            if (now != this.state.time)
                this.setState({time: this.now})
        }, 1000);
    }

    componentWillUnmount() {
        window.clearInterval(this.timerId);
    }

    render() {
        const {config, classes, dashboardConfig, updateWidgetConfig} = this.props;

        const dateComp = () => {
            return (
                <div className={classes.date}>
                    {moment(new Date().getTime()).format(config.settings.dateFormat)}
                </div>
            )
        }

        const settingsDialogText = <span>
            For more info about date & time formats<br/>see the <Link href="https://momentjs.com/docs/#/displaying/format/"
            target="blank">Moment.js</Link> documentation.
        </span>

        return (
            <WidgetFrame
                config={config}
                dashboardConfig={dashboardConfig}
                updateWidgetConfig={updateWidgetConfig}
            >
                <div className={classes.body}>
                    <div className={classes.clock}>
                        {this.state.time}
                    </div>
                    {config.settings.showDate ? dateComp() : null}
                </div>
                <WidgetMenu id={config.id} settings={config.settings} dialogText={settingsDialogText} settingsFormFields={[{
                    name: "timeFormat",
                    label: "Time format",
                }, {
                    name: "dateFormat",
                    label: "Date format",
                }, {
                    name: "showDate",
                    label: "Show date",
                }]} />
            </WidgetFrame>
        )
    }
}

export default withStyles(styles)(ClockWidget);
