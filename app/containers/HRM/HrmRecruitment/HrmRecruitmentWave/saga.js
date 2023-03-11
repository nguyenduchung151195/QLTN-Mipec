// import { take, call, put, select } from 'redux-saga/effects';

import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { API_RECRUITMENT_WAVE, API_HUMAN_RESOURCE, API_ROLE_GROUP,API_TO_LINK,API_ADD_CANDIDATE } from 'config/urlConfig';
import {
  createApplicantRecruitmentSuccess,
  createApplicantRecruitmentFailure,
  createRecruitmentWaveSuccess,
  createRecruitmentWaveFailure,
  updateRecruitmentWaveSuccess,
  updateRecruitmentWaveFailure,
  deleteRecruitmentWaveSuccess,
  deleteRecruitmentWaveFailure,
  getHumanResourceSuccess,
  getHumanResourceFailure,
  getRoleGroupSuccessAction,
  getRoleGroupError,
  postSwitchCandidateSuccess,
  postSwitchCandidateFailure,
} from './actions';
import {
  CREATE_RECRUIMENTWAVE,
  UPDATE_RECRUIMENTWAVE,
  DELETE_RECRUIMENTWAVE,
  CREATE_ROUNDRECRUIMENT,
  UPDATE_ROUNDRECRUIMENT,
  DELETE_ROUNDRECRUIMENT,
  CREATE_SUBJECTRECRUIMENT,
  UPDATE_SUBJECTRECRUIMENT,
  DELETE_SUBJECTRECRUIMENT,
  CREATE_APPLICANTRECRUITMENT,
  UPDATE_APPLICANTRECRUITMENT,
  DELETE_APPLICANTRECRUITMENT,
  GET_HUMAN_RESOURCE,
  GET_ROLE_GROUP,
  POST_SWITCH_CANDIDATE
} from './constants';
import { changeSnackbar } from '../../../Dashboard/actions';

export function* postSwitchCandidateSaga(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_TO_LINK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log(1)
    if (response.status) {
      console.log(12)
      yield put(changeSnackbar({ status: true, message: 'Chuyển ứng viên thành công', variant: 'success' }));
      yield put(postSwitchCandidateSuccess(response));
    } else {
      console.log(13,response)
      yield put(changeSnackbar({ status: true, message: response.message || 'Chuyển ứng viên thất bại', variant: 'error' }));
      yield put(postSwitchCandidateFailure(response));
    }
    console.log(14)
  } catch (err) {
    console.log(15,err)
    yield put(changeSnackbar({ status: true, message: err.message || 'Chuyển ứng viên thất bại', variant: 'error' }));
    yield put(postSwitchCandidateFailure(err));
  }
}
export function* createRecruitmentWave(action) {
  try {
    const { data } = action;
    const response = yield call(request, API_RECRUITMENT_WAVE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createRecruitmentWaveSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createRecruitmentWaveFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createRecruitmentWaveFailure(err));
  }
}

