
import {CommonWidgetProps, LocalStorageSchema} from "./types";

const localStorageHandler = {
    get: (target: LocalStorageSchema, name: string) => {
        const res = window.localStorage.getItem(name);
        return res == undefined ? target[name] : JSON.parse(res);
    },
    set: (target: LocalStorageSchema, name: string, value: any, receiver: any) => {
        window.localStorage.setItem(name, JSON.stringify(value));
        return true;
    },
};

export const claudeLocalStorage = new Proxy<LocalStorageSchema>(new LocalStorageSchema(), localStorageHandler);

export function copy<T>(data: T): T {
    return JSON.parse(JSON.stringify(data))
}

export type ClaudeThemeType = 'light' | 'dark';

export type ClaudeTheme = {
    backgroundColor: string,
    color: string,
}

export const claudeThemes: {[key in ClaudeThemeType]: ClaudeTheme} = {
    dark: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        color: 'white',
    },
    light: {
        backgroundColor: '',
        color: '',
    },
};

export namespace WidgetStyle {
    export function getRelativeSize<T = {}>(ratio: number, ref: 'width' | 'height' = 'width'): (p: CommonWidgetProps<T>) => number {
        return (props: CommonWidgetProps<T>) => props.config[ref] * ratio;
    }

    export function getThemeProp<T = {}>(propName: keyof ClaudeTheme) {
        return (props: CommonWidgetProps<T>) => claudeThemes[props.dashboardConfig.theme][propName];
    }
}

