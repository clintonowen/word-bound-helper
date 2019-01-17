/* global it describe */

import React from 'react';
import { shallow } from 'enzyme';

import WordsForm from './words-form';

describe('<WordsForm />', () => {
  it('Renders without crashing', () => {
    shallow(<WordsForm />);
  });
});
