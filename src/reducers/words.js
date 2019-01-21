import {
  SET_WORD_LENGTH,
  SET_POSS_LETTERS,
  FETCH_WORDS_REQUEST,
  FETCH_WORDS_SUCCESS,
  FETCH_WORDS_ERROR,
  CLEAR_WORDS,
  SELECT_WORD,
  DESELECT_WORD,
  TOGGLE_LETTER_OPTIONS,
  SET_LETTER_COLOR
} from '../actions/words';

const initialState = {
  error: null,
  loading: false,
  query: {
    wordLength: null,
    possLetters: null
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
  if (action.type === TOGGLE_LETTER_OPTIONS) {
    const { wordIndex, letterIndex } = action;

    // Hide options for all letters
    let word = state.selectedWords[wordIndex].map(letter => {
      return Object.assign({}, letter, {
        showOptions: 'hidden'
      });
    });

    // If options were hidden for selected letter, make them visible
    let currentSetting = state.selectedWords[wordIndex][letterIndex].showOptions;
    if (currentSetting === 'hidden') {
      const letter = Object.assign({}, state.selectedWords[wordIndex][letterIndex], {
        showOptions: 'visible'
      });

      // Reinsert toggled letter into parent word
      word = (letterIndex > 0)
        ? word.slice(0, letterIndex).concat(letter).concat(word.slice(letterIndex + 1))
        : [letter].concat(word.slice(1));
    }

    // Reinsert updated word into `selectedWords` array
    const selectedWords = (wordIndex > 0)
      ? state.selectedWords.slice(0, wordIndex).concat([word]).concat(state.selectedWords.slice(wordIndex + 1))
      : [word].concat(state.selectedWords.slice(1));

    // Assign updated `selectedWords` to state
    return Object.assign({}, state, {
      selectedWords
    });
  }
  if (action.type === SET_LETTER_COLOR) {
    const { color, wordIndex, letterIndex } = action;

    // Set new letter color
    const letter = Object.assign({}, state.selectedWords[wordIndex][letterIndex], {
      color
    });

    // Reinsert letter into parent word
    const word = (letterIndex > 0)
      ? state.selectedWords[wordIndex].slice(0, letterIndex).concat(letter).concat(state.selectedWords[wordIndex].slice(letterIndex + 1))
      : [letter].concat(state.selectedWords[wordIndex].slice(1));

    // Reinsert updated word into `selectedWords` array
    const selectedWords = (wordIndex > 0)
      ? state.selectedWords.slice(0, wordIndex).concat([word]).concat(state.selectedWords.slice(wordIndex + 1))
      : [word].concat(state.selectedWords.slice(1));

    // Assign updated `selectedWords` to state
    return Object.assign({}, state, {
      selectedWords
    });
  }
  return state;
}
