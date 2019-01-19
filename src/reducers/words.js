import {
  SET_WORD_LENGTH,
  SET_POSS_LETTERS,
  SET_CORR_LETTERS,
  SET_CORR_POSITION,
  SET_INC_POSITION,
  FETCH_WORDS_REQUEST,
  FETCH_WORDS_SUCCESS,
  FETCH_WORDS_ERROR,
  CLEAR_WORDS,
  SELECT_WORD,
  DESELECT_WORD
} from '../actions/words';

const initialState = {
  error: null,
  loading: false,
  query: {
    wordLength: null,
    possLetters: null,
    corrLetters: null,
    corrPosition: null,
    incPosition: null
  },
  words: null,
  selectedWords: []
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
  if (action.type === SET_CORR_LETTERS) {
    const { corrLetters } = action;
    return Object.assign({}, state, {
      query: Object.assign({}, state.query, {
        corrLetters
      })
    });
  }
  if (action.type === SET_CORR_POSITION) {
    const { corrPosition } = action;
    return Object.assign({}, state, {
      query: Object.assign({}, state.query, {
        corrPosition
      })
    });
  }
  if (action.type === SET_INC_POSITION) {
    const { incPosition } = action;
    return Object.assign({}, state, {
      query: Object.assign({}, state.query, {
        incPosition
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
  if (action.type === SELECT_WORD) {
    const { word } = action;
    const selectedWords = [...state.selectedWords, word];
    return Object.assign({}, state, {
      selectedWords
    });
  }
  if (action.type === DESELECT_WORD) {
    const selectedWords = state.selectedWords.slice(0, -1);
    return Object.assign({}, state, {
      selectedWords
    });
  }
  return state;
}
