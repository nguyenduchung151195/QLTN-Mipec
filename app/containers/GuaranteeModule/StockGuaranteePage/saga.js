import { takeLatest, call, put, select } from 'redux-saga/effects';
import { API_STOCK_MAINTENANCE, API_STOCK_GUARANTEE } from '../../../config/urlConfig';
import * as constants from './constants';
import * as actions from './actions';
import { changeSnackbar } from '../../Dashboard/actions';
import request from '../../../utils/request';

function* getStockGuarantee(action) {
  const { id } = action;
  try {
    const stockGuarantee = yield call(request, `${API_STOCK_GUARANTEE}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stockGuarantee),
    });
    yield put(actions.getStockGuaranteeSuccess(stockGuarantee));
    yield put(changeSnackbar({ status: true, message: 'Lấy thông tin bảo hành sản phẩm thành công', variant: 'success' }));
  } catch (error) {
    console.log(error);
    yield put(actions.getStockGuaranteeFailure());

    yield put(changeSnackbar({ status: true, message: 'Lấy thông tin bảo hành sản phẩm thất bại', variant: 'error' }));
  }
}



function* postStockGuarantee(action) {
  const { data } = action;
  console.log(data);

  try {
    yield call(request, API_STOCK_GUARANTEE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    yield put(actions.createStockGuaranteeSuccess());

    yield put(changeSnackbar({ status: true, message: 'Thêm mới bảo hành sản phẩm thành công', variant: 'success' }));
  } catch (error) {
    yield put(actions.createStockGuaranteeFailure());
    console.log(error);
    yield put(changeSnackbar({ status: true, message: 'Thêm mới bảo hành sản phẩm thất bại', variant: 'error' }));
  }
}

function* putStockGuarantee(action) {
  const { data } = action;
  try {
    yield call(request, `${API_STOCK_GUARANTEE}/${data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    yield put(actions.updateStockGuaranteeSuccess());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật bảo hành sản phẩm thành công', variant: 'success' }));
  } catch (error) {
    yield put(actions.updateStockGuaranteeFailure());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật bảo hành sản phẩm thất bại', variant: 'error' }));
  }
}


function* getStockGuaranteeTask(action) {
  const { id } = action;
  try {
    const stockGuaranteeTask = yield call(request, `${API_STOCK_GUARANTEE}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      //body: JSON.stringify(stockGuaranteeTask),
    });
    yield put(actions.getStockGuaranteeTaskSuccess(stockGuaranteeTask));
    yield put(changeSnackbar({ status: true, message: 'Lấy thông tin bảo hành sản phẩm thành công', variant: 'success' }));
  } catch (error) {
    console.log(error);
    yield put(actions.getStockGuaranteeTaskFailure());

    yield put(changeSnackbar({ status: true, message: 'Lấy thông tin bảo hành sản phẩm thất bại', variant: 'error' }));
  }
}



function* postStockGuaranteeTask(action) {
  const { data } = action;
  const { task, stockGuarantee } = data;

  try {
    yield call(request, `${API_STOCK_GUARANTEE}/createTask?guaranteeStockId=${stockGuarantee._id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    yield put(actions.createStockGuaranteeTaskSuccess());

    yield put(changeSnackbar({ status: true, message: 'Thêm mới bảo công việc hành sản phẩm thành công', variant: 'success' }));
  } catch (error) {
    yield put(actions.createStockGuaranteeTaskFailure());
    console.log(error);
    yield put(changeSnackbar({ status: true, message: 'Thêm mới bảo công việc hành sản phẩm thất bại', variant: 'error' }));
  }
}

function* deleteStockGuaranteeTask(action) {
  const { data } = action;
  const { ids, stockGuarantee } = data;
  try {
    yield call(request, `${API_STOCK_GUARANTEE}/deleteTask/${stockGuarantee._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ids}),
    });
    yield put(actions.deleteStockGuaranteeSuccess());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật bảo công việc hành sản phẩm thành công', variant: 'success' }));
  } catch (error) {
    console.log(error);
    yield put(actions.deleteStockGuaranteeTaskFailure());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật bảo công việc hành sản phẩm thất bại', variant: 'error' }));
  }
}

function* getStockMaintenance(action) {
  const { id } = action;
  try {
    const stockMaintenance = yield call(request, `${API_STOCK_MAINTENANCE}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stockMaintenance),
    });
    yield put(actions.getStockMaintenanceSuccess(stockMaintenance));
    yield put(changeSnackbar({ status: true, message: 'Lấy thông tin bảo trì sản phẩm thành công', variant: 'success' }));
  } catch (error) {
    console.log(error);
    yield put(actions.getStockMaintenanceFailure());

    yield put(changeSnackbar({ status: true, message: 'Lấy thông tin bảo trì sản phẩm thất bại', variant: 'error' }));
  }
}



function* postStockMaintenance(action) {
  const { data } = action;

  try {
    yield call(request, API_STOCK_MAINTENANCE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    yield put(actions.createStockMaintenanceSuccess());

    yield put(changeSnackbar({ status: true, message: 'Thêm mới bảo trì sản phẩm thành công', variant: 'success' }));
  } catch (error) {
    yield put(actions.createStockMaintenanceFailure());
    console.log(error);
    yield put(changeSnackbar({ status: true, message: 'Thêm mới bảo trì sản phẩm thất bại', variant: 'error' }));
  }
}

function* putStockMaintenance(action) {
  const { data } = action;
  console.log(data);

  try {
    yield call(request, `${API_STOCK_MAINTENANCE}/${data._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    yield put(actions.updateStockMaintenanceSuccess());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật bảo trì sản phẩm thành công', variant: 'success' }));
  } catch (error) {
    yield put(actions.updateStockMaintenanceFailure());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật bảo trì sản phẩm thất bại', variant: 'error' }));
  }
}


function* getStockMaintenanceTask(action) {
  const { id } = action;
  try {
    const stockMaintenanceTask = yield call(request, `${API_STOCK_MAINTENANCE}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      //body: JSON.stringify(stockMaintenanceTask),
    });
    yield put(actions.getStockMaintenanceTaskSuccess(stockMaintenanceTask));
    yield put(changeSnackbar({ status: true, message: 'Lấy thông tin bảo trì sản phẩm thành công', variant: 'success' }));
  } catch (error) {
    console.log(error);
    yield put(actions.getStockMaintenanceTaskFailure());

    yield put(changeSnackbar({ status: true, message: 'Lấy thông tin bảo trì sản phẩm thất bại', variant: 'error' }));
  }
}



function* postStockMaintenanceTask(action) {
  const { data } = action;
  const { task, stockMaintenance } = data;

  try {
    yield call(request, `${API_STOCK_MAINTENANCE}/createTask?maintenanceStockId=${stockMaintenance._id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    yield put(actions.createStockMaintenanceTaskSuccess());

    yield put(changeSnackbar({ status: true, message: 'Thêm mới bảo công việc hành sản phẩm thành công', variant: 'success' }));
  } catch (error) {
    yield put(actions.createStockMaintenanceTaskFailure());
    console.log(error);
    yield put(changeSnackbar({ status: true, message: 'Thêm mới bảo công việc hành sản phẩm thất bại', variant: 'error' }));
  }
}

function* deleteStockMaintenanceTask(action) {
  const { data } = action;
  const { ids, stockMaintenance } = data;
  try {
    yield call(request, `${API_STOCK_MAINTENANCE}/deleteTask/${stockMaintenance._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ids}),
    });
    yield put(actions.deleteStockMaintenanceSuccess());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật bảo công việc hành sản phẩm thành công', variant: 'success' }));
  } catch (error) {
    console.log(error);
    yield put(actions.deleteStockMaintenanceTaskFailure());
    yield put(changeSnackbar({ status: true, message: 'Cập nhật bảo công việc hành sản phẩm thất bại', variant: 'error' }));
  }
}

