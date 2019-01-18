import {
  loadDictionary,
  hasOnlyPossLetters,
  includesLetters,
  hasLettersInPosition,
  hasNoWrongLetters,
  rankWords
} from './utils';

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
