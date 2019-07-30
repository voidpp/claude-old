import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware, {ThunkMiddleware} from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';
import { save, load } from "redux-localstorage-simple"

const loggerMiddleware = createLogger();

export default function configureStore() {
    return createStore(rootReducer, load(), applyMiddleware(thunkMiddleware as ThunkMiddleware, loggerMiddleware, save()))
}
