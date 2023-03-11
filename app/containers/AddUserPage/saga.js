// import { take, call, put, select } from 'redux-saga/effects';

// Individual exports for testing
import qs from 'qs';
import { call, put, takeLatest } from 'redux-saga/effects';
import request, { requestAuth } from '../../utils/request';
import { ADD_USER, GET_DEPARTMENT, EDIT_USER, GET_USER, GET_MODULE, GET_ROLE_APP, EDIT_NEW_PASS } from './constants';
import {
  addUserFalseAction,
  addUserSuccessAction,
  getDepartmentSuccess,
  getDepartmentFailed,
  editUserSuccess,
  editUserFailed,
  getUserSuccess,
  getUserFailed,
  getmoduleSuccess,
  getModuleFailed,
  getRoleApp,
  getRoleAppSuccess,
  getRoleAppFailed,
  updateNewPass,
  updateNewPassSuccess,
  updateNewPassFailed,
} from './actions';
import {
  API_USERS,
  API_ORIGANIZATION,
  CREATE,
  UPLOAD_IMG_SINGLE,
  API_ROLE,
  API_COMMON_MODULE,
  API_ROLE_GROUP,
  APP_URL,
  API_HISTORY_ACTION,
  API_ROLE_APP,
  API_ADMIN_CHANGE_PASS,
} from '../../config/urlConfig';
import { clientId } from '../../variable';

export function* AddUser(action) {
  const formData = new FormData();
  formData.append('file', action.body.avatar);
  const registerUser = {
    username: action.body.username,
    password: action.body.password,
    name: action.body.name,
    email: action.body.email,
    code: action.body.code,
    status: action.body.status,
  };
  const token = localStorage.getItem('token');
  try {
    let avatar = '';
    if (action.body.avatar) {
      try {
        const formData = new FormData();
        formData.append('file', action.body.avatar);
        const upload = yield call(request, UPLOAD_IMG_SINGLE, {
          method: 'POST',
          headers: {},
          body: formData,
        });
        avatar = upload.url;
      } catch (error) {
        // avatar = '';
      }
    }

    const dataRegister = yield call(request, CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
      body: qs.stringify(registerUser),
    });
    if (dataRegister) {
      const createUser = {
        organizationUnit: action.body.organizationUnit,
        code: action.body.code,
        name: action.body.name,
        email: action.body.email,
        beginWork: action.body.beginWork,
        gender: action.body.gender,
        identityCardNumber: action.body.IDcard,
        phoneNumber: action.body.mobileNumber,
        address: action.body.address,
        note: action.body.note,
        positions: action.body.positions,
        userExtendViewConfig: action.body.userExtendViewConfig,
        avatar,
        dob: action.body.dob,
        status: action.body.status,
        username: action.body.username,
        user: dataRegister.user,
        others: action.body.others,
        type: action.body.type,
        roleGroupSource: action.body.roleGroupSource,
        allowedDepartment: action.body.allowedDepartment,
        admin: action.body.admin,
        // resetChild: action.body.resetChild,
      };
      const dataCreate = yield call(request, API_USERS, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createUser),
      });
      const bodyAddRole = {
        roles: action.body.allFunctionForAdd,
        userId: dataRegister.user,
      };
      yield call(request, API_ROLE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyAddRole),
      });
      if (dataCreate) {
        let dataHistoryAction = {
          module: 'Employee',
          action: 'Thêm mới',
        };
        request(API_HISTORY_ACTION, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
          },
          body: JSON.stringify(dataHistoryAction),
        });
        yield put(addUserSuccessAction());
      } else {
        yield put(addUserFalseAction());
      }
    } else {
      yield put(addUserFalseAction());
    }
    // yield put(addUserSuccessAction(data));
  } catch (err) {
    yield put(addUserFalseAction(err));
  }
}

