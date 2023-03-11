/**
 *
 * AddRecruitmentWave
 *
 */

import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Info, Add, SwapHoriz } from '@material-ui/icons';
import { Grid, Typography, SwipeableDrawer } from '../../../../../../components/LifetekUi';
import CustomInputBase from '../../../../../../components/Input/CustomInputBase';
import CustomButton from '../../../../../../components/Button/CustomButton';
import CustomGroupInputField from '../../../../../../components/Input/CustomGroupInputField';
import Department from '../../../../../../components/Filter/DepartmentAndEmployee';
import { viewConfigName2Title } from '../../../../../../utils/common';
import moment from 'moment';
import Buttons from 'components/CustomButtons/Button';
import { Helmet } from 'react-helmet';
import { API_HRM_RECRUIMENTWAVE, API_VANCANCIES, API_CANDIDATE, API_ADD_CANDIDATE, API_ROUND_EXAM } from 'config/urlConfig';
import AddRecruitment from '../AddRecruitment';
import AddRoundRecruitment from '../AddRoundRecruitment';
import AddApplicantRecruitment from '../AddApplicantRecruitment';
import ListPage from 'components/List';
import SwicthCandidate from '../SwicthCandidate'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import CustomAppBar from 'components/CustomAppBar';

/* eslint-disable react/prefer-stateless-function */

