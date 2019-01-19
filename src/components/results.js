import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateSwipeIndex } from '../actions/app';
import { fetchWords, clearWords } from '../actions/words';
import { makeId } from '../actions/utils';
import './results.css';

class Results extends Component {
  componentWillReceiveProps (nextProps) {
    if (nextProps.wordLength && nextProps.possLetters &&
      (nextProps.wordLength !== this.props.wordLength ||
      nextProps.possLetters !== this.props.possLetters ||
      nextProps.corrLetters !== this.props.corrLetters ||
      nextProps.corrPosition !== this.props.corrPosition ||
      nextProps.incPosition !== this.props.incPosition)) {
      const values = {
        wordLength: nextProps.wordLength,
        possLetters: nextProps.possLetters,
        corrLetters: nextProps.corrLetters,
        corrPosition: nextProps.corrPosition,
        incPosition: nextProps.incPosition
      };

      this.props.dispatch(fetchWords(values));
    }
  }

  onStartOverClick () {
    this.props.dispatch(updateSwipeIndex(0));
    this.props.dispatch(clearWords());
  }

  render () {
    let results;
    let count;
    if (this.props.words) {
      results = this.props.words.map(word => {
        const id = makeId();
        return (
          <li key={id}>{word}</li>
        );
      });

      count = (<p>{this.props.words.length} possible solutions</p>);
    }

    return (
      <React.Fragment>
        <button onClick={() => this.onStartOverClick()}>Start Over</button>
        {count}
        <ol className='results'>
          {results}
        </ol>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  wordLength: state.words.wordLength,
  possLetters: state.words.possLetters,
  corrLetters: state.words.corrLetters,
  corrPosition: state.words.corrPosition,
  incPosition: state.words.incPosition,
  words: state.words.words
});

export default connect(mapStateToProps)(Results);
