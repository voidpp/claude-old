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

export class LocalStorageSchema {
    widgets: WidgetConfigList = [];
    stepSize: number = 10;
}

// ffu
export type AppConfig = LocalStorageSchema;

export interface State {
    config: AppConfig,
}

export type ThunkDispatcher = ThunkDispatch<{}, undefined, Action>;
