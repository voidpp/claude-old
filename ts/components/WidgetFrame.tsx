import * as React from "react";
import { Rnd, DraggableData, ResizableDelta, Position, RndResizeCallback } from "react-rnd";
import { createStyles, withStyles, WithStyles } from '@material-ui/core';
import { WidgetConfig, BaseWidgetConfig } from "../types";

import { DraggableEvent } from "react-draggable";
import { ResizeDirection } from "re-resizable";
import WidgetRemoveButton from "../containers/WidgetRemoveButton";

const styles = () => createStyles({
    body: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 5,
        height: '100%',
        position: 'relative',
        '&:hover $removeButtonContainer': {
            opacity: 1,
        }
    },
    removeButtonContainer: {
        position: 'absolute',
        top: 0,
        right: 5,
        opacity: 0.1,
        transition: '0.3s opacity',
    },
});

export type DispatchProps = {
    updateWidgetConfig: (id: string, config: Partial<BaseWidgetConfig>) => void,
}

export interface OwnProps {
    config: WidgetConfig,
    stepSize: number,
    children: React.ReactNode,
    removeButton?: boolean,
    onResize?: RndResizeCallback,
}

export default withStyles(styles)(React.memo((props: OwnProps & DispatchProps & WithStyles<typeof styles>) => {
    const {config, stepSize, updateWidgetConfig, classes, removeButton = true, onResize} = props;

    const onDragStop = (e: DraggableEvent, data: DraggableData) => {
        if (data.deltaX == 0 && data.deltaY == 0)
            return;
        updateWidgetConfig(config.id, {
            x: data.lastX,
            y: data.lastY,
        })
    }

    const onResizeStop = (e: MouseEvent, dir: ResizeDirection, elementRef: HTMLDivElement, delta: ResizableDelta, position: Position) => {
        if (delta.width == 0 && delta.height == 0)
            return;
        updateWidgetConfig(config.id, {
            x: position.x,
            y: position.y,
            width: config.width + delta.width,
            height: config.height + delta.height,
        })
    }

    return <Rnd
        position={{
            x: config.x,
            y: config.y
        }}
        size={{
            width: config.width,
            height: config.height,
        }}
        dragGrid={[stepSize, stepSize]}
        resizeGrid={[stepSize, stepSize]}
        onDragStop={onDragStop}
        onResizeStop={onResizeStop}
        onResize={onResize}
    >
        <div className={props.classes.body}>
            { props.children }
            { removeButton ? <div className={classes.removeButtonContainer}><WidgetRemoveButton id={config.id} /></div> : null }
        </div>
    </Rnd>
}))
