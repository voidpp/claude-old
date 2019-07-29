import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export interface BaseWidgetConfig {
    x: number,
    y: number,
    width: number,
    height: number,
    settings: any, // this is widget specific
}

export interface WidgetConfig extends BaseWidgetConfig {
    id: number,
    type: string,
}

export type CommonWidgetProps<T = any> = {
    config: Omit<WidgetConfig, 'settings'> & {settings: T},
    stepSize: number,
}

export type WidgetConfigList = Array<WidgetConfig>;
export type WidgetConfigMap = { [n: number]: WidgetConfig };

export class LocalStorageSchema {
    currentDashboardId: number = 0;
}

export interface DashboardConfig {
    id: number,
    name: string,
    stepSize: number,
    widgets: WidgetConfigMap,
}

export type DashboardConfigMap = { [n: number]: DashboardConfig };

export interface State {
    currentDashboardId: number,
    dashboards: DashboardConfigMap,
}

export type ThunkDispatcher = ThunkDispatch<{}, undefined, Action>;
