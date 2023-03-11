/**
 *
 * CashManager
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Tab, Tabs, withStyles } from '@material-ui/core';
import AddCashManager from 'containers/AddCashManager';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectCashManager from './selectors';
import reducer from './reducer';
import saga from './saga';
import { mergeData } from './actions';
import { SwipeableDrawer } from '../../components/LifetekUi';
import { mergeData as mergeDataCashManager } from '../AddCashManager/actions';

const VerticalTabs = withStyles(() => ({
  flexContainer: {
    flexDirection: 'column',
  },
  indicator: {
    display: 'none',
  },
}))(Tabs);

const VerticalTab = withStyles(() => ({
  selected: {
    color: 'white',
    backgroundColor: `#2196F3`,
    borderRadius: '5px',
    boxShadow: '3px 5.5px 7px rgba(0, 0, 0, 0.15)',
  },
  root: {},
}))(Tab);
/* eslint-disable react/prefer-stateless-function */
export class CashManager extends React.Component {
  mergeData = data => {
    this.props.mergeData(data);
  };

  onDialog = openDialog => {
    this.props.mergeData({ openDialog, tab: 0 });
    this.props.mergeDataCashManager({
      tab: 0,
    });
  };

  onCustomer = openCustomer => {
    this.props.mergeData({ openCustomer, tab:1 });
    this.props.mergeDataCashManager({
      tab: 1,
    });
  };

  // onDialog = openDialog => {
  //   this.props.mergeData({ openDialog });
  // };

  // onCustomer = openCustomer => {
  //   this.props.mergeData({ openCustomer });
  // };

  render() {
    const { cashManager } = this.props;
    const { id, openDialog, openCustomer, tab } = cashManager;
    return (
      <div>
        <VerticalTabs>
          <VerticalTab style={{ textAlign: 'left', textTransform: 'none' }} label="Tổng hợp thu tiền trong năm" onClick={this.onDialog} />
          <VerticalTab
            style={{ textAlign: 'left', textTransform: 'none' }}
            label="Top khách hàng thu tiền nhiều nhất trong tháng"
            onClick={this.onCustomer}
          />
        </VerticalTabs>
        <SwipeableDrawer anchor="right" onClose={() => this.props.mergeData({ openDialog: false })} open={openDialog} width={window.innerWidth - 260}>
          <AddCashManager id={id} tab={tab} />
        </SwipeableDrawer>
        <SwipeableDrawer anchor="right" onClose={() => this.props.mergeData({ openCustomer: false })} open={openCustomer} width={window.innerWidth - 260}>
          <AddCashManager id={id} tab={tab} />
        </SwipeableDrawer>
      </div>
    );
  }
}

CashManager.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  cashManager: makeSelectCashManager(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    mergeData: data => dispatch(mergeData(data)),
    mergeDataCashManager: data => dispatch(mergeDataCashManager(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'cashManager', reducer });
const withSaga = injectSaga({ key: 'cashManager', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(),
)(CashManager);
