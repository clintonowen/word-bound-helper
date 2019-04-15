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
        let id = makeId();
        let color = 'Blue';
        if (`${i}` === this.props.wordLength) {
          color = 'Orange';
        }
        numbers.push((
          <div key={id} className='number-picker'>
            <button
              onClick={() => this.onLengthClick(`${i}`)}
            >
              <img
                className='number-option'
                src={`/img/numbers-${color.toLowerCase()}/${i}.png`}
                alt={`${color} ${i}`}
              />
            </button>
          </div>
        ));
      }
      return (
        <div id='words-form'>
          <button onClick={() => this.onNavClick(0, true)}>Start Over</button>
          <br />
          <p>Select word length:</p>
          {numbers}
          <form
            className='words-form'
            onSubmit={e => this.onSubmit(e)}
          >
            <label htmlFor='possible-letters'>
              Enter available letters:
            </label>
            <input type='text'
              id='possible-letters'
              value={this.state.possLetters}
              onChange={e => this.setLetters(e.target.value)}
            />
            <br />
            <button disabled={!this.state.wordLength || !this.state.possLetters}>
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
