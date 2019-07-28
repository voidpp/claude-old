import * as React from "react";
import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import { CommonWidgetProps } from "../types";
import WidgetFrame from "../containers/WidgetFrame";
import { ResizableDelta, Position } from "react-rnd";
import { ResizeDirection } from "re-resizable";

import * as moment from 'moment';

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
    }
});

type Settings = {
    showDate: boolean,
    timeFormat: string,
    dateFormat: string,
}

type State = {
    time: number,
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
            time: new Date().getTime(),
        }
    }

    componentDidMount() {
        this.timerId = window.setInterval(() => this.setState({time: new Date().getTime()}), 1000);
    }

    componentWillUnmount() {
        window.clearInterval(this.timerId);
    }

    render() {
        const {config, classes, stepSize} = this.props;

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
            this.dateElement.style.fontSize = `${elementRef.clientHeight * 0.17}px`;

            this.lastWidth = elementRef.clientWidth;
            this.lastHeight = elementRef.clientHeight;
        }

        const dateComp = () => {
            return (
                <div className={classes.date} ref={r => {this.dateElement = r}}>
                    {moment(this.state.time).format(config.settings.dateFormat)}
                </div>
            )
        }

        return (
            <WidgetFrame config={config} stepSize={stepSize} onResize={onResize}>
                <div className={classes.body} ref={setFontSize}>
                    <div className={classes.clock} ref={r => {this.clockElement = r}}>
                        {moment(this.state.time).format(config.settings.timeFormat)}
                    </div>
                    {config.settings.showDate ? dateComp() : null}
                </div>
            </WidgetFrame>
        )
    }
}

export default withStyles(styles)(ClockWidget);
