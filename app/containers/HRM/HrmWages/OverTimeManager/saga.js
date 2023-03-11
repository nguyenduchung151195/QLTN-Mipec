// import { take, call, put, select } from 'redux-saga/effects';

import { changeSnackbar } from 'containers/Dashboard/actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { API_OVER_TIME, API_PLAN_OT } from '../../../../config/urlConfig';
import {
  addOverTimeManagerFailure, addOverTimeManagerSuccess,
  addPlanOverTimeFailure, addPlanOverTimeSuccess, deleteOverTimeManagerFailure, deleteOverTimeManagerSuccess, updateOverTimeManagerFailure, updateOverTimeManagerSuccess, updatePlanOverTimeFailure, updatePlanOverTimeSuccess
} from './actions';
import {
  ADD_OVER_TIME_MANAGER,
  ADD_PLAN_OT, DELETE_OVER_TIME_MANAGER, UPDATE_OVER_TIME_MANAGER, UPDATE_PLAN_OT
} from './constants';

export function* addOverTimeManagerSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data } = action;
    const res = yield call(request, `${API_OVER_TIME}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res && res.status === 1) {
      yield put(addOverTimeManagerSuccess(res.data));
      yield put(changeSnackbar({ variant: 'success', message: 'Thêm mới dữ liệu thành công', status: true }));
    } else {
      yield put(addOverTimeManagerFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.message || 'Thêm mới dữ liệu thất bại', status: true }));
    }
  } catch (error) {
    yield put(addOverTimeManagerFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: 'Thêm mới dữ liệu thất bại', status: true }));
  }
}

export function* updateOverTimeManagerSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data } = action;
    const res = yield call(request, `${API_OVER_TIME}/${data._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (res && res.status === 1) {
      yield put(updateOverTimeManagerSuccess(res.data));
      yield put(changeSnackbar({ variant: 'success', message: 'Cập nhật dữ liệu thành công', status: true }));
    } else {
      yield put(updateOverTimeManagerFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.message || 'Cập nhật dữ liệu thất bại', status: true }));
    }
  } catch (error) {
    yield put(updateOverTimeManagerFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: 'Cập nhật dữ liệu thất bại', status: true }));
  }
}
export function* deleteOverTimeManagerSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { ids } = action;
    const res = yield call(request, `${API_OVER_TIME}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify(action.data),
    });
    if (res && res.status === 1) {
      yield put(deleteOverTimeManagerSuccess(res.data));
      yield put(changeSnackbar({ variant: 'success', message: 'Xóa dữ liệu thành công', status: true }));
    } else {
      yield put(deleteOverTimeManagerFailure(res));
      yield put(changeSnackbar({ variant: 'error', message: res.message || 'Xóa dữ liệu thất bại', status: true }));
    }
  } catch (error) {
    yield put(deleteOverTimeManagerFailure(error));
    yield put(changeSnackbar({ variant: 'error', message: 'Xóa dữ liệu thất bại', status: true }));
  }
}

export function* addPlanOverTimeSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data } = action;
    const newData = { startDate: data.startDate, endDate: data.endDate, join: data.join.map(item => ({ hrmEmployeeId: item._id })) };

    const res = yield call(request, `${API_PLAN_OT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(newData),
    });
    if (res && res.status === 1) {
      yield put(addPlanOverTimeSuccess(res));
    } else {
      yield put(addPlanOverTimeFailure(res));
    }

  } catch (error) {
    yield put(addPlanOverTimeFailure(error))
  }
}

export function* updatePlanOverTimeSaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data } = action;
    const newData = { startDate: data.startDate, endDate: data.endDate, join: data.join.map(item => ({ hrmEmployeeId: item._id })) };

    const res = yield call(request, `${API_PLAN_OT}/${action.data && action.data._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(newData),
    });

    if (res && res.status === 1) {
      yield put(updatePlanOverTimeSuccess(res));
    } else {
      yield put(updatePlanOverTimeFailure(res));
    }

  } catch (error) {
    yield put(updatePlanOverTimeFailure(error))
  }
}

export default function* overTimeManagerSaga() {

  // OT
  yield takeLatest(ADD_OVER_TIME_MANAGER, addOverTimeManagerSaga);
  yield takeLatest(UPDATE_OVER_TIME_MANAGER, updateOverTimeManagerSaga);
  yield takeLatest(DELETE_OVER_TIME_MANAGER, deleteOverTimeManagerSaga);

  // ke hoach OT
  yield takeLatest(ADD_PLAN_OT, addPlanOverTimeSaga);
  yield takeLatest(UPDATE_PLAN_OT, updatePlanOverTimeSaga);
}
