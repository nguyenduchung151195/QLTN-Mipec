import { takeLatest, call, put, select } from 'redux-saga/effects';
import { API_ASSET_MAINTENANCE, API_ASSET_GUARANTEE } from '../../../config/urlConfig';
import * as constants from './constants';
import * as actions from './actions';
import { changeSnackbar } from '../../Dashboard/actions';
import request from '../../../utils/request';

function* getAssetGuarantee(action) {
  const { id } = action;
  try {
    const assetGuarantee = yield call(request, `${API_ASSET_GUARANTEE}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assetGuarantee),
    });
    yield put(actions.getAssetGuaranteeSuccess(assetGuarantee));
    yield put(changeSnackbar({ status: true, message: 'Lấy thông tin bảo hành tài sản thành công', variant: 'success' }));
  } catch (error) {
    console.log(error);
    yield put(actions.getAssetGuaranteeFailure());

    yield put(changeSnackbar({ status: true, message: 'Lấy thông tin bảo hành tài sản thất bại', variant: 'error' }));
  }
}



function* postAssetGuarantee(action) {
  const { data } = action;
  try {
    yield call(request, API_ASSET_GUARANTEE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    yield put(actions.createAssetGuaranteeSuccess());

    yield put(changeSnackbar({ status: true, message: 'Thêm mới bảo hành tài sản thành công', variant: 'success' }));
  } catch (error) {
    yield put(actions.createAssetGuaranteeFailure());
    console.log(error);
    yield put(changeSnackbar({ status: true, message: 'Thêm mới bảo hành tài sản thất bại', variant: 'error' }));
  }
}

function* putAssetGuarantee(action) {
  const { data } = action;

  try {
    yield call(request, `${API_ASSET_GUARANTEE}/${data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    yield put(actions.updateAssetGuaranteeSuccess());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật bảo hành tài sản thành công', variant: 'success' }));
  } catch (error) {
    yield put(actions.updateAssetGuaranteeFailure());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật bảo hành tài sản thất bại', variant: 'error' }));
  }
}


function* getAssetGuaranteeTask(action) {
  const { id } = action;
  try {
    const assetGuaranteeTask = yield call(request, `${API_ASSET_GUARANTEE}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      //body: JSON.stringify(assetGuaranteeTask),
    });
    yield put(actions.getAssetGuaranteeTaskSuccess(assetGuaranteeTask));
    yield put(changeSnackbar({ status: true, message: 'Lấy thông tin bảo hành tài sản thành công', variant: 'success' }));
  } catch (error) {
    console.log(error);
    yield put(actions.getAssetGuaranteeTaskFailure());

    yield put(changeSnackbar({ status: true, message: 'Lấy thông tin bảo hành tài sản thất bại', variant: 'error' }));
  }
}



function* postAssetGuaranteeTask(action) {
  const { data } = action;
  const { task, assetGuarantee } = data;

  try {
    yield call(request, `${API_ASSET_GUARANTEE}/createTask?guaranteeAssetId=${assetGuarantee._id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    yield put(actions.createAssetGuaranteeTaskSuccess());

    yield put(changeSnackbar({ status: true, message: 'Thêm mới bảo công việc hành tài sản thành công', variant: 'success' }));
  } catch (error) {
    yield put(actions.createAssetGuaranteeTaskFailure());
    console.log(error);
    yield put(changeSnackbar({ status: true, message: 'Thêm mới bảo công việc hành tài sản thất bại', variant: 'error' }));
  }
}

function* deleteAssetGuaranteeTask(action) {
  const { data } = action;
  const { ids, assetGuarantee } = data;
  try {
    yield call(request, `${API_ASSET_GUARANTEE}/deleteTask/${assetGuarantee._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ids}),
    });
    yield put(actions.deleteAssetGuaranteeSuccess());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật bảo công việc hành tài sản thành công', variant: 'success' }));
  } catch (error) {
    console.log(error);
    yield put(actions.deleteAssetGuaranteeTaskFailure());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật bảo công việc hành tài sản thất bại', variant: 'error' }));
  }
}

function* getAssetMaintenance(action) {
  const { id } = action;
  try {
    const assetMaintenance = yield call(request, `${API_ASSET_MAINTENANCE}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assetMaintenance),
    });
    yield put(actions.getAssetMaintenanceSuccess(assetMaintenance));
    yield put(changeSnackbar({ status: true, message: 'Lấy thông tin bảo trì tài sản thành công', variant: 'success' }));
  } catch (error) {
    console.log(error);
    yield put(actions.getAssetMaintenanceFailure());

    yield put(changeSnackbar({ status: true, message: 'Lấy thông tin bảo trì tài sản thất bại', variant: 'error' }));
  }
}



function* postAssetMaintenance(action) {
  const { data } = action;

  try {
    yield call(request, API_ASSET_MAINTENANCE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    yield put(actions.createAssetMaintenanceSuccess());

    yield put(changeSnackbar({ status: true, message: 'Thêm mới bảo trì tài sản thành công', variant: 'success' }));
  } catch (error) {
    yield put(actions.createAssetMaintenanceFailure());
    console.log(error);
    yield put(changeSnackbar({ status: true, message: 'Thêm mới bảo trì tài sản thất bại', variant: 'error' }));
  }
}

function* putAssetMaintenance(action) {
  const { data } = action;

  try {
    yield call(request, `${API_ASSET_MAINTENANCE}/${data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    yield put(actions.updateAssetMaintenanceSuccess());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật bảo trì tài sản thành công', variant: 'success' }));
  } catch (error) {
    yield put(actions.updateAssetMaintenanceFailure());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật bảo trì tài sản thất bại', variant: 'error' }));
  }
}


function* getAssetMaintenanceTask(action) {
  const { id } = action;
  try {
    const assetMaintenanceTask = yield call(request, `${API_ASSET_MAINTENANCE}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      //body: JSON.stringify(assetMaintenanceTask),
    });
    yield put(actions.getAssetMaintenanceTaskSuccess(assetMaintenanceTask));
    yield put(changeSnackbar({ status: true, message: 'Lấy thông tin bảo trì tài sản thành công', variant: 'success' }));
  } catch (error) {
    console.log(error);
    yield put(actions.getAssetMaintenanceTaskFailure());

    yield put(changeSnackbar({ status: true, message: 'Lấy thông tin bảo trì tài sản thất bại', variant: 'error' }));
  }
}



function* postAssetMaintenanceTask(action) {
  const { data } = action;
  const { task, assetMaintenance } = data;

  try {
    yield call(request, `${API_ASSET_MAINTENANCE}/createTask?maintenanceAssetId=${assetMaintenance._id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    yield put(actions.createAssetMaintenanceTaskSuccess());

    yield put(changeSnackbar({ status: true, message: 'Thêm mới bảo công việc hành tài sản thành công', variant: 'success' }));
  } catch (error) {
    yield put(actions.createAssetMaintenanceTaskFailure());
    console.log(error);
    yield put(changeSnackbar({ status: true, message: 'Thêm mới bảo công việc hành tài sản thất bại', variant: 'error' }));
  }
}

function* deleteAssetMaintenanceTask(action) {
  const { data } = action;
  const { ids, assetMaintenance } = data;
  try {
    yield call(request, `${API_ASSET_MAINTENANCE}/deleteTask/${assetMaintenance._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ids}),
    });
    yield put(actions.deleteAssetMaintenanceSuccess());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật bảo công việc hành tài sản thành công', variant: 'success' }));
  } catch (error) {
    console.log(error);
    yield put(actions.deleteAssetMaintenanceTaskFailure());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật bảo công việc hành tài sản thất bại', variant: 'error' }));
  }
}

