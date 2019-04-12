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
      editing: false,
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
    this.setState({
      editing: false,
      selectedWords: []
    });
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
      editing: true,
      selectedWords
    });
  }

  handleDeselectWord () {
    const selectedWords = this.state.selectedWords.slice(0, -1);
    this.setState({
      editing: false,
      selectedWords
    });
    // Fetch an updated list of words
    this.props.dispatch(fetchWords(this.props.query, selectedWords));
  }

  handleClickDone () {
    this.setState({
      editing: false
    });
    // Fetch an updated list of words
    this.props.dispatch(fetchWords(this.props.query, this.state.selectedWords));
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
  }

  render () {
    let results;
    let count;
    if (this.props.loading) {
      results = (
        <p>
          Loading words...
        </p>
      );
    } else if (this.state.editing) {
      results = (
        <ol>
          <li>
            Set the color for each letter in the selected word above.
          </li>
          <li>
            Click 'Done' to get a new list of possible words.
          </li>
        </ol>
      );
    } else if (this.props.words) {
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
        if (wordIndex !== this.state.selectedWords.length - 1) {
          let classes = 'letter-picker';
          if (wordIndex === this.state.selectedWords.length - 2) {
            classes += ' before-editing';
          }
          return (
            <div
              key={id}
              className={classes}
            >
              <img
                className='letter border-hidden'
                src={`/img/letters-${letter.color.toLowerCase()}/${letter.letter.toUpperCase()}.png`}
                alt={`${letter.color} ${letter.letter.toUpperCase()}`} />
            </div>
          );
        } else {
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
                  className='letter border-dash'
                  src={`/img/letters-${letter.color.toLowerCase()}/${letter.letter.toUpperCase()}.png`}
                  alt={`${letter.color} ${letter.letter.toUpperCase()}`} />
              </button>
              {options}
            </div>
          );
        }
      });
      const id = makeId();
      return (
        <li key={id}>
          {letters}
        </li>
      );
    });

    if (selected.length > 0) {
      selected[selected.length - 1].props.children.push(
        <button key={makeId()} onClick={() => this.handleDeselectWord()}>
          Remove
        </button>
      );
      selected[selected.length - 1].props.children.push(
        <button key={makeId()} onClick={() => this.handleClickDone()}>
          Done
        </button>
      );
    }

    return (
      <React.Fragment>
        <button onClick={() => this.onStartOverClick()}>Start Over</button>
        <ul id='selected-words'>
          {selected}
        </ul>
        {count}
        <ol className='results'>
          {results}
        </ol>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.words.loading,
  query: state.words.query,
  words: state.words.words
});

export default connect(mapStateToProps)(Results);
