import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateSwipeIndex } from '../actions/app';
import './landing-page.css';

class LandingPage extends Component {
  handleClick (index) {
    this.props.dispatch(updateSwipeIndex(index));
  }

  render () {
    return (
      <div id='landing-page'>
        <h1>Word Bound Helper</h1>
        <button onClick={() => this.handleClick(1)}>New Level</button>
      </div>
    );
  }
}

export default connect()(LandingPage);
