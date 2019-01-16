import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import wordsReducer from './reducers/words';

const store = createStore(
  combineReducers({
    words: wordsReducer
  }),
  applyMiddleware(thunk)
);

export default store;
