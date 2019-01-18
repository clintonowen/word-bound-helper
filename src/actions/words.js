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
  let path;

  switch (wordLength) {
    case '2':
      path = '/data/dictionaries/2-letter.txt';
      break;
    case '3':
      path = '/data/dictionaries/3-letter.txt';
      break;
    case '4':
      path = '/data/dictionaries/4-letter.txt';
      break;
    case '5':
      path = '/data/dictionaries/5-letter.txt';
      break;
    case '6':
      path = '/data/dictionaries/6-letter.txt';
      break;
    case '7':
      path = '/data/dictionaries/7-letter.txt';
      break;
    case '8':
      path = '/data/dictionaries/8-letter.txt';
      break;
    default:
      break;
  }

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

  loadDictionary(path)
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

function loadDictionary (path) {
  return new Promise((resolve, reject) => {
    window.fetch(`${process.env.PUBLIC_URL}${path}`)
      .then(response => response.text())
      .then((data) => {
        let dictionary = [];
        data.toString().split('\n').forEach(word => {
          dictionary.push(word);
        });
        resolve(dictionary);
      })
      .catch(err => reject(err));
  });
}

function hasOnlyPossLetters (word, letters) {
  for (let i = 0; i < word.length; i++) {
    if (!letters.includes(word[i])) {
      return false;
    }
  }
  return true;
}

function includesLetters (word, letters) {
  if (!letters) {
    return true;
  }
  for (let i = 0; i < letters.length; i++) {
    let index = word.indexOf(letters[i]);
    if (index === -1) {
      return false;
    } else {
      word = word.slice(0, index) + word.slice(index + 1);
    }
  }
  return true;
}

function hasLettersInPosition (word, letters) {
  if (!letters) {
    return true;
  }
  for (let i = 0; i < letters.length; i++) {
    if (letters[i] !== '*' && word[i] !== letters[i]) {
      return false;
    }
  }
  return true;
}

function hasNoWrongLetters (word, letters) {
  if (!letters) {
    return true;
  }
  let result = true;
  letters.forEach(letterSet => {
    for (let i = 0; i < letterSet.length; i++) {
      if (letterSet[i] !== '*' && word[i] === letterSet[i]) {
        result = false;
      }
    }
  });
  return result;
}

function rankWords (words) {
  let wordRanks = [];
  let sortedWords = [];
  words.forEach(word => {
    let letterCount = {};
    for (let i = 0; i < word.length; i++) {
      if (letterCount[word[i]]) {
        letterCount[word[i]]++;
      } else {
        letterCount[word[i]] = 1;
      }
    }
    let rank = 1;
    Object.values(letterCount).forEach(count => {
      rank *= count;
    });
    wordRanks.push({ 'word': word, 'rank': rank });
  });
  wordRanks.sort((a, b) => a['rank'] - b['rank']);
  wordRanks.forEach(rankedWord => {
    sortedWords.push(rankedWord['word']);
  });
  return sortedWords;
}
