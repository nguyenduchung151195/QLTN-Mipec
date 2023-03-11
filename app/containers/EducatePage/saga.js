// import { take, call, put, select } from 'redux-saga/effects';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { API_HRM_EDUCATION } from '../../config/urlConfig';
import {
  createEducateSuccess,
  createEducateFailure,
  updateEducateSuccess,
  updateEducateFailure,
  deleteEducateSuccess,
  deleteEducateFailure,
} from './actions';
import { CREATE_EDUCATE, UPDATE_EDUCATE, DELETE_EDUCATE } from './constants';
import { changeSnackbar } from '../Dashboard/actions';

export function* createEducate(action) {
  try {
    const { data } = action;
    console.log('data',data)
    console.log('action',action)
    const response = yield call(request, `${API_HRM_EDUCATION}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createEducateSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createEducateFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createEducateFailure(err));
  }
}

export function* updateEducate(action) {
  try {
    const { hrmEmployeeId: EducateId, data } = action;
    const response = yield call(request, `${API_HRM_EDUCATION}/${EducateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateEducateSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateEducateFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateEducateFailure(err));
  }
}

export function* deleteEducate(action) {
  try {
    const { hrmEmployeeId, ids } = action;
    const response = yield call(request, `${API_HRM_EDUCATION}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteEducateSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteEducateFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteEducateFailure(err));
  }
}

export default function* EducatePageSaga() {
  yield takeLatest(CREATE_EDUCATE, createEducate);
  yield takeLatest(UPDATE_EDUCATE, updateEducate);
  yield takeLatest(DELETE_EDUCATE, deleteEducate);
}

// // Individual exports for testing
// export default function* educatePageSaga() {
//   // See example in containers/HomePage/saga.js
// }
