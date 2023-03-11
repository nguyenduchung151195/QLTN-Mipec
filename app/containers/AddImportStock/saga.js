import { call, put, takeEvery } from 'redux-saga/effects';
import qs from 'qs';
import request, { requestApprove } from '../../utils/request';
import { CRM_SOURCE, API_STOCK_IMPORT, API_ADD_NEW_PRODUCT, API_APPROVE, API_HISTORY_ACTION } from '../../config/urlConfig';
import {
  getCRMSourceSuccessAct,
  getCRMSourceFailedAct,
  createOrderSuccessAct,
  createOrderFailedAct,
  getOrderUpdateSuccessAct,
  getProductBySupplierSuccessAct,
  getProductBySupplierFailed,
  getProductByIdSuccessAct,
  getProductByIdFailed,
  updateOrderSuccess,
  updateOrderFailed,
  getOrderUpdateFailed,
} from './actions';
import { GET_CRM_SOURCE, CREATE_NEW_ORDER, UPDATE_ORDER, GET_ORDER_UPDATE, GET_PRODUCT_BY_SUPPLIER, GET_PRODUCT_BY_ID } from './constants';
import { changeSnackbar } from '../Dashboard/actions';
import { clientId } from '../../variable';
export function* getCrmSource() {
  try {
    const token = localStorage.getItem('token');
    const data = yield call(request, `${CRM_SOURCE}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getCRMSourceSuccessAct(data));
    } else {
      yield put(getCRMSourceFailedAct({}));
    }
  } catch (err) {
    yield put(getCRMSourceFailedAct(err));
  }
}
export function* getOrder(action) {
  try {
    const token = localStorage.getItem('token');
    const data = yield call(request, `${API_STOCK_IMPORT}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getOrderUpdateSuccessAct(data));
    } else {
      yield put(getOrderUpdateFailed({}));
    }
  } catch (err) {
    yield put(getOrderUpdateFailed(err));
  }
}
export function* createNewOder(action) {
  try {
    const token = localStorage.getItem('token');
    const dynamicFormsList = action.body.dynamicFormsList;
    action.body.dynamicFormsList = undefined;
    const data = yield call(request, API_STOCK_IMPORT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Content-type': 'application/x-www-form-urlencoded',
        'Content-type': 'application/json',
      },
      // body: qs.stringify(action.body),
      body: JSON.stringify(action.body),
    });
    // if (data) {
    //   yield put(createOrderSuccessAct(data));
    //   yield put(changeSnackbar({ status: true, message: 'Tạo mới nhập kho thành công', variant: 'success' }));
    // } else {
    //   yield put(changeSnackbar({ status: true, message: 'Tạo mới nhập kho thất bại', variant: 'error' }));
    //   yield put(createOrderFailedAct({}));
    // }
    if (data) {
      if (Number(action.body.state) === 4) {
        yield put(createOrderSuccessAct(data));
        let dataHistoryAction = {
          module: 'StockImport',
          action: 'Thêm mới',
        };
        request(API_HISTORY_ACTION, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
          },
          body: JSON.stringify(dataHistoryAction),
        });
        yield put(changeSnackbar({ status: true, message: 'Tạo mới nhập kho thành công', variant: 'success' }));
      } else if (Number(action.body.state) === 0) {
        const dynamicFormsObject = Array.isArray(dynamicFormsList) && dynamicFormsList.find(n => String(n._id) === String(action.body.dynamicForms));
        const content = dynamicFormsObject && dynamicFormsObject.content;
        const groupInfo = [];
        action.body.groupSelected.group.forEach(item => {
          groupInfo.push({
            order: item.order,
            person: item.person,
            approve: 0,
            reason: '',
          });
        });
        const bodyApprovedRequest = {
          name: action.body.name,
          subCode: 'Yêu cầu nhập kho',
          collectionCode: dynamicFormsObject && dynamicFormsObject.moduleCode,
          moduleCode: 'StockImport',
          content: content,
          dataInfo: data,
          dynamicForm: action.body.dynamicForms,
          convertMapping: '5d832729c252b2577006c5ab',
          approveGroup: action.body.groupApproved && action.body.groupApproved.idGroupApproved,
          clientId,
          groupInfo,
        };
        const forms = yield call(requestApprove, `${API_APPROVE}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-type': 'application/json',
          },
          body: JSON.stringify(bodyApprovedRequest),
        });
        if (forms) {
          yield put(createOrderSuccessAct(forms));
          let dataHistoryAction = {
            module: 'StockImport',
            action: 'Thêm mới',
          };
          request(API_HISTORY_ACTION, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify(dataHistoryAction),
          });
          yield put(changeSnackbar({ status: true, message: 'Tạo mới nhập kho thành công', variant: 'success' }));
        }
      } else {
        yield put(createOrderSuccessAct(data));
        let dataHistoryAction = {
          module: 'StockImport',
          action: 'Thêm mới',
        };
        request(API_HISTORY_ACTION, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
          },
          body: JSON.stringify(dataHistoryAction),
        });
        yield put(changeSnackbar({ status: true, message: 'Tạo mới nhập kho thành công', variant: 'success' }));
      }
    } else {
      yield put(changeSnackbar({ status: true, message: 'Tạo mới nhập kho thất bại', variant: 'error' }));
      yield put(createOrderFailedAct({}));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: `${err.message}`, variant: 'error' }));
    yield put(createOrderFailedAct(err));
  }
}
export function* updateOrder(action) {
  try {
    const token = localStorage.getItem('token');
    const data = yield call(request, `${API_STOCK_IMPORT}/${action.body.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Content-type': 'application/x-www-form-urlencoded',
        'Content-type': 'application/json',
      },
      // body: qs.stringify(action.body),
      body: JSON.stringify(action.body),
    });
    if (data) {
      yield put(updateOrderSuccess(data));
      let dataHistoryAction = {
        module: 'StockImport',
        action: 'Cập nhật',
      };
      request(API_HISTORY_ACTION, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(dataHistoryAction),
      });
      yield put(changeSnackbar({ status: true, message: 'Cập nhật nhập kho thành công', variant: 'success' }));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật nhập kho thất bại', variant: 'error' }));
      yield put(updateOrderFailed({}));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: `${err.message}`, variant: 'error' }));
    yield put(updateOrderFailed(err));
  }
}

export function* getProductByStock(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ADD_NEW_PRODUCT}/organizationUnit/${action.body}?${action.params}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getProductBySupplierSuccessAct(data.data));
    } else {
      yield put(getProductBySupplierFailed({}));
    }
  } catch (err) {
    yield put(getProductBySupplierFailed(err));
  }
}

export function* getProductById(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ADD_NEW_PRODUCT}/?${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getProductByIdSuccessAct(data.data));
    } else {
      yield put(getProductByIdFailed({}));
    }
  } catch (err) {
    yield put(getProductByIdFailed(err));
  }
}

// Individual exports for testing
export default function* addImportStockSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_CRM_SOURCE, getCrmSource);
  yield takeEvery(CREATE_NEW_ORDER, createNewOder);
  yield takeEvery(UPDATE_ORDER, updateOrder);
  yield takeEvery(GET_ORDER_UPDATE, getOrder);
  yield takeEvery(GET_PRODUCT_BY_SUPPLIER, getProductByStock);
  yield takeEvery(GET_PRODUCT_BY_ID, getProductById);
}
