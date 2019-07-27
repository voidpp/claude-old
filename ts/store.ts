import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware, {ThunkMiddleware} from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';

const loggerMiddleware = createLogger();

export default function configureStore() {
    return createStore(rootReducer, {}, applyMiddleware(thunkMiddleware as ThunkMiddleware, loggerMiddleware))
}
