import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import appReducer from './reducers/app';
import wordsReducer from './reducers/words';

const store = createStore(
  combineReducers({
    app: appReducer,
    words: wordsReducer
  }),
  applyMiddleware(thunk)
);

export default store;
