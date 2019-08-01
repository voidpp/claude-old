import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { Dispatch } from "react";

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
    stepSize: number,
}

export type WidgetConfigList = Array<WidgetConfig>;
export type WidgetConfigMap = { [s: string]: WidgetConfig };

export class LocalStorageSchema {
    currentDashboardId: string = '';
}

export interface DashboardConfig {
    id: string,
    name: string,
    stepSize: number,
}

export type DashboardConfigMap = { [s: string]: DashboardConfig };

export interface State {
    currentDashboardId: string,
    dashboards: DashboardConfigMap,
    widgets: WidgetConfigMap,
}

export type ThunkDispatcher = ThunkDispatch<{}, undefined, Action>;
export type Dispatcher = Dispatch<Action>;
