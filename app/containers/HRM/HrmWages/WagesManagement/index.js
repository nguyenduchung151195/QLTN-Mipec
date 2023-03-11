/**
 *
 * WagesPage
 *
 */

import { Grid, AppBar, Toolbar, IconButton, Button } from '@material-ui/core';
import { Add, ImportExport, Close } from '@material-ui/icons';
import Buttons from 'components/CustomButtons/Button';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { Dialog, Paper, SwipeableDrawer, Typography } from '../../../../components/LifetekUi';
import ListPage from '../../../../components/List';
import { API_TIMEKEEPING_TABLE } from '../../../../config/urlConfig';
import { changeSnackbar } from '../../../Dashboard/actions';
import makeSelectDashboardPage, { makeSelectProfile } from '../../../Dashboard/selectors';
import Timekeeping from '../Timekeeping/Loadable';
import Kanban from '../../../KanbanPlugin';
import BODialog from '../../../../components/LifetekUi/Planner/BODialog';
import CustomAppBar from 'components/CustomAppBar';

import './style.css';
import {
  addTakeLeaveManager,
  // addOverTimeManager,
  createWages,
  deleteTakeLeaveManager,
  deleteWages,
  getAllTimekeepingEquipment,
  getAllVacationMode,
  getTimekeepingToEquipment,
  importTimeKeeping,
  mergeData,
  updateTakeLeaveManager,
  updateWages,
  // updateOverTimeManager,
  // deleteOverTimeManager,
  addPlanOverTime,
} from './actions';
import AddWages from './components/AddWages';
import ImportHrmTimeKeeping from './components/ImportHrmTimeKeeping';
// import TakeLeaveManager from './components/TakeLeaveManager/Loadable';
import reducer from './reducer';
import saga from './saga';
import makeSelectWagesManagement from './selectors';
/* eslint-disable react/prefer-stateless-function */
function Bt(props) {
  return (
    <Buttons
      // color={props.tab === tab ? 'gradient' : 'simple'}
      color={props.color}
      right
      round
      size="sm"
      onClick={props.onClick}
    >
      {props.children}
    </Buttons>
  );
}

