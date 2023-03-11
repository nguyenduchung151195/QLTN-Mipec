/*
 *
 * TowerContractPage reducer
 *
 */

import { fromJS } from 'immutable';
import * as constants from './constants';

export const initialState = fromJS({
  fee: null,
  loading: false,
  createSuccess: null,
  updateSuccess: null,
  deleteSuccess: null,
  templates: [],
  fees_data: [],
});

function towerContractPageReducer(state = initialState, action) {
  switch (action.type) {
    case constants.GET_FEE:
      return state.set('loading', true).set('success', null);
    case constants.GET_ALL_STATUS:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case constants.GET_ALL_STATUS_FAIL:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case constants.GET_ALL_STATUS_SUCCESS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('listStatus', action.data);
    case constants.GET_FEE_SUCCESS:
      return state
        .set('loading', false)
        .set('fee', action.data)
        .set('success', true);
    case constants.GET_FEE_FAILURE:
      return state
        .set('loading', false)
        .set('success', false)
        .set('fee', null);

    case constants.CREATE_CONTRACT:
      return state.set('loading', true).set('createSuccess', null);
    case constants.CREATE_CONTRACT_SUCCESS:
      return state.set('loading', false).set('createSuccess', true);
    case constants.CREATE_CONTRACT_FAILURE:
      return state.set('loading', false).set('createSuccess', false);

    case constants.UPDATE_CONTRACT:
      return state.set('loading', true).set('updateSuccess', null);
    case constants.UPDATE_CONTRACT_SUCCESS:
      return state.set('loading', false).set('updateSuccess', true);
    case constants.UPDATE_CONTRACT_FAILURE:
      return state.set('loading', false).set('updateSuccess', false);

    case constants.DELETE_CONTRACT:
      return state.set('loading', true).set('deleteSuccess', null);
    case constants.DELETE_CONTRACT_SUCCESS:
      return state.set('loading', false).set('deleteSuccess', true);
    case constants.DELETE_CONTRACT_FAILURE:
      return state.set('loading', false).set('deleteSuccess', false);

    case constants.CLEANUP:
      return state
        .set('loading', false)
        .set('fee', null)
        .set('createSuccess', null)
        .set('updateSuccess', null)
        .set('deleteSuccess', null);
    case constants.GET_MODULE_FEE_SUCCESS:
      return state.set('templates', action.data);
    case constants.GET_ALL_FEES_SUCCESS:
      return state.set('fees_data', action.data);
    default:
      return state;
  }
}

export default towerContractPageReducer;
