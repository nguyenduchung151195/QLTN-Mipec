import { takeLatest, call, put, select } from 'redux-saga/effects';
import request from 'utils/request';
import {
  createAccountRequestSuccess, createcreateAccountRequestFailed, updateAccountRequestFailure, updateAccountRequestSuccess, updatePasswordRequestSuccess, updatePasswordRequestFailure, getLtAccountSuccess, getLtAccountFailer
} from './actions';
import { CREATE_ACCOUNT_REQUESTED, UPDATE_ACCOUNT_REQUESTED, UPDATE_PASSWORD_REQUESTED, FECTH_ACCOUNT } from './constants';
import { API_LT_ACCOUNT ,API_HISTORY_ACTION} from '../../config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';

const requestURL = API_LT_ACCOUNT;

function* fetchLtAccount(action) {
  const token = localStorage.getItem('token');
  try {
    const response = yield call(request, `${requestURL}/${action.id}`, {
      method: 'GET',
      headers: {
        Authorazation: `Bearer ${token}`,
      },
    });
    if (response) {
      yield put(changeSnackbar({ status: true, message: 'Lấy thông tin thành công', variant: 'success' }));
      yield put(getLtAccountSuccess(response));
    }
    else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Lấy thông tin  thất bại', variant: 'error' }));
      yield put(getLtAccountFailer(response));
    }

  } catch (error) {
    yield put(changeSnackbar({ status: true, message: error.message || 'lấy thông tin thất bại', variant: 'error' }));
    yield put(createcreateAccountRequestFailed(response));
  }

}

function* createAccountRequest(data) {
  try {
    const token = localStorage.getItem('token');
    const response = yield call(request, requestURL, {
      method: 'POST',
      headers: {
        Authorazation: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.data),
    });
    if (response.status) {
      let dataHistoryAction = {
        module: 'Contract',
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
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createAccountRequestSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createcreateAccountRequestFailed(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createcreateAccountRequestFailed(err));
  }
}

function* updateAccountRequest(data) {
  try {
    const token = localStorage.getItem('token');
    const response = yield call(request, `${requestURL}/${data.data._id}`, {
      method: 'PUT',
      headers: {
        Authorazation: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.data),
    });
    if (response.status) {
      let dataHistoryAction = {
        module: 'Contract',
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
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateAccountRequestSuccess(response));
    } else {
      console.log(77777, response.message);
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateAccountRequestFailure(response));
    }
  } catch (err) {
 
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateAccountRequestFailure(err));
  }
}

function* updatePasswordRequest(data) {
  try {
    const token = localStorage.getItem('token');
    const response = yield call(request, `${requestURL}/${data.data.id}`, {
      method: 'PUT',
      headers: {
        Authorazation: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Đổi mật khẩu thành công', variant: 'success' }));
      yield put(updatePasswordRequestSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Đổi mật khẩu thất bại', variant: 'error' }));
      yield put(updatePasswordRequestFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Đổi mật khẩu thất bại', variant: 'error' }));
    yield put(updatePasswordRequestFailure(err));
  }
}

export default function* rootSaga() {
  yield takeLatest(FECTH_ACCOUNT, fetchLtAccount);
  yield takeLatest(CREATE_ACCOUNT_REQUESTED, createAccountRequest);
  yield takeLatest(UPDATE_ACCOUNT_REQUESTED, updateAccountRequest);
  yield takeLatest(UPDATE_PASSWORD_REQUESTED, updatePasswordRequest);
}
