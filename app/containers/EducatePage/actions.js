/*
 *
 * EducatePage actions
 *
 */

import { DEFAULT_ACTION,
  CREATE_EDUCATE,
  CREATE_EDUCATE_SUCCESS,
  CREATE_EDUCATE_FAILURE,
  UPDATE_EDUCATE,
  UPDATE_EDUCATE_SUCCESS,
  UPDATE_EDUCATE_FAILURE,
  DELETE_EDUCATE,
  DELETE_EDUCATE_SUCCESS,
  DELETE_EDUCATE_FAILURE, } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function createEducate(data) {
  return {
    type: CREATE_EDUCATE,
    data,
  };
}

export function createEducateSuccess(data) {
  return {
    type: CREATE_EDUCATE_SUCCESS,
    data,
  };
}

export function createEducateFailure(error) {
  return {
    type: CREATE_EDUCATE_FAILURE,
    error,
  };
}

export function updateEducate(hrmEmployeeId, data) {
  return {
    type: UPDATE_EDUCATE,
    hrmEmployeeId,
    data,
  };
}

export function updateEducateSuccess(data) {
  return {
    type: UPDATE_EDUCATE_SUCCESS,
    data,
  };
}

export function updateEducateFailure(error) {
  return {
    type: UPDATE_EDUCATE_FAILURE,
    error,
  };
}

export function deleteEducate(hrmEmployeeId, ids) {
  return {
    type: DELETE_EDUCATE,
    hrmEmployeeId,
    ids
  };
}

export function deleteEducateSuccess(data) {
  return {
    type: DELETE_EDUCATE_SUCCESS,
    data,
  };
}

export function deleteEducateFailure(error) {
  return {
    type: DELETE_EDUCATE_FAILURE,
    error,
  };
}