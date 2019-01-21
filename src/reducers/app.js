import {
  UPDATE_SWIPE_INDEX
} from '../actions/app';

const initialState = {
  index: 0
};

export default function reducer (state = initialState, action) {
  if (action.type === UPDATE_SWIPE_INDEX) {
    const { index } = action;
    return Object.assign({}, state, {
      index
    });
  }
  return state;
}
