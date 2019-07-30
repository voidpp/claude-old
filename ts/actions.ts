import { BaseWidgetConfig } from "./types";
import { claudeLocalStorage } from "./tools";

export enum Action {
    ADD_WIDGET = 'ADD_WIDGET',
    ADD_DASHBOARD = 'ADD_DASHBOARD',
    REMOVE_WIDGET = 'REMOVE_WIDGET',
    UPDATE_WIDGET_CONFIG = 'UPDATE_WIDGET_CONFIG',
    SELECT_DASHBOARD = 'SELECT_DASHBOARD',
}

export const addDashboard = (name: string, stepSize: number) => ({
    type: Action.ADD_DASHBOARD,
    name,
    stepSize,
})


export const addWidget = (dashboardId: string, widgetType: string) => ({
    type: Action.ADD_WIDGET,
    dashboardId,
    widgetType,
})

export const updateWidgetConfig = (widgetId: string, config: Partial<BaseWidgetConfig>) => ({
    type: Action.UPDATE_WIDGET_CONFIG,
    widgetId,
    config,
})

export const removeWidget = (widgetId: string) => ({
    type: Action.REMOVE_WIDGET,
    widgetId,
})

export const selectDashboard = (id: string) => {
    // claudeLocalStorage.currentDashboardId = id;
    return {
        type: Action.SELECT_DASHBOARD,
        id,
    }
}
