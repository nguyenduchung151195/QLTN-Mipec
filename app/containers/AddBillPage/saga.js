import { takeEvery, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
import { changeSnackbar } from '../Dashboard/actions';
import { GET_CONTRACT, API_SALE, API_BILLS, API_ORDER_PO } from '../../config/urlConfig';
import { GET_ALL_CONTRACT, CREATE_BILL, GET_BILL_BY_ID, UPDATE_BILL } from './constants';
import {
  getAllContractSuccess,
  getAllContractFailed,
  getAllSaleQuoSuccess,
  getAllSaleQuoFailed,
  createBillSuccess,
  createBillFailed,
  getBillByIdSuccess,
  getBillByIdFailed,
  updateBillSuccess,
  updateBillFailed,
  getAllPOSuccess,
  getAllPOFailed,
} from './actions';

export function* getAllContract(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${GET_CONTRACT}?${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAllContractSuccess(data.data));
    } else {
      yield put(getAllContractFailed({}));
    }
  } catch (err) {
    yield put(getAllContractFailed(err));
  }
}

export function* getAllSaleQuo() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_SALE}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAllSaleQuoSuccess(data.data));
    } else {
      yield put(getAllSaleQuoFailed({}));
    }
  } catch (err) {
    yield put(getAllSaleQuoFailed(err));
  }
}

export function* getAllPO() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ORDER_PO}?filter%5Btype%5D=1`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAllPOSuccess(data.data));
    } else {
      yield put(getAllPOFailed({}));
    }
  } catch (err) {
    yield put(getAllPOFailed(err));
  }
}

export function* createNewBill(action) {
  const token = localStorage.getItem('token');
  const edittingTrading = JSON.parse(localStorage.getItem('edittingTrading'));
  const newBody = Object.assign({}, action.body);
  if (edittingTrading) {
    newBody.exchangingAgreement = {
      exchangingAgreementId: edittingTrading._id,
      name: edittingTrading.name,
    };
  }
  try {
    const data = yield call(request, `${API_BILLS}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBody),
    });
    if (data) {
      yield put(createBillSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Thêm mới hóa đơn thành công', variant: 'success' }));
    } else {
      yield put(createBillFailed({}));
      yield put(changeSnackbar({ status: true, message: 'Thêm mới hóa đơn thất bại', variant: 'error' }));
    }
  } catch (err) {
    yield put(createBillFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Thêm mới hóa đơn thất bại', variant: 'error' }));
  }
}

export function* updateBill(action) {
  const token = localStorage.getItem('token');
  const edittingTrading = JSON.parse(localStorage.getItem('edittingTrading'));
  const newBody = Object.assign({}, action.body);
  if (edittingTrading) {
    newBody.exchangingAgreement = {
      exchangingAgreementId: edittingTrading._id,
      name: edittingTrading.name,
    };
  }
  try {
    const data = yield call(request, `${API_BILLS}/${action.body.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBody),
    });
    if (data) {
      yield put(updateBillSuccess(data));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật hóa đơn thành công', variant: 'success' }));
    } else {
      yield put(updateBillFailed({}));
      yield put(changeSnackbar({ status: true, message: 'Cập nhật hóa đơn thất bại', variant: 'error' }));
    }
  } catch (err) {
    yield put(updateBillFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật hóa đơn thất bại', variant: 'error' }));
  }
}

export function* getBillById(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_BILLS}/${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getBillByIdSuccess(data));
    } else {
      yield put(getBillByIdFailed({}));
    }
  } catch (err) {
    yield put(getBillByIdFailed(err));
  }
}

// Individual exports for testing
export default function* addBillPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeEvery(GET_ALL_CONTRACT, getAllContract);
  yield takeEvery(GET_ALL_CONTRACT, getAllPO);
  yield takeEvery(GET_ALL_CONTRACT, getAllSaleQuo);
  yield takeEvery(CREATE_BILL, createNewBill);
  yield takeEvery(GET_BILL_BY_ID, getBillById);
  yield takeEvery(UPDATE_BILL, updateBill);
}
