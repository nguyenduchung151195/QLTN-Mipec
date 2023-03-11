/*
 *
 * ReportHrmPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, MERGE_DATA, GET_API_SUCCESS } from './constants';

export const initialState = fromJS({
  personnel: [],
  catagory: [],
});

function reportHrmPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case MERGE_DATA:
      return state.merge(action.data);
    case GET_API_SUCCESS:
      return state.set('personnel', action.personnel).set('catagory', action.catagory);
    default:
      return state;
  }
}

export default reportHrmPageReducer;
