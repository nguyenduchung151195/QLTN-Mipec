/*
 *
 * AddExportStockPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  DEFAULT_ACTION,
  RESET_NOTI,
  GET_PRODUCT_BY_ID,
  GET_PRODUCT_BY_ID_FAILED,
  GET_PRODUCT_BY_ID_SUCCESS,

  GET_ASSET_BY_ID,
  GET_ASSET_BY_ID_FAILED,
  GET_ASSET_BY_ID_SUCCESS,

  GET_PRODUCT_BY_SUPPLIER,
  GET_PRODUCT_BY_SUPPLIER_FAILED,
  GET_PRODUCT_BY_SUPPLIER_SUCCESS,
  CREATE_NEW_ORDER,
  CREATE_NEW_ORDER_SUCCESS,
  CREATE_NEW_ORDER_FAILED,
  GET_ORDER_BY_ID,
  GET_ORDER_BY_ID_SUCCESS,
  GET_ORDER_BY_ID_FAILED,
  UPDATE_ORDER,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAILED,
} from './constants';

export const initialState = fromJS({});

function addExportStockPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case RESET_NOTI:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', false);
    case GET_PRODUCT_BY_SUPPLIER:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_PRODUCT_BY_SUPPLIER_SUCCESS:
      return state
        .set('productList', action.data)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case GET_PRODUCT_BY_SUPPLIER_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_PRODUCT_BY_ID:
      return state
        .set('productListById', [])
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_PRODUCT_BY_ID_SUCCESS:
      return state
        .set('productListById', action.data)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case GET_PRODUCT_BY_ID_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case GET_ASSET_BY_ID:
      return state
        .set('productListById', [])
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ASSET_BY_ID_SUCCESS:
      return state
        .set('productListById', action.data)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case GET_ASSET_BY_ID_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case CREATE_NEW_ORDER:
      return state
        .set('loading', true)
        .set('successCreate', false)
        .set('error', false);
    case CREATE_NEW_ORDER_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case CREATE_NEW_ORDER_FAILED:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    case GET_ORDER_BY_ID:
      return state
        .set('loading', true)
        .set('success', false)
        .set('error', false);
    case GET_ORDER_BY_ID_SUCCESS:
      return state
        .set('order', action.data)
        .set('loading', false)
        .set('success', true)
        .set('error', false);
    case GET_ORDER_BY_ID_FAILED:
      return state
        .set('loading', false)
        .set('success', false)
        .set('error', true);
    case UPDATE_ORDER:
      return state
        .set('loading', true)
        .set('successCreate', false)
        .set('error', false);
    case UPDATE_ORDER_SUCCESS:
      return state
        .set('loading', false)
        .set('successCreate', true)
        .set('error', false);
    case UPDATE_ORDER_FAILED:
      return state
        .set('loading', false)
        .set('successCreate', false)
        .set('error', true);
    default:
      return state;
  }
}

export default addExportStockPageReducer;
