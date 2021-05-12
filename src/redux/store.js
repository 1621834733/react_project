import {createStore,applyMiddleware} from 'redux'
import Reducers from './reducers/index'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
export default createStore(Reducers,composeWithDevTools(applyMiddleware(thunk)))