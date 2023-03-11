/*
 *
 * DispatchManagerGo actions
 *
 */

import { DEFAULT_ACTION, MEGER_DATA, DELETE_DISPATCHS_GO, DELETE_DISPATCHS_GO_SUCCESS, DELETE_DISPATCHS_GO_FAIL } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
export function mergeData(data) {
  return {
    type: MEGER_DATA,
    data,
  };
}
export function deleteDispatchGoAct(data) {
  return {
    type: DELETE_DISPATCHS_GO,
    data,
  };
}
export function deleteDispatchGoSuccessAct() {
  return {
    type: DELETE_DISPATCHS_GO_SUCCESS,
  };
}
export function deleteDispatchGoFailedAct() {
  return {
    type: DELETE_DISPATCHS_GO_FAIL,
  };
}
