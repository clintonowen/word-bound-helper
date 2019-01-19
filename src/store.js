import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import thunk from 'redux-thunk';
import appReducer from './reducers/app';
import wordsReducer from './reducers/words';

const store = createStore(
  combineReducers({
    form: formReducer,
    app: appReducer,
    words: wordsReducer
  }),
  applyMiddleware(thunk)
);

export default store;
