/*
 *
 * SocialInsurancePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  MERGE_DATA,
  CREATE_SOCIALINSURANCE,
  CREATE_SOCIALINSURANCE_SUCCESS,
  CREATE_SOCIALINSURANCE_FAILURE,
  UPDATE_SOCIALINSURANCE,
  UPDATE_SOCIALINSURANCE_SUCCESS,
  UPDATE_SOCIALINSURANCE_FAILURE,
  DELETE_SOCIALINSURANCE,
  DELETE_SOCIALINSURANCE_SUCCESS,
  DELETE_SOCIALINSURANCE_FAILURE,
} from './constants';

export const initialState = fromJS({
  isLoading: false,
  createSocialInsuranceSuccess: null,
  updateSocialInsuranceSuccess: null,
  deleteSocialInsuranceSuccess: null,
  tab: 0,
  reload: false,
});

function socialInsurancePageReducer(state = initialState, action) {
  switch (action.type) {
    case MERGE_DATA:
      return state.merge(action.data);
    case CREATE_SOCIALINSURANCE:
      return state.set('isLoading', true).set('createSocialInsuranceSuccess', null).set('reload', false);
    case CREATE_SOCIALINSURANCE_SUCCESS:
      return state.set('isLoading', false).set('createSocialInsuranceSuccess', true).set('reload', true);
    case CREATE_SOCIALINSURANCE_FAILURE:
      return state.set('isLoading', false).set('createSocialInsuranceSuccess', false).set('reload', false);
    case UPDATE_SOCIALINSURANCE:
      return state.set('isLoading', true).set('updateSocialInsuranceSuccess', null).set('reload', false);
    case UPDATE_SOCIALINSURANCE_SUCCESS:
      return state.set('isLoading', false).set('updateSocialInsuranceSuccess', true).set('reload', true);
    case UPDATE_SOCIALINSURANCE_FAILURE:
      return state.set('isLoading', false).set('updateSocialInsuranceSuccess', false).set('reload', false);
    case DELETE_SOCIALINSURANCE:
      return state.set('isLoading', true).set('deleteSocialInsuranceSuccess', null).set('reload', false);
    case DELETE_SOCIALINSURANCE_SUCCESS:
      return state.set('isLoading', false).set('deleteSocialInsuranceSuccess', true).set('reload', true);
    case DELETE_SOCIALINSURANCE_FAILURE:
      return state.set('isLoading', false).set('deleteSocialInsuranceSuccess', false).set('reload', false);
    default:
      return state;
  }
}

export default socialInsurancePageReducer;
