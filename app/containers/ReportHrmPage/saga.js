// import { take, call, put, select } from 'redux-saga/effects';
import { call, put, takeLatest } from 'redux-saga/effects';
import request from '../../utils/request';
import { API_USERS, API_SOURCE_HRMCONFIG, API_HRM_REPORT } from '../../config/urlConfig';
import { changeSnackbar } from '../Dashboard/actions';
import { getApiSuccess } from './actions';
import { GET_API } from './constants';

// Individual exports for testing
// export function* getApiSaga() {
//   try {
//     const personnel = yield call(request, API_HRM_REPORT, {
//       method: 'GET',
//     });
//     const catagory = yield call(request, API_SOURCE_HRMCONFIG, {
//       method: 'GET',
//     });
//     yield put(getApiSuccess(personnel, catagory));
//   } catch (error) {
//     yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
//   }
// }

export function* getApiSaga() {
  try {
    const headersOptions = {
      method: 'GET',
      headers: {
        'Contetn-Type': 'application/json'
      },

    }
    const personnel = yield call(request, API_HRM_REPORT, headersOptions);
    const category = yield call(request, API_SOURCE_HRMCONFIG, headersOptions);
    yield put(getApiSuccess(personnel, category));
    // if (personnel.status || category.status) {
    //   yield put(getApiSuccess(personnel, category));
    // } else {
    //   yield put(changeSnackbar({ status: true, message: personnel.message || category.message || 'Lấy dữ liệu thất bại', variant: 'error' }));
    // }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export default function* reportHrmPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_API, getApiSaga);
}
