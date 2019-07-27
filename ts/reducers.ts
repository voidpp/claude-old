import { combineReducers } from 'redux';
import { State, AppConfig } from './types';
import { claudeLocalStorage } from './tools';
import widgetRegistry from "./widgetRegistry";


import {addWidget, Action, updateWidgetConfig} from './actions'

type ConfigAction = ReturnType<typeof addWidget> | ReturnType<typeof updateWidgetConfig>;

function config(state: AppConfig = claudeLocalStorage, action: ConfigAction): AppConfig {

    // 'widgetType' in action only for the Typescript ...
    if ('widgetType' in action && action.type == Action.ADD_WIDGET) {

        let newState =  Object.assign({}, state, {
            widgets: state.widgets.concat([{
                id: (state.widgets.length ? Math.max(...state.widgets.map(w => w.id)) : 0) + 1,
                ...widgetRegistry[action.widgetType].default,
                type: action.widgetType,
            }])
        })
        claudeLocalStorage.widgets = newState.widgets;
        return newState;

    } else if('config' in action && action.type == Action.UPDATE_WIDGET_CONFIG) {

        let newState: AppConfig = JSON.parse(JSON.stringify(state)); // TODO: slice the original array instead of full copy...
        Object.assign(newState.widgets.find(i => i.id == action.id), action.config);
        claudeLocalStorage.widgets = newState.widgets;
        return newState;

    } else if('id' in action && action.type == Action.REMOVE_WIDGET) {

        let widgets = [...state.widgets]
        widgets.splice(state.widgets.findIndex(i => i.id == action.id), 1);
        let newState = Object.assign({}, state, {widgets});
        claudeLocalStorage.widgets = newState.widgets;
        return newState;

    }

    return state;
}

const rootReducer = combineReducers<State>({
    config,
});

export default rootReducer;
