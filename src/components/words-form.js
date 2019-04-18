import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateSwipeIndex } from '../actions/app';
import { setWordLength, setPossLetters, clearWords } from '../actions/words';
import { makeId } from '../actions/utils';
import './words-form.css';

class WordsForm extends Component {
  constructor (props) {
    super(props);
    this.state = {
      possLetters: '',
      wordLength: null
    };
  }

  onSubmit (event) {
    event.preventDefault();
    this.onNavClick(2);
  }

  onNavClick (index, clear) {
    let { wordLength, possLetters } = this.state;
    if (wordLength && possLetters && !clear) {
      possLetters = possLetters.replace(/[^a-zA-Z]+/g, '').toLowerCase().split('');
      this.props.dispatch(setPossLetters(possLetters));
      this.props.dispatch(updateSwipeIndex(index));
    } else if (clear) {
      this.props.dispatch(updateSwipeIndex(index));
      this.props.dispatch(clearWords());
    }
    this.setState({
      possLetters: '',
      wordLength: null
    });
  }

  onLengthClick (wordLength) {
    this.setState({ wordLength });
    this.props.dispatch(setWordLength(wordLength));
  }

  setLetters (possLetters) {
    this.setState({ possLetters });
  }

  render () {
    if (this.props.loading) {
      return (
        <p>
          Searching for possible words...
        </p>
      );
    } else {
      let numbers = [];
      for (let i = 3; i <= 7; i++) {
        const id = makeId();
        let color = 'Blue';
        if (i === this.props.wordLength) {
          color = 'Orange';
        }
        const selected = color === 'Blue' ? 'Unselected' : 'Selected';
        numbers.push((
          <button
            key={id}
            className={`number-option ${color.toLowerCase()}`}
            type='button'
            onClick={() => this.onLengthClick(i)}
            title={`${i} ${selected}`}
          >
            {i}
          </button>
        ));
      }
      return (
        <div id='words-form'>
          <button
            className='nav-button pink'
            onClick={() => this.onNavClick(0, true)}
          >
            Start Over
          </button>
          <br />
          <form
            className='words-form'
            onSubmit={e => this.onSubmit(e)}
          >
            <label>
              Select word length:
            </label>
            {numbers}
            <label htmlFor='possible-letters'>
              Enter available letters:
            </label>
            <input type='text'
              id='possible-letters'
              value={this.state.possLetters}
              onChange={e => this.setLetters(e.target.value)}
            />
            <br />
            <button
              className='nav-button green'
              type='submit'
              disabled={!this.state.wordLength || !this.state.possLetters}
            >
              Continue
            </button>
          </form>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  loading: state.words.loading,
  wordLength: state.words.query.wordLength,
  possLetters: state.words.query.possLetters
});

export default connect(mapStateToProps)(WordsForm);
