/**
 *
 * TowerCustomerPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectTowerCustomerPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

function TowerCustomerPage() {
  return (
    <div>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

TowerCustomerPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  towerCustomerPage: makeSelectTowerCustomerPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'towerCustomerPage', reducer });
const withSaga = injectSaga({ key: 'towerCustomerPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(TowerCustomerPage);
