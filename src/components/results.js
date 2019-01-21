import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateSwipeIndex } from '../actions/app';
import { fetchWords, clearWords, selectWord, deselectWord, toggleLetterOptions, setLetterColor } from '../actions/words';
import { makeId } from '../actions/utils';
import './results.css';

class Results extends Component {
  componentWillReceiveProps (nextProps) {
    if (nextProps.query.wordLength && nextProps.query.possLetters &&
      (Object.keys(nextProps.query).some(key => {
        return nextProps.query[key] !== this.props.query[key];
      }) || nextProps.selectedWords !== this.props.selectedWords)) {
      // console.log('Dispatching `fetchWords`.');
      this.props.dispatch(fetchWords(nextProps.query, nextProps.selectedWords));
    }
  }

  onStartOverClick () {
    this.props.dispatch(updateSwipeIndex(0));
    this.props.dispatch(clearWords());
  }

  handleSelectWord (word) {
    let wordArray = word.split('').map(letter => {
      return {
        letter,
        color: 'Blue',
        showOptions: 'hidden'
      };
    });
    this.props.dispatch(selectWord(wordArray));
  }

  handleDeselectWord () {
    this.props.dispatch(deselectWord());
  }

  handleToggleOptions (wordIndex, letterIndex) {
    this.props.dispatch(toggleLetterOptions(wordIndex, letterIndex));
  }

  handleSelectColor (color, wordIndex, letterIndex) {
    this.props.dispatch(setLetterColor(color, wordIndex, letterIndex));
    this.props.dispatch(toggleLetterOptions(wordIndex, letterIndex));
    // this.props.dispatch(fetchWords(this.props.query, this.props.selectedWords));
  }

  render () {
    let results;
    let count;
    if (this.props.words) {
      results = this.props.words.map(word => {
        const id = makeId();
        return (
          <li key={id}>
            <button onClick={() => this.handleSelectWord(word)}>
              {word}
            </button>
          </li>
        );
      });

      count = (<p>{this.props.words.length} possible solutions</p>);
    }

    let selected = this.props.selectedWords.map((wordArray, wordIndex) => {
      const letters = wordArray.map((letter, letterIndex) => {
        const id = makeId();
        const optionColors = ['Blue', 'Orange', 'Green'].filter(color => {
          return color !== letter.color;
        });
        const options = (
          <React.Fragment>
            <button onClick={() => this.handleSelectColor(optionColors[0], wordIndex, letterIndex)}>
              <img
                className='letter-option letter-option-left'
                src={`/img/letters-${optionColors[0].toLowerCase()}/${letter.letter.toUpperCase()}.png`}
                alt={`${optionColors[0]} ${letter.letter.toUpperCase()}`}
                style={{ visibility: `${letter.showOptions}` }} />
            </button>
            <button onClick={() => this.handleSelectColor(optionColors[1], wordIndex, letterIndex)}>
              <img
                className='letter-option letter-option-right'
                src={`/img/letters-${optionColors[1].toLowerCase()}/${letter.letter.toUpperCase()}.png`}
                alt={`${optionColors[1]} ${letter.letter.toUpperCase()}`}
                style={{ visibility: `${letter.showOptions}` }} />
            </button>
          </React.Fragment>
        );
        return (
          <div
            key={id}
            className='letter-picker'
          >
            <button onClick={() => this.handleToggleOptions(wordIndex, letterIndex)}>
              <img
                className='letter'
                src={`/img/letters-${letter.color.toLowerCase()}/${letter.letter.toUpperCase()}.png`}
                alt={`${letter.color} ${letter.letter.toUpperCase()}`} />
            </button>
            {options}
          </div>
        );
      });
      const id = makeId();
      return (
        <li key={id}>
          {letters}
        </li>
      );
    });

    let deselectButton;
    if (selected.length > 0) {
      deselectButton = (
        <button onClick={() => this.handleDeselectWord()}>
          Remove last word
        </button>
      );
    }

    return (
      <React.Fragment>
        <button onClick={() => this.onStartOverClick()}>Start Over</button>
        <ul id='selected-words'>
          {selected}
        </ul>
        {deselectButton}
        {count}
        <ol className='results'>
          {results}
        </ol>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  query: state.words.query,
  words: state.words.words,
  selectedWords: state.words.selectedWords
});

export default connect(mapStateToProps)(Results);
