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
        <h1>WORD</h1>
        <div id='title-bound' className='title'>
          <span className='pink'>B</span>
          <span className='blue'>O</span>
          <span className='orange'>U</span>
          <span className='green'>N</span>
          <span className='pink'>D</span>
        </div>
        <div id='title-helper' className='title'>
          <span className='green'>H</span>
          <span className='green'>E</span>
          <span className='green'>L</span>
          <span className='green'>P</span>
          <span className='green'>E</span>
          <span className='green'>R</span>
        </div>
        <button onClick={() => this.handleClick(1)}>New Level</button>
      </div>
    );
  }
}

export default connect()(LandingPage);
