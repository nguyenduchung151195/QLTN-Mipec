/**
 *
 * RecruitmentManagementPage
 *
 */

import { Grid } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import Buttons from 'components/CustomButtons/Button';
import ListPage from 'components/List';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import {  Paper, SwipeableDrawer } from '../../../../components/LifetekUi';
import { API_RECRUITMENT } from '../../../../config/urlConfig';
import { makeSelectProfile } from '../../../Dashboard/selectors';
//import { Kanban } from '../../../KanbanPlugin';
import { createRecruitmentManagement, deleteRecruitmentManagement, getCountHrmByRole, getHumanResource, mergeData,getPositionVacation, updateRecruitmentManagement } from './actions';
import AddRecruitmentManagement from './components/AddRecruitmentManagement/Loadable';
import reducer from './reducer';
import saga from './saga';
import makeSelectRecruitmentManagementPage from './selectors';
import Kanban from 'components/LifetekUi/Planner/PlanDemo';

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

function RecruitmentManagementPage(props) {
  const {
    mergeData,
    recruitmentManagementPage,
    onCreateRecruitmentManagement,
    onUpdateRecruitmentManagement,
    onDeleteRecruitmentManagement,
    id: hrmEmployeeId,
    getCountHrmByRole,
    getHumanResource,
    getPositionVacation,
    profile
  } = props;
  const {
    createRecruitmentManagementSuccess,
    updateRecruitmentManagementSuccess,
    deleteRecruitmentManagementSuccess,
    tab,
    countEmployee,
    fieldRole,
    positionVacation,
    humanResource
  } = recruitmentManagementPage;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecruitmentManagement, setSelectedRecruitmentManagement] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    getHumanResource();
  }, [])

  useEffect(
    () => {
      if (createRecruitmentManagementSuccess === true) {
        setReload(true);
        handleCloseRecruitmentManagementDialog();
      }
      if (!createRecruitmentManagementSuccess) {
        setReload(false);
      }
    },
    [createRecruitmentManagementSuccess],
  );

  useEffect(
    () => {
      if (updateRecruitmentManagementSuccess === true) {
        setReload(true);
        handleCloseRecruitmentManagementDialog();
      }
      if (!updateRecruitmentManagementSuccess) {
        setReload(false);
      }
    },
    [updateRecruitmentManagementSuccess],
  );

  const handleSave = useCallback(data => {
    console.log(data)
    // const vancancyId = data.vacanciesId._id
    const { _id: recruitmentManagementId } = data;
    const result = {
      ...data,
      // vacanciesId: vancancyId
    }
    
    if (!recruitmentManagementId) {
      onCreateRecruitmentManagement(result);
    } else {
      onUpdateRecruitmentManagement(recruitmentManagementId, result);
    }
  }, []);

  const handleOpenRecruitmentManagementDialog = () => {
    setSelectedRecruitmentManagement(null);
    setOpenDialog(true);
  };

  const handleCloseRecruitmentManagementDialog = useCallback(() => {
    setSelectedRecruitmentManagement(null)
    setOpenDialog(false);
  }, []);

  const addItem = () => (
    <Add style={{ color: 'white' }} onClick={handleOpenRecruitmentManagementDialog}>
      Open Menu
    </Add>
  );
  const addItemKanban = () => {
    setOpenDialog(true);
  };

  const ItemComponent = data => (
    <div
      style={{
        padding: '20px 5px',
        margin: '20px 5px',
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
      }}
    >
      <p className="kanban-planner">
        Tên công văn: <b> {data.name}</b>
      </p>
      <p className="kanban-planner">
        Người gửi: <b> {data.fromUsers ? data.fromUsers.map(item => item.name).join(', ') : ''}</b>
      </p>
      <p className="kanban-planner">
        Người ký: <b> {data.receiverSign ? data.receiverSign.name : ''}</b>
      </p>

      <div className="footer-kanban-item">
        <button type="button" className="footer-kanban-item-time">
          <Notifications style={{ fontSize: '1rem' }} /> {new Date(data.receiveTime).toLocaleDateString('vi-VN', { month: 'long', day: 'numeric' })}
        </button>
        <InsertCommentOutlined style={{ cursor: 'pointer' }} />
      </div>
    </div>
  );

  const handleDelete = data => onDeleteRecruitmentManagement(hrmEmployeeId, data);

  const customFunction = (items) => {
    const newItem = items.map(it => ({
      ...it,
      unitId: it['unitId.name'],
      proponent: it['proponent.name'],
      certificate: it['certificate.title'],
      specialized: it['specialized.title'],
      age: it['age.title'],
      levelLanguage: it['levelLanguage.title'],
      marriage: it['marriage.title'],
    }))
    return newItem;
  }
  return (
    <div>
      <Paper>
        <Grid container>
          <Grid item md={12}>
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
            exportExcel
            importExport
            code="HrmRecruitment"
            parentCode="hrm"
            onEdit={row => {
              setSelectedRecruitmentManagement(row);
              setOpenDialog(true);
            }}
            showDepartmentAndEmployeeFilter
            organizationUnitFilterKey="unitId"
            disableEmployee
            onDelete={handleDelete}
            reload={reload}
            apiUrl={API_RECRUITMENT}
            settingBar={[addItem()]}
            customFunction={customFunction}
            disableAdd
            profile={props.profile}
          />
        )}
        {tab === 1 ? <Kanban
        module="hrmStatus" code="ST06" apiUrl={API_RECRUITMENT}
        addItem={addItemKanban} itemComponent={ItemComponent} 
          // statusType="hrmStatus"
          // enableTotal
          // titleField="name" // tên trường sẽ lấy làm title trong kanban
          // //callBack={callBack} // sự kiện trả về kanban
          // // command: kanban-dragndrop: khi kéo thả kanban: trả về id trường vừa kéo và giá trị kanban mới (number)
          // // data={bos} // list dữ liệu
          // path={API_RECRUITMENT}
          // code="ST06" // code của danh sách trạng thái kanban
          // customContent={[
          //   {
          //     title: 'Giám sát',
          //     fieldName: 'supervisor.name',
          //     type: 'string',
          //   },
          //   {
          //     title: 'Khách hàng',
          //     fieldName: 'customer.name',
          //     type: 'string',
          //   },
          //   {
          //     title: 'Giá trị',
          //     fieldName: 'value.amount',
          //     type: 'number',
          //   },
          //   {
          //     title: 'Tạo ngày',
          //     fieldName: 'createdAt',
          //     type: 'date',
          //   },
          // ]}
          // customActions={[
          //   {
          //     action: 'email',
          //     params: 'typeLine=4',
          //   },
          //   {
          //     action: 'sms',
          //     params: 'typeLine=3',
          //   },
          //   {
          //     action: 'call',
          //     params: 'typeLine=2',
          //   },
          // ]}
          // history={props.history}
        />
          : null}
      </Paper>
      <SwipeableDrawer anchor="right" onClose={handleCloseRecruitmentManagementDialog} open={openDialog} width={window.innerWidth - 260}>
        <div
          style={{ padding: 15 }}
        >
          <AddRecruitmentManagement
            hrmEmployeeId={hrmEmployeeId}
            code="HrmRecruitment"
            recruitmentManagement={selectedRecruitmentManagement}
            onSave={handleSave}
            onClose={handleCloseRecruitmentManagementDialog}
            getCountHrmByRole={getCountHrmByRole}
            getPositionVacation={getPositionVacation}
            fieldRole={fieldRole}
            positionVacation={positionVacation}
            humanResource={humanResource}
            countEmployee={countEmployee}
            profile={profile}
            propsAll={props}
          />
        </div>
      </SwipeableDrawer>
    </div>
  );
}

RecruitmentManagementPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  recruitmentManagementPage: makeSelectRecruitmentManagementPage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    mergeData: data => dispatch(mergeData(data)),
    onCreateRecruitmentManagement: data => dispatch(createRecruitmentManagement(data)),
    onUpdateRecruitmentManagement: (hrmEmployeeId, data) => dispatch(updateRecruitmentManagement(hrmEmployeeId, data)),
    onDeleteRecruitmentManagement: (hrmEmployeeId, ids) => dispatch(deleteRecruitmentManagement(hrmEmployeeId, ids)),
    getCountHrmByRole: (roleCode, organizationUnit) => dispatch(getCountHrmByRole(roleCode, organizationUnit)),
    getPositionVacation: (roleCode) => dispatch(getPositionVacation(roleCode)),
    getHumanResource: () => dispatch(getHumanResource()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'recruitmentManagementPage', reducer });
const withSaga = injectSaga({ key: 'recruitmentManagementPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(RecruitmentManagementPage);
