/*
 *
 * AddUserPage actions
 *
 */

import {
  DEFAULT_ACTION,
  ADD_USER_SUCCESS,
  ADD_USER,
  ADD_USER_FALSE,
  GET_DEPARTMENT_SUCCESS,
  GET_DEPARTMENT,
  GET_DEPARTMENT_FAILED,
  RESET_NOTI,
  EDIT_USER,
  EDIT_USER_FAILED,
  EDIT_USER_SUCCESS,
  GET_USER,
  MERGE,
  GET_USER_SUCCESS,
  GET_USER_FAILED,
  GET_MODULE,
  GET_MODULE_SUCCESS,
  GET_MODULE_ERROR,
  GET_ROLE_APP,
  GET_ROLE_APP_FAILED,
  GET_ROLE_APP_SUCCESS,
  EDIT_NEW_PASS,
  EDIT_NEW_PASS_SUCCESS,
  EDIT_NEW_PASS_FAILED
} from './constants';

export function getRoleApp(id) {
  return {
    type: GET_ROLE_APP,
    id,
  };
}

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function addUserAction(body) {
  return {
    type: ADD_USER,
    body,
  };
}
export function addUserSuccessAction(data) {
  return {
    type: ADD_USER_SUCCESS,
    data,
  };
}
export function addUserFalseAction(err) {
  return {
    type: ADD_USER_FALSE,
    err,
  };
}

export function getDepartmentAct(body) {
  return {
    type: GET_DEPARTMENT,
    body,
  };
}
export function getDepartmentSuccess(data) {
  return {
    type: GET_DEPARTMENT_SUCCESS,
    data,
  };
}
export function getDepartmentFailed(err) {
  return {
    type: GET_DEPARTMENT_FAILED,
    err,
  };
}
export function getRoleAppSuccess(data) {
  return {
    type: GET_ROLE_APP_SUCCESS,
    data,
  };
}
export function getRoleAppFailed(err) {
  return {
    type: GET_ROLE_APP_FAILED,
    err,
  };
}
export function resetNoti() {
  return {
    type: RESET_NOTI,
  };
}

export function editUserAct(body) {
  return {
    type: EDIT_USER,
    body,
  };
}
export function editUserSuccess(data) {
  return {
    type: EDIT_USER_SUCCESS,
    data,
  };
}
export function editUserFailed(err) {
  return {
    type: EDIT_USER_FAILED,
    err,
  };
}

export function getUserAct(body) {
  return {
    type: GET_USER,
    body,
  };
}
export function merge(data) {
  return {
    type: MERGE,
    data,
  };
}
export function getUserSuccess(data) {
  return {
    type: GET_USER_SUCCESS,
    data,
  };
}
export function getUserFailed(err) {
  return {
    type: GET_USER_FAILED,
    err,
  };
}
export function getModuleAct(body) {
  return {
    type: GET_MODULE,
    body,
  };
}
export function getmoduleSuccess(data) {
  return {
    type: GET_MODULE_SUCCESS,
    data,
  };
}
export function getModuleFailed(err) {
  return {
    type: GET_MODULE_ERROR,
    err,
  };
}

export function updateNewPass(body) {
  return {
    type: EDIT_NEW_PASS,
    body,
  };
}
export function updateNewPassSuccess(data) {
  return {
    type: EDIT_NEW_PASS_SUCCESS,
    data,
  };
}
export function updateNewPassFailed(err) {
  return {
    type: EDIT_NEW_PASS_FAILED,
    err,
  };
}
