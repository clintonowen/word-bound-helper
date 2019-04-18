import {
  SET_WORD_LENGTH,
  SET_POSS_LETTERS,
  FETCH_WORDS_REQUEST,
  FETCH_WORDS_SUCCESS,
  FETCH_WORDS_ERROR,
  CLEAR_WORDS
} from '../actions/words';

const initialState = {
  error: null,
  loading: false,
  query: {
    wordLength: null,
    possLetters: ''
  },
  words: null
};

export default function reducer (state = initialState, action) {
  if (action.type === SET_WORD_LENGTH) {
    const { wordLength } = action;
    return Object.assign({}, state, {
      query: Object.assign({}, state.query, {
        wordLength
      })
    });
  }
  if (action.type === SET_POSS_LETTERS) {
    const { possLetters } = action;
    return Object.assign({}, state, {
      query: Object.assign({}, state.query, {
        possLetters
      })
    });
  }
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
  if (action.type === CLEAR_WORDS) {
    return Object.assign({}, state, initialState);
  }
  return state;
}
