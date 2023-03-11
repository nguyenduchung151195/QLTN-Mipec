/*
 *
 * ReportHrmPage actions
 *
 */

import { DEFAULT_ACTION, MERGE_DATA, GET_API, GET_API_SUCCESS } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}
export function getApi() {
  return {
    type: GET_API,
  };
}
export function getApiSuccess(personnel, catagory) {
  return {
    type: GET_API_SUCCESS,
    personnel,
    catagory,
  };
}
