import {
  loadDictionary,
  hasOnlyPossLetters,
  includesLetters,
  hasLettersInPosition,
  hasNoWrongLetters,
  rankWords
} from './utils';

export const SET_WORD_LENGTH = 'SET_WORD_LENGTH';
export const setWordLength = wordLength => ({
  type: SET_WORD_LENGTH,
  wordLength
});

export const SET_POSS_LETTERS = 'SET_POSS_LETTERS';
export const setPossLetters = possLetters => ({
  type: SET_POSS_LETTERS,
  possLetters
});

export const SET_CORR_LETTERS = 'SET_CORR_LETTERS';
export const setCorrLetters = corrLetters => ({
  type: SET_CORR_LETTERS,
  corrLetters
});

export const SET_CORR_POSITION = 'SET_CORR_POSITION';
export const setCorrPosition = corrPosition => ({
  type: SET_CORR_POSITION,
  corrPosition
});

export const SET_INC_POSITION = 'SET_INC_POSITION';
export const setIncPosition = incPosition => ({
  type: SET_INC_POSITION,
  incPosition
});

export const FETCH_WORDS_REQUEST = 'FETCH_WORDS_REQUEST';
export const fetchWordsRequest = () => ({
  type: FETCH_WORDS_REQUEST
});

export const FETCH_WORDS_SUCCESS = 'FETCH_WORDS_SUCCESS';
export const fetchWordsSuccess = words => ({
  type: FETCH_WORDS_SUCCESS,
  words
});

export const FETCH_WORDS_ERROR = 'FETCH_WORDS_ERROR';
export const fetchWordsError = error => ({
  type: FETCH_WORDS_ERROR,
  error
});

export const CLEAR_WORDS = 'CLEAR_WORDS';
export const clearWords = () => ({
  type: CLEAR_WORDS
});

export const SELECT_WORD = 'SELECT_WORD';
export const selectWord = word => ({
  type: SELECT_WORD,
  word
});

export const DESELECT_WORD = 'DESELECT_WORD';
export const deselectWord = () => ({
  type: DESELECT_WORD
});

export const SHOW_LETTER_OPTIONS = 'SHOW_LETTER_OPTIONS';
export const showLetterOptions = (wordIndex, letterIndex) => ({
  type: SHOW_LETTER_OPTIONS,
  wordIndex,
  letterIndex
});

export const HIDE_LETTER_OPTIONS = 'HIDE_LETTER_OPTIONS';
export const hideLetterOptions = (wordIndex, letterIndex) => ({
  type: HIDE_LETTER_OPTIONS,
  wordIndex,
  letterIndex
});

export const fetchWords = data => dispatch => {
  dispatch(fetchWordsRequest());
  let {
    wordLength,
    possLetters,
    corrLetters,
    corrPosition,
    incPosition
  } = data;
  let results = [];

  // Validate inputs
  if (!wordLength) {
    const err = new Error('Missing Word Length');
    err.status = 400;
    dispatch(fetchWordsError(err));
  }
  if (!possLetters) {
    const err = new Error('Missing Possible Letters');
    err.status = 400;
    dispatch(fetchWordsError(err));
  } else {
    possLetters = possLetters.toLowerCase();
  }
  if (corrLetters) {
    corrLetters = corrLetters.toLowerCase();
  }
  if (corrPosition) {
    corrPosition = corrPosition.toLowerCase();
  }
  if (incPosition) {
    incPosition = incPosition.toLowerCase().replace(/\s/g, '').split(',');
  }

  loadDictionary(wordLength)
    .then(dictionary => {
      dictionary.forEach(word => {
        if (hasOnlyPossLetters(word, possLetters) &&
          includesLetters(word, corrLetters) &&
          hasLettersInPosition(word, corrPosition) &&
          hasNoWrongLetters(word, incPosition)) {
          // console.log(word);
          results.push(word);
        }
      });
      results = rankWords(results);
      // console.log(results);
      return results;
    })
    .then(results => {
      dispatch(fetchWordsSuccess(results));
    })
    .catch(err => {
      dispatch(fetchWordsError(err));
    });
};
