import React, { memo, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid } from '@material-ui/core';
import { Paper, VerticalTabs, VerticalTab } from 'components/LifetekUi';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import { API_QUESTION, API_EXAM,API_ROUND_EXAM, API_VANCANCIES } from '../../../../config/urlConfig';
import makeSelectConfigRecruitment from './selectors';
import TableComponent from 'components/TableComponent';
import { changeSnackbar } from 'containers/Dashboard/actions';
import ListPage from 'components/List';
import { Edit, Person, Info, Add, Delete } from '@material-ui/icons';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Button } from '@material-ui/core';
import AddSubject from './components/AddSubject';
import AddQuestion from './components/AddQuestion';
import AddRound from './components/AddRound';
import AddVacation from './components/AddVacation';
import CustomerVerticalTabList from 'components/CustomVerticalTabList';
import SortableTree from 'react-sortable-tree';
import CustomTheme from 'components/ThemeSortBar/index';
import CustomSortableTree from './components/CustomSortableTree';

import {
  createSubject,
  updateSubject,
  deleteSubject,
  createRound,
  updateRound,
  deleteRound,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createVacation,
  updateVacation,
  deleteVacation,
} from './actions';

function ConfigRecruitmentPage(props) {
  const {
    configRecruitmentPage,
    createSubject,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    updateSubject,
    deleteSubject,
    createRound,
    updateRound,
    deleteRound,
    createVacation,
    updateVacation,
    deleteVacation,
  } = props;
  const { roundData, subjectData, vacationData, loading, createQuestionSuccess, success, createSubjectSuccess } = configRecruitmentPage;
  const [tab, setTab] = useState(0);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [localState, setLocalState] = useState({});
  const [reload, setReload] = useState(true);

  useEffect(
    () => {
      if (success) handleCloseDialog();
      setReload(success)
    },
    [success],
  );


  const handleSaveVacation = e => {
    const round = e.roundExams
    const map = e.roundExams.map((item,index)=>{
      return {
        ...round[index],
        roundExamId: round[index]._id,
        order: index,
      }
    })
    // const positions = {
    //   roleName: e.position.name,
    //   roleCode: e.position.code,
    // }
    const data = {
      ...e,
      roundExams: map,
      // position: positions
    }
    if (e._id) updateVacation(data);
    else createVacation(data);
  };

  const handleSaveRound = e => {
    const data = {
      ...e,
    }
    if (e._id) updateRound(data);
    else createRound(data);
  };

  const handleSaveSubject = e => {
    const data = {
      ...e,
      pointLadder: 10,
    }
    if (e._id) updateSubject(data);
    else createSubject(data);
  };

  const handleSaveQuestion = e => {
    const dataCorr = e.data && e.data.find(item => item.checked === true)
    const corrAns = dataCorr && dataCorr.content
    const data = {
      ...e,
      name: e.name,
      scores: 10,
      type: e.type,
      data: e.data,
      correctAnswer: corrAns || null,
      obligatory: e.obligatory,
    }
    if (e._id) updateQuestion(data);
    else createQuestion(data);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };
  const handleDeleteSubject = (data) => {
    if (data && data._id) {
      deleteSubject(data._id);
    } else {
      // Xóa lỗi
    }
  }
  const handleDeleteQuestion = (data) => {
    if (data && data._id) {
      deleteQuestion(data._id);
    } else {
      // Xóa lỗi
    }
  }
  const handleDeleteRound = (data) => {
    if (data && data._id) {
      deleteRound(data._id);
    } else {
      // Xóa lỗi
    }
  }
  const handleDeleteVacation = (data) => {
    if (data && data._id) {
      deleteVacation(data._id);
    } else {
      // Xóa lỗi
    }
  }

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
    setLocalState({});
  };

  const handleOpenDialogOnEdit = e => {
    setIsOpenDialog(true);
    setLocalState(e);
  };

  return (
    <Paper>
      <Grid container spacing={16}>
        <Grid item xs={2}>
          <VerticalTabs value={tab} onChange={(e, tab) => setTab(tab)}>
            <VerticalTab value={0} label="Vị trí tuyển dụng" />
            <VerticalTab value={1} label="Vòng thi" />
            <VerticalTab value={2} label="Môn thi" />
            <VerticalTab value={3} label="Câu hỏi" />
          </VerticalTabs>
        </Grid>
        <Grid item xs={10}>
          {tab === 0 && (<CustomSortableTree onEdit={handleOpenDialogOnEdit} onDelete={handleDeleteVacation} onChange={e => { }} settingBar={[
            <Button color="primary" size="small" variant="outlined" onClick={handleOpenDialog}>
              <Add /> Thêm mới
            </Button>,
          ]}
            reload={reload}
            success={success}
            apiUrl={API_VANCANCIES}
          />
          )}

          {tab === 1 && (
            <CustomSortableTree
              onEdit={handleOpenDialogOnEdit}
              onDelete={handleDeleteRound}
              onChange={e => { }}
              settingBar={[
                <Button color="primary" size="small" variant="outlined" onClick={handleOpenDialog}>
                  <Add /> Thêm mới
                </Button>,
              ]}
              apiUrl={API_ROUND_EXAM}
              reload={reload}
              success={success}
            />
          )}

          {tab === 2 && (
            <CustomSortableTree
              onEdit={handleOpenDialogOnEdit}
              onDelete={handleDeleteSubject}
              onChange={e => { }}
              settingBar={[
                <Button color="primary" size="small" variant="outlined" onClick={handleOpenDialog}>
                  <Add /> Thêm mới
                </Button>,
              ]}
              success={success}
              reload={reload}
              apiUrl={API_EXAM}
              createSubjectSuccess={createSubjectSuccess}
            />
          )}
          {tab === 3 && (
            <CustomSortableTree
              onEdit={handleOpenDialogOnEdit}
              onDelete={handleDeleteQuestion}
              onChange={e => { }}
              settingBar={[
                <Button color="primary" size="small" variant="outlined" onClick={handleOpenDialog}>
                  <Add /> Thêm mới
                </Button>,
              ]}
              success={success}
              reload={reload}
              apiUrl={API_QUESTION}
              createQuestionSuccess={createQuestionSuccess}
            />
          )}
        </Grid>
      </Grid>

      <Dialog fullWidth maxWidth={'md'} open={isOpenDialog && tab === 0} onClose={handleCloseDialog}>
        <DialogTitle>Thiết lập vị trí tuyển dụng</DialogTitle>
        <DialogContent>
          <AddVacation onSave={handleSaveVacation} onClose={handleCloseDialog} vacationData={localState} />
        </DialogContent>
      </Dialog>

      <Dialog fullWidth maxWidth={'md'} open={isOpenDialog && tab === 1} onClose={handleCloseDialog}>
        <DialogTitle>Thiết lập vòng thi</DialogTitle>
        <DialogContent>
          <AddRound onSave={handleSaveRound} onClose={handleCloseDialog} roundData={localState} />
        </DialogContent>
      </Dialog>

      <Dialog fullWidth maxWidth={'md'} open={isOpenDialog && tab === 2} onClose={handleCloseDialog} disableEnforceFocus>
        <DialogTitle>Thiết lập môn thi</DialogTitle>
        <DialogContent>
          <AddSubject onSave={handleSaveSubject} onClose={handleCloseDialog} subjectData={localState} createSubjectSuccess={createSubjectSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog fullWidth maxWidth={'md'} open={isOpenDialog && tab === 3} onClose={handleCloseDialog} disableEnforceFocus>
        <DialogTitle>Thiết lập bộ câu hỏi</DialogTitle>
        <DialogContent>
          <AddQuestion onSave={handleSaveQuestion} onClose={handleCloseDialog} questionData={localState} createQuestionSuccess={createQuestionSuccess} />
        </DialogContent>
      </Dialog>
    </Paper>
  );
}

const mapStateToProps = createStructuredSelector({
  configRecruitmentPage: makeSelectConfigRecruitment(),
});

function mapDispatchToProps(dispatch) {
  return {
    createSubject: data => dispatch(createSubject(data)),
    updateSubject: data => dispatch(updateSubject(data)),
    deleteSubject: (_id) => dispatch(deleteSubject(_id)),
    createQuestion: data => dispatch(createQuestion(data)),
    updateQuestion: data => dispatch(updateQuestion(data)),
    deleteQuestion: (_id) => dispatch(deleteQuestion(_id)),
    createRound: data => dispatch(createRound(data)),
    updateRound: data => dispatch(updateRound(data)),
    deleteRound: (_id) => dispatch(deleteRound(_id)),
    createVacation: data => dispatch(createVacation(data)),
    updateVacation: data => dispatch(updateVacation(data)),
    deleteVacation: (_id) => dispatch(deleteVacation(_id)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'dataRecruitment', reducer });
const withSaga = injectSaga({ key: 'dataRecruitment', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ConfigRecruitmentPage);
