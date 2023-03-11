/**
 *
 * experiencePage
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
import makeSelectExperiencePage from './selectors';
import { API_HRM_EXPERIENCE } from '../../../../../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import AddExperience from './components/AddExperience';
import { createExperience, updateExperience, deleteExperience } from './actions';

/* eslint-disable react/prefer-stateless-function */
function ExperiencePage(props) {
  const { experiencePage, onCreateExperience, onUpdateExperience, onDeleteExperience, id: hrmEmployeeId } = props;
  const { createExperienceSuccess, updateExperienceSuccess, deleteExperienceSuccess, reload } = experiencePage;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExperience, setselectedExperience] = useState(null);
  const filter = {
    hrmEmployeeId: hrmEmployeeId,
  }
  useEffect(
    () => {
      if (createExperienceSuccess === true) {
        handleCloseExperienceDialog();
      }
      if (!createExperienceSuccess) {
      }
    },
    [createExperienceSuccess],
  );

  useEffect(
    () => {
      if (updateExperienceSuccess === true) {
        handleCloseExperienceDialog();
      }
      if (!updateExperienceSuccess) {
      }
    },
    [updateExperienceSuccess],
  );

  const handleSave = useCallback(data => {
    const { _id: experienceId, ...restData } = data;
    if (!experienceId) {
      onCreateExperience(data);
    } else {
      onUpdateExperience(experienceId, data);
    }
  }, []);

  const handleOpenExperienceDialog = () => {
    setselectedExperience(null);
    setOpenDialog(true);
  };

  const handleCloseExperienceDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => (
    <Add style={{ color: 'white' }} onClick={handleOpenExperienceDialog}>
      Open Menu
    </Add>
  );

  const hanleDelete = ids => onDeleteExperience(hrmEmployeeId, ids);

  const mapFunction = item => ({
    ...item,
    hrmEmployeeId: item['name'],
    
  });

  return (
    <div>
      <Typography
        component="p"
        style={{
          fontWeight: 550,
          fontSize: '18px',
          marginLeft: 40,
          marginTop: 40,
        }}
      >
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Quá trình kinh nghiệm làm việc
        <span
          style={{
            color: '#A4A4A4',
            fontStyle: 'italic',
            fontWeight: 500,
          }}
        />
      </Typography>
      <Paper>
        <ListPage
          code="WorkExperience"
          parentCode="hrm"
          onEdit={row => {
            setselectedExperience(row);
            setOpenDialog(true);
          }}
          onDelete={hanleDelete}
          reload={reload}
          apiUrl={API_HRM_EXPERIENCE}
          settingBar={[addItem()]}
          filter={filter}
          mapFunction={mapFunction}
          disableAdd
        />
      </Paper>
      <SwipeableDrawer anchor="right" onClose={handleCloseExperienceDialog} open={openDialog}  width={window.innerWidth - 260}>
      <div 
        // style={{ width: window.innerWidth - 260 }}
        >
          <AddExperience
            hrmEmployeeId={hrmEmployeeId}
            code="WorkExperience"
            experience={selectedExperience}
            onSave={handleSave}
            onClose={handleCloseExperienceDialog}
          />
        </div>
      </SwipeableDrawer>
    </div>
  );
}

ExperiencePage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  experiencePage: makeSelectExperiencePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateExperience: data => dispatch(createExperience(data)),
    onUpdateExperience: (hrmEmployeeId, data) => dispatch(updateExperience(hrmEmployeeId, data)),
    onDeleteExperience: (hrmEmployeeId, ids) => dispatch(deleteExperience(hrmEmployeeId, ids)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'experiencePage', reducer });
const withSaga = injectSaga({ key: 'experiencePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ExperiencePage);
