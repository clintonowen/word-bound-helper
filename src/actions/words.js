

import { API_BASE_URL } from '../config';
import { normalizeResponseErrors } from './utils';

export const ACTION_REQUEST = 'ACTION_REQUEST';
export const actionRequest = () => ({
  type: ACTION_REQUEST
});

export const ACTION_SUCCESS = 'ACTION_SUCCESS';
export const actionSuccess = data => ({
  type: ACTION_SUCCESS,
  data
});

export const ACTION_ERROR = 'ACTION_ERROR';
export const actionError = error => ({
  type: ACTION_ERROR,
  error
});

export const asyncAction = data => dispatch => {
  dispatch(actionRequest());
  return window.fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => normalizeResponseErrors(res))
    .then(res => {
      dispatch(actionSuccess(res.json()));
    })
    .catch(err => dispatch(actionError(err)));
};