// Individual exports for testing
export default function* stockGuaranteePageSaga() {
  yield takeLatest(constants.GET_STOCK_GUARANTEE, getStockGuarantee);
  yield takeLatest(constants.CREATE_STOCK_GUARANTEE, postStockGuarantee);
  yield takeLatest(constants.UPDATE_STOCK_GUARANTEE, putStockGuarantee);
  yield takeLatest(constants.GET_STOCK_GUARANTEE_TASK, getStockGuaranteeTask);
  yield takeLatest(constants.CREATE_STOCK_GUARANTEE_TASK, postStockGuaranteeTask);
  yield takeLatest(constants.DELETE_STOCK_GUARANTEE_TASK, deleteStockGuaranteeTask);

  yield takeLatest(constants.GET_STOCK_MAINTAINER, getStockMaintenance);
  yield takeLatest(constants.CREATE_STOCK_MAINTAINER, postStockMaintenance);
  yield takeLatest(constants.UPDATE_STOCK_MAINTAINER, putStockMaintenance);
  yield takeLatest(constants.GET_STOCK_MAINTAINER_TASK, getStockMaintenanceTask);
  yield takeLatest(constants.CREATE_STOCK_MAINTAINER_TASK, postStockMaintenanceTask);
  yield takeLatest(constants.DELETE_STOCK_MAINTAINER_TASK, deleteStockMaintenanceTask);
}
