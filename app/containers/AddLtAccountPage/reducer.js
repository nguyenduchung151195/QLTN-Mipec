import { fromJS } from 'immutable';
import {
  CREATE_ACCOUNT_REQUESTED, CREATE_ACCOUNT_REQUESTED_SUCCEEDED,
  CREATE_ACCOUNT_REQUESTED_FAILED,
  UPDATE_ACCOUNT_REQUESTED, UPDATE_ACCOUNT_REQUESTED_SUCCEEDED,
  UPDATE_ACCOUNT_REQUESTED_FAILED,
  UPDATE_PASSWORD_REQUESTED_SUCCEEDED, UPDATE_PASSWORD_REQUESTED_FAILED,
  UPDATE_PASSWORD_REQUESTED,
  MERGE_DATA, RESET, FECTH_ACCOUNT, FECTH_ACCOUNT_SUCCESS, FECTH_ACCOUNT_FAILER, RESET_ACCOUNT
} from './constants';

export const initialState = fromJS({
  loading: false,
  createAccountRequestSuccess: null,
  updateAccountRequestSuccess: null,
  updatePasswordRequestSuccess: null,
  data: {}
});

function accountRequestReducer(state = initialState, action) {
  switch (action.type) {
    case RESET_ACCOUNT: {
      return initialState;
    }
    case FECTH_ACCOUNT: {
      return state.set('loading', true).set('data', {});
    }
    case FECTH_ACCOUNT_SUCCESS: {
      return state.set('loading', false).set('data', action.data);
    }
    case FECTH_ACCOUNT_FAILER: {
      return state.set('loading', false).set('data', action.data);
    }
    case CREATE_ACCOUNT_REQUESTED:
      return state.set('loading', true).set('createAccountRequestSuccess', null);
    case CREATE_ACCOUNT_REQUESTED_SUCCEEDED:
      return state.set('loading', false).set('createAccountRequestSuccess', true);
    case CREATE_ACCOUNT_REQUESTED_FAILED:
      return state.set('loading', false).set('createAccountRequestSuccess', false);

    case UPDATE_ACCOUNT_REQUESTED:
      return state.set('loading', true).set('updateAccountRequestSuccess', null);
    case UPDATE_ACCOUNT_REQUESTED_SUCCEEDED:
      return state.set('loading', false).set('updateAccountRequestSuccess', true);
    case UPDATE_ACCOUNT_REQUESTED_FAILED:
      return state.set('loading', false).set('updateAccountRequestSuccess', false);

    case UPDATE_PASSWORD_REQUESTED:
      return state.set('updatePasswordRequestSuccess', null);
    case UPDATE_PASSWORD_REQUESTED_SUCCEEDED:
      return state.set('updatePasswordRequestSuccess', true);
    case UPDATE_PASSWORD_REQUESTED_FAILED:
      return state.set('updatePasswordRequestSuccess', false);

    case MERGE_DATA:
      return state.merge(action.data);

    default:
      return state;
  }
}

export default accountRequestReducer;
