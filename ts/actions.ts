import { BaseWidgetConfig } from "./types";

export enum Action {
    ADD_WIDGET = 'ADD_WIDGET',
    REMOVE_WIDGET = 'REMOVE_WIDGET',
    UPDATE_WIDGET_CONFIG = 'UPDATE_WIDGET_CONFIG',
}

export const addWidget = (widgetType: string) => ({
    type: Action.ADD_WIDGET,
    widgetType,
})

export const updateWidgetConfig = (id: number, config: Partial<BaseWidgetConfig>) => ({
    type: Action.UPDATE_WIDGET_CONFIG,
    id,
    config,
})

export const removeWidget = (id: number) => ({
    type: Action.REMOVE_WIDGET,
    id,
})
