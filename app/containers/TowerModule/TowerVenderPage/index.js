/**
 *
 * TowerVenderPage
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
import makeSelectTowerVenderPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

function TowerVenderPage() {
  return (
    <div>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

TowerVenderPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  towerVenderPage: makeSelectTowerVenderPage(),
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

const withReducer = injectReducer({ key: 'towerVenderPage', reducer });
const withSaga = injectSaga({ key: 'towerVenderPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(TowerVenderPage);
