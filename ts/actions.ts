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


export const addWidget = (dashboardId: number, widgetType: string) => ({
    type: Action.ADD_WIDGET,
    dashboardId,
    widgetType,
})

export const updateWidgetConfig = (dashboardId: number, widgetId: number, config: Partial<BaseWidgetConfig>) => ({
    type: Action.UPDATE_WIDGET_CONFIG,
    dashboardId,
    widgetId,
    config,
})

export const removeWidget = (dashboardId: number, widgetId: number) => ({
    type: Action.REMOVE_WIDGET,
    dashboardId,
    widgetId,
})

export const selectDashboard = (id: number) => {
    // claudeLocalStorage.currentDashboardId = id;
    return {
        type: Action.SELECT_DASHBOARD,
        id,
    }
}
