import {
    CREATE_ACCOUNT_REQUESTED,
    CREATE_ACCOUNT_REQUESTED_SUCCEEDED,
    CREATE_ACCOUNT_REQUESTED_FAILED,
    MERGE_DATA,
    UPDATE_ACCOUNT_REQUESTED,
    UPDATE_ACCOUNT_REQUESTED_FAILED,UPDATE_ACCOUNT_REQUESTED_SUCCEEDED,
    UPDATE_PASSWORD_REQUESTED,UPDATE_PASSWORD_REQUESTED_FAILED,
    UPDATE_PASSWORD_REQUESTED_SUCCEEDED,RESET_ACCOUNT, FECTH_ACCOUNT, FECTH_ACCOUNT_SUCCESS, FECTH_ACCOUNT_FAILER
  } from './constants';

  export function resetLtAccount(){
    return {
      type: RESET_ACCOUNT
    };
  }

  export function getLtAccount(id){
    return {
      type: FECTH_ACCOUNT,
      id,
    }
  }
  export function getLtAccountSuccess(data){
    return {
      type: FECTH_ACCOUNT_SUCCESS,
      data,
    }
  }
  export function getLtAccountFailer(error){
    return {
      type: FECTH_ACCOUNT_FAILER,
      error,
    }
  }
  
  export function createAccountRequest(data) {
    return {
      type: CREATE_ACCOUNT_REQUESTED,
      data,
    };
  }
  
  export function createAccountRequestSuccess(data) {
    return {
      type: CREATE_ACCOUNT_REQUESTED_SUCCEEDED,
      data,
    };
  }
  
  export function createcreateAccountRequestFailed(error) {
    return {
      type: CREATE_ACCOUNT_REQUESTED_FAILED,
      error,
    };
  }
  export const updateAccountRequest = data => {
    return {
      type: UPDATE_ACCOUNT_REQUESTED,
      data
    };
  };
  export const updateAccountRequestSuccess = data => {
    return {
      type: UPDATE_ACCOUNT_REQUESTED_SUCCEEDED,
      data
    };
  };
  export const updateAccountRequestFailure = action => {
    return {
      type: UPDATE_ACCOUNT_REQUESTED_FAILED,
      payload: action,
    };
  };

  export const updatePasswordRequest = data => {
    return {
      type: UPDATE_PASSWORD_REQUESTED,
      data
    };
  };
  export const updatePasswordRequestSuccess = data => {
    return {
      type: UPDATE_PASSWORD_REQUESTED_SUCCEEDED,
      data
    };
  };
  export const updatePasswordRequestFailure = action => {
    return {
      type: UPDATE_PASSWORD_REQUESTED_FAILED,
      payload: action,
    };
  };

  
  export function mergeAccountRequest(data) {
    return {
      type: MERGE_DATA,
      data,
    };
  }