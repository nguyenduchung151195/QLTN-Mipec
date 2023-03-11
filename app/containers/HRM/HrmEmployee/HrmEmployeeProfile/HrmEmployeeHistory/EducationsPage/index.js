/**
 *
 * EducationPage
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
import { Paper, Typography, SwipeableDrawer } from '../../../../../../components/LifetekUi';
import makeSelectEducationPage from './selectors';
import { API_HRM_EDUCATION } from '../../../../../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import AddEducation from './components/AddEducation';
import { createEducation, updateEducation, deleteEducation } from './actions';

/* eslint-disable react/prefer-stateless-function */
function EducationPage(props) {
  const { educationPage, onCreateEducation, onUpdateEducation, onDeleteEducation, id: hrmEmployeeId } = props;
  const { createEducationSuccess, updateEducationSuccess, deleteEducationSuccess, reload } = educationPage;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEducation, setselectedEducation] = useState(null);
  const filter = {
    hrmEmployeeId: hrmEmployeeId,
  }
  useEffect(
    () => {
      if (createEducationSuccess === true) {
        handleCloseEducationDialog();
      }
      if (!createEducationSuccess) {
      }
    },
    [createEducationSuccess],
  );

  useEffect(
    () => {
      if (updateEducationSuccess === true) {
        handleCloseEducationDialog();
      }
      if (!updateEducationSuccess) {
      }
    },
    [updateEducationSuccess],
  );

  const handleSave = useCallback(data => {
    const { _id: educationId } = data;
    if (!educationId) {
      onCreateEducation(data);
    } else {
      onUpdateEducation(educationId, data);
    }
  }, []);

  const handleOpenEducationDialog = () => {
    setselectedEducation(null);
    setOpenDialog(true);
  };

  const handleCloseEducationDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => (
    <Add style={{ color: 'white' }} onClick={handleOpenEducationDialog}>
      Open Menu
    </Add>
  );

  const handleDelete = ids => onDeleteEducation(hrmEmployeeId, ids);

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
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Quá trình đào tạo
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
          code="EducateProcess"
          parentCode="hrm"
          onEdit={row => {
            setselectedEducation(row);
            setOpenDialog(true);
          }}
          onDelete={handleDelete}
          reload={reload}
          apiUrl={API_HRM_EDUCATION}
          settingBar={[addItem()]}
          filter={filter}
          mapFunction={mapFunction}
          disableAdd
        />
      </Paper>
      <SwipeableDrawer anchor="right" onClose={handleCloseEducationDialog} open={openDialog}  width={window.innerWidth - 260}>
        <div style={{ width: window.innerWidth - 260 }}>
          <AddEducation
            hrmEmployeeId={hrmEmployeeId}
            code="EducateProcess"
            education={selectedEducation}
            onSave={handleSave}
            onClose={handleCloseEducationDialog}
          />
        </div>
      </SwipeableDrawer>
    </div>
  );
}

EducationPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  educationPage: makeSelectEducationPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateEducation: data => dispatch(createEducation(data)),
    onUpdateEducation: (hrmEmployeeId, data) => dispatch(updateEducation(hrmEmployeeId, data)),
    onDeleteEducation: (hrmEmployeeId, ids) => dispatch(deleteEducation(hrmEmployeeId, ids)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'educationPage', reducer });
const withSaga = injectSaga({ key: 'educationPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(EducationPage);
