import * as React from 'react';
import { Grow } from "@material-ui/core";
import { useRef, useEffect } from "react";

export const dialogTransition = p => <Grow {...p} />

export function useInterval(callback: any, delay: number) {
    const savedCallback = useRef<any>();

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        let id = setInterval(tick, delay);
        return () => clearInterval(id);
    }, [delay]);
}
