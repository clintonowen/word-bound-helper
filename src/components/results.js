import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateSwipeIndex } from '../actions/app';
import { fetchWords, clearWords } from '../actions/words';
import { makeId } from '../actions/utils';
import './results.css';

class Results extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedWords: []
    };
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.query.wordLength && nextProps.query.possLetters &&
      Object.keys(nextProps.query).some(key => {
        return nextProps.query[key] !== this.props.query[key];
      })) {
      // console.log('Dispatching `fetchWords`.');
      this.props.dispatch(fetchWords(nextProps.query, this.state.selectedWords));
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
    const selectedWords = [...this.state.selectedWords, wordArray];
    this.setState({
      selectedWords
    });
  }

  handleDeselectWord () {
    const selectedWords = this.state.selectedWords.slice(0, -1);
    this.setState({
      selectedWords
    });
    // Fetch an updated list of words
    this.props.dispatch(fetchWords(this.props.query, selectedWords));
  }

  handleToggleOptions (wordIndex, letterIndex) {
    // Hide options for all letters
    let word = this.state.selectedWords[wordIndex].map(letter => {
      return Object.assign({}, letter, {
        showOptions: 'hidden'
      });
    });
    // If options were hidden for selected letter, make them visible
    let currentSetting = this.state.selectedWords[wordIndex][letterIndex].showOptions;
    if (currentSetting === 'hidden') {
      const letter = Object.assign({}, this.state.selectedWords[wordIndex][letterIndex], {
        showOptions: 'visible'
      });
      // Reinsert toggled letter into parent word
      word = (letterIndex > 0)
        ? word.slice(0, letterIndex).concat(letter).concat(word.slice(letterIndex + 1))
        : [letter].concat(word.slice(1));
    }
    // Reinsert updated word into `selectedWords` array
    const selectedWords = (wordIndex > 0)
      ? this.state.selectedWords.slice(0, wordIndex).concat([word]).concat(this.state.selectedWords.slice(wordIndex + 1))
      : [word].concat(this.state.selectedWords.slice(1));
    // Assign updated `selectedWords` to state
    this.setState({
      selectedWords
    });
  }

  handleSelectColor (color, wordIndex, letterIndex) {
    // Set new letter color
    const letter = Object.assign({}, this.state.selectedWords[wordIndex][letterIndex], {
      color,
      showOptions: 'hidden'
    });
    // Reinsert letter into parent word
    const word = (letterIndex > 0)
      ? this.state.selectedWords[wordIndex].slice(0, letterIndex).concat(letter).concat(this.state.selectedWords[wordIndex].slice(letterIndex + 1))
      : [letter].concat(this.state.selectedWords[wordIndex].slice(1));
    // Reinsert updated word into `selectedWords` array
    const selectedWords = (wordIndex > 0)
      ? this.state.selectedWords.slice(0, wordIndex).concat([word]).concat(this.state.selectedWords.slice(wordIndex + 1))
      : [word].concat(this.state.selectedWords.slice(1));
    // Assign updated `selectedWords` to state
    this.setState({
      selectedWords
    });
    // Fetch an updated list of words
    this.props.dispatch(fetchWords(this.props.query, selectedWords));
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

    let selected = this.state.selectedWords.map((wordArray, wordIndex) => {
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
  words: state.words.words
});

export default connect(mapStateToProps)(Results);
