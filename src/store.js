import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import thunk from 'redux-thunk';
import wordsReducer from './reducers/words';

const store = createStore(
  combineReducers({
    form: formReducer,
    words: wordsReducer
  }),
  applyMiddleware(thunk)
);

export default store;
