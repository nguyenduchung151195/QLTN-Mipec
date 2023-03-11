import { takeEvery, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import {
  getAssetSuccess,
  getAssetFailed,
  editAllocationSuccess,
  editAllocationFailed,
} from './actions';
import { GET_ASSET, EDIT_ALLOCATION } from './constants';
import { API_ASSET, API_ASSET_ALLOCATION, API_HISTORY_ACTION } from '../../../config/urlConfig';
import { changeSnackbar } from '../../Dashboard/actions';

export function* getAsset(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ASSET}/${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data) {
      yield put(getAssetSuccess(data));
    } else {
      yield put(getAssetFailed({}));
    }
  } catch (err) {
    console.log(err);
    yield put(getAssetFailed(err));
  }
}

export function* editAllocation(action) {
  const { body } = action;
  let method = body.method === 'add' ? 'POST' : 'PUT';
  let id = '';
  if (method === 'PUT') {
    id = body.id;
    body.method = 'update';
  } else id = '';
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ASSET_ALLOCATION}/${id}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (data) {
      yield put(editAllocationSuccess(data));
      if (method === 'PUT') {
        let dataHistoryAction = {
          module: 'Asset',
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
      } else {
        let dataHistoryAction = {
          module: 'Asset',
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
      yield put(
        changeSnackbar({ status: true, message: 'Thao tác thành công', variant: 'success' }),
      );
    } else {
      yield put(editAllocationFailed({}));
      yield put(changeSnackbar({ status: true, message: 'Thao tác thất bại', variant: 'error' }));
    }
  } catch (err) {
    console.log(err);
    yield put(editAllocationFailed(err));
    yield put(changeSnackbar({ status: true, message: 'Thao tác thất bại', variant: 'error' }));
  }
}

// Individual exports for testing
export default function* allocationPageSaga() {
  yield takeEvery(EDIT_ALLOCATION, editAllocation);
  yield takeEvery(GET_ASSET, getAsset);
}
