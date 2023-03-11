/**
 *
 * SabbaticalPage
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
import makeSelectSabbaticalPage from './selectors';
import { API_HRM_SABBATICAL } from '../../../../../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import AddSabbatical from './components/AddSabbatical';
import { createSabbatical, updateSabbatical, deleteSabbatical } from './actions';

/* eslint-disable react/prefer-stateless-function */
function SabbaticalPage(props) {
  const { sabbaticalPage, onCreateSabbatical, onUpdateSabbatical, onDeleteSabbatical, id: hrmEmployeeId, fileName } = props;
  const { createSabbaticalSuccess, updateSabbaticalSuccess, deleteSabbaticalSuccess, reload } = sabbaticalPage;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSabbatical, setSelectedSabbatical] = useState(null);
  const filter = {
    hrmEmployeeId: hrmEmployeeId,
  }
  useEffect(
    () => {
      if (createSabbaticalSuccess === true) {
        handleCloseSabbaticalDialog();
      }
      if (!createSabbaticalSuccess) {
      }
    },
    [createSabbaticalSuccess],
  );
  useEffect(
    () => {
      if (updateSabbaticalSuccess === true) {
        handleCloseSabbaticalDialog();
      }
      if (!updateSabbaticalSuccess) {
      }
    },
    [updateSabbaticalSuccess],
  );

  const handleSave = useCallback(data => {
    const { _id: sabbaticalId, ...restData } = data;
    if (!sabbaticalId) {
      onCreateSabbatical(data);
    } else {
      onUpdateSabbatical(sabbaticalId, data);
    }
  }, []);

  const handleOpenSabbaticalDialog = () => {
    setSelectedSabbatical(null);
    setOpenDialog(true);
  };

  const handleCloseSabbaticalDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => (
    <Add style={{ color: 'white' }} onClick={handleOpenSabbaticalDialog}>
      Open Menu
    </Add>
  );

  const handleDelete = ids => onDeleteSabbatical(hrmEmployeeId, ids);

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
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Quá trình nghỉ phép
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
          code="InformationTakeLeave"
          parentCode="hrm"
          onEdit={row => {
            setSelectedSabbatical(row);
            setOpenDialog(true);
          }}
          onDelete={handleDelete}
          reload={reload}
          apiUrl={API_HRM_SABBATICAL}
          settingBar={[addItem()]}
          filter={filter}
          mapFunction={mapFunction}
          disableAdd
        />
      </Paper>
      <SwipeableDrawer anchor="right" onClose={handleCloseSabbaticalDialog} open={openDialog} width={window.innerWidth - 260}>
      <div 
        // style={{ width: window.innerWidth - 260 }}
        >
          <AddSabbatical
            code="InformationTakeLeave"
            hrmEmployeeId={hrmEmployeeId}
            sabbatical={selectedSabbatical}
            onSave={handleSave}
            onClose={handleCloseSabbaticalDialog}
            fileName={fileName}
          />
        </div>
      </SwipeableDrawer>
    </div>
  );
}

SabbaticalPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  sabbaticalPage: makeSelectSabbaticalPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateSabbatical: data => dispatch(createSabbatical(data)),
    onUpdateSabbatical: (hrmEmployeeId, data) => dispatch(updateSabbatical(hrmEmployeeId, data)),
    onDeleteSabbatical: (hrmEmployeeId, ids) => dispatch(deleteSabbatical(hrmEmployeeId, ids)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'sabbaticalPage', reducer });
const withSaga = injectSaga({ key: 'sabbaticalPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SabbaticalPage);
