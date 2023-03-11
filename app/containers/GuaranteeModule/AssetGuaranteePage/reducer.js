/*
 *
 * AssetGuaranteePage reducer
 *
 */

import { fromJS } from 'immutable';
import * as constants from './constants';

export const initialState = fromJS({
  assetGuarantee: {},
  assetMaintenance: {},
  type: 0,
});

function assetGuaranteePageReducer(state = initialState, action) {
  switch (action.type) {
    case constants.CHANGE_TYPE:
      return state.set('type', action.data);
    case constants.GET_ASSET_GUARANTEE:
      return state.set('loading', true).set('success', null);
    case constants.GET_ASSET_GUARANTEE_SUCCESS:
      return state
        .set('loading', false)
        .set('assetGuarantee', action.data)
        .set('success', true);
    case constants.GET_ASSET_GUARANTEE_FAILURE:
      return state
        .set('loading', false)
        .set('success', false)
        .set('assetGuarantee', null);

    case constants.CREATE_ASSET_GUARANTEE:
      return state.set('loading', true).set('createSuccess', null);
    case constants.CREATE_ASSET_GUARANTEE_SUCCESS:
      return state.set('loading', false).set('createSuccess', true);
    case constants.CREATE_ASSET_GUARANTEE_FAILURE:
      return state.set('loading', false).set('createSuccess', false);

    case constants.UPDATE_ASSET_GUARANTEE:
      return state.set('loading', true).set('updateSuccess', null);
    case constants.UPDATE_ASSET_GUARANTEE_SUCCESS:
      return state.set('loading', false).set('updateSuccess', true);
    case constants.UPDATE_ASSET_GUARANTEE_FAILURE:
      return state.set('loading', false).set('updateSuccess', false);

    case constants.DELETE_ASSET_GUARANTEE:
      return state.set('loading', true).set('deleteSuccess', null);
    case constants.DELETE_ASSET_GUARANTEE_SUCCESS:
      return state.set('loading', false).set('deleteSuccess', true);
    case constants.DELETE_ASSET_GUARANTEE_FAILURE:
      return state.set('loading', false).set('deleteSuccess', false);

    case constants.GET_ASSET_GUARANTEE_TASK:
      return state.set('loading', true).set('success', null);
    case constants.GET_ASSET_GUARANTEE_TASK_SUCCESS:
      return state
        .set('loading', false)
        .set('assetGuarantee', action.data)
        .set('success', true);
    case constants.GET_ASSET_GUARANTEE_TASK_FAILURE:
      return state
        .set('loading', false)
        .set('success', false)
        .set('assetGuarantee', null);

    case constants.CREATE_ASSET_GUARANTEE_TASK:
      return state.set('loading', true).set('createTaskSuccess', null);
    case constants.CREATE_ASSET_GUARANTEE_TASK_SUCCESS:
      return state.set('loading', false).set('createTaskSuccess', true);
    case constants.CREATE_ASSET_GUARANTEE_TASK_FAILURE:
      return state.set('loading', false).set('createTaskSuccess', false);

    case constants.UPDATE_ASSET_GUARANTEE_TASK:
      return state.set('loading', true).set('updateTaskSuccess', null);
    case constants.UPDATE_ASSET_GUARANTEE_TASK_SUCCESS:
      return state.set('loading', false).set('updateTaskSuccess', true);
    case constants.UPDATE_ASSET_GUARANTEE_TASK_FAILURE:
      return state.set('loading', false).set('updateTaskSuccess', false);

    case constants.DELETE_ASSET_GUARANTEE_TASK:
      return state.set('loading', true).set('deleteTaskSuccess', null);
    case constants.DELETE_ASSET_GUARANTEE_TASK_SUCCESS:
      return state.set('loading', false).set('deleteTaskSuccess', true);
    case constants.DELETE_ASSET_GUARANTEE_TASK_FAILURE:
      return state.set('loading', false).set('deleteTaskSuccess', false);



    case constants.GET_ASSET_MAINTAINER:
      return state.set('loading', true).set('success', null);
    case constants.GET_ASSET_MAINTAINER_SUCCESS:
      return state
        .set('loading', false)
        .set('assetMaintenance', action.data)
        .set('success', true);
    case constants.GET_ASSET_MAINTAINER_FAILURE:
      return state
        .set('loading', false)
        .set('success', false)
        .set('assetMaintenance', null);

    case constants.CREATE_ASSET_MAINTAINER:
      return state.set('loading', true).set('createSuccess', null);
    case constants.CREATE_ASSET_MAINTAINER_SUCCESS:
      return state.set('loading', false).set('createSuccess', true);
    case constants.CREATE_ASSET_MAINTAINER_FAILURE:
      return state.set('loading', false).set('createSuccess', false);

    case constants.UPDATE_ASSET_MAINTAINER:
      return state.set('loading', true).set('updateSuccess', null);
    case constants.UPDATE_ASSET_MAINTAINER_SUCCESS:
      return state.set('loading', false).set('updateSuccess', true);
    case constants.UPDATE_ASSET_MAINTAINER_FAILURE:
      return state.set('loading', false).set('updateSuccess', false);

    case constants.DELETE_ASSET_MAINTAINER:
      return state.set('loading', true).set('deleteSuccess', null);
    case constants.DELETE_ASSET_MAINTAINER_SUCCESS:
      return state.set('loading', false).set('deleteSuccess', true);
    case constants.DELETE_ASSET_MAINTAINER_FAILURE:
      return state.set('loading', false).set('deleteSuccess', false);

    case constants.GET_ASSET_MAINTAINER_TASK:
      return state.set('loading', true).set('success', null);
    case constants.GET_ASSET_MAINTAINER_TASK_SUCCESS:
      return state
        .set('loading', false)
        .set('assetMaintenance', action.data)
        .set('success', true);
    case constants.GET_ASSET_MAINTAINER_TASK_FAILURE:
      return state
        .set('loading', false)
        .set('success', false)
        .set('assetMaintenance', null);

    case constants.CREATE_ASSET_MAINTAINER_TASK:
      return state.set('loading', true).set('createTaskSuccess', null);
    case constants.CREATE_ASSET_MAINTAINER_TASK_SUCCESS:
      return state.set('loading', false).set('createTaskSuccess', true);
    case constants.CREATE_ASSET_MAINTAINER_TASK_FAILURE:
      return state.set('loading', false).set('createTaskSuccess', false);

    case constants.UPDATE_ASSET_MAINTAINER_TASK:
      return state.set('loading', true).set('updateTaskSuccess', null);
    case constants.UPDATE_ASSET_MAINTAINER_TASK_SUCCESS:
      return state.set('loading', false).set('updateTaskSuccess', true);
    case constants.UPDATE_ASSET_MAINTAINER_TASK_FAILURE:
      return state.set('loading', false).set('updateTaskSuccess', false);

    case constants.DELETE_ASSET_MAINTAINER_TASK:
      return state.set('loading', true).set('deleteTaskSuccess', null);
    case constants.DELETE_ASSET_MAINTAINER_TASK_SUCCESS:
      return state.set('loading', false).set('deleteTaskSuccess', true);
    case constants.DELETE_ASSET_MAINTAINER_TASK_FAILURE:
      return state.set('loading', false).set('deleteTaskSuccess', false);

    case constants.CLEANUP:
      console.log('CLEANUP');
      return state
        .set('assetMaintenance', {})
        .set('assetGuarantee', {})
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

export default assetGuaranteePageReducer;
