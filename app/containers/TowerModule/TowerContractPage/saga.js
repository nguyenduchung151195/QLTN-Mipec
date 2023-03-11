import { takeLatest, call, put, select } from 'redux-saga/effects';
import {
  API_FEE,
  API_TEMPLATE,
  API_CONTRACT_SEND_MAIL,
  API_SEND_FEE_NOTI,
  API_SEND_ALL_FEE_NOTI,
  API_HISTORY_ACTION,
} from '../../../config/urlConfig';
import request from '../../../utils/request';
import { changeSnackbar } from '../../Dashboard/actions';
import { CREATE_CONTRACT, GET_ALL_FEES, GET_FEE, GET_MODULE_FEE, SEND_MAIL_FEES, SEND_NOTI_FEES, UPDATE_CONTRACT, GET_ALL_STATUS } from './constants';
import {
  getFeeSuccess,
  getFeeFailure,
  createContractSuccess,
  createContractFailure,
  updateContractSuccess,
  updateContractFailure,
  getModuleFeeFailure,
  getModuleFeeSuccess,
  sendMailFeesFailure,
  sendMailFeesSuccess,
  sendNotiFeesFailure,
  sendNotiFeesSuccess,
  getAllFeesSuccess,
  getAllFeesFailure,
  fetchAllStatusFailAction,
  fetchAllStatusSuccessAction,
} from './actions';

function* getFee(action) {
  const { id } = action;
  try {
    const fees = yield call(request, `${API_FEE}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fees),
    });
    yield put(getFeeSuccess(fees));
    yield put(changeSnackbar({ status: true, message: 'Lấy thông tin phí thành công', variant: 'success' }));
  } catch (error) {
    console.log(error);
    yield put(getFeeFailure([]));
    yield put(changeSnackbar({ status: true, message: 'Lấy thông tin phí thất bại', variant: 'error' }));
  }
}

function* postFee(action) {
  const { fees } = action;
  try {
    let response = yield call(request, API_FEE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fees),
    });
    if (response) {
      yield put(createContractSuccess());
      yield put(changeSnackbar({ status: true, message: 'Thêm mới phí thành công', variant: 'success' }));
      let dataHistoryAction = {
        module: 'Fee',
        action: 'Thêm mới',
      };
      yield call(request, API_HISTORY_ACTION, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(dataHistoryAction),
      });
    }
  } catch (error) {
    yield put(createContractFailure());
    console.log(error);
    yield put(changeSnackbar({ status: true, message: 'Thêm mới phí thất bại', variant: 'error' }));
  }
}

function* putFee(action) {
  const { fees } = action;

  try {
    yield call(request, `${API_FEE}/${fees._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fees),
    });
    yield put(updateContractSuccess());
    let dataHistoryAction = {
      module: 'Fee',
      action: 'Cập nhật',
    };
    yield call(request, API_HISTORY_ACTION, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify(dataHistoryAction),
    });
    yield put(changeSnackbar({ status: true, message: 'Cập nhật phí thành công', variant: 'success' }));
  } catch (error) {
    yield put(updateContractFailure());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật phí thất bại', variant: 'error' }));
  }
}

export function* getModuleFeeSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_TEMPLATE}?filter[$or][0][clientId]=50_CRM&filter[$or][1][clientId]=ALL`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    if (res) {
      yield put(getModuleFeeSuccess(res));
    } else {
      yield put(getModuleFeeFailure(res));
    }
  } catch (error) {
    yield put(getModuleFeeFailure(error));
  }
}

export function* sendMailFeesSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_CONTRACT_SEND_MAIL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(action.data),
    });
    if (res && res.status === 1) {
      yield put(sendMailFeesSuccess(res));
      yield put(changeSnackbar({ status: true, message: 'Gửi email thành công', variant: 'success' }));
    } else {
      yield put(sendMailFeesFailure(res));
      yield put(changeSnackbar({ status: true, message: 'Gửi email không thành công', variant: 'error' }));
    }
  } catch (error) {
    yield put(sendMailFeesFailure(error));
    yield put(changeSnackbar({ status: true, message: 'Gửi email không thành công', variant: 'error' }));
  }
}

export function* sendNotiFeesSaga(action) {
  const token = localStorage.getItem('token');
  const { data } = action;
  let res;
  try {
    if (data.sendAll == '1') {
      res = yield call(request, `${API_SEND_ALL_FEE_NOTI}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        //body: JSON.stringify(action.data)
      });
    } else {
      res = yield call(request, `${API_SEND_FEE_NOTI}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(action.data),
      });
    }
    if (res && res.success) {
      yield put(sendNotiFeesSuccess(res));
      yield put(changeSnackbar({ status: true, message: 'Gửi thông báo thành công', variant: 'success' }));
    } else {
      yield put(sendNotiFeesFailure(res));
      yield put(changeSnackbar({ status: true, message: 'Gửi thông báo không  thành công', variant: 'error' }));
    }
  } catch (error) {
    yield put(sendNotiFeesFailure(error));
    yield put(changeSnackbar({ status: true, message: 'Gửi thông báo không thành công', variant: 'error' }));
  }
}

export function* getAllFeesSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_FEE}?filter[sendingStatus]=0`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    if (res) {
      yield put(getAllFeesSuccess(res.data));
    } else {
      yield put(getAllFeesFailure(res));
    }
  } catch (error) {
    yield put(getAllFeesFailure(error));
  }
}

export function* fetchGetAllStatus(type) {
  console.log(type);
  const filters = {
    filter: { type: type.id },
  };
  let allF = serialize(filters);
  try {
    const data = yield call(request, `${API_STATUS_CRMCONFIG}?${allF}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    localStorage.setItem('crmStatus', JSON.stringify(data));
    if (data) {
      yield put(fetchAllStatusSuccessAction(data));
    } else {
      yield put(fetchAllStatusSuccessAction({}));
    }
  } catch (err) {
    yield put(fetchAllStatusFailAction(err));
  }
}
// Individual exports for testing
export default function* towerContractPageSaga() {
  yield takeLatest(GET_FEE, getFee);
  yield takeLatest(CREATE_CONTRACT, postFee);
  // yield takeLatest(GET_TASK_CURRENT, getTaskCurrent);
  yield takeLatest(GET_ALL_STATUS, fetchGetAllStatus);
  yield takeLatest(UPDATE_CONTRACT, putFee);
  yield takeLatest(GET_MODULE_FEE, getModuleFeeSaga);
  yield takeLatest(GET_ALL_FEES, getAllFeesSaga);
  yield takeLatest(SEND_MAIL_FEES, sendMailFeesSaga);
  yield takeLatest(SEND_NOTI_FEES, sendNotiFeesSaga);
}
