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
      selectedWords: []
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

  onStartOverClick () {
    this.setState({
      editingWord: null,
      selectedWords: []
    });
    this.props.dispatch(updateSwipeIndex(0));
    this.props.dispatch(clearWords());
  }

  handleSelectWord (word) {
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
        color,
        showOptions: 'hidden'
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
      selectedWords
    });
    // Fetch an updated list of words
    this.props.dispatch(fetchWords(this.props.query, selectedWords));
  }

  handleToggleOptions (letterIndex) {
    // Hide options for all letters
    let editingWord = this.state.editingWord.map(letter => {
      return Object.assign({}, letter, {
        showOptions: 'hidden'
      });
    });
    // If options were hidden for selected letter, make them visible
    let currentSetting = this.state.editingWord[letterIndex].showOptions;
    if (currentSetting === 'hidden') {
      const letter = Object.assign({}, this.state.editingWord[letterIndex], {
        showOptions: 'visible'
      });
      // Reinsert toggled letter into parent word
      editingWord = (letterIndex > 0)
        ? editingWord.slice(0, letterIndex).concat(letter).concat(editingWord.slice(letterIndex + 1))
        : [letter].concat(editingWord.slice(1));
    }
    // Assign updated `selectedWords` to state
    this.setState({
      editingWord
    });
  }

  handleSelectColor (color, letterIndex) {
    // Set new letter color
    const letter = Object.assign({}, this.state.editingWord[letterIndex], {
      color,
      showOptions: 'hidden'
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

  render () {
    let results;
    let count;
    if (this.props.loading) {
      results = (
        <p>
          Loading words...
        </p>
      );
    } else if (this.state.editingWord) {
      results = (
        <ol>
          <li>
            Click the letters in the word above to set their color.
          </li>
          <li>
            Click the plus sign to add the word to your list of guesses.
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
        let classes = 'letter-picker';
        if (wordIndex === this.state.selectedWords.length - 1) {
          classes += ' before-editing';
        }
        return (
          <div
            key={id}
            className={classes}
          >
            <img
              className='letter-image'
              src={`/img/letters-${letter.color.toLowerCase()}/${letter.letter.toUpperCase()}.png`}
              alt={`${letter.color} ${letter.letter.toUpperCase()}`} />
          </div>
        );
      });
      let remove;
      if (wordIndex === this.state.selectedWords.length - 1) {
        remove = (
          <button className='remove-button' key={makeId()} onClick={() => this.handleClickRemoveSelected()} title='Remove word' />
        );
      }
      return (
        <li key={makeId()}>
          {letters}
          {remove}
        </li>
      );
    });

    let editing;
    if (this.state.editingWord) {
      editing = this.state.editingWord.map((letter, letterIndex) => {
        const colors = ['Blue', 'Orange', 'Green'].filter(color => {
          return color !== letter.color;
        });
        const bgImage = `/img/letters-${letter.color.toLowerCase()}/${letter.letter.toUpperCase()}.png`;
        const bgOption1 = `/img/letters-${colors[0].toLowerCase()}/${letter.letter.toUpperCase()}.png`;
        const bgOption2 = `/img/letters-${colors[1].toLowerCase()}/${letter.letter.toUpperCase()}.png`;
        const options = (
          <React.Fragment>
            <button
              onClick={() => this.handleSelectColor(colors[0], letterIndex)}
              className='letter-option letter-option-left'
              title={`${colors[0]} ${letter.letter.toUpperCase()}`}
              style={{
                visibility: `${letter.showOptions}`,
                backgroundImage: `url(${bgOption1})`
              }}
            />
            <button
              onClick={() => this.handleSelectColor(colors[1], letterIndex)}
              className='letter-option letter-option-right'
              title={`${colors[1]} ${letter.letter.toUpperCase()}`}
              style={{
                visibility: `${letter.showOptions}`,
                backgroundImage: `url(${bgOption2})`
              }}
            />
          </React.Fragment>
        );
        return (
          <div
            key={makeId()}
            className='letter-picker'
          >
            <button
              onClick={() => this.handleToggleOptions(letterIndex)}
              className='letter-button'
              title={`${letter.color} ${letter.letter.toUpperCase()}`}
              style={{
                backgroundImage: `url(${bgImage})`
              }}
            />
            {options}
          </div>
        );
      });
      editing.push(
        <button className='remove-button' key={makeId()} onClick={() => this.handleClickRemoveEditing()} title='Remove word' />
      );
      editing.push(
        <button className='add-button' key={makeId()} onClick={() => this.handleClickAdd()} title='Add word' />
      );
    }

    return (
      <React.Fragment>
        <button onClick={() => this.onStartOverClick()}>Start Over</button>
        <ul id='selected-words'>
          {selected}
        </ul>
        {editing}
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
