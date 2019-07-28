import { BaseWidgetConfig } from "./types";
import { claudeLocalStorage } from "./tools";

export enum Action {
    ADD_WIDGET = 'ADD_WIDGET',
    REMOVE_WIDGET = 'REMOVE_WIDGET',
    UPDATE_WIDGET_CONFIG = 'UPDATE_WIDGET_CONFIG',
    SELECT_DASHBOARD = 'SELECT_DASHBOARD',
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

export const selectDashboard = (id: number) => {
    claudeLocalStorage.currentDashboardId = id;
    return {
        type: Action.SELECT_DASHBOARD,
        id,
    }
}