export function* updateRecruitmentWave(action) {
  try {
    const { hrmEmployeeId: RecruitmentWaveId, data } = action;
    const response = yield call(request, `${API_RECRUITMENT_WAVE}/${RecruitmentWaveId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Cập nhật thành công', variant: 'success' }));
      yield put(updateRecruitmentWaveSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Cập nhật thất bại', variant: 'error' }));
      yield put(updateRecruitmentWaveFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Cập nhật thất bại', variant: 'error' }));
    yield put(updateRecruitmentWaveFailure(err));
  }
}

export function* deleteRecruitmentWave(action) {
  try {
    const { hrmEmployeeId, ids } = action;
    const response = yield call(request, `${API_RECRUITMENT_WAVE}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Xóa thành công', variant: 'success' }));
      yield put(deleteRecruitmentWaveSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Xóa thất bại', variant: 'error' }));
      yield put(deleteRecruitmentWaveFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Xóa thất bại', variant: 'error' }));
    yield put(deleteRecruitmentWaveFailure(err));
  }
}

export function* getHumanResourceSaga() {
  const token = localStorage.getItem('token');
  try {
    const res = yield call(request, `${API_HUMAN_RESOURCE}`, {
      method: 'GET',
      headers: {
        Authorazation: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (res && res.status) {
      const { humanResourceSource, data } = res;
      yield put(getHumanResourceSuccess(humanResourceSource, data));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Lấy dữ thất bại định biên', variant: 'error' }));
      yield put(getHumanResourceFailure(response));
    }
  } catch (err) {
    yield put(changeSnackbar({ status: true, message: err.message || 'Lấy dữ thất bại định biên', variant: 'error' }));
    yield put(getHumanResourceFailure(err));
  }
}

export function* getRoleGroupSaga() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ROLE_GROUP}?clientId=20_CRM`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (data) {
      yield put(getRoleGroupSuccessAction(data.data));
    } else {
      yield put(getRoleGroupError({}));
    }
  } catch (err) {
    yield put(getRoleGroupError(err));
  }
}

export function* createRoundRecruitment(data) {
  console.log(data);
}
export function* updateRoundRecruitment(data) {
  console.log(data);
}
export function* deleteRoundRecruitment(data) {
  console.log(data);
}

export function* createSubjectRecruitment(data) {
  console.log(data);
}
export function* updateSubjectRecruitment(data) {
  console.log(data);
}
export function* deleteSubjectRecruitment(data) {
  console.log(data);
}

export function* createApplicantRecruitment(action) {
  try {
    const token = localStorage.getItem('token');
    // const { data } = action;
    console.log(action.action,'llllll')
    const response = yield call(request, API_ADD_CANDIDATE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.action),
    });
    if (response.status) {
      yield put(changeSnackbar({ status: true, message: 'Thêm mới thành công', variant: 'success' }));
      yield put(createApplicantRecruitmentSuccess(response));
    } else {
      yield put(changeSnackbar({ status: true, message: response.message || 'Thêm mới thất bại', variant: 'error' }));
      yield put(createApplicantRecruitmentFailure(response));
    }
  } catch (err) {
    console.log(err,11111)
    yield put(changeSnackbar({ status: true, message: err.message || 'Thêm mới thất bại', variant: 'error' }));
    yield put(createApplicantRecruitmentFailure(err));
  }
}
export function* updateApplicantRecruitment(data) {
  console.log(data);
}
export function* deleteApplicantRecruitment(data) {
  console.log(data);
}

export default function* RecruitmentWavePageSaga() {
  yield takeLatest(CREATE_RECRUIMENTWAVE, createRecruitmentWave);
  yield takeLatest(UPDATE_RECRUIMENTWAVE, updateRecruitmentWave);
  yield takeLatest(DELETE_RECRUIMENTWAVE, deleteRecruitmentWave);
  yield takeLatest(CREATE_ROUNDRECRUIMENT, createRoundRecruitment);
  yield takeLatest(UPDATE_ROUNDRECRUIMENT, updateRoundRecruitment);
  yield takeLatest(DELETE_ROUNDRECRUIMENT, deleteRoundRecruitment);
  yield takeLatest(CREATE_SUBJECTRECRUIMENT, createSubjectRecruitment);
  yield takeLatest(UPDATE_SUBJECTRECRUIMENT, updateSubjectRecruitment);
  yield takeLatest(DELETE_SUBJECTRECRUIMENT, deleteSubjectRecruitment);
  yield takeLatest(CREATE_APPLICANTRECRUITMENT, createApplicantRecruitment);
  yield takeLatest(UPDATE_APPLICANTRECRUITMENT, updateApplicantRecruitment);
  yield takeLatest(DELETE_APPLICANTRECRUITMENT, deleteApplicantRecruitment);
  yield takeLatest(GET_HUMAN_RESOURCE, getHumanResourceSaga);
  yield takeLatest(GET_ROLE_GROUP, getRoleGroupSaga);
  yield takeLatest(POST_SWITCH_CANDIDATE, postSwitchCandidateSaga);
}
