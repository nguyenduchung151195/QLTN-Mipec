// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { API_TIMEKEEPING_PAYCHECK } from 'config/urlConfig';
import {
  getDetailWageSalarySuccess,
  getDetailWageSalaryFailure,
  sendMailWageSalaryFailure,
  sendMailWageSalarySuccess,
  getAllTemplateSuccess,
  getAllTemplateFailure,
} from './actions';
import { GET_DETAIL_WAGE_SALARY, SEND_MAIL_WAGE_SALARY, GET_ALL_TEMPLATE } from './constants';
import { changeSnackbar } from 'containers/Dashboard/actions';
import { API_TEMPLATE } from '../../../../config/urlConfig';
import { clientId } from '../../../../variable';

export function* getDetailWagesSalary(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_TIMEKEEPING_PAYCHECK}?hrmWageId=${action.data._id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // console.log('1', res)
    if (res && res.status === 1) {
      yield put(getDetailWageSalarySuccess(res.data));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
      yield put(getDetailWageSalaryFailure(res));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
    yield put(getDetailWageSalaryFailure(error));
  }
}

export function* getTemplateEmail(action) {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_TEMPLATE}?clientId=${clientId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (res) {
      yield put(getAllTemplateSuccess(res));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
    }
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Lấy dữ liệu thất bại', variant: 'error' }));
  }
}

export function* sendMailWageSalarySaga(action) {
  const token = localStorage.getItem('token');
  try {
    const { data } = action;
    // console.log('saga', data);
    const res = yield call(request, `${API_TIMEKEEPING_PAYCHECK}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      method: 'POST'
    });
    if (res && res.status === 1) {
      yield put(changeSnackbar({ status: true, message: 'Gửi phiếu lương thành công', variant: 'error' }));
      yield put(sendMailWageSalarySuccess(res));
    } else {
      yield put(changeSnackbar({ status: true, message: 'Gửi phiếu lương thất bại', variant: 'error' }));
      yield put(sendMailWageSalaryFailure(res));
    }
  } catch (error) {
    yield put(changeSnackbar({ status: true, message: 'Gửi phiếu lương thất bại', variant: 'error' }));
    yield put(sendMailWageSalaryFailure(error));
  }
}
export default function* wageDetailPageSaga() {
  yield takeLatest(GET_DETAIL_WAGE_SALARY, getDetailWagesSalary);
  yield takeLatest(SEND_MAIL_WAGE_SALARY, sendMailWageSalarySaga);
  yield takeLatest(GET_ALL_TEMPLATE, getTemplateEmail);
}