// Individual exports for testing
export default function* assetGuaranteePageSaga() {
  yield takeLatest(constants.GET_ASSET_GUARANTEE, getAssetGuarantee);
  yield takeLatest(constants.CREATE_ASSET_GUARANTEE, postAssetGuarantee);
  yield takeLatest(constants.UPDATE_ASSET_GUARANTEE, putAssetGuarantee);
  yield takeLatest(constants.GET_ASSET_GUARANTEE_TASK, getAssetGuaranteeTask);
  yield takeLatest(constants.CREATE_ASSET_GUARANTEE_TASK, postAssetGuaranteeTask);
  yield takeLatest(constants.DELETE_ASSET_GUARANTEE_TASK, deleteAssetGuaranteeTask);

  yield takeLatest(constants.GET_ASSET_MAINTAINER, getAssetMaintenance);
  yield takeLatest(constants.CREATE_ASSET_MAINTAINER, postAssetMaintenance);
  yield takeLatest(constants.UPDATE_ASSET_MAINTAINER, putAssetMaintenance);
  yield takeLatest(constants.GET_ASSET_MAINTAINER_TASK, getAssetMaintenanceTask);
  yield takeLatest(constants.CREATE_ASSET_MAINTAINER_TASK, postAssetMaintenanceTask);
  yield takeLatest(constants.DELETE_ASSET_MAINTAINER_TASK, deleteAssetMaintenanceTask);
}
