/*
 *
 * AssetGuaranteePage actions
 *
 */

import * as constants from './constants';


export function changeType(data) {
  return {
    type: constants.CHANGE_TYPE,
    data,
  };
}

export function getAssetGuarantee(id) {
  return {
    type: constants.GET_ASSET_GUARANTEE,
    id,
  };
}

export function getAssetGuaranteeSuccess(data) {
  return {
    type: constants.GET_ASSET_GUARANTEE_SUCCESS,
    data,
  };
}

export function getAssetGuaranteeFailure(data) {
  return {
    type: constants.GET_ASSET_GUARANTEE_FAILURE,
    data,
  };
}

export function createAssetGuarantee(data) {
  return {
    type: constants.CREATE_ASSET_GUARANTEE,
    data,
  };
}

export function createAssetGuaranteeSuccess(data) {
  return {
    type: constants.CREATE_ASSET_GUARANTEE_SUCCESS,
    data,
  };
}

export function createAssetGuaranteeFailure(data) {
  return {
    type: constants.CREATE_ASSET_GUARANTEE_FAILURE,
    data,
  };
}

export function updateAssetGuarantee(data) {
  return {
    type: constants.UPDATE_ASSET_GUARANTEE,
    data,
  };
}

export function updateAssetGuaranteeSuccess(data) {
  return {
    type: constants.UPDATE_ASSET_GUARANTEE_SUCCESS,
    data,
  };
}

export function updateAssetGuaranteeFailure(data) {
  return {
    type: constants.UPDATE_ASSET_GUARANTEE_FAILURE,
    data,
  };
}

export function deleteAssetGuarantee(id) {
  return {
    type: constants.DELETE_ASSET_GUARANTEE,
    id,
  };
}

export function deleteAssetGuaranteeSuccess(data) {
  return {
    type: constants.DELETE_ASSET_GUARANTEE_SUCCESS,
    data,
  };
}

export function deleteAssetGuaranteeFailure(data) {
  return {
    type: constants.DELETE_ASSET_GUARANTEE_FAILURE,
    data,
  };
}

export function getAssetGuaranteeTask(id) {
  return {
    type: constants.GET_ASSET_GUARANTEE_TASK,
    id,
  };
}

export function getAssetGuaranteeTaskSuccess(data) {
  return {
    type: constants.GET_ASSET_GUARANTEE_TASK_SUCCESS,
    data,
  };
}

export function getAssetGuaranteeTaskFailure(data) {
  return {
    type: constants.GET_ASSET_GUARANTEE_TASK_FAILURE,
    data,
  };
}

export function createAssetGuaranteeTask(data) {
  return {
    type: constants.CREATE_ASSET_GUARANTEE_TASK,
    data,
  };
}

export function createAssetGuaranteeTaskSuccess(data) {
  return {
    type: constants.CREATE_ASSET_GUARANTEE_TASK_SUCCESS,
    data,
  };
}

export function createAssetGuaranteeTaskFailure(data) {
  return {
    type: constants.CREATE_ASSET_GUARANTEE_TASK_FAILURE,
    data,
  };
}

export function updateAssetGuaranteeTask(data) {
  return {
    type: constants.UPDATE_ASSET_GUARANTEE_TASK,
    data,
  };
}

export function updateAssetGuaranteeTaskSuccess(data) {
  return {
    type: constants.UPDATE_ASSET_GUARANTEE_TASK_SUCCESS,
    data,
  };
}

export function updateAssetGuaranteeTaskFailure(data) {
  return {
    type: constants.UPDATE_ASSET_GUARANTEE_TASK_FAILURE,
    data,
  };
}

export function deleteAssetGuaranteeTask(data) {
  return {
    type: constants.DELETE_ASSET_GUARANTEE_TASK,
    data,
  };
}

export function deleteAssetGuaranteeTaskSuccess(data) {
  return {
    type: constants.DELETE_ASSET_GUARANTEE_TASK_SUCCESS,
    data,
  };
}

export function deleteAssetGuaranteeTaskFailure(data) {
  return {
    type: constants.DELETE_ASSET_GUARANTEE_TASK_FAILURE,
    data,
  };
}

