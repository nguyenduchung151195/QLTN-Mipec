/**
 *
 * BonusPage
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
import makeSelectBonusPage from './selectors';
import { API_HRM_BONUS } from '../../../../../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import AddBonus from './components/AddBonus';
import { createBonus, updateBonus, deleteBonus } from './actions';
import { makeSelectProfile } from '../../../../../Dashboard/selectors';

/* eslint-disable react/prefer-stateless-function */
function BonusPage(props) {
  const { bonusPage, onCreateBonus, onUpdateBonus, onDeleteBonus, id: hrmEmployeeId } = props;
  const { createBonusSuccess, updateBonusSuccess, deleteBonusSuccess, reload } = bonusPage;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBonus, setSelectedBonus] = useState(null);
  const filter = {
    hrmEmployeeId: hrmEmployeeId,
  }
  useEffect(
    () => {
      if (createBonusSuccess === true) {
        handleCloseBonusDialog();
      }
      if (!createBonusSuccess) {
      }
    },
    [createBonusSuccess],
  );

  useEffect(
    () => {
      if (updateBonusSuccess === true) {
        handleCloseBonusDialog();
      }
      if (!updateBonusSuccess) {
      }
    },
    [updateBonusSuccess],
  );

  const handleSave = useCallback(data => {
    const { _id: bonusId } = data;
    if (!bonusId) {
      onCreateBonus(data);
    } else {
      onUpdateBonus(bonusId, data);
    }
  }, []);

  const handleOpenBonusDialog = () => {
    setSelectedBonus(null);
    setOpenDialog(true);
  };

  const handleCloseBonusDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => (
    <Add style={{ color: 'white' }} onClick={handleOpenBonusDialog}>
      Open Menu
    </Add>
  );

  const handleDelete = data => onDeleteBonus(hrmEmployeeId, data);

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
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Quá trình khen thưởng
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
          code="BonusProcess"
          parentCode="hrm"
          onEdit={row => {
            setSelectedBonus(row);
            setOpenDialog(true);
          }}
          onDelete={handleDelete}
          reload={reload}
          apiUrl={API_HRM_BONUS}
          settingBar={[addItem()]}
          filter={filter}
          profile={props.profile}
          mapFunction={mapFunction}
          disableAdd
        />
      </Paper>
      <SwipeableDrawer anchor="right" onClose={handleCloseBonusDialog} open={openDialog}  width={window.innerWidth - 260}>
        <div 
        // style={{ width: window.innerWidth - 260 }}
        >
          <AddBonus hrmEmployeeId={hrmEmployeeId} code="BonusProcess" bonus={selectedBonus} onSave={handleSave} onClose={handleCloseBonusDialog} />
        </div>
      </SwipeableDrawer>
    </div>
  );
}

BonusPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  bonusPage: makeSelectBonusPage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateBonus: data => dispatch(createBonus(data)),
    onUpdateBonus: (hrmEmployeeId, data) => dispatch(updateBonus(hrmEmployeeId, data)),
    onDeleteBonus: (hrmEmployeeId, ids) => dispatch(deleteBonus(hrmEmployeeId, ids)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'bonusPage', reducer });
const withSaga = injectSaga({ key: 'bonusPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(BonusPage);
