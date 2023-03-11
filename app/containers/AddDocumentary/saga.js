import { put, takeLatest, call } from 'redux-saga/effects';
import { changeSnackbar } from '../Dashboard/actions';
import request from '../../utils/request';
import { API_REPORT } from '../../config/urlConfig';
import { getDataSuccess, mergeData } from './actions';
import { GET_DATA } from './constants';

// Individual exports for testing
export function* getDataSaga() {
  try {
    const data = yield call(request, `${API_REPORT}/debtSupplier`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    yield put(getDataSuccess(data));
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export default function* addDocumentarySaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_DATA, getDataSaga);
}
