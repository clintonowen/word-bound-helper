import React, { Component } from 'react';
import { Field, reduxForm, focus } from 'redux-form';
import { fetchWords } from '../actions/words';
import Input from './input';
import { required, nonEmpty } from '../validators';
import './words-form.css';

export class WordsForm extends Component {
  onSubmit (values) {
    return this.props.dispatch(fetchWords(values));
  }

  render () {
    return (
      <form
        className='words-form'
        onSubmit={this.props.handleSubmit(values =>
          this.onSubmit(values)
        )}>
        <label htmlFor='wordLength'>Word Length</label>
        <Field
          id='wordLength'
          component='select'
          type='text'
          name='wordLength'
          validate={[required, nonEmpty]}
          placeholder='Choose word length'
        >
          <option value='' disabled>Choose word length</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
          <option value='4'>4</option>
          <option value='5'>5</option>
          <option value='6'>6</option>
          <option value='7'>7</option>
          <option value='8'>8</option>
        </Field>
        <Field
          id='possLetters'
          label='Possible Letters'
          component={Input}
          type='text'
          name='possLetters'
          validate={[required, nonEmpty]}
        />
        <Field
          id='corrLetters'
          label='Correct Letters'
          component={Input}
          type='text'
          name='corrLetters'
          // validate={[]}
        />
        <Field
          id='corrPosition'
          label='Correct Position'
          component={Input}
          type='text'
          name='corrPosition'
          // validate={[]}
        />
        <Field
          id='incPosition'
          label='Incorrect Position'
          component={Input}
          type='text'
          name='incPosition'
          // validate={[]}
        />
        <button
          type='submit'
          disabled={!this.props.valid || this.props.submitting}>
          Submit
        </button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'words',
  onSubmitFail: (errors, dispatch) => dispatch(focus('words', Object.keys(errors)[0]))
})(WordsForm);
