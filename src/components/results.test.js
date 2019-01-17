/* global it describe */

import React from 'react';
import { shallow } from 'enzyme';

import Results from './results';

describe('<Results />', () => {
  it('Renders without crashing', () => {
    shallow(<Results />);
  });
});
