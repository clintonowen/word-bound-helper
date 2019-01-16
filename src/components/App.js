import React, { Component } from 'react';
import WordsForm from './words-form';
import Results from './results';
import './App.css';

class App extends Component {
  render () {
    return (
      <div className='App'>
        <WordsForm />
        <Results />
      </div>
    );
  }
}

export default App;
