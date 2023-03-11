/**
 *
 * AssetGuaranteePage
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAssetGuaranteePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { AppBar, Tab, Tabs, withStyles } from '@material-ui/core';
import styles from './styles';
import { setStyle } from '@amcharts/amcharts4/.internal/core/utils/DOM';
import AssetGuaranteeTabPage from './Tabs/AssetGuaranteeTabPage';
import AssetMaintenanceTabPage from './Tabs/AssetMaintenanceTabPage';
import * as actions from './actions';
function AssetGuaranteePage(props) {

  const { classes, onChangeType, assetGuaranteePage } = props;

  const { type } = assetGuaranteePage;

  const handleChange = (event, newValue) => {
    onChangeType(newValue);
  };

  return (
    <div>
      <AppBar style={{ zIndex: 1, marginBottom: 10 }} position="relative" color="default">
        <Tabs
          style={{ width: '95%' }}
          value={type}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            className={classes.tabRoot}
            label="Bảo hành"
          />
          <Tab
            className={classes.tabRoot}
            label="Bảo trì"
          />
        </Tabs>
      </AppBar>
      {type == 0 && (
        <AssetGuaranteeTabPage {...props} />
      )}
      {type == 1 && (
        <AssetMaintenanceTabPage {...props} />
      )}

    </div>
  );
}

AssetGuaranteePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  assetGuaranteePage: makeSelectAssetGuaranteePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onChangeType: data => dispatch(actions.changeType(data)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'assetGuaranteePage', reducer });

export default compose(
  memo,
  withReducer,
  withConnect,
  withStyles(styles),
)(AssetGuaranteePage);
