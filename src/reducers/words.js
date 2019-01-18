import {
  FETCH_WORDS_REQUEST,
  FETCH_WORDS_SUCCESS,
  FETCH_WORDS_ERROR
} from '../actions/words';

const initialState = {
  error: null,
  loading: false,
  words: []
};

export default function reducer (state = initialState, action) {
  if (action.type === FETCH_WORDS_REQUEST) {
    return Object.assign({}, state, {
      error: null,
      loading: true,
      words: []
    });
  }
  if (action.type === FETCH_WORDS_SUCCESS) {
    const { words } = action;
    return Object.assign({}, state, {
      error: null,
      loading: false,
      words
    });
  }
  if (action.type === FETCH_WORDS_ERROR) {
    const { error } = action;
    return Object.assign({}, state, {
      error,
      loading: false,
      words: []
    });
  }
  return state;
}