export function* editUser(action) {
  const token = localStorage.getItem('token');
  try {
    let avatar = action.body.avatarURL;
    if (action.body.avatar) {
      try {
        const formData = new FormData();
        formData.append('file', action.body.avatar);
        const upload = yield call(request, UPLOAD_IMG_SINGLE, {
          method: 'POST',
          headers: {},
          body: formData,
        });
        avatar = upload.url;
      } catch (error) {
        // avatar = action.body.avatarURL;
      }
    }

    const editUser = {
      organizationUnit: action.body.organizationUnit,
      code: action.body.code,
      name: action.body.name,
      email: action.body.email,
      beginWork: action.body.beginWork,
      gender: action.body.gender,
      identityCardNumber: action.body.IDcard,
      phoneNumber: action.body.mobileNumber,
      address: action.body.address,
      note: action.body.note,
      positions: action.body.positions,
      avatar,
      userExtendViewConfig: action.body.userExtendViewConfig,
      dob: action.body.dob,
      status: action.body.status,
      user: action.body.user,
      others: action.body.others,
      type: action.body.type,
      codeRoleGroupSelect: action.body.codeRoleGroupSelect,
      roleGroupSource: action.body.roleGroupSource,
      allowedDepartment: action.body.allowedDepartment,
      admin: action.body.admin,
    };
    const dataEdit = yield call(request, `${API_USERS}/${action.body.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editUser),
    });
    if (dataEdit) {
      if (action.body.userId) {
        const bodyAddRole = {
          roles: action.body.allFunctionForAdd,
          userId: action.body.userId,
          // resetChild: action.body.resetChild,
        };
        yield call(request, `${API_ROLE}/${action.body.userId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyAddRole),
        });
      }
      if (action.body.resetChild) {
        const resetRoleBody = {
          userId: action.body.id,
          roleGroupId: action.body.roleGroupSelectId,
        };
        yield call(request, `${APP_URL}/api/roleApp/resetChildRole`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(resetRoleBody),
        });
      }
      let dataHistoryAction = {
        module: 'Employee',
        action: 'Cập nhật',
      };
      request(API_HISTORY_ACTION, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(dataHistoryAction),
      });
      yield put(editUserSuccess());
    } else {
      yield put(editUserFailed());
    }
    // yield put(addUserSuccessAction(data));
  } catch (err) {
    yield put(editUserFailed(err));
  }
}

export function* getDepartment() {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, API_ORIGANIZATION, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    yield put(getDepartmentSuccess(data));
  } catch (err) {
    yield put(getDepartmentFailed(err));
  }
}
export function* getDataRoleApp(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_ROLE_APP}/Employee/${action.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('data', data);
    yield put(getRoleAppSuccess(data.roles));
  } catch (err) {
    yield put(getRoleAppFailed(err));
  }
}
export function* editNewPass(action) {
  console.log('action', action);
  const token = localStorage.getItem('token');
  try {
    const data = yield call(requestAuth, `${API_ADMIN_CHANGE_PASS}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(action.body),
    });
    console.log('data', data);
    yield put(updateNewPassSuccess(data));
  } catch (err) {
    console.log('errror change pass', err);
    yield put(updateNewPassFailed(err));
  }
}
export function* getUser(action) {
  const token = localStorage.getItem('token');
  try {
    const data = yield call(request, `${API_USERS}/${action.body}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (data.status === 'success') {
      const userId = data.data.userId || null;
      let roleForCurrentUser = [];
      if (userId !== null) {
        roleForCurrentUser = yield call(request, `${API_ROLE}/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      yield put(
        getUserSuccess({
          user: data.data,
          role: roleForCurrentUser,
        }),
      );
    } else {
      yield put(getUserFailed());
    }
  } catch (err) {
    yield put(getUserFailed(err));
  }
}
export function* getModules() {
  try {
    const data = yield call(request, `${API_COMMON_MODULE}`, {
      method: 'GET',
    });
    const roleGroups = yield call(request, `${API_ROLE_GROUP}?clientId=${clientId}`, {
      method: 'GET',
    });
    yield put(
      getmoduleSuccess({
        data,
        roleGroups: roleGroups.data,
      }),
    );
  } catch (err) {
    yield put(getModuleFailed(err));
  }
}

// Individual exports for testing
export default function* addUserPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_USER, getUser);
  yield takeLatest(GET_ROLE_APP, getDataRoleApp);
  yield takeLatest(ADD_USER, AddUser);
  yield takeLatest(EDIT_USER, editUser);
  yield takeLatest(EDIT_NEW_PASS, editNewPass);
  yield takeLatest(GET_DEPARTMENT, getDepartment);
  yield takeLatest(GET_MODULE, getModules);
}
