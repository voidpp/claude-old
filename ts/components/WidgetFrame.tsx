import {createStyles, Theme, withStyles, WithStyles} from '@material-ui/core';
import { ResizeDirection } from "re-resizable";
import * as React from "react";
import { DraggableEvent } from "react-draggable";
import { DraggableData, Position, ResizableDelta, Rnd, RndResizeCallback } from "react-rnd";
import { UpdateWidgetConfigAction, WidgetConfig, DashboardConfig } from "../types";
import {claudeThemes} from "../tools";


const styles = () => createStyles({
    body: {
        color: (props: OwnProps) => claudeThemes[props.dashboardConfig.theme].color,
        backgroundColor: (props: OwnProps) => claudeThemes[props.dashboardConfig.theme].backgroundColor,
        borderRadius: 5,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&:hover .widget-menu': {
            opacity: 1,
        }
    },
});

export interface OwnProps {
    config: WidgetConfig,
    children: React.ReactNode,
    removeButton?: boolean,
    onResize?: RndResizeCallback,
    updateWidgetConfig: UpdateWidgetConfigAction,
    dashboardConfig: DashboardConfig,
}

function isEquals(o1: Object, o2: Object): boolean {
    for (const k of Object.keys(o1)) {
        if (o1[k] !== o2[k])
            return false
    }
    return true
}

function WidgetFrame(props: OwnProps & WithStyles<typeof styles>) {
    const {config, dashboardConfig, updateWidgetConfig, classes} = props;
    const [position, setPosition] = React.useState({
        x: config.x,
        y: config.y,
    });
    const [size, setSize] = React.useState({
        width: config.width,
        height: config.height,
    });

    const updatePosition = (newData: typeof position) => {
        if (isEquals(newData, position))
            return;
        setPosition(newData);
        updateWidgetConfig(config.id, newData)
    };

    const onDragStop = (e: DraggableEvent, data: DraggableData) => {
        updatePosition({
            x: data.lastX,
            y: data.lastY,
        })
    };

    const onDrag = (e: DraggableEvent, data: DraggableData) => {
        updatePosition( {
            x: data.x,
            y: data.y,
        })
    };

    const onResizeStop = (e: MouseEvent, dir: ResizeDirection, elementRef: HTMLDivElement, delta: ResizableDelta, newPosition: Position) => {
        onResize(e, dir, elementRef, delta, newPosition);
    };

    const onResize = (e: MouseEvent, dir: ResizeDirection, elementRef: HTMLDivElement, delta: ResizableDelta, newPosition: Position) => {
        const newData = {
            x: newPosition.x,
            y: newPosition.y,
            width: elementRef.offsetWidth,
            height: elementRef.offsetHeight,
        };
        if (isEquals(newData, {...position, ...size}))
            return;

        updateWidgetConfig(config.id, newData);

        setPosition({...newData});
        setSize({...newData});
    };

    return <Rnd
        position={{
            x: config.x,
            y: config.y
        }}
        size={{
            width: config.width,
            height: config.height,
        }}
        dragGrid={[dashboardConfig.stepSize, dashboardConfig.stepSize]}
        resizeGrid={[dashboardConfig.stepSize, dashboardConfig.stepSize]}
        onDragStop={onDragStop}
        onResizeStop={onResizeStop}
        onDrag={onDrag}
        onResize={onResize}
        style={{userSelect: 'none'}}
        enableUserSelectHack={false}
    >
        <div className={classes.body}>
            { props.children }
        </div>
    </Rnd>
}

export default withStyles(styles)(WidgetFrame)
