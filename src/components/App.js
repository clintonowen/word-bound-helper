import React, { Component } from 'react';
import { connect } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';
import { virtualize, bindKeyboard } from 'react-swipeable-views-utils';
import { mod } from 'react-swipeable-views-core';
import { updateSwipeIndex } from '../actions/app';
import LandingPage from './landing-page';
import WordsForm from './words-form';
import Results from './results';
import './App.css';

const VirtualizeSwipeableViews = bindKeyboard(virtualize(SwipeableViews));

const styles = {
  slide: {
    backgroundColor: '#766E8E',
    padding: 15,
    minHeight: 100,
    color: '#fff'
  }
  // slide1: {
  //   backgroundColor: '#FEA900'
  // },
  // slide2: {
  //   backgroundColor: '#B3DC4A'
  // },
  // slide3: {
  //   backgroundColor: '#6AC0FF'
  // }
};

function slideRenderer (params) {
  const { index, key } = params;
  let style;
  let component;

  switch (mod(index, 3)) {
    case 0:
      style = styles.slide1;
      component = (<LandingPage />);
      break;

    case 1:
      style = styles.slide2;
      component = (<WordsForm />);
      break;

    case 2:
      style = styles.slide3;
      component = (<Results />);
      break;

    default:
      break;
  }

  return (
    <div style={Object.assign({}, styles.slide, style)} key={key}>
      {component}
    </div>
  );
}

class App extends Component {
  constructor (props) {
    super(props);
    this.state = { index: 0 };
  }

  handleChangeIndex (index) {
    this.props.dispatch(updateSwipeIndex(index));
  }

  render () {
    return (
      <div>
        <VirtualizeSwipeableViews
          index={this.props.swipeIndex}
          onChangeIndex={this.handleChangeIndex}
          slideRenderer={slideRenderer}
          disabled
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  swipeIndex: state.app.index
});

export default connect(mapStateToProps)(App);
