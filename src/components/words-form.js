import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, getFormValues, reset } from 'redux-form';
import { updateSwipeIndex } from '../actions/app';
import { setWordLength, setPossLetters, clearWords } from '../actions/words';
import { makeId } from '../actions/utils';
import './words-form.css';

class WordsForm extends Component {
  onSubmit (event) {
    event.preventDefault();
  }

  onNavClick (index, clear) {
    const { wordLength } = this.props;
    if (wordLength && this.props.values && this.props.values.possLetters && !clear) {
      const possLetters = this.props.values.possLetters.replace(/[^a-zA-Z]+/g, '').toLowerCase().split('');
      this.props.dispatch(setPossLetters(possLetters));
      this.props.dispatch(updateSwipeIndex(index));
    } else if (clear) {
      this.props.dispatch(updateSwipeIndex(index));
      this.props.dispatch(clearWords());
      this.props.dispatch(reset('letters'));
    }
  }

  onLengthClick (wordLength) {
    this.props.dispatch(setWordLength(wordLength));
  }

  render () {
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
      <React.Fragment>
        <button onClick={() => this.onNavClick(0, true)}>Start Over</button>
        <br />
        <p>Select word length:</p>
        {numbers}
        <p>Enter available letters:</p>
        <form
          className='words-form'
          onSubmit={e => this.onSubmit(e)}
        >
          <Field
            id='possLetters'
            label='Possible Letters'
            component='input'
            type='text'
            name='possLetters'
          />
        </form>
        <button onClick={() => this.onNavClick(2)}>Continue</button>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  wordLength: state.words.query.wordLength,
  possLetters: state.words.query.possLetters,
  values: getFormValues('letters')(state)
});

export default reduxForm({
  form: 'letters'
})(connect(mapStateToProps)(WordsForm));
