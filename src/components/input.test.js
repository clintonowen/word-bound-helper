/* global it describe */

import React from 'react';
import { shallow } from 'enzyme';

import Input from './input';

describe('<Input />', () => {
  const input = {
    name: 'possLetters',
    value: ''
  };
  const meta = {
    invalid: 'true',
    pristine: 'true'
  };

  it('Renders without crashing', () => {
    shallow(<Input
      id='possLetters'
      input={input}
      label='Possible Letters'
      meta={meta}
      type='text' />);
  });
});
