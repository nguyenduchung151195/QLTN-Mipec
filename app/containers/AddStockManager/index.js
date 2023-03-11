/* eslint-disable no-prototype-builtins */
/* eslint-disable func-names */
/**
 *
 * AddStockManager
 *
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Grid } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import { makeSelectProfile } from '../Dashboard/selectors';
import { TrendingFlat } from '@material-ui/icons';
import MomentUtils from '@date-io/moment';
import { inventoryColumns, inventoryReportByMonthColumns } from '../../variable';
import ListPage from 'containers/ListPage';
import { API_REPORT } from '../../config/urlConfig';
import Inventory from './List/Inventory/index';
import ImportStatement from './List/ImportStatement/index';
import ExportStatement from './List/ExportStatement/index';

import InventoryAsset from './List/InventoryAsset/index';
import ImportStatementAsset from './List/ImportStatementAsset/index';
import ExportStatementAsset from './List/ExportStatementAsset/index';


function AddStockManager(props) {
  const { tab, profile, onClose } = props;
  const [queryFilter, setQueryFilter] = useState({
    queryFilter: {
      year: 2021,
      organizationUnitId: '',
      employeeId: '',
      startDate: '',
      endDate: '',
      skip: 0,
      limit: 10,
    },
  })


  return (
    <>
      {tab === 0 ? (
        <Inventory onClose={onClose} />
      ) : null}

      {tab === 1 ? (
        <Grid item md={12}>
          <ImportStatement onClose={onClose} />
        </Grid>
      ) : null}

      {tab === 2 ? (
        <Grid item md={12}>
          <ExportStatement onClose={onClose} />
        </Grid>

      ) : null}
       {tab === 3 ? (
        <InventoryAsset onClose={onClose} />
      ) : null}

      {tab === 4 ? (
        <Grid item md={12}>
          <ImportStatementAsset onClose={onClose} />
        </Grid>
      ) : null}

      {tab === 5 ? (
        <Grid item md={12}>
          <ExportStatementAsset onClose={onClose} />
        </Grid>

      ) : null}
    </>
  )

}

// const mapStateToProps = createStructuredSelector({
//   profile: makeSelectProfile(),
// });
const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});

const withConnect = connect(
  mapStateToProps
);

export default compose(
  withConnect,
)(AddStockManager);


// const withConnect = connect(
//   mapStateToProps,
//   mapDispatchToProps,
// );



// export default compose(
//   withConnect,
// )(AddStockManager);

// export default AddStockManager;
