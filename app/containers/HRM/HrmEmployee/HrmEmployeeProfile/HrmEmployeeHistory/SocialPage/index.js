/**
 *
 * SocialPage
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
import makeSelectSocialPage from './selectors';
import { API_HRM_SOCIAL } from '../../../../../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import AddSocial from './components/AddSocial';
import { createSocial, updateSocial, deleteSocial } from './actions';

/* eslint-disable react/prefer-stateless-function */
function SocialPage(props) {
  const { socialPage, onCreateSocial, onUpdateSocial, onDeleteSocial, id: hrmEmployeeId } = props;
  const { createSocialSuccess, updateSocialSuccess, deleteSocialSuccess, reload } = socialPage;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSocial, setSelectedSocial] = useState(null);
  const filter = {
    hrmEmployeeId: hrmEmployeeId,
  }
  useEffect(
    () => {
      if (createSocialSuccess === true) {
        handleCloseSocialDialog();
      }
      if (!createSocialSuccess) {
      }
    },
    [createSocialSuccess],
  );

  useEffect(
    () => {
      if (updateSocialSuccess === true) {
        handleCloseSocialDialog();
      }
      if (!updateSocialSuccess) { }
    },
    [updateSocialSuccess],
  );

  const handleSave = useCallback(data => {
    const { _id: socailId } = data;
    if (!socailId) {
      onCreateSocial(data);
    } else {
      onUpdateSocial(socailId, data);
    }
  }, []);

  const handleOpenSocialDialog = () => {
    setSelectedSocial(null);
    setOpenDialog(true);
  };

  const handleCloseSocialDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => (
    <Add style={{ color: 'white' }} onClick={handleOpenSocialDialog}>
      Open Menu
    </Add>
  );

  const handleDelete = ids => onDeleteSocial(hrmEmployeeId, ids);

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
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Quá trình bảo hiểm
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
          code="InsuranceInformation"
          parentCode="hrm"
          onEdit={row => {
            setSelectedSocial(row);
            setOpenDialog(true);
          }}
          onDelete={handleDelete}
          reload={reload}
          apiUrl={API_HRM_SOCIAL}
          settingBar={[addItem()]}
          filter={filter}
          mapFunction={mapFunction}
          disableAdd
        />
      </Paper>
      <SwipeableDrawer anchor="right" onClose={handleCloseSocialDialog} open={openDialog} width={window.innerWidth - 260}>
      <div 
        style={{ width: window.innerWidth - 260 }}
        >
          <AddSocial
            code="InsuranceInformation"
            hrmEmployeeId={hrmEmployeeId}
            social={selectedSocial}
            onSave={handleSave}
            onClose={handleCloseSocialDialog}
          />
        </div>
      </SwipeableDrawer>
    </div>
  );
}

SocialPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  socialPage: makeSelectSocialPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateSocial: data => dispatch(createSocial(data)),
    onUpdateSocial: (hrmEmployeeId, data) => dispatch(updateSocial(hrmEmployeeId, data)),
    onDeleteSocial: (hrmEmployeeId, ids) => dispatch(deleteSocial(hrmEmployeeId, ids)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'socialPage', reducer });
const withSaga = injectSaga({ key: 'socialPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SocialPage);
