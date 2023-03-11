// import { take, call, put, select } from 'redux-saga/effects';
import { takeEvery, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
import { API_DISPATCH } from '../../config/urlConfig';
import { DEFAULT_ACTION, MEGER_DATA, DELETE_DISPATCHS_GO, DELETE_DISPATCHS_GO_SUCCESS } from './constants';
import { changeSnackbar } from '../Dashboard/actions';
import {
  deleteDispatchGoSuccessAct,
} from './actions';
import { CREATE_DOCUMENT_SUCCESS } from '../AddDispatchManagerPage/constants';
import { serialize } from '../../helper';
let lastQuery = {};
// Individual exports for testing
// export default function* dispatchManagerGoSaga() {
//   // See example in containers/HomePage/saga.js
// }
export function* fetchDeleteDispatchGo(action) {
  const token = localStorage.getItem('token');
console.log(1111);
  try {
    const deletedBos = yield call(request, `${API_DISPATCH}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: action.data }),
    });

    if (deletedBos) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteDispatchGoSuccessAct());
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Xóa thất bại', variant: 'error' }));
  }
}
export default function* dispatchManagerGoSaga() {
  // See example in containers/HomePage/saga.js
  // yield takeEvery(GET_ALL_DISPATCH, getAllDispatch);
  // yield takeEvery(CREATE_DOCUMENT_SUCCESS, getAllDispatch);
  // yield takeEvery(DELETE_DISPATCHS_SUCCESS, getAllDispatch);
  yield takeEvery(DELETE_DISPATCHS_GO, fetchDeleteDispatchGo);
  // yield takeEvery(UPDATE_DISPATCH_SUCCESS, getAllDispatch);
  // yield takeEvery(UPDATE_DISPATCH, fetchUpdateDispatch);
}
