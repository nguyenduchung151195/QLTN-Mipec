/* eslint-disable radix */
/**
 *
 * TowerContractPage
 *
 */

import React, { useState, useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';

import { Grid, Table, TableBody, TableCell, TableRow, TableHead, Fab, Paper, Typography } from '@material-ui/core';
import { TextField } from 'components/LifetekUi';
import { Add, Check, Edit, Remove } from '@material-ui/icons';
import { AsyncAutocomplete } from '../../../../../components/LifetekUi';
import { API_STOCK } from '../../../../../config/urlConfig';
import { DatePicker } from 'material-ui-pickers';
import CustomDatePicker from 'components/CustomDatePicker';

const convertNumber = (num) => {
  if (isNaN(Number(num))) return;
  if (!isNaN(Number(num))) return Number(num).toLocaleString("es-AR", { maximumFractionDigits: 0 })
}
const MaintenanceRow = memo(props => {
  const { maintenance, fromDate, toDate, setFromDate, setToDate ,checkCount,disabled} = props;
  maintenance.dataProduct = maintenance.dataProduct ? maintenance.dataProduct : maintenance.stockId;
  const name=maintenance.name?maintenance.name: maintenance.dataProduct.name;
  const calcPrice = ({ amount, costPrice, dataProduct }) => {
    return (amount * (costPrice || dataProduct && dataProduct.pricePolicy && dataProduct.pricePolicy.costPrice)) + (amount * (costPrice || dataProduct && dataProduct.pricePolicy && dataProduct.pricePolicy.costPrice)) * (dataProduct&& dataProduct.tax / 100||0);
  };

  return (
    <TableRow>
      <TableCell>
        {/* <DatePicker
          inputVariant="outlined"
          format="DD/MM/YYYY"
          value={fromDate}
          variant="outlined"
          label="Ngày kết thúc"
          margin="dense"
          disabled
        /> */}
        <CustomDatePicker
          label="Ngày bắt đầu"
          value={fromDate}
          variant="outlined"
          name="note"
          margin="normal"
          onChange={e => setFromDate(e)}
          InputProps={{
            readOnly: true
          }}
          disabled={disabled || checkCount}

        />
      </TableCell>
      <TableCell>
        {/* <DatePicker
          inputVariant="outlined"
          format="DD/MM/YYYY"
          value={toDate}
          variant="outlined"
          label="Ngày kết thúc"
          margin="dense"
          disabled
        /> */}
        <CustomDatePicker
          label="Ngày kết thúc"
          value={toDate}
          variant="outlined"
          name="note"
          margin="normal"
          onChange={e => setToDate(e)}
          InputProps={{
            readOnly: true
          }}
          disabled={disabled || checkCount}
        />
      </TableCell>
      <TableCell>
        <TextField style={{minWidth: 200}} fullWidth variant="standard"  value={maintenance.dataProduct && maintenance.dataProduct.code || ''} name="code" InputProps={{
            readOnly: true
          }} />
      </TableCell>
      <TableCell>
        <TextField style={{minWidth: 200}} fullWidth variant="standard"  value={name} name="name" InputProps={{
            readOnly: true
          }} />
      </TableCell>
      <TableCell>
        <TextField variant="standard"  value={maintenance.amount || ''} name="amount" InputProps={{
            readOnly: true
          }} />
      </TableCell>
      <TableCell>
        <TextField
          // type="number"
          variant="standard"
          type="text"
          required value={convertNumber(maintenance.costPrice || maintenance.dataProduct && maintenance.dataProduct.pricePolicy && maintenance.dataProduct.pricePolicy.costPrice)}  name="costPrice" InputProps={{
            readOnly: true
          }} />
      </TableCell>
      <TableCell > {maintenance && maintenance.dataProduct && Number(maintenance.dataProduct.tax)>0 ? Number(maintenance.dataProduct.tax) : 0} </TableCell>
      <TableCell >
        <TextField
          variant="standard"
          required
          // type="number"
          type="text"
          value={convertNumber(calcPrice(maintenance))}
          InputProps={{
            readOnly: true
          }}
          
        />
      </TableCell>
    </TableRow>
  );
});
function MaintenanceInvoiceTab(props) {
  const { maintenances, toDate, fromDate, setFromDate, setToDate } = props;

  const renderTableFooter = useCallback(() => {
    if (maintenances) {
      let total = 0;
      for (let i = 0; i < maintenances.length; i++) {
        // const item = maintenances[i];
        // item.dataProduct = item.dataProduct ? item.dataProduct : item.stockId;
        // if (parseInt(item.costPrice || item.dataProduct && item.dataProduct.pricePolicy && item.dataProduct.pricePolicy.costPrice) > 0 && parseInt(item.amount) > 0) {
        //   total += item.dataProduct && parseInt((item.costPrice || item.dataProduct && item.dataProduct.pricePolicy && item.dataProduct.pricePolicy.costPrice || 0) * Number(item.amount)) + (item.dataProduct.tax / 100||0) * parseInt((item.costPrice || item.dataProduct.pricePolicy.costPrice) * item.amount);
        // }
        const item = maintenances[i];
        item.dataProduct = item.dataProduct ? item.dataProduct : item.stockId;
        const amount=Number(item.amount)>0?Number(item.amount): 0;
        const price=Number(item.price)>0? Number(item.price): Number(item.costPrice)>0? Number(item.costPrice) : item.dataProduct && item.dataProduct.pricePolicy && item.dataProduct.pricePolicy.costPrice && Number(item.dataProduct.pricePolicy.costPrice)>0?Number(item.dataProduct.pricePolicy.costPrice):0;
        const vat=item.dataProduct && Number(item.dataProduct.tax)>0?Number(item.dataProduct.tax):0;
        total += (price* amount)*(1 + vat/100); 
      }
      return (
        <TableRow>
          <TableCell colSpan={7} />
          <TableCell><Typography variant="subtitle1" gutterBottom component="div">Tổng tiền: {convertNumber(total)}</Typography></TableCell>
          {/* <TableCell /> */}
        </TableRow>
      );
    }
  }, [maintenances]);

  return (
    <Grid container spacing={8}>
      <Grid item xs={12}>
        <Paper>
          <Table stickyHeader size="small" padding="dense" style={{ overflowX: 'auto', display: 'block' }} >
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: 180, padding: '4px 20px 4px 20px' }}>Ngày bắt đầu</TableCell>
                <TableCell style={{ minWidth: 180, padding: '4px 20px 4px 20px' }}>Ngày kết thúc</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>Mã bảo trì</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>Tên bảo trì</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>Số lượng</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>Đơn giá</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>VAT</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>Thành tiền</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {maintenances && maintenances.map(maintenance => (
                <MaintenanceRow maintenance={maintenance} fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} />
              ))}
              {renderTableFooter()}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
}

MaintenanceInvoiceTab.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default memo(MaintenanceInvoiceTab);
