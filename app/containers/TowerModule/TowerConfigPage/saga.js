import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../../utils/request';
import { changeSnackbar } from '../../Dashboard/actions';

import { API_TASK_CONFIG, API_CREAT_TASK_CONFIG, API_UPDATE_TASK_CONFIG, API_DELETE_TASK_CONFIG } from '../../../config/urlConfig';
import { GET_CONFIG, POST_CONFIG, PUT_CONFIG, DELETE_CONFIG, PUT_CONFIG_PARENT } from './constants';
import { postConfigSuccess, deleteConfigSuccess, getConfig, mergeData } from './actions';

const data = [
  {
    status: 1,
    state: '3',
    _id: '5ef02b89f3c66f2e333c243e',
    name: 'Trạng thái thu phí',
    code: 'PLANER',
    data: [
      { _id: '5ef02b89f3c66f2e333c2441', name: 'Chưa có kế hoạch', order: 1, code: 1, type: '1', canDelete: false, color: '#2196f3' },
      { _id: '5ef02b89f3c66f2e333c2440', name: 'Hoàn thành', order: 1, code: 3, type: '3', canDelete: false, color: '#223916' },
      { _id: '5ef02b89f3c66f2e333c243f', name: 'Công việc thất bại', order: 1, code: 4, type: '4', canDelete: false, color: 'rgba(189, 7, 7, 0.96)' },
      { _id: '5f754d48d32d6a70b8de8a49', name: 'Công việc trong tuần', color: '#ac27b7', code: 1, type: '5' },
      { _id: '5f80192122b3266de772d40c', name: 'Công việc phát sinh trong tuần', color: '#2e8fc7', code: 1, type: '8' },
    ],
    createdAt: '2020-06-22T03:54:49.626Z',
    updatedAt: '2020-10-09T08:02:41.842Z',
    __v: 74,
  },
];

// Individual exports for testing
export function* getTaskSaga() {
  try {
    // const config = yield call(request, API_TASK_CONFIG, {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem('token')}`,
    //   },
    // });

    // localStorage.setItem('taskStatus', JSON.stringify(config));
    // yield put(mergeData({ config }));
    yield put(mergeData({ config: data }));
  } catch {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}
export function* postTaskSaga(action) {
  try {
    const data = yield call(request, `${API_CREAT_TASK_CONFIG}/${action.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(postConfigSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Thêm mới cấu hình thành công', variant: 'success' }));
    yield put(getConfig());
  } catch {
    yield put(changeSnackbar({ status: true, message: 'Thêm mới cấu hình thất bại', variant: 'error' }));
  }
}
export function* putTaskSaga(action) {
  try {
    const data = yield call(request, `${API_UPDATE_TASK_CONFIG}/${action.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.data),
    });

    yield put(postConfigSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Cập nhật cấu hình thành công', variant: 'success' }));
    yield put(getConfig());
  } catch {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật cấu hình thất bại', variant: 'error' }));
  }
}
export function* deleteTaskSaga(action) {
  try {
    const data = yield call(request, `${API_DELETE_TASK_CONFIG}/${action.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id: action.configId }),
    });

    yield put(deleteConfigSuccess(data));
    yield put(changeSnackbar({ status: true, message: 'Xóa cấu hình thành công', variant: 'success' }));
    yield put(getConfig());
  } catch {
    yield put(changeSnackbar({ status: true, message: 'Xóa cấu hình thất bại', variant: 'error' }));
  }
}

export function* putConfigParentSaga(action) {
  try {
    yield call(request, `${API_TASK_CONFIG}/${action.data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: action.data.data, name: action.data.name }),
    });

    yield put(changeSnackbar({ status: true, message: 'Cập nhật cấu hình gantt thành công', variant: 'success' }));
    yield put(getConfig());
  } catch {
    yield put(changeSnackbar({ status: true, message: 'Cập nhật  cấu hình gantt thất bại', variant: 'error' }));
  }
}

export default function* configTaskSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_CONFIG, getTaskSaga);
  yield takeLatest(POST_CONFIG, postTaskSaga);
  yield takeLatest(PUT_CONFIG, putTaskSaga);
  yield takeLatest(DELETE_CONFIG, deleteTaskSaga);
  yield takeLatest(PUT_CONFIG_PARENT, putConfigParentSaga);
}
