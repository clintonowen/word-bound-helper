import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, getFormValues, reset } from 'redux-form';
import { updateSwipeIndex } from '../actions/app';
import { setWordLength, setPossLetters, clearWords } from '../actions/words';
import './words-form.css';

class WordsForm extends Component {
  componentWillReceiveProps (nextProps) {
    const nextValues = nextProps.values;
    const values = this.props.values;
    if (nextValues && ((nextValues && !values) || Object.keys(nextValues).some(key => nextValues[key] !== values[key]))) {
      this.props.dispatch(setPossLetters(nextValues['possLetters']));
    }
  }

  onNavClick (index, clear) {
    this.props.dispatch(updateSwipeIndex(index));
    if (clear) {
      this.props.dispatch(clearWords());
      this.props.dispatch(reset('letters'));
    }
  }

  onLengthClick (wordLength) {
    this.props.dispatch(setWordLength(wordLength));
  }

  render () {
    return (
      <React.Fragment>
        <button onClick={() => this.onNavClick(0, true)}>Start Over</button>
        <br />
        <p>Select word length:</p>
        <button onClick={() => this.onLengthClick('3')}>3</button>
        <button onClick={() => this.onLengthClick('4')}>4</button>
        <button onClick={() => this.onLengthClick('5')}>5</button>
        <button onClick={() => this.onLengthClick('6')}>6</button>
        <button onClick={() => this.onLengthClick('7')}>7</button>
        <p>Enter available letters:</p>
        <form
          className='words-form'
          onSubmit={this.props.handleSubmit(values =>
            this.onSubmit(values)
          )}>
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
