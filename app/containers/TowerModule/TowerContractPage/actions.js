/*
 *
 * TowerContractPage actions
 *
 */

import {
  DELETE_CONTRACT,
  DELETE_CONTRACT_FAILURE,
  DELETE_CONTRACT_SUCCESS,
  GET_ALL_STATUS,
  GET_ALL_STATUS_SUCCESS,
  GET_ALL_STATUS_FAIL,
  GET_FEE,
  GET_FEE_FAILURE,
  GET_FEE_SUCCESS,
  CREATE_CONTRACT,
  CREATE_CONTRACT_FAILURE,
  CREATE_CONTRACT_SUCCESS,
  UPDATE_CONTRACT,
  UPDATE_CONTRACT_FAILURE,
  UPDATE_CONTRACT_SUCCESS,
  CLEANUP,
  GET_MODULE_FEE,
  GET_MODULE_FEE_SUCCESS,
  GET_MODULE_FEE_FAILURE,
  SEND_MAIL_FEES,
  SEND_MAIL_FEES_SUCCESS,
  SEND_MAIL_FEES_FAILURE,
  SEND_NOTI_FEES,
  SEND_NOTI_FEES_SUCCESS,
  SEND_NOTI_FEES_FAILURE,
  GET_ALL_FEES,
  GET_ALL_FEES_SUCCESS,
  GET_ALL_FEES_FAILURE,
} from './constants';

export function getFee(id) {
  return {
    type: GET_FEE,
    id,
  };
}

export function getFeeSuccess(data) {
  return {
    type: GET_FEE_SUCCESS,
    data,
  };
}

export function getFeeFailure(data) {
  return {
    type: GET_FEE_FAILURE,
    data,
  };
}
// export function fetchAllStatusAction(id, currentType) {
//   return {
//     type: GET_ALL_STATUS,
//     id,
//     currentType,
//   };
// }
export function fetchAllStatusAction(currentType) {
  return {
    type: GET_ALL_STATUS,
    currentType,
  };
}
export function fetchAllStatusSuccessAction(data, message) {
  return {
    type: GET_ALL_STATUS_SUCCESS,
    data,
    message,
  };
}
export function fetchAllStatusFailAction(err, message) {
  return {
    type: GET_ALL_STATUS_FAIL,
    err,
    message,
  };
}
export function createContract(fees) {
  return {
    type: CREATE_CONTRACT,
    fees,
  };
}

export function createContractSuccess(data) {
  return {
    type: CREATE_CONTRACT_SUCCESS,
    data,
  };
}

export function createContractFailure(data) {
  return {
    type: CREATE_CONTRACT_FAILURE,
    data,
  };
}

export function updateContract(fees) {
  return {
    type: UPDATE_CONTRACT,
    fees,
  };
}

export function updateContractSuccess(data) {
  return {
    type: UPDATE_CONTRACT_SUCCESS,
    data,
  };
}

export function updateContractFailure(data) {
  return {
    type: UPDATE_CONTRACT_FAILURE,
    data,
  };
}

export function deleteContract(id) {
  return {
    type: DELETE_CONTRACT,
    id,
  };
}

export function deleteContractSuccess(data) {
  return {
    type: DELETE_CONTRACT_SUCCESS,
    data,
  };
}

export function deleteContractFailure(data) {
  return {
    type: DELETE_CONTRACT_FAILURE,
    data,
  };
}

export function cleanup() {
  return {
    type: CLEANUP,
  };
}

export function getModuleFee() {
  return {
    type: GET_MODULE_FEE,
  };
}
export function getModuleFeeSuccess(data) {
  return {
    type: GET_MODULE_FEE_SUCCESS,
    data,
  };
}
export function getModuleFeeFailure(error) {
  return {
    type: GET_MODULE_FEE_FAILURE,
    error,
  };
}

export function sendMailFees(data) {
  return {
    type: SEND_MAIL_FEES,
    data,
  };
}
export function sendMailFeesSuccess(data) {
  return {
    type: SEND_MAIL_FEES_SUCCESS,
    data,
  };
}
export function sendMailFeesFailure(error) {
  return {
    type: SEND_MAIL_FEES_FAILURE,
    error,
  };
}

export function sendNotiFees(data) {
  return {
    type: SEND_NOTI_FEES,
    data,
  };
}
export function sendNotiFeesSuccess(data) {
  return {
    type: SEND_NOTI_FEES_SUCCESS,
    data,
  };
}
export function sendNotiFeesFailure(error) {
  return {
    type: SEND_NOTI_FEES_FAILURE,
    error,
  };
}

export function getAllFees() {
  return {
    type: GET_ALL_FEES,
  };
}
export function getAllFeesSuccess(data) {
  return {
    type: GET_ALL_FEES_SUCCESS,
    data,
  };
}
export function getAllFeesFailure(error) {
  return {
    type: GET_ALL_FEES_FAILURE,
    error,
  };
}
