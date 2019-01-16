import React, { Component } from 'react';
import { connect } from 'react-redux';
import { makeId } from '../actions/utils';
import './results.css';

class Results extends Component {
  render () {
    let results = this.props.words.map(word => {
      const id = makeId();
      return (
        <li key={id}>{word}</li>
      );
    });
    let count = (this.props.words.length > 0)
      ? (<p>{this.props.words.length} results:</p>)
      : null;
    return (
      <React.Fragment>
        {count}
        <ol className='results'>
          {results}
        </ol>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  words: state.words.words
});

export default connect(mapStateToProps)(Results);