function AddRecruitmentWave(props) {
  const [tab, setTab] = useState(0);
  const [showBtn, setShowBtn] = useState(0);

  const [selectedRoundRecruitmentWave, setSelectedRoundRecruitmentWave] = useState(null);
  const [isOpenRoundRecruitmentWave, setIsOpenRoundRecruitmentWave] = useState(null);
  const [isOpenSwitchCandidate, setIsOpenSwitchCandidate] = useState(null);
  const [id, setId] = useState(null)
  const [nextRound, setNextRound] = useState(null)
  const [recruitmentWaveId, setRecruitmentWaveId] = useState(null)
  const [recruitmentWaveCode, setRecruitmentWaveCode] = useState(null)
  const [round, setRound] = useState([])
  const [idRound, setIdRound] = useState([])
  const [dataRound, setDataRound] = useState([])
  const [localState, setLocalState] = useState(null)
  // const [localState]

  const [selectedApplicantRecruitmentWave, setSelectedApplicantRecruitmentWave] = useState(null);
  const [isOpenApplicantRecruitmentWave, setIsOpenApplicantRecruitmentWave] = useState(null);

  const {
    onClose,
    code,
    apiUrl,
    recruitmentWavePage,
    recruitmentWave,
    onCreateRoundRecruitment,
    onUpdateRoundRecruitment,
    onDeleteRoundRecruitment,
    onCreateSubjectRecruiment,
    onUpdateSubjectRecruiment,
    onDeleteSubjectRecruiment,
    onCreateApplicantRecruitment,
    onUpdateApplicantRecruitment,
    onDeleteApplicantRecruitment,
    onPostSwitchCandidate,
  } = props;

  const { updateRoundSuccess, updateApplicantSuccess, postSwitchCandidateSuccess, createApplicantRecruitmentSuccess } = recruitmentWavePage;
  const getId = id => {
    setId(id)
  }
  const getRecruitmentWaveId = id => {
    setRecruitmentWaveId(id)
  }
  const getRecruitmentWaveCode = id => {
    setRecruitmentWaveCode(id)
  }
  const Bt = props => (
    <Buttons onClick={() => { setTab(props.tab); setNextRound(props.nextRound), setIdRound(props.idRound) }}  {...props} color={props.tab === tab ? 'gradient' : 'simple'}>
      {props.children}
    </Buttons>
  );
  useEffect(
    () => {
      const api = `${API_VANCANCIES}/${id}`
      if (api && id !== null)
        fetch(`${api}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            setRound(data.data.roundExams)
          });
    },
    [id],
  );
  useEffect(
    () => {
      const api = `${API_ROUND_EXAM}/${idRound}`
      if (api && id !== null)
        fetch(`${api}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(response => response.json())
          .then(data => {
            setDataRound(data.data.exams)
          });
    },
    [idRound],
  );

  useEffect(
    () => {
      let score = 0
        dataRound.forEach(item=>{
          score += item.scored
           return score
        })
        setLocalState({scores : score})
    },
    [dataRound],
  );


  useEffect(
    () => {
      setShowBtn(recruitmentWave && recruitmentWave.originItem);
    },
    [recruitmentWave],
  );

  useEffect(
    () => {
      setIsOpenRoundRecruitmentWave(false);
    },
    [updateRoundSuccess],
  );
  useEffect(
    () => {
      handleCloseDialog(false);
    },
    [postSwitchCandidateSuccess],
  );
  useEffect(
    () => {
      setIsOpenApplicantRecruitmentWave(false);
    },
    [createApplicantRecruitmentSuccess],
  );

  useEffect(
    () => {
      setIsOpenApplicantRecruitmentWave(false);
    },
    [updateApplicantSuccess],
  );

  const handleSaveRoundRecruitmentWave = e => {

    if (e._id) onUpdateRoundRecruitment(e);

    else onCreateRoundRecruitment(data);
  };
  const handleCloseDialog = () => {
    setIsOpenSwitchCandidate(false);
  };
  const handleOpenDialog = () => {
    setIsOpenSwitchCandidate(true);
  };
  // const handleOpenDialog = () => {
  //   setIsOpenDialog(true);
  //   setLocalState({});
  // };

  // const handleOpenDialogOnEdit = e => {
  //   setIsOpenDialog(true);
  //   setLocalState(e);
  // };
  const handleSaveApplicantRecruitmentWave = e => {
    const data = {
      ...e,
      recruitmentWave: recruitmentWaveCode,
      organizationUnit: '5f101eab3d3f3a09bbf319d9'
    }
    if (e._id) onUpdateApplicantRecruitment(e);
    else onCreateApplicantRecruitment(data);
  };
  const handleSaveSwitchCandidate = e => {
    const data = e.scores ? {
      count: parseInt(e.count),
      scores: parseInt(e.scores),
      recruitmentWaveId: recruitmentWaveId,
      roundExamId: nextRound
    } : {
      count: parseInt(e.count),
      recruitmentWaveId: recruitmentWaveId,
      roundExamId: nextRound
    }

    onPostSwitchCandidate(data)
  }
  const filterCanStart = {
    vacanciesId: id,
    recruitmentWaveId: recruitmentWaveId
  }
  const filterCan = {
    // examId: null,
    // roundExamId: round.length > 0 ? round[0]._id : null,
    // vacanciesId: id,
    recruitmentWave: recruitmentWaveId
  }
  const filterCan1 = {
    examId: null,
    roundExamId: round.length > 1 ? round[1]._id : null,
    vacanciesId: id,
    recruitmentWaveId: recruitmentWaveId
  }
  const filterCan2 = {
    examId: null,
    roundExamId: round.length > 2 ? round[2]._id : null,
    vacanciesId: id,
    recruitmentWaveId: recruitmentWaveId
  }
  return (
    <>
      <Grid container>
        <Bt tab={0} style={{ marginLeft: 30 }}>
          Thông tin chung
        </Bt>
        {showBtn && <Bt tab={1}>Thiết lập phòng thi</Bt>}
        {showBtn && <Bt tab={4} nextRound={round[0] ? round[0]._id : null}>Danh sách ứng viên</Bt>}
        {round.length > 0 ?
          round.map((item, index) => {

            return (
              <>
                {<Bt tab={index + 5} nextRound={round[index + 1] ? round[index + 1]._id : null} idRound={round[index]._id}>{item.name}</Bt>}
              </>
            )
          }) : null
        }
        {showBtn && <Bt tab={2}>Ứng viên</Bt>}
        {showBtn && <Bt tab={3}>Kết quả thi tuyển</Bt>}

      </Grid>

      {tab === 0 && <AddRecruitment {...props} getId={getId} getRecruitmentWaveId={getRecruitmentWaveId} getRecruitmentWaveCode={getRecruitmentWaveCode} />}

      {tab === 1 && (
        <>
          <CustomAppBar
            title={'Thiết lập phòng thi'}
            onGoBack={e => onClose()}
            disableAdd
          />
          <ListPage
            apiUrl={`${API_CANDIDATE}`}
            code={code}
            parentCode="hrm"
            onEdit={row => {
              setSelectedRoundRecruitmentWave(row);
              setIsOpenRoundRecruitmentWave(true);
            }}
            onDelete={row => onDelete(row)}
            reload={updateRoundSuccess}
            settingBar={[
              <Add
                style={{ color: 'white' }}
                onClick={() => {
                  setIsOpenRoundRecruitmentWave(true);
                  setSelectedRoundRecruitmentWave({});
                }}
              >
                Open Menu
              </Add>
            ]}
            disableAdd
          />

          <Dialog maxWidth={'lg'} fullwidth open={isOpenRoundRecruitmentWave} onClose={() => setIsOpenRoundRecruitmentWave(false)}>
            <DialogTitle>THIẾT LẬP VÒNG THI</DialogTitle>
            <DialogContent>
              <AddRoundRecruitment
                {...props}
                selectedData={selectedRoundRecruitmentWave}
                onClose={() => setIsOpenRoundRecruitmentWave(false)}
                onSave={handleSaveRoundRecruitmentWave}
              />
            </DialogContent>
          </Dialog>
        </>
      )}

      {tab === 4 && (
        <>
          <CustomAppBar
            title={'Danh sách ứng viên ban đầu'}
            onGoBack={e => onClose()}
            disableAdd
          />
          <ListPage
            apiUrl={`${API_CANDIDATE}?recruitmentWaveCode=${recruitmentWaveCode}`}
            code={code}
            // filterCan={filterCanStart}
            noQuery
            parentCode="hrm"
            onEdit={row => {
              setIsOpenApplicantRecruitmentWave(true);
              // handleOpenDialogOnEdit()
            }}
            onDelete={row => onDelete(row)}
            reload={createApplicantRecruitmentSuccess}
            settingBar={[
              <SwapHoriz style={{ color: 'white' }} onClick={handleOpenDialog}>
                Chuyển ứng viên
              </SwapHoriz>,
              <Add style={{ color: 'white' }} onClick={() => { setIsOpenApplicantRecruitmentWave(true) }}>
                Open Menu
              </Add>,
            ]}
            disableAdd
          />
          <SwipeableDrawer
            anchor="right"
            onClose={() => setIsOpenApplicantRecruitmentWave(false)}
            open={isOpenApplicantRecruitmentWave}
            style={{ width: '100vh  - 20px' }}
            width={window.innerWidth - 260}
          >
            <AddApplicantRecruitment
              {...props}
              isOpenApplicantRecruitmentWave={isOpenApplicantRecruitmentWave}
              selectedData={selectedApplicantRecruitmentWave}
              onClose={() => setIsOpenApplicantRecruitmentWave(false)}

              onSave={handleSaveApplicantRecruitmentWave}
            />
          </SwipeableDrawer>
          <Dialog fullWidth maxWidth={'md'} open={isOpenSwitchCandidate} onClose={handleCloseDialog}>
            <DialogTitle>Chuyển ứng viên sang vòng sau</DialogTitle>
            <DialogContent>
              <SwicthCandidate onSave={handleSaveSwitchCandidate} disableScores nextRound={nextRound} onClose={handleCloseDialog} />
            </DialogContent>
          </Dialog>
        </>
      )}
      {tab === 5 && (
        <>
          <CustomAppBar
            title={'VÒng 1'}
            onGoBack={e => onClose()}
            disableAdd
          />
          <ListPage
            apiUrl={`${API_CANDIDATE}?recruitmentWaveCode=${recruitmentWaveCode}&roundExamId=${idRound}&recruitmentWaveId=${recruitmentWaveId}`}
            code={code}
            // filterCan={filterCan}
            parentCode="hrm"
            noQuery
            disableEdit
            onEdit={row => {
              setIsOpenApplicantRecruitmentWave(true);
              // handleOpenDialogOnEdit()
            }}
            onDelete={row => onDelete(row)}
            reload={updateApplicantSuccess}
            settingBar={[
              <SwapHoriz style={{ color: 'white' }} onClick={handleOpenDialog}>
                Chuyển ứng viên
              </SwapHoriz>,
              // <Add style={{ color: 'white' }} onClick={() => { setIsOpenApplicantRecruitmentWave(true) }}>
              //   Open Menu
              // </Add>
            ]}
            disableAdd
          />
          <SwipeableDrawer
            anchor="right"
            onClose={() => setIsOpenApplicantRecruitmentWave(false)}
            open={isOpenApplicantRecruitmentWave}
            style={{ width: '100vh  - 20px' }}
            width={window.innerWidth - 260}
          >
            <AddApplicantRecruitment
              {...props}
              isOpenApplicantRecruitmentWave={isOpenApplicantRecruitmentWave}
              selectedData={selectedApplicantRecruitmentWave}
              onClose={() => setIsOpenApplicantRecruitmentWave(false)}

              onSave={handleSaveApplicantRecruitmentWave}
            />
          </SwipeableDrawer>
          <Dialog fullWidth maxWidth={'md'} open={isOpenSwitchCandidate} onClose={handleCloseDialog}>
            <DialogTitle>Chuyển ứng viên sang vòng sau</DialogTitle>
            <DialogContent>
              <SwicthCandidate onSave={handleSaveSwitchCandidate} switchData={localState} nextRound={nextRound} onClose={handleCloseDialog} />
            </DialogContent>
          </Dialog>
        </>
      )}
      {tab === 6 && (
        <>
          <CustomAppBar
            title={'VÒng 2'}
            onGoBack={e => onClose()}
            disableAdd
          />
          <ListPage
            apiUrl={`${API_CANDIDATE}?recruitmentWaveCode=${recruitmentWaveCode}&roundExamId=${idRound}&recruitmentWaveId=${recruitmentWaveId}`}
            code={code}
            // filterCan={filterCan1}
            noQuery
            parentCode="hrm"
            onEdit={row => {
              setIsOpenApplicantRecruitmentWave(true);
            }}
            onDelete={row => onDelete(row)}
            reload={updateApplicantSuccess}
            settingBar={[
              <Add style={{ color: 'white' }} onClick={() => setIsOpenApplicantRecruitmentWave(true)}>
                Open Menu
              </Add>,
            ]}
            disableAdd
          />
          <SwipeableDrawer
            anchor="right"
            onClose={() => setIsOpenApplicantRecruitmentWave(false)}
            open={isOpenApplicantRecruitmentWave}
            style={{ width: '100vh  - 20px' }}
            width={window.innerWidth - 260}
          >
            <AddApplicantRecruitment
              {...props}
              isOpenApplicantRecruitmentWave={isOpenApplicantRecruitmentWave}
              selectedData={selectedApplicantRecruitmentWave}
              onClose={() => setIsOpenApplicantRecruitmentWave(false)}
              onSave={handleSaveApplicantRecruitmentWave}
            />
          </SwipeableDrawer>
        </>
      )}
      {tab === 7 && (
        <>
          <CustomAppBar
            title={'VÒng 3'}
            onGoBack={e => onClose()}
            disableAdd
          />
          <ListPage
            apiUrl={`${API_CANDIDATE}`}
            code={code}
            filterCan={filterCan2}
            parentCode="hrm"
            onEdit={row => {
              setIsOpenApplicantRecruitmentWave(true);
            }}
            onDelete={row => onDelete(row)}
            reload={updateApplicantSuccess}
            settingBar={[
              <Add style={{ color: 'white' }} onClick={() => setIsOpenApplicantRecruitmentWave(true)}>
                Open Menu
              </Add>,
            ]}
            disableAdd
          />
          <SwipeableDrawer
            anchor="right"
            onClose={() => setIsOpenApplicantRecruitmentWave(false)}
            open={isOpenApplicantRecruitmentWave}
            style={{ width: '100vh  - 20px' }}
            width={window.innerWidth - 260}
          >
            <AddApplicantRecruitment
              {...props}
              isOpenApplicantRecruitmentWave={isOpenApplicantRecruitmentWave}
              selectedData={selectedApplicantRecruitmentWave}
              onClose={() => setIsOpenApplicantRecruitmentWave(false)}
              onSave={handleSaveApplicantRecruitmentWave}
            />
          </SwipeableDrawer>
        </>
      )}
      {tab === 2 && (
        <>
          <CustomAppBar
            title={'Ứng viên'}
            onGoBack={e => onClose()}
            disableAdd
          />
          <ListPage
            code={code}
            parentCode="hrm"
            onEdit={row => {
              setIsOpenApplicantRecruitmentWave(true);
            }}
            onDelete={row => onDelete(row)}
            reload={updateApplicantSuccess}
            apiUrl={apiUrl}
            settingBar={[
              <Add style={{ color: 'white' }} onClick={() => setIsOpenApplicantRecruitmentWave(true)}>
                Open Menu
              </Add>,
            ]}
            disableAdd
          />
          <SwipeableDrawer
            anchor="right"
            onClose={() => setIsOpenApplicantRecruitmentWave(false)}
            open={isOpenApplicantRecruitmentWave}
            style={{ width: '100vh  - 20px' }}
            width={window.innerWidth - 260}
          >
            <AddApplicantRecruitment
              {...props}
              isOpenApplicantRecruitmentWave={isOpenApplicantRecruitmentWave}
              selectedData={selectedApplicantRecruitmentWave}
              onClose={() => setIsOpenApplicantRecruitmentWave(false)}
              onSave={handleSaveApplicantRecruitmentWave}
            />
          </SwipeableDrawer>
        </>
      )}
      {tab === 3 && (
        <>
          <CustomAppBar
            title={'Kết quả thi tuyển'}
            onGoBack={e => onClose()}
            disableAdd
          />
        </>)}
    </>
  );
}

export default memo(AddRecruitmentWave);
