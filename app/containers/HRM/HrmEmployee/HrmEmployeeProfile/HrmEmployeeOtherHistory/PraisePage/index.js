/**
 *
 * PraisePage
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
import makeSelectPraisePage from './selectors';
import { API_HRM_PRAISE } from '../../../../../../config/urlConfig';
import reducer from './reducer';
import saga from './saga';
import AddPraise from './components/AddPraise';
import { createPraise, updatePraise, deletePraise } from './actions';

/* eslint-disable react/prefer-stateless-function */
function PraisePage(props) {
  const { praisePage, onCreatePraise, onUpdatePraise, onDeletePraise, id: hrmEmployeeId } = props;
  const { createPraiseSuccess, updatePraiseSuccess, reload } = praisePage;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPraise, setSelectedPraise] = useState(null);
  const filter = {
    hrmEmployeeId: hrmEmployeeId,
  }
  useEffect(
    () => {
      if (createPraiseSuccess === true) {
        handleClosePraiseDialog();
      }
      if (!createPraiseSuccess) {
      }
    },
    [createPraiseSuccess],
  );

  useEffect(
    () => {
      if (updatePraiseSuccess === true) {
        handleClosePraiseDialog();
      }
      if (!updatePraiseSuccess) {
      }
    },
    [updatePraiseSuccess],
  );

  const handleSave = useCallback(data => {
    const { _id: praiseId } = data;
    if (!praiseId) {
      onCreatePraise(data);
    } else {
      onUpdatePraise(praiseId, data);
    }
  }, []);

  const handleOpenPraiseDialog = () => {
    setOpenDialog(true);
  };

  const handleClosePraiseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const addItem = () => (
    <Add style={{ color: 'white' }} onClick={handleOpenPraiseDialog}>
      Open Menu
    </Add>
  );

  const handleDelete = ids => onDeletePraise(hrmEmployeeId, ids);

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
        <Edit style={{ fontSize: '20px', marginBottom: '5px' }} /> Khen thưởng con
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
          code="BonusChild"
          parentCode="hrm"
          onEdit={row => {
            setSelectedPraise(row);
            setOpenDialog(true);
          }}
          onDelete={handleDelete}
          reload={reload}
          apiUrl={API_HRM_PRAISE}
          settingBar={[addItem()]}
          filter={filter}

          disableAdd
        />
      </Paper>
      <SwipeableDrawer anchor="right" onClose={handleClosePraiseDialog} open={openDialog} width={window.innerWidth - 260}>
      <div 
        // style={{ width: window.innerWidth - 260 }}
        >
          <AddPraise hrmEmployeeId={hrmEmployeeId} code="BonusChild" praise={selectedPraise} onSave={handleSave} onClose={handleClosePraiseDialog} />
        </div>
      </SwipeableDrawer>
    </div>
  );
}

PraisePage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  praisePage: makeSelectPraisePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreatePraise: data => dispatch(createPraise(data)),
    onUpdatePraise: (hrmEmployeeId, data) => dispatch(updatePraise(hrmEmployeeId, data)),
    onDeletePraise: (hrmEmployeeId, ids) => dispatch(deletePraise(hrmEmployeeId, ids)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'praisePage', reducer });
const withSaga = injectSaga({ key: 'praisePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(PraisePage);
