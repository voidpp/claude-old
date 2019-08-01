import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';
import client from './client';

const loggerMiddleware = createLogger();

const initalData = window['initalData'];

export default function configureStore() {
    console.debug("Store initial data", initalData)
    let store = createStore(rootReducer, initalData, applyMiddleware(client.createReduxMiddleware(), loggerMiddleware))
    client.dispatcher = store.dispatch;
    return store;
}
