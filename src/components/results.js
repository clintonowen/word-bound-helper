import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateSwipeIndex } from '../actions/app';
import { fetchWords, clearWords, selectWord, deselectWord } from '../actions/words';
import { makeId } from '../actions/utils';
import './results.css';

class Results extends Component {
  componentWillReceiveProps (nextProps) {
    if (nextProps.query.wordLength && nextProps.query.possLetters &&
      (Object.keys(nextProps.query).some(key => {
        return nextProps.query[key] !== this.props.query[key];
      }))) {
      this.props.dispatch(fetchWords(nextProps.query));
    }
  }

  onStartOverClick () {
    this.props.dispatch(updateSwipeIndex(0));
    this.props.dispatch(clearWords());
  }

  handleSelectWord (word) {
    this.props.dispatch(selectWord(word));
  }

  handleDeselectWord () {
    this.props.dispatch(deselectWord());
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

    let selected = this.props.selectedWords.map(word => {
      const id = makeId();
      return (
        <li key={id}>
          {word}
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
        <ul>
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
