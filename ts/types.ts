import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { Dispatch } from "react";
import {ClaudeThemeType} from "./tools";

export interface BaseWidgetConfig {
    x: number,
    y: number,
    width: number,
    height: number,
    settings: any, // this is widget specific
}

export interface WidgetConfig extends BaseWidgetConfig {
    id: string,
    type: string,
    dashboardId: string,
}

export type CommonWidgetProps<T = any> = {
    config: Omit<WidgetConfig, 'settings'> & {settings: T},
    dashboardConfig: DashboardConfig,
    updateWidgetConfig: UpdateWidgetConfigAction,
}

export type WidgetConfigList = Array<WidgetConfig>;
export type WidgetConfigMap = { [s: string]: WidgetConfig };

export class LocalStorageSchema {
    currentDashboardId: string = ''; // move to url?
}

export interface DashboardConfig {
    id: string,
    name: string,
    stepSize: number,
    // locale: 'hu' | 'en'
    background: string,
    theme: ClaudeThemeType,
}

export type DashboardConfigMap = { [s: string]: DashboardConfig };

export interface State {
    currentDashboardId: string,
    dashboards: DashboardConfigMap,
    widgets: WidgetConfigMap,
}

export type ThunkDispatcher = ThunkDispatch<{}, undefined, Action>;
export type Dispatcher = Dispatch<Action>;
export type UpdateWidgetConfigAction = (widgetId: string, config: Partial<BaseWidgetConfig>) => void;

export interface ServerStatusData {
    cpu: {
        cores: number,
    },
    hdd: Array<{
        device: string,
        free: number,
        label: string,
        mount: string,
        percent: number,
        total: number,
        used: number,
    }>,
    load: [number, number, number],
    memory: {
        available: number,
        free: number,
        percent: number,
        total: number,
        used: number,
    },
    uptime: number,
    ping: number,
}

