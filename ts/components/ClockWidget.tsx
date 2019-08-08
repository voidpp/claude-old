import { createStyles, Link, withStyles, WithStyles } from '@material-ui/core';
import * as moment from 'moment';
import { ResizeDirection } from "re-resizable";
import * as React from "react";
import { Position, ResizableDelta } from "react-rnd";
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
    },
    date: {
        textAlign: 'center',
        lineHeight: '95%',
        fontWeight: 'bold',
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

    private clockElement: HTMLElement;
    private dateElement: HTMLElement;
    private lastWidth: number;
    private lastHeight: number;
    private timerId: number;

    constructor(props) {
        super(props);
        this.lastWidth = this.props.config.width - 1;
        this.lastHeight = this.props.config.height - 1;
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

        const onResize = (e: MouseEvent, dir: ResizeDirection, elementRef: HTMLDivElement, delta: ResizableDelta, position: Position) => {
            if (delta.height || delta.width)
                setFontSize(elementRef);
        }

        const setFontSize = (elementRef: HTMLElement) => {
            if (!elementRef || !this.clockElement)
                return

            if (this.lastWidth == elementRef.clientWidth && this.lastHeight == elementRef.clientHeight)
                return;

            this.clockElement.style.fontSize = `${elementRef.clientHeight * 0.8}px`;
            if (this.dateElement)
                this.dateElement.style.fontSize = `${elementRef.clientHeight * 0.17}px`;

            this.lastWidth = elementRef.clientWidth;
            this.lastHeight = elementRef.clientHeight;
        }

        const dateComp = () => {
            return (
                <div className={classes.date} ref={r => {this.dateElement = r}}>
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
                onResize={onResize}
                updateWidgetConfig={updateWidgetConfig}
            >
                <div className={classes.body} ref={setFontSize}>
                    <div className={classes.clock} ref={r => {this.clockElement = r}}>
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
