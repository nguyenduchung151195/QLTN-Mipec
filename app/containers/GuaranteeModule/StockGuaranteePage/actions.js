/*
 *
 * StockGuaranteePage actions
 *
 */

import * as constants from './constants';


export function changeType(data) {
  return {
    type: constants.CHANGE_TYPE,
    data,
  };
}

export function getStockGuarantee(id) {
  return {
    type: constants.GET_STOCK_GUARANTEE,
    id,
  };
}

export function getStockGuaranteeSuccess(data) {
  return {
    type: constants.GET_STOCK_GUARANTEE_SUCCESS,
    data,
  };
}

export function getStockGuaranteeFailure(data) {
  return {
    type: constants.GET_STOCK_GUARANTEE_FAILURE,
    data,
  };
}

export function createStockGuarantee(data) {
  return {
    type: constants.CREATE_STOCK_GUARANTEE,
    data,
  };
}

export function createStockGuaranteeSuccess(data) {
  return {
    type: constants.CREATE_STOCK_GUARANTEE_SUCCESS,
    data,
  };
}

export function createStockGuaranteeFailure(data) {
  return {
    type: constants.CREATE_STOCK_GUARANTEE_FAILURE,
    data,
  };
}

export function updateStockGuarantee(data) {
  return {
    type: constants.UPDATE_STOCK_GUARANTEE,
    data,
  };
}

export function updateStockGuaranteeSuccess(data) {
  return {
    type: constants.UPDATE_STOCK_GUARANTEE_SUCCESS,
    data,
  };
}

export function updateStockGuaranteeFailure(data) {
  return {
    type: constants.UPDATE_STOCK_GUARANTEE_FAILURE,
    data,
  };
}

export function deleteStockGuarantee(id) {
  return {
    type: constants.DELETE_STOCK_GUARANTEE,
    id,
  };
}

export function deleteStockGuaranteeSuccess(data) {
  return {
    type: constants.DELETE_STOCK_GUARANTEE_SUCCESS,
    data,
  };
}

export function deleteStockGuaranteeFailure(data) {
  return {
    type: constants.DELETE_STOCK_GUARANTEE_FAILURE,
    data,
  };
}

export function getStockGuaranteeTask(id) {
  return {
    type: constants.GET_STOCK_GUARANTEE_TASK,
    id,
  };
}

export function getStockGuaranteeTaskSuccess(data) {
  return {
    type: constants.GET_STOCK_GUARANTEE_TASK_SUCCESS,
    data,
  };
}

export function getStockGuaranteeTaskFailure(data) {
  return {
    type: constants.GET_STOCK_GUARANTEE_TASK_FAILURE,
    data,
  };
}

export function createStockGuaranteeTask(data) {
  return {
    type: constants.CREATE_STOCK_GUARANTEE_TASK,
    data,
  };
}

export function createStockGuaranteeTaskSuccess(data) {
  return {
    type: constants.CREATE_STOCK_GUARANTEE_TASK_SUCCESS,
    data,
  };
}

export function createStockGuaranteeTaskFailure(data) {
  return {
    type: constants.CREATE_STOCK_GUARANTEE_TASK_FAILURE,
    data,
  };
}

export function updateStockGuaranteeTask(data) {
  return {
    type: constants.UPDATE_STOCK_GUARANTEE_TASK,
    data,
  };
}

export function updateStockGuaranteeTaskSuccess(data) {
  return {
    type: constants.UPDATE_STOCK_GUARANTEE_TASK_SUCCESS,
    data,
  };
}

export function updateStockGuaranteeTaskFailure(data) {
  return {
    type: constants.UPDATE_STOCK_GUARANTEE_TASK_FAILURE,
    data,
  };
}

export function deleteStockGuaranteeTask(data) {
  return {
    type: constants.DELETE_STOCK_GUARANTEE_TASK,
    data,
  };
}

export function deleteStockGuaranteeTaskSuccess(data) {
  return {
    type: constants.DELETE_STOCK_GUARANTEE_TASK_SUCCESS,
    data,
  };
}

export function deleteStockGuaranteeTaskFailure(data) {
  return {
    type: constants.DELETE_STOCK_GUARANTEE_TASK_FAILURE,
    data,
  };
}

//-------------------------------------------------//

export function getStockMaintenance(id) {
  return {
    type: constants.GET_STOCK_MAINTAINER,
    id,
  };
}

export function getStockMaintenanceSuccess(data) {
  return {
    type: constants.GET_STOCK_MAINTAINER_SUCCESS,
    data,
  };
}

export function getStockMaintenanceFailure(data) {
  return {
    type: constants.GET_STOCK_MAINTAINER_FAILURE,
    data,
  };
}

export function createStockMaintenance(data) {
  return {
    type: constants.CREATE_STOCK_MAINTAINER,
    data,
  };
}

export function createStockMaintenanceSuccess(data) {
  return {
    type: constants.CREATE_STOCK_MAINTAINER_SUCCESS,
    data,
  };
}

export function createStockMaintenanceFailure(data) {
  return {
    type: constants.CREATE_STOCK_MAINTAINER_FAILURE,
    data,
  };
}

export function updateStockMaintenance(data) {
  return {
    type: constants.UPDATE_STOCK_MAINTAINER,
    data,
  };
}

export function updateStockMaintenanceSuccess(data) {
  return {
    type: constants.UPDATE_STOCK_MAINTAINER_SUCCESS,
    data,
  };
}

export function updateStockMaintenanceFailure(data) {
  return {
    type: constants.UPDATE_STOCK_MAINTAINER_FAILURE,
    data,
  };
}

export function deleteStockMaintenance(id) {
  return {
    type: constants.DELETE_STOCK_MAINTAINER,
    id,
  };
}

export function deleteStockMaintenanceSuccess(data) {
  return {
    type: constants.DELETE_STOCK_MAINTAINER_SUCCESS,
    data,
  };
}

export function deleteStockMaintenanceFailure(data) {
  return {
    type: constants.DELETE_STOCK_MAINTAINER_FAILURE,
    data,
  };
}

export function getStockMaintenanceTask(id) {
  return {
    type: constants.GET_STOCK_MAINTAINER_TASK,
    id,
  };
}

export function getStockMaintenanceTaskSuccess(data) {
  return {
    type: constants.GET_STOCK_MAINTAINER_TASK_SUCCESS,
    data,
  };
}

export function getStockMaintenanceTaskFailure(data) {
  return {
    type: constants.GET_STOCK_MAINTAINER_TASK_FAILURE,
    data,
  };
}

export function createStockMaintenanceTask(data) {
  return {
    type: constants.CREATE_STOCK_MAINTAINER_TASK,
    data,
  };
}

export function createStockMaintenanceTaskSuccess(data) {
  return {
    type: constants.CREATE_STOCK_MAINTAINER_TASK_SUCCESS,
    data,
  };
}

export function createStockMaintenanceTaskFailure(data) {
  return {
    type: constants.CREATE_STOCK_MAINTAINER_TASK_FAILURE,
    data,
  };
}

export function updateStockMaintenanceTask(data) {
  return {
    type: constants.UPDATE_STOCK_MAINTAINER_TASK,
    data,
  };
}

export function updateStockMaintenanceTaskSuccess(data) {
  return {
    type: constants.UPDATE_STOCK_MAINTAINER_TASK_SUCCESS,
    data,
  };
}

export function updateStockMaintenanceTaskFailure(data) {
  return {
    type: constants.UPDATE_STOCK_MAINTAINER_TASK_FAILURE,
    data,
  };
}

export function deleteStockMaintenanceTask(data) {
  return {
    type: constants.DELETE_STOCK_MAINTAINER_TASK,
    data,
  };
}

export function deleteStockMaintenanceTaskSuccess(data) {
  return {
    type: constants.DELETE_STOCK_MAINTAINER_TASK_SUCCESS,
    data,
  };
}

export function deleteStockMaintenanceTaskFailure(data) {
  return {
    type: constants.DELETE_STOCK_MAINTAINER_TASK_FAILURE,
    data,
  };
}

export function cleanup() {
  return {
    type: constants.CLEANUP,
  };
}