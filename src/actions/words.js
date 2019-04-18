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

export const fetchWords = (query, selectedWords) => dispatch => {
  dispatch(fetchWordsRequest());
  let {
    wordLength,
    possLetters
  } = query;
  let corrLetters = [];
  let corrPosition = '';
  let incPosition = [];
  let incLetterAndPos = [];
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
  }

  possLetters = possLetters.replace(/[^a-zA-Z]+/g, '').toLowerCase().split('');

  // Check selected word history
  if (selectedWords && selectedWords.length !== 0) {
    // Check only last selected word for `corrLetters` and `corrPosition`
    selectedWords[selectedWords.length - 1].forEach(letter => {
      if (letter.color === 'Orange' || letter.color === 'Green') {
        if (!corrLetters.includes(letter.letter)) {
          corrLetters.push(letter.letter);
        }
      }
      if (letter.color === 'Blue' || letter.color === 'Orange') {
        corrPosition += '*';
      }
      if (letter.color === 'Green') {
        corrPosition += letter.letter.toLowerCase();
      }
    });

    // Check all selected words for `possLetters` and `incPosition`
    selectedWords.forEach(word => {
      let thisIncPosition = '';
      let thisIncLetterAndPos = '';
      word.forEach(letter => {
        const color = letter.color;
        letter = letter.letter.toLowerCase();
        if (color === 'Blue') {
          if (!corrLetters.includes(letter)) {
            possLetters = possLetters.filter(possLetter => possLetter !== letter);
          }
          thisIncPosition += '*';
          thisIncLetterAndPos += letter;
        }
        if (color === 'Orange') {
          thisIncPosition += letter;
          thisIncLetterAndPos += '*';
        }
        if (color === 'Green') {
          thisIncPosition += '*';
          thisIncLetterAndPos += '*';
        }
      });
      incPosition.push(thisIncPosition);
      incLetterAndPos.push(thisIncLetterAndPos);
    });
  }

  loadDictionary(wordLength)
    .then(dictionary => {
      dictionary.forEach(word => {
        if (hasOnlyPossLetters(word, possLetters) &&
          includesLetters(word, corrLetters) &&
          hasLettersInPosition(word, corrPosition) &&
          hasNoWrongLetters(word, incPosition) &&
          hasNoWrongLetters(word, incLetterAndPos)) {
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