//-------------------------------------------------//

export function getAssetMaintenance(id) {
  return {
    type: constants.GET_ASSET_MAINTAINER,
    id,
  };
}

export function getAssetMaintenanceSuccess(data) {
  return {
    type: constants.GET_ASSET_MAINTAINER_SUCCESS,
    data,
  };
}

export function getAssetMaintenanceFailure(data) {
  return {
    type: constants.GET_ASSET_MAINTAINER_FAILURE,
    data,
  };
}

export function createAssetMaintenance(data) {
  return {
    type: constants.CREATE_ASSET_MAINTAINER,
    data,
  };
}

export function createAssetMaintenanceSuccess(data) {
  return {
    type: constants.CREATE_ASSET_MAINTAINER_SUCCESS,
    data,
  };
}

export function createAssetMaintenanceFailure(data) {
  return {
    type: constants.CREATE_ASSET_MAINTAINER_FAILURE,
    data,
  };
}

export function updateAssetMaintenance(data) {
  return {
    type: constants.UPDATE_ASSET_MAINTAINER,
    data,
  };
}

export function updateAssetMaintenanceSuccess(data) {
  return {
    type: constants.UPDATE_ASSET_MAINTAINER_SUCCESS,
    data,
  };
}

export function updateAssetMaintenanceFailure(data) {
  return {
    type: constants.UPDATE_ASSET_MAINTAINER_FAILURE,
    data,
  };
}

export function deleteAssetMaintenance(id) {
  return {
    type: constants.DELETE_ASSET_MAINTAINER,
    id,
  };
}

export function deleteAssetMaintenanceSuccess(data) {
  return {
    type: constants.DELETE_ASSET_MAINTAINER_SUCCESS,
    data,
  };
}

export function deleteAssetMaintenanceFailure(data) {
  return {
    type: constants.DELETE_ASSET_MAINTAINER_FAILURE,
    data,
  };
}

export function getAssetMaintenanceTask(id) {
  return {
    type: constants.GET_ASSET_MAINTAINER_TASK,
    id,
  };
}

export function getAssetMaintenanceTaskSuccess(data) {
  return {
    type: constants.GET_ASSET_MAINTAINER_TASK_SUCCESS,
    data,
  };
}

export function getAssetMaintenanceTaskFailure(data) {
  return {
    type: constants.GET_ASSET_MAINTAINER_TASK_FAILURE,
    data,
  };
}

export function createAssetMaintenanceTask(data) {
  return {
    type: constants.CREATE_ASSET_MAINTAINER_TASK,
    data,
  };
}

export function createAssetMaintenanceTaskSuccess(data) {
  return {
    type: constants.CREATE_ASSET_MAINTAINER_TASK_SUCCESS,
    data,
  };
}

export function createAssetMaintenanceTaskFailure(data) {
  return {
    type: constants.CREATE_ASSET_MAINTAINER_TASK_FAILURE,
    data,
  };
}

export function updateAssetMaintenanceTask(data) {
  return {
    type: constants.UPDATE_ASSET_MAINTAINER_TASK,
    data,
  };
}

export function updateAssetMaintenanceTaskSuccess(data) {
  return {
    type: constants.UPDATE_ASSET_MAINTAINER_TASK_SUCCESS,
    data,
  };
}

export function updateAssetMaintenanceTaskFailure(data) {
  return {
    type: constants.UPDATE_ASSET_MAINTAINER_TASK_FAILURE,
    data,
  };
}

export function deleteAssetMaintenanceTask(data) {
  return {
    type: constants.DELETE_ASSET_MAINTAINER_TASK,
    data,
  };
}

export function deleteAssetMaintenanceTaskSuccess(data) {
  return {
    type: constants.DELETE_ASSET_MAINTAINER_TASK_SUCCESS,
    data,
  };
}

export function deleteAssetMaintenanceTaskFailure(data) {
  return {
    type: constants.DELETE_ASSET_MAINTAINER_TASK_FAILURE,
    data,
  };
}

export function cleanup() {
  return {
    type: constants.CLEANUP,
  };
}