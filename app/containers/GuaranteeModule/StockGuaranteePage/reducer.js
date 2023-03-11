/*
 *
 * StockGuaranteePage reducer
 *
 */

import { fromJS } from 'immutable';
import * as constants from './constants';

export const initialState = fromJS({
  stockGuarantee: {},
  stockMaintenance: {},
  type: 0,
});

function stockGuaranteePageReducer(state = initialState, action) {
  switch (action.type) {
    case constants.CHANGE_TYPE:
      return state.set('type', action.data);
    case constants.GET_STOCK_GUARANTEE:
      return state.set('loading', true).set('success', null);
    case constants.GET_STOCK_GUARANTEE_SUCCESS:
      return state
        .set('loading', false)
        .set('stockGuarantee', action.data)
        .set('success', true);
    case constants.GET_STOCK_GUARANTEE_FAILURE:
      return state
        .set('loading', false)
        .set('success', false)
        .set('stockGuarantee', null);

    case constants.CREATE_STOCK_GUARANTEE:
      return state.set('loading', true).set('createSuccess', null);
    case constants.CREATE_STOCK_GUARANTEE_SUCCESS:
      return state.set('loading', false).set('createSuccess', true);
    case constants.CREATE_STOCK_GUARANTEE_FAILURE:
      return state.set('loading', false).set('createSuccess', false);

    case constants.UPDATE_STOCK_GUARANTEE:
      return state.set('loading', true).set('updateSuccess', null);
    case constants.UPDATE_STOCK_GUARANTEE_SUCCESS:
      return state.set('loading', false).set('updateSuccess', true);
    case constants.UPDATE_STOCK_GUARANTEE_FAILURE:
      return state.set('loading', false).set('updateSuccess', false);

    case constants.DELETE_STOCK_GUARANTEE:
      return state.set('loading', true).set('deleteSuccess', null);
    case constants.DELETE_STOCK_GUARANTEE_SUCCESS:
      return state.set('loading', false).set('deleteSuccess', true);
    case constants.DELETE_STOCK_GUARANTEE_FAILURE:
      return state.set('loading', false).set('deleteSuccess', false);

    case constants.GET_STOCK_GUARANTEE_TASK:
      return state.set('loading', true).set('success', null);
    case constants.GET_STOCK_GUARANTEE_TASK_SUCCESS:
      return state
        .set('loading', false)
        .set('stockGuarantee', action.data)
        .set('success', true);
    case constants.GET_STOCK_GUARANTEE_TASK_FAILURE:
      return state
        .set('loading', false)
        .set('success', false)
        .set('stockGuarantee', null);

    case constants.CREATE_STOCK_GUARANTEE_TASK:
      return state.set('loading', true).set('createTaskSuccess', null);
    case constants.CREATE_STOCK_GUARANTEE_TASK_SUCCESS:
      return state.set('loading', false).set('createTaskSuccess', true);
    case constants.CREATE_STOCK_GUARANTEE_TASK_FAILURE:
      return state.set('loading', false).set('createTaskSuccess', false);

    case constants.UPDATE_STOCK_GUARANTEE_TASK:
      return state.set('loading', true).set('updateTaskSuccess', null);
    case constants.UPDATE_STOCK_GUARANTEE_TASK_SUCCESS:
      return state.set('loading', false).set('updateTaskSuccess', true);
    case constants.UPDATE_STOCK_GUARANTEE_TASK_FAILURE:
      return state.set('loading', false).set('updateTaskSuccess', false);

    case constants.DELETE_STOCK_GUARANTEE_TASK:
      return state.set('loading', true).set('deleteTaskSuccess', null);
    case constants.DELETE_STOCK_GUARANTEE_TASK_SUCCESS:
      return state.set('loading', false).set('deleteTaskSuccess', true);
    case constants.DELETE_STOCK_GUARANTEE_TASK_FAILURE:
      return state.set('loading', false).set('deleteTaskSuccess', false);



    case constants.GET_STOCK_MAINTAINER:
      return state.set('loading', true).set('success', null);
    case constants.GET_STOCK_MAINTAINER_SUCCESS:
      return state
        .set('loading', false)
        .set('stockMaintenance', action.data)
        .set('success', true);
    case constants.GET_STOCK_MAINTAINER_FAILURE:
      return state
        .set('loading', false)
        .set('success', false)
        .set('stockMaintenance', null);

    case constants.CREATE_STOCK_MAINTAINER:
      return state.set('loading', true).set('createSuccess', null);
    case constants.CREATE_STOCK_MAINTAINER_SUCCESS:
      return state.set('loading', false).set('createSuccess', true);
    case constants.CREATE_STOCK_MAINTAINER_FAILURE:
      return state.set('loading', false).set('createSuccess', false);

    case constants.UPDATE_STOCK_MAINTAINER:
      return state.set('loading', true).set('updateSuccess', null);
    case constants.UPDATE_STOCK_MAINTAINER_SUCCESS:
      return state.set('loading', false).set('updateSuccess', true);
    case constants.UPDATE_STOCK_MAINTAINER_FAILURE:
      return state.set('loading', false).set('updateSuccess', false);

    case constants.DELETE_STOCK_MAINTAINER:
      return state.set('loading', true).set('deleteSuccess', null);
    case constants.DELETE_STOCK_MAINTAINER_SUCCESS:
      return state.set('loading', false).set('deleteSuccess', true);
    case constants.DELETE_STOCK_MAINTAINER_FAILURE:
      return state.set('loading', false).set('deleteSuccess', false);

    case constants.GET_STOCK_MAINTAINER_TASK:
      return state.set('loading', true).set('success', null);
    case constants.GET_STOCK_MAINTAINER_TASK_SUCCESS:
      return state
        .set('loading', false)
        .set('stockMaintenance', action.data)
        .set('success', true);
    case constants.GET_STOCK_MAINTAINER_TASK_FAILURE:
      return state
        .set('loading', false)
        .set('success', false)
        .set('stockMaintenance', null);

    case constants.CREATE_STOCK_MAINTAINER_TASK:
      return state.set('loading', true).set('createTaskSuccess', null);
    case constants.CREATE_STOCK_MAINTAINER_TASK_SUCCESS:
      return state.set('loading', false).set('createTaskSuccess', true);
    case constants.CREATE_STOCK_MAINTAINER_TASK_FAILURE:
      return state.set('loading', false).set('createTaskSuccess', false);

    case constants.UPDATE_STOCK_MAINTAINER_TASK:
      return state.set('loading', true).set('updateTaskSuccess', null);
    case constants.UPDATE_STOCK_MAINTAINER_TASK_SUCCESS:
      return state.set('loading', false).set('updateTaskSuccess', true);
    case constants.UPDATE_STOCK_MAINTAINER_TASK_FAILURE:
      return state.set('loading', false).set('updateTaskSuccess', false);

    case constants.DELETE_STOCK_MAINTAINER_TASK:
      return state.set('loading', true).set('deleteTaskSuccess', null);
    case constants.DELETE_STOCK_MAINTAINER_TASK_SUCCESS:
      return state.set('loading', false).set('deleteTaskSuccess', true);
    case constants.DELETE_STOCK_MAINTAINER_TASK_FAILURE:
      return state.set('loading', false).set('deleteTaskSuccess', false);

    case constants.CLEANUP:
      return state
        .set('stockGuarantee', {})
        .set('stockMaintenance', {})
        .set('loading', false)
        .set('createSuccess', null)
        .set('updateSuccess', null)
        .set('deleteSuccess', null)
        .set('createTaskSuccess', null)
        .set('updateTaskSuccess', null)
        .set('deleteTaskSuccess', null);
    default:
      return state;
  }
}

export default stockGuaranteePageReducer;
