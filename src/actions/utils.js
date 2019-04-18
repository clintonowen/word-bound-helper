export const normalizeResponseErrors = res => {
  if (!res.ok) {
    if (
      res.headers.has('content-type') &&
      res.headers.get('content-type').startsWith('application/json')
    ) {
      // It's a nice JSON error returned by us, so decode it
      return res.json().then(err => Promise.reject(err));
    }
    // It's a less informative error returned by express
    const err = {
      code: res.status,
      message: res.statusText
    };
    return Promise.reject(err);
  }
  return res;
};

export const makeId = () => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 24; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const loadDictionary = (wordLength) => {
  let path;

  switch (wordLength) {
    case 2:
      path = '/data/dictionaries/2-letter.txt';
      break;
    case 3:
      path = '/data/dictionaries/3-letter.txt';
      break;
    case 4:
      path = '/data/dictionaries/4-letter.txt';
      break;
    case 5:
      path = '/data/dictionaries/5-letter.txt';
      break;
    case 6:
      path = '/data/dictionaries/6-letter.txt';
      break;
    case 7:
      path = '/data/dictionaries/7-letter.txt';
      break;
    case 8:
      path = '/data/dictionaries/8-letter.txt';
      break;
    default:
      break;
  }

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
};

export const hasOnlyPossLetters = (word, letters) => {
  for (let i = 0; i < word.length; i++) {
    if (!letters.includes(word[i])) {
      return false;
    }
  }
  return true;
};

export const includesLetters = (word, letters) => {
  if (letters.length === 0) {
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
};

export const hasLettersInPosition = (word, letters) => {
  if (letters.length === 0) {
    return true;
  }
  for (let i = 0; i < letters.length; i++) {
    if (letters[i] !== '*' && word[i] !== letters[i]) {
      return false;
    }
  }
  return true;
};

export const hasNoWrongLetters = (word, letters) => {
  if (letters.length === 0) {
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
};

export const rankWords = (words) => {
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
};
