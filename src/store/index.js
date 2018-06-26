import { createStore, combineReducers, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

//import individual reducers for data sources
import heartRate from "./heartrate";
import steps from "./steps";
import firestoreStore from './firebase'

const reducer = combineReducers({
  heartRate,
  steps,
  firestoreStore
});

const middleware = composeWithDevTools(
  applyMiddleware(
    thunkMiddleware,
    createLogger({
      collapsed: true
    })
  )
);

const store = createStore(reducer, middleware);

export default store;
