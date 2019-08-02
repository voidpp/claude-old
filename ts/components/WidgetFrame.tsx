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

function isEquals(o1: Object, o2: Object): boolean {
    for (const k of Object.keys(o1)) {
        if (o1[k] !== o2[k])
            return false
    }
    return true
}

export default withStyles(styles)((props: OwnProps & DispatchProps & WithStyles<typeof styles>) => {
    const {config, stepSize, updateWidgetConfig, classes, removeButton = true} = props;
    const [position, setPosition] = React.useState({
        x: config.x,
        y: config.y,
    })
    const [size, setSize] = React.useState({
        width: config.width,
        height: config.height,
    })

    const updatePosition = (newData: typeof position) => {
        if (isEquals(newData, position))
            return
        setPosition(newData)
        updateWidgetConfig(config.id, newData)
    }

    const onDragStop = (e: DraggableEvent, data: DraggableData) => {
        updatePosition({
            x: data.lastX,
            y: data.lastY,
        })
    }

    const onDrag = (e: DraggableEvent, data: DraggableData) => {
        updatePosition( {
            x: data.x,
            y: data.y,
        })
    }

    const onResizeStop = (e: MouseEvent, dir: ResizeDirection, elementRef: HTMLDivElement, delta: ResizableDelta, newPosition: Position) => {
        onResize(e, dir, elementRef, delta, newPosition);
    }

    const onResize = (e: MouseEvent, dir: ResizeDirection, elementRef: HTMLDivElement, delta: ResizableDelta, newPosition: Position) => {
        const newData = {
            x: newPosition.x,
            y: newPosition.y,
            width: elementRef.offsetWidth,
            height: elementRef.offsetHeight,
        }
        if (isEquals(newData, {...position, ...size}))
            return

        updateWidgetConfig(config.id, newData);

        setPosition({...newData});
        setSize({...newData});
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
        onDrag={onDrag}
        onResize={onResize}
    >
        <div className={props.classes.body}>
            { props.children }
            { removeButton ? <div className={classes.removeButtonContainer}><WidgetRemoveButton id={config.id} /></div> : null }
        </div>
    </Rnd>
})