function WagesPage(props) {
  const {
    mergeData,
    wagesPage,
    onCreateWages,
    onUpdateWages,
    onDeleteWages,
    id: hrmEmployeeId,
    onChangeSnackbar,
    dashboardPage,
    getAllTimekeepingEquipment,
    getTimekeepingToEquipment,
    importTimeKeeping,
    addTakeLeaveManager,
    updateTakeLeaveManager,
    deleteTakeLeaveManager,
    getAllVacationMode,
  } = props;
  const {
    createWagesSuccess,
    updateWagesSuccess,
    deleteWagesSuccess,
    tab,
    reload,
    timekeepingEquipment,
    hrm2equipment,
    addUpdateTakeleaveManagerSuccess,
    vacationMode,
  } = wagesPage;
  const [openDialog, setOpenDialog] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [selectedWages, setSelectedWages] = useState(null);
  // const [reload, setReload] = useState(false);
  const [kanbanFilter, setKanbanFilter] = useState({});
  const [filter] = useState({});
  const [openKanbanDialog, setOpenKanbanDialog] = useState(false);
  const [kanbanData] = useState({});

  useEffect(() => {
    getAllTimekeepingEquipment();
    getAllVacationMode();
  }, []);

  useEffect(
    () => {
      if (createWagesSuccess === true) {
        // setReload(true);
        handleCloseWagesDialog();
      }
      if (!createWagesSuccess) {
        // setReload(false);
      }
    },
    [createWagesSuccess],
  );

  useEffect(
    () => {
      if (updateWagesSuccess === true) {
        // setReload(true);
        handleCloseWagesDialog();
      }
      if (!updateWagesSuccess) {
        // setReload(false);
      }
    },
    [updateWagesSuccess],
  );

  useEffect(
    () => {
      if (deleteWagesSuccess === true) {
        // setReload(true);
      }
      if (!deleteWagesSuccess) {
        // setReload(false);
      }
    },
    [deleteWagesSuccess],
  );

  const handleSave = useCallback(data => {
    const { _id: WagesId } = data;
    if (!WagesId) {
      onCreateWages(data);
    } else {
      onUpdateWages(WagesId, data);
    }
  }, []);

  useEffect(() => {
    const listCrmStatus = JSON.parse(localStorage.getItem('hrmStatus'));
    const currentCrmStatus = listCrmStatus[listCrmStatus.findIndex(d => d.code === 'ST06')];
    const laneStart = [];
    const laneAdd = [];
    const laneSucces = [];
    const laneFail = [];
    currentCrmStatus &&
    currentCrmStatus.data != 'undefined' && 
    currentCrmStatus.data.forEach(item => {
      switch (item.code) {
        case 1:
          laneStart.push(item);
          break;
        case 2:
          laneAdd.push(item);
          break;

        case 3:
          laneSucces.push(item);
          break;

        case 4:
          laneFail.push(item);
          break;

        default:
          break;
      }
    });
    const sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
    setKanbanFilter({ crmStatusSteps: sortedKanbanStatus });
  }, []);

  const callBack = (cmd, data) => {
    if (cmd === 'quick-add') {
      setOpenDialog(true);
      return;
    }
    if (cmd === 'CommentDialog') {
      setOpenKanbanDialog(true);
      kanbanData(data);
      return;
    }
  };

  const handleCloseKanbanDialog = () => {
    setOpenKanbanDialog(false);
  };

  const handleOpenWagesDialog = () => {
    setSelectedWages(null);
    setOpenDialog(true);
  };

  const handleCloseWagesDialog = useCallback(() => {
    setSelectedWages(null);
    setOpenDialog(false);
  }, []);

  const addItem = () => (
    <Add style={{ color: 'white' }} onClick={handleOpenWagesDialog}>
      Open Menu
    </Add>
  );

  const importExport = () => <ImportExport style={{ color: 'white' }} onClick={() => setOpenImport(true)} />;

  const handleDelete = data => onDeleteWages(hrmEmployeeId, data);

  const mapFunction = item => ({
    ...item,
    inChargedEmployeeId: item['inChargedEmployeeId.name'],
    organizationUnitId: item['organizationUnitId.name'],
  });

  return (
    <div>
      <Paper>
        <Grid container>
          <Grid item md={12}>
            {/* <Bt onClick={() => mergeData({ tab: 3 })} color={tab === 3 ? 'gradient' : 'simple'}>
              Quản lý thời gian OT
            </Bt> */}
            {/* <Bt onClick={() => mergeData({ tab: 2 })} color={tab === 2 ? 'gradient' : 'simple'}>
              Quản lý nghỉ phép
            </Bt> */}
            <Bt onClick={() => mergeData({ tab: 1 })} color={tab === 1 ? 'gradient' : 'simple'}>
              Kanban
            </Bt>
            <Bt onClick={() => mergeData({ tab: 0 })} color={tab === 0 ? 'gradient' : 'simple'}>
              Danh sách
            </Bt>
          </Grid>
        </Grid>
        {tab === 0 && (
          <ListPage
            code="HrmTimekeepingTable"
            parentCode="hrm"
            onEdit={row => {
              setSelectedWages(row);
              setOpenDialog(true);
            }}
            disableSearch
            employeeFilterKey="inChargedEmployeeId"
            showDepartmentAndEmployeeFilter
            onDelete={handleDelete}
            reload={reload}
            mapFunction={mapFunction}
            apiUrl={API_TIMEKEEPING_TABLE}
            settingBar={[addItem(), importExport()]}
            disableAdd
            profile={props.profile}
            kanban="ST06"
          />
        )}
        {tab === 1 ? (
          <Kanban
            isOpenSinglePage
            statusType="hrmStatus"
            enableAdd
            titleField="name" // tên trường sẽ lấy làm title trong kanban
            callBack={callBack} // sự kiện trả về kanban
            // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
            // data={bos} // list dữ liệu
            // reload={reload}
            path={API_TIMEKEEPING_TABLE}
            code="ST06" // code của danh sách trạng thái kanban
            filter={kanbanFilter}
            customContent={customContent}
            customActions={[
              {
                action: 'comment',
                // params: 'typeLine=4',
              },
            ]}
            history={props.history}
          />
        ) : null}
        {/* {tab === 2 && <TakeLeaveManager
          reload={reload}
          addUpdateTakeleaveManagerSuccess={addUpdateTakeleaveManagerSuccess}

          addTakeLeaveManager={addTakeLeaveManager}
          updateTakeLeaveManager={updateTakeLeaveManager}
          deleteTakeLeaveManager={deleteTakeLeaveManager}

          vacationMode={vacationMode}
        />} */}
      </Paper>
      <Dialog dialogAction={false} onClose={handleCloseKanbanDialog} open={openKanbanDialog}>
        <BODialog
          setCoverTask={() => {}}
          profile={props.profile}
          taskId={kanbanData._id}
          // filterItem={innerFilterItem}
          data={kanbanData}
          API={API_TIMEKEEPING_TABLE}
          customContent={customContent}
        />
      </Dialog>
      <SwipeableDrawer anchor="right" onClose={() => setOpenImport(false)} open={openImport} width={window.innerWidth - 260}>
        <ImportHrmTimeKeeping
          timekeepingEquipment={timekeepingEquipment}
          hrm2equipment={hrm2equipment}
          getTimekeepingToEquipment={getTimekeepingToEquipment}
          importTimeKeeping={importTimeKeeping}
        />
      </SwipeableDrawer>
      {selectedWages ? (
        <SwipeableDrawer anchor="right" onClose={handleCloseWagesDialog} open={openDialog} width={window.innerWidth - 260}>
          <div>
            <Grid style={{ padding: '15px', marginTop: '70px' }}>
              <CustomAppBar title={'CẬP NHẬT BẢNG CHỐT CÔNG'} onGoBack={handleCloseWagesDialog} onSubmit={handleSave} />
              <Grid container direction="row" justify="flex-end">
                <Grid item xs={12}>
                  <Grid container direction="column" justify="center" alignItems="center">
                    <Typography variant="h5">BẢNG CHẤM CÔNG</Typography>
                    <Typography>
                      {selectedWages &&
                        selectedWages.originItem &&
                        `Tháng ${selectedWages.originItem.month || '...'} Năm ${selectedWages.originItem.year || '...'}`}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item style={{ width: 'calc(100% - 300px)' }}>
                  <Typography variant="body1">Họ và tên: {selectedWages['inChargedEmployeeId.name'] || ''} </Typography>
                  <Typography variant="body1">Phòng/ban: {selectedWages['organizationUnitId.name'] || ''}</Typography>
                </Grid>
              </Grid>
              <Timekeeping tableId={selectedWages && selectedWages._id} organizationUnitId={selectedWages['organizationUnitId._id']} />
            </Grid>
            {/* <AddWages
            hrmEmployeeId={hrmEmployeeId}
            code="Recruitment"
            Wages={selectedWages}
            onSave={handleSave}
            onClose={handleCloseWagesDialog}
          /> */}
          </div>
        </SwipeableDrawer>
      ) : (
        <AddWages
          profile={props.profile}
          code="HrmTimekeepingTable"
          onChangeSnackbar={onChangeSnackbar}
          wages={selectedWages}
          open={openDialog}
          users={wagesPage && wagesPage.users}
          onSave={handleSave}
          onClose={handleCloseWagesDialog}
        />
      )}
    </div>
  );
}

WagesPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  wagesPage: makeSelectWagesManagement(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    mergeData: data => dispatch(mergeData(data)),
    onCreateWages: data => dispatch(createWages(data)),
    onUpdateWages: (hrmEmployeeId, data) => dispatch(updateWages(hrmEmployeeId, data)),
    onDeleteWages: (hrmEmployeeId, ids) => dispatch(deleteWages(hrmEmployeeId, ids)),
    onChangeSnackbar: obj => dispatch(changeSnackbar(obj)),

    getAllTimekeepingEquipment: () => dispatch(getAllTimekeepingEquipment()),
    getTimekeepingToEquipment: _id => dispatch(getTimekeepingToEquipment(_id)),
    importTimeKeeping: data => dispatch(importTimeKeeping(data)),

    addTakeLeaveManager: data => dispatch(addTakeLeaveManager(data)),
    updateTakeLeaveManager: data => dispatch(updateTakeLeaveManager(data)),
    deleteTakeLeaveManager: ids => dispatch(deleteTakeLeaveManager(ids)),

    // che do
    getAllVacationMode: () => dispatch(getAllVacationMode()),

    // addOverTimeManager: (data) => dispatch(addOverTimeManager(data)),
    // updateOverTimeManager: (data) => dispatch(updateOverTimeManager(data)),
    // deleteOverTimeManager: (ids) => dispatch(deleteOverTimeManager(ids)),

    // ke hoach ot
    addPlanOverTime: data => dispatch(addPlanOverTime(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'wagesManagement', reducer });
const withSaga = injectSaga({ key: 'wagesManagement', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(WagesPage);
const customContent = [
  {
    title: 'Giám sát',
    fieldName: 'supervisor.name',
    type: 'string',
  },
  {
    title: 'Khách hàng',
    fieldName: 'customer.name',
    type: 'string',
  },
  {
    title: 'Giá trị',
    fieldName: 'value.amount',
    type: 'number',
  },
];
