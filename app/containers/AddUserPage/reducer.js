/*
 *
 * AddUserPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  GET_DEPARTMENT,
  GET_DEPARTMENT_SUCCESS,
  GET_DEPARTMENT_FAILED,
  RESET_NOTI,
  ADD_USER,
  ADD_USER_SUCCESS,
  ADD_USER_FALSE,
  EDIT_USER,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAILED,
  GET_USER,
  GET_USER_SUCCESS,
  GET_USER_FAILED,
  GET_MODULE,
  GET_MODULE_SUCCESS,
  GET_MODULE_ERROR,
  MERGE,
  GET_ROLE_APP,
  GET_ROLE_APP_SUCCESS,
  GET_ROLE_APP_FAILED,
  EDIT_NEW_PASS,
  EDIT_NEW_PASS_SUCCESS,
  EDIT_NEW_PASS_FAILED,
} from './constants';

export const initialState = fromJS({
  listOrganizationUnit: [],
  listRoleApp: null,
  roleGroups: [],
  changePass: false,
});

function addUserPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE:
      return state.merge(action.data);
    case RESET_NOTI:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('changePass', false);
    case GET_DEPARTMENT:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('body', action.body);
    case GET_DEPARTMENT_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('listOrganizationUnit', action.data);
    case GET_DEPARTMENT_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ROLE_APP:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('body', action.body);
    case GET_ROLE_APP_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('error', false)
        .set('listRoleApp', action.data);
    case GET_ROLE_APP_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case ADD_USER:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('body', action.body);
    case ADD_USER_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case ADD_USER_FALSE:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', true);
    case EDIT_USER:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', false)
        .set('body', action.body);
    case EDIT_USER_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case EDIT_USER_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('successCreate', false)
        .set('error', true);
    case GET_USER:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('body', action.body);
    case GET_USER_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('user', action.data.user)
        .set('role', action.data.role)
        .set('error', false);
    case GET_USER_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_MODULE:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_MODULE_SUCCESS:
      return state
        .set('loading', false)
        .set('success', true)
        .set('modules', action.data.data)
        .set('roleGroups', action.data.roleGroups)
        .set('error', false);
    case GET_MODULE_ERROR:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case EDIT_NEW_PASS:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', false)
        .set('body', action.body);
    case EDIT_NEW_PASS_SUCCESS:
      return state
        .set('loading', false)
        .set('error', false)
        .set('changePass', true);
    case EDIT_NEW_PASS_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('changePass', false);
    // .set('error', true);
    default:
      return state;
  }
}

export default addUserPageReducer;
