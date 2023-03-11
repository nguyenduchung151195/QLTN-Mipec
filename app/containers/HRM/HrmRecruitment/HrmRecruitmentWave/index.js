/**
 *
 * RecruitmentWavePage
 *
 */

import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Edit, Add } from '@material-ui/icons';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import ListPage from 'components/List';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Paper, Typography, SwipeableDrawer } from 'components/LifetekUi';
import makeSelectRecruitmentWavePage from './selectors';
import { API_RECRUITMENT_WAVE } from 'config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import AddRecruitmentWave from './components/AddRecruitmentWave';
import {
  createRecruitmentWave,
  updateRecruitmentWave,
  deleteRecruitmentWave,
  createRoundRecruitment,
  updateRoundRecruitment,
  deleteRoundRecruitment,
  createSubjectRecruiment,
  updateSubjectRecruiment,
  deleteSubjectRecruiment,
  createApplicantRecruitment,
  updateApplicantRecruitment,
  deleteApplicantRecruitment,
  getHumanResource,
  getRoleGroupAction,
  postSwitchCandidate,
} from './actions';

/* eslint-disable react/prefer-stateless-function */
function RecruitmentWavePage(props) {
  const { recruitmentWavePage, onCreateRecruitmentWave, onUpdateRecruitmentWave, onDeleteRecruitmentWave, id: hrmEmployeeId } = props;
  const { createRecruitmentWaveSuccess, updateRecruitmentWaveSuccess, deleteRecruitmentWaveSuccess, createApplicantRecruitment } = recruitmentWavePage;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecruitmentWave, setSelectedRecruitmentWave] = useState(null);
  const [reload, setReload] = useState(false);
  const code = 'HrmRecruitmentWave';

  useEffect(
    () => {
      if (createRecruitmentWaveSuccess === true) {
        setReload(true);
        handleCloseRecruitmentWaveDialog();
      }
      if (!createRecruitmentWaveSuccess) {
        setReload(false);
      }
    },
    [createRecruitmentWaveSuccess],
  );
  useEffect(
    () => {
      if (createApplicantRecruitment === true) {
        setReload(true);
        handleCloseRecruitmentWaveDialog();
      }
      if (!createApplicantRecruitment) {
        setReload(false);
      }
    },
    [createApplicantRecruitment],
  );

  useEffect(
    () => {
      if (updateRecruitmentWaveSuccess === true) {
        setReload(true);
        handleCloseRecruitmentWaveDialog();
      }
      if (!updateRecruitmentWaveSuccess) {
        setReload(false);
      }
    },
    [updateRecruitmentWaveSuccess],
  );

  useEffect(
    () => {
      if (deleteRecruitmentWaveSuccess === true) {
        setReload(true);
      }
      if (!deleteRecruitmentWaveSuccess) {
        setReload(false);
      }
    },
    [deleteRecruitmentWaveSuccess],
  );
  const handleSave = useCallback(data => {
    const { _id: RecruitmentWaveId } = data;
    if (!RecruitmentWaveId) {
      onCreateRecruitmentWave(data);
    } else {
      onUpdateRecruitmentWave(RecruitmentWaveId, data);
    }
  }, []);

  const handleOpenRecruitmentWaveDialog = () => {
    setSelectedRecruitmentWave(null);
    setOpenDialog(true);
  };

  const handleCloseRecruitmentWaveDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => (
    <Add style={{ color: 'white' }} onClick={handleOpenRecruitmentWaveDialog}>
      Open Menu
    </Add>
  );

  const handleDelete = data => onDeleteRecruitmentWave(hrmEmployeeId, data);
  const customFunction = (items) => {
    console.log(items,'oooo')
    const newItem = items.map(it => ({
      ...it,
      unitId: it['unitId.name'],
      proponent: it['proponent.name'],
      certificate: it['certificate.title'],
      specialized: it['specialized.title'],
      age: it['age.title'],
      levelLanguage: it['levelLanguage.title'],
      marriage: it['marriage.title'],
      hrmRecruitmentId: it['hrmRecruitmentId.name'],
      informatics:it['informatics.title']
    }))
    return newItem;
  }
  return (
    <div>
      <Paper>
        <ListPage
          exportExcel
          code={code}
          onEdit={row => {
            setSelectedRecruitmentWave(row);
            setOpenDialog(true);
          }}
          onDelete={handleDelete}
          reload={reload}
          apiUrl={API_RECRUITMENT_WAVE}
          settingBar={[addItem()]}
          disableAdd
          customFunction={customFunction}
        />
      </Paper>
      
      <SwipeableDrawer anchor="right" onClose={handleCloseRecruitmentWaveDialog} open={openDialog}  width={window.innerWidth - 260}>
      <div style={{marginTop: 60}}>
        <AddRecruitmentWave
          {...props}
          hrmEmployeeId={hrmEmployeeId}
          code={code}
          recruitmentWave={selectedRecruitmentWave}
          onSave={handleSave}
          onClose={handleCloseRecruitmentWaveDialog}
        />
      </div>
      </SwipeableDrawer>
    </div>
  );
}

RecruitmentWavePage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  recruitmentWavePage: makeSelectRecruitmentWavePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateRecruitmentWave: data => dispatch(createRecruitmentWave(data)),
    onUpdateRecruitmentWave: (hrmEmployeeId, data) => dispatch(updateRecruitmentWave(hrmEmployeeId, data)),
    onDeleteRecruitmentWave: (hrmEmployeeId, ids) => dispatch(deleteRecruitmentWave(hrmEmployeeId, ids)),
    onCreateRoundRecruitment: action => dispatch(createRoundRecruitment(action)),
    onUpdateRoundRecruitment: action => dispatch(updateRoundRecruitment(action)),
    onDeleteRoundRecruitment: action => dispatch(deleteRoundRecruitment(action)),
    onCreateSubjectRecruiment: action => dispatch(createSubjectRecruiment(action)),
    onUpdateSubjectRecruiment: action => dispatch(updateSubjectRecruiment(action)),
    onDeleteSubjectRecruiment: action => dispatch(deleteSubjectRecruiment(action)),
    onPostSwitchCandidate: action => dispatch(postSwitchCandidate(action)),
    onCreateApplicantRecruitment: action => dispatch(createApplicantRecruitment(action)),
    onUpdateApplicantRecruitment: action => dispatch(updateApplicantRecruitment(action)),
    onDeleteApplicantRecruitment: action => dispatch(deleteApplicantRecruitment(action)),
    getHumanResource: () => dispatch(getHumanResource()),
    onGetRoleGroup: () => dispatch(getRoleGroupAction()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'recruitmentWavePage', reducer });
const withSaga = injectSaga({ key: 'recruitmentWavePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(RecruitmentWavePage);
