/*
 *
 * AddDocumentary reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, GET_DATA_SUCCESS } from './constants';

export const initialState = fromJS({

});

function addDocumentaryReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_DATA_SUCCESS:
      return state.set('reports', action.data);
    default:
      return state;
  }
}

export default addDocumentaryReducer;
