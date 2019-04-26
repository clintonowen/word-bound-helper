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
      editingWord: null,
      selectedWords: [],
      startingIndex: 0
    };
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.query.wordLength && nextProps.query.possLetters &&
      Object.keys(nextProps.query).some(key => {
        return nextProps.query[key] !== this.props.query[key];
      })) {
      this.props.dispatch(fetchWords(nextProps.query, this.state.selectedWords));
    }
  }

  onNavClick (index) {
    this.setState({
      editingWord: null,
      selectedWords: [],
      startingIndex: 0
    });
    this.props.dispatch(updateSwipeIndex(index));
    if (index === 0) {
      this.props.dispatch(clearWords());
    }
  }

  handleSelectWord (word) {
    document.getElementById('top').scrollIntoView(true);
    let wordArray = word.split('').map((letter, index) => {
      let color = 'Blue';
      if (this.state.selectedWords.length > 0) {
        const lastColor = this.state.selectedWords[this.state.selectedWords.length - 1][index].color;
        if (lastColor === 'Green') {
          color = 'Green';
        }
      }
      return {
        letter,
        color
      };
    });
    this.setState({
      editingWord: wordArray
    });
  }

  handleClickRemoveSelected () {
    let selectedWords = this.state.selectedWords.slice(0, -1);
    this.setState({
      editingWord: null,
      selectedWords
    });
    // Fetch an updated list of words
    this.props.dispatch(fetchWords(this.props.query, selectedWords));
  }

  handleClickRemoveEditing () {
    this.setState({
      editingWord: null
    });
  }

  handleClickAdd () {
    const selectedWords = [...this.state.selectedWords, this.state.editingWord];
    this.setState({
      editingWord: null,
      selectedWords,
      startingIndex: 0
    });
    // Fetch an updated list of words
    this.props.dispatch(fetchWords(this.props.query, selectedWords));
  }

  handleCycleColor (currentColor, letterIndex) {
    let color;
    switch (currentColor) {
      case 'Blue':
        color = 'Orange';
        break;
      case 'Orange':
        color = 'Green';
        break;
      default:
        color = 'Blue';
    }
    // Set new letter color
    const letter = Object.assign({}, this.state.editingWord[letterIndex], {
      color
    });
    // Reinsert letter into `editingWord`
    const editingWord = (letterIndex > 0)
      ? this.state.editingWord.slice(0, letterIndex).concat(letter).concat(this.state.editingWord.slice(letterIndex + 1))
      : [letter].concat(this.state.editingWord.slice(1));
    // Assign updated `editingWord` to state
    this.setState({
      editingWord
    });
  }

  handlePrevClick () {
    const startingIndex = this.state.startingIndex - 10;
    this.setState({ startingIndex });
  }

  handleNextClick () {
    const startingIndex = this.state.startingIndex + 10;
    this.setState({ startingIndex });
  }

  render () {
    let selectedList;
    let results;
    let resultsNav;
    let count;
    if (this.props.loading) {
      results = (
        <p>
          Loading words...
        </p>
      );
    } else if (this.state.editingWord) {
      results = (
        <ol id='editing-instructions'>
          <li>
            Click the letters in the word above to set their color.
          </li>
          <li>
            Click the plus sign to add the word to your list of guesses.
          </li>
        </ol>
      );
    } else if (this.props.words && this.props.words.length > 0) {
      results = [];
      const start = this.state.startingIndex;
      for (let i = start; i < start + 10; i++) {
        if (this.props.words[i]) {
          const id = makeId();
          results.push(
            <li key={id}>
              <button
                className='word-button blue'
                onClick={() => this.handleSelectWord(this.props.words[i])}
              >
                {this.props.words[i]}
              </button>
            </li>
          );
        }
      }
      const plural = this.props.words.length !== 1 ? 's' : null;
      count = (
        <React.Fragment>
          <p>
            <span id='list-length'>{this.props.words.length}</span> possible solution{plural}
          </p>
          <p>
            Select a word:
          </p>
          <p className='subtext'>
            <em>Note: Words at the top of the list have more unique letters, so they are better for narrowing down the solution</em>
          </p>
        </React.Fragment>
      );
      resultsNav = (
        <React.Fragment>
          <button
            className='results-nav pink'
            onClick={() => this.handlePrevClick()}
            disabled={this.state.startingIndex === 0}
          >
            Prev
          </button>
          <button
            className='results-nav pink'
            onClick={() => this.handleNextClick()}
            disabled={this.state.startingIndex + 10 >= this.props.words.length}
          >
            Next
          </button>
        </React.Fragment>
      );
    } else {
      results = (
        <p>
          Uh oh! No words found!
        </p>
      );
    }

    if (this.state.selectedWords.length > 0) {
      let selected = this.state.selectedWords.map((wordArray, wordIndex) => {
        let found = true;
        const letters = wordArray.map((letter, letterIndex) => {
          const id = makeId();
          if (letter.color !== 'Green') {
            found = false;
          }
          return (
            <span
              key={id}
              className={`letter-image ${letter.color.toLowerCase()}`}
            >
              {letter.letter.toUpperCase()}
            </span>
          );
        });
        let remove;
        if (wordIndex === this.state.selectedWords.length - 1) {
          remove = (
            <button className='remove-button' key={makeId()} onClick={() => this.handleClickRemoveSelected()} title='Remove word' />
          );
        }
        let contClasses = 'letters-container';
        if (wordIndex !== this.state.selectedWords.length - 1) {
          contClasses += ' not-last';
        }
        if (found) {
          count = null;
          results = (
            <React.Fragment>
              <p>
                CONGRATULATIONS!
              </p>
              <p>
                You found the correct word!
              </p>
              <button
                className='nav-button pink'
                onClick={() => this.onNavClick(0)}
              >
                Start Over
              </button>
            </React.Fragment>
          );
          resultsNav = null;
        }
        return (
          <li key={makeId()}>
            <div className={contClasses}>
              {letters}
            </div>
            <div className='remove-selected'>
              {remove}
            </div>
          </li>
        );
      });

      selectedList = (
        <ul id='selected-words'>
          {selected}
        </ul>
      );
    }

    let editingButtons;
    if (this.state.editingWord) {
      editingButtons = this.state.editingWord.map((letter, letterIndex) => {
        return (
          <button
            key={makeId()}
            onClick={() => this.handleCycleColor(letter.color, letterIndex)}
            className={`letter-button ${letter.color.toLowerCase()}`}
            title={`${letter.color} ${letter.letter.toUpperCase()}`}
          >
            {letter.letter.toUpperCase()}
          </button>
        );
      });
    }

    let editing;
    if (this.state.editingWord) {
      editing = (
        <div id='editing-container'>
          <div id='editing-buttons'>
            {editingButtons}
          </div>
          <div id='add-remove'>
            <button className='add-button' key={makeId()} onClick={() => this.handleClickAdd()} title='Add word' />
            <button className='remove-button' key={makeId()} onClick={() => this.handleClickRemoveEditing()} title='Remove word' />
          </div>
        </div>
      );
    }

    return (
      <div id='results'>
        <button
          className='nav-button pink'
          onClick={() => this.onNavClick(1)}
        >
          Back
        </button>
        {selectedList}
        {editing}
        {count}
        <ol start={`${this.state.startingIndex + 1}`} className='results'>
          {results}
        </ol>
        {resultsNav}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.words.loading,
  query: state.words.query,
  words: state.words.words
});

export default connect(mapStateToProps)(Results);
