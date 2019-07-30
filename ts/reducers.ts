import { combineReducers } from 'redux';
// import { State, AppConfig, LocalStorageSchema } from './types';
import { claudeLocalStorage } from './tools';
import widgetRegistry from "./widgetRegistry";
const uuid = require('uuid/v4');
import * as objectAssignDeep from 'object-assign-deep';

import { State, DashboardConfigMap, WidgetConfigMap} from './types';


import {addWidget, Action, updateWidgetConfig, selectDashboard, addDashboard, removeWidget} from './actions'

type ConfigAction = ReturnType<typeof addWidget> | ReturnType<typeof updateWidgetConfig>;

// function localStorageAsDict(): LocalStorageSchema {
//     let res = new LocalStorageSchema();
//     for (let k of Object.keys(claudeLocalStorage)) {
//         res[k] = claudeLocalStorage[k];
//     }
//     return res;
// }

// function config(state: AppConfig = localStorageAsDict(), action: ConfigAction): AppConfig {

//     // 'widgetType' in action only for the Typescript ...
//     if ('widgetType' in action && action.type == Action.ADD_WIDGET) {

//         let newState =  Object.assign({}, state, {
//             widgets: state.widgets.concat([{
//                 id: (state.widgets.length ? Math.max(...state.widgets.map(w => w.id)) : 0) + 1,
//                 ...widgetRegistry[action.widgetType].default,
//                 type: action.widgetType,
//             }])
//         })
//         claudeLocalStorage.widgets = newState.widgets;
//         return newState;

//     } else if('config' in action && action.type == Action.UPDATE_WIDGET_CONFIG) {

//         let newState: AppConfig = JSON.parse(JSON.stringify(state)); // TODO: slice the original array instead of full copy...
//         Object.assign(newState.widgets.find(i => i.id == action.id), action.config);
//         claudeLocalStorage.widgets = newState.widgets;
//         return newState;

//     } else if('id' in action && action.type == Action.REMOVE_WIDGET) {

//         let widgets = [...state.widgets]
//         widgets.splice(state.widgets.findIndex(i => i.id == action.id), 1);
//         let newState = Object.assign({}, state, {widgets});
//         claudeLocalStorage.widgets = newState.widgets;
//         return newState;

//     }

//     return state;
// }


// [key in Action] is a mapped object type
type HandlerMap<T> = {[key in Action]?: (state: T, action: any) => T}

function mergeResource<T>(old: T, new_: T): T {
    return Object.assign<{}, T, T>({}, old, new_);
}

const dashboardHandlers: HandlerMap<DashboardConfigMap> = {
    [Action.ADD_DASHBOARD]: (state: DashboardConfigMap, action: ReturnType<typeof addDashboard>): DashboardConfigMap => {
        const id = uuid();
        return mergeResource<DashboardConfigMap>(state, {
            [id]: {
                id,
                name: action.name,
                stepSize: action.stepSize,
            }
        });
    }
}

const widgetHandlers: HandlerMap<WidgetConfigMap> = {
    [Action.ADD_WIDGET]: (state: WidgetConfigMap, action: ReturnType<typeof addWidget>): WidgetConfigMap => {
        const id = uuid();
        return mergeResource<WidgetConfigMap>(state, {
            [id]: {
                id,
                type: action.widgetType,
                ...widgetRegistry[action.widgetType].default,
                dashboardId: action.dashboardId,
            }
        });
    },
    [Action.UPDATE_WIDGET_CONFIG]: (state: WidgetConfigMap, action: ReturnType<typeof updateWidgetConfig>): WidgetConfigMap => {
        return objectAssignDeep({}, state, {[action.widgetId]: action.config});
    },
    [Action.REMOVE_WIDGET]: (state: WidgetConfigMap, action: ReturnType<typeof removeWidget>): WidgetConfigMap => {
        let newState = Object.assign({}, state);
        delete newState[action.widgetId];
        return newState;
    },
}

function currentDashboardId(state = claudeLocalStorage.currentDashboardId, action: ReturnType<typeof selectDashboard>) {
    if (action.type == Action.SELECT_DASHBOARD) {
        return action.id;
    }
    return state;
}

function dashboards(state = {}, action: {type: Action}): DashboardConfigMap {
    if (action.type in dashboardHandlers)
        return dashboardHandlers[action.type](state, action);

    return state;
}

function widgets(state = {}, action: {type: Action}): WidgetConfigMap {
    if (action.type in widgetHandlers)
        return widgetHandlers[action.type](state, action);

    return state;
}

const rootReducer = combineReducers<State>({
    currentDashboardId,
    dashboards,
    widgets,
});

export default rootReducer;
