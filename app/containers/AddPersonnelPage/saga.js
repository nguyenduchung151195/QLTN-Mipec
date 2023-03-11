// import { take, call, put, select } from 'redux-saga/effects';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import {
  fetchAllUserSuccessAction,
  fetchAllUserfalseAction,
  fetchListDepartmentSuccess,
  fetchConfigSuccessAction,
  fetchConfigfalseAction,
  fetchUpdateConfigSuccessAction,
  fetchUpdateConfigfalseAction,
  fetchListDepartmentFalse,
} from './actions';
import { GET_ALL_USER, GET_LIST_DEPARTMENT, GET_CONFIG, UPDATE_GET_CONFIG } from './constants';
import { API_PERSONNEL, API_VIEWCONFIG, API_ORIGANIZATION } from '../../config/urlConfig';
// import { changeSnackbar } from '../Dashboard/actions';
export function* fetchGetAllUser(action) {
  try {
    const data = yield call(request, `${API_PERSONNEL}?${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (data) {
      yield put(fetchAllUserSuccessAction({ data: data.data, count: data.count, skip: data.skip, limit: data.limit }));
    }
  } catch (err) {
    yield put(fetchAllUserfalseAction(err));
  }
}
export function* fetchGetConfig() {
  try {
    // const departmentId = action.departmentId;
    // const userId = localStorage.getItem('userId');
    const data = yield call(request, `${API_VIEWCONFIG}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (data) {
      let config = [];
      data.forEach(e => {
        if (e.path === '/setting/Employee') {
          config = e.editDisplay.type.fields.type;
        }
      });
      yield put(fetchConfigSuccessAction(config));
    } else {
      yield put(fetchConfigfalseAction({}));
    }
  } catch (err) {
    yield put(fetchConfigfalseAction(err));
  }
}
export function* fetchUpdateConfig(action) {
  try {
    // const departmentId = action.departmentId;

    const data = yield call(request, `${API_VIEWCONFIG}5c8ea461b74423494cb0d13d`, {
      method: 'PUT',
      body: JSON.stringify(action.body),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (data) {
      yield put(fetchUpdateConfigSuccessAction(data));
    } else {
      yield put(fetchUpdateConfigfalseAction({}));
    }
  } catch (err) {
    yield put(fetchUpdateConfigfalseAction(err));
  }
}

export function* fetchAllDepartment() {
  try {
    // const departmentId = action.departmentId;

    const data = yield call(request, API_ORIGANIZATION, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (data) {
      yield put(fetchListDepartmentSuccess(data));
    } else {
      yield put(fetchListDepartmentFalse({}));
    }
  } catch (err) {
    yield put(fetchListDepartmentFalse(err));
  }
}
// Individual exports for testing
export default function* addPersonnelPageSaga() {
  yield takeLatest(GET_ALL_USER, fetchGetAllUser);
  yield takeLatest(GET_LIST_DEPARTMENT, fetchAllDepartment);
  yield takeLatest(GET_CONFIG, fetchGetConfig);
  yield takeLatest(UPDATE_GET_CONFIG, fetchUpdateConfig);

  // See example in containers/HomePage/saga.js
}
