import { combineReducers } from 'redux';
// import { State, AppConfig, LocalStorageSchema } from './types';
import { claudeLocalStorage } from './tools';
import widgetRegistry from "./widgetRegistry";

import { State, DashboardConfigMap} from './types';


import {addWidget, Action, updateWidgetConfig, selectDashboard, addDashboard} from './actions'

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

function getNextId(map: {[n: number] : any}): number {
    const keys = Object.keys(map).map(parseInt);
    return (keys.length ? Math.max(...keys) : 0) + 1;
}

// [key in Action] is a mapped object type
type DashboardHandlerMap = {[key in Action]?: (state: DashboardConfigMap, action: any) => DashboardConfigMap}

function mergeDashboard(old: DashboardConfigMap, new_: DashboardConfigMap): DashboardConfigMap {
    return Object.assign<{}, DashboardConfigMap, DashboardConfigMap>({}, old, new_);
}

const dashboardHandlers: DashboardHandlerMap = {
    [Action.ADD_DASHBOARD]: (state: DashboardConfigMap, action: ReturnType<typeof addDashboard>): DashboardConfigMap => {
        const id = getNextId(state);
        return mergeDashboard(state, {
            [id]: {
                id,
                name: action.name,
                stepSize: action.stepSize,
                widgets: {},
            }
        });
    }
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

const rootReducer = combineReducers<State>({
    currentDashboardId,
    dashboards,
});

export default rootReducer;
