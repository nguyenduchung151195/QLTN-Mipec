/**
 *
 * IndenturePage
 *
 * *
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
import makeSelectIndenturePage from './selectors';
import { API_HRM_INDENTURE } from '../../../../../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import AddIndenture from './components/AddIndenture';
import { createIndenture, updateIndenture, deleteIndenture } from './actions';
import { makeSelectProfile } from '../../../../../Dashboard/selectors';

/* eslint-disable react/prefer-stateless-function */
function IndenturePage(props) {
  const { indenturePage, onCreateIndenture, onUpdateIndenture, onDeleteIndenture, id: hrmEmployeeId, codeContract } = props;
  const { createIndentureSuccess, updateIndentureSuccess, deleteIndentureSuccess, reload } = indenturePage;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIndenture, setselectedIndenture] = useState(null);
  const filter = {
    hrmEmployeeId: hrmEmployeeId,
  }
  useEffect(
    () => {
      if (createIndentureSuccess === true) {
        handleCloseIndentureDialog();
      }
      if (!createIndentureSuccess) {
      }
    },
    [createIndentureSuccess],
  );
  useEffect(
    () => {
      if (updateIndentureSuccess === true) {
        handleCloseIndentureDialog();
      }
      if (!updateIndentureSuccess) {
      }
    },
    [updateIndentureSuccess],
  );

  const handleSave = useCallback(data => {
    const { _id: indentureId } = data;
    if (!indentureId) {
      onCreateIndenture(data);
    } else {
      onUpdateIndenture(indentureId, data);
    }
  }, []);

  const handleOpenIndentureDialog = () => {
    setselectedIndenture(null);
    setOpenDialog(true);
  };

  const handleCloseIndentureDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => (
    <Add style={{ color: 'white' }} onClick={handleOpenIndentureDialog}>
      Open Menu
    </Add>
  );

  const handleDelete = ids => onDeleteIndenture(hrmEmployeeId, ids);

  const mapFunction = item => ({
    ...item,
    hrmEmployeeId: item['name'],
    contractType: item['contractType']
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
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Quá trình tiến độ hợp đồng
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
          code="ContractProcess"
          parentCode="hrm"
          onEdit={row => {
            setselectedIndenture(row);
            setOpenDialog(true);
          }}
          onDelete={handleDelete}
          reload={reload}
          apiUrl={API_HRM_INDENTURE}
          settingBar={[addItem()]}
          filter={filter}
          profile={props.profile}
          disableAdd
          mapFunction={mapFunction}
        />
      </Paper>
      <SwipeableDrawer anchor="right" onClose={handleCloseIndentureDialog} open={openDialog} width={window.innerWidth - 260}>
      <div 
        // style={{ width: window.innerWidth - 260 }}
        >
          <AddIndenture
            hrmEmployeeId={hrmEmployeeId}
            code="ContractProcess"
            indenture={selectedIndenture}
            onSave={handleSave}
            onClose={handleCloseIndentureDialog}
            folderName={codeContract}
          />
        </div>
      </SwipeableDrawer>
    </div>
  );
}

IndenturePage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  indenturePage: makeSelectIndenturePage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateIndenture: data => dispatch(createIndenture(data)),
    onUpdateIndenture: (hrmEmployeeId, data) => dispatch(updateIndenture(hrmEmployeeId, data)),
    onDeleteIndenture: (hrmEmployeeId, ids) => dispatch(deleteIndenture(hrmEmployeeId, ids)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'indenturePage', reducer });
const withSaga = injectSaga({ key: 'indenturePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IndenturePage);
