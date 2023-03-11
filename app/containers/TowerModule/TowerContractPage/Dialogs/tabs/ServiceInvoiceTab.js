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
import CustomDatePicker from 'components/CustomDatePicker';
const convertNumber = (num) => {
  if (isNaN(Number(num))) return;
  if (!isNaN(Number(num))) return Number(num).toLocaleString("es-AR", { maximumFractionDigits: 0 })
}
const ServiceRow = memo(props => {
  const { service, fromDate, toDate, setFromDate, setToDate, disabled, checkCount } = props;
  service.dataProduct = service.dataProduct ? service.dataProduct : service.stockId;
  const calcPrice = ({ amount, costPrice, dataProduct = {} }) => {
    const vat = dataProduct && Number(dataProduct.tax) > 0 ? dataProduct.tax : Number(service.vat) > 0 ? service : 0
    return (amount * (costPrice || dataProduct && dataProduct.pricePolicy && dataProduct.pricePolicy.costPrice)) * (1 + vat / 100);
  };
  return (
    <TableRow>
      <TableCell style={{ minWidth: 210, padding: '4px 20px 4px 20px' }}>
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
          top={20}
          right={24}
          onChange={e => setFromDate(e)}
          InputProps={{
            readOnly: true
          }}
          disabled={disabled || checkCount}

        />
      </TableCell>
      <TableCell style={{ minWidth: 210, padding: '4px 20px 4px 20px' }}>
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
          top={20}
          right={24}
          onChange={e => setToDate(e)}
          InputProps={{
            readOnly: true
          }}
          disabled={disabled || checkCount}
        // style={{ width: '100%', zIndex: 0 }}
        />
      </TableCell>
      <TableCell>
        <TextField style={{ minWidth: 200 }} fullWidth variant="standard" value={(service.dataProduct && service.dataProduct.code) || ''} name="code" InputProps={{
          readOnly: true
        }} />
      </TableCell>
      <TableCell>
        <TextField style={{ minWidth: 200 }} fullWidth variant="standard" value={service.name || ''} name="name" InputProps={{
          readOnly: true
        }} />
      </TableCell>
      <TableCell>
        <TextField variant="standard" value={service.amount || ''} name="amount" InputProps={{
          readOnly: true
        }} />
      </TableCell>
      <TableCell>
        <TextField variant="standard" value={service.unit || service.dataProduct.unit.name} name="unit" InputProps={{
          readOnly: true
        }} />
      </TableCell>
      <TableCell>
        <TextField variant="standard" value={Number(service.price) > 0 ? convertNumber(service.price) : convertNumber(service.dataProduct && service.dataProduct.pricePolicy && service.dataProduct.pricePolicy.costPrice)} name="costPrice" InputProps={{
          readOnly: true
        }} />
      </TableCell>
      <TableCell>
        {Number(service.vat) > 0 ? Number(service.vat) : service && service.dataProduct && service.dataProduct.tax !== 0 ? service.dataProduct.tax : 0}
      </TableCell>
      <TableCell >
        <TextField
          variant="standard"
          required
          // type="number"
          type="text"
          value={Number(service.totalMoney) > 0 ? convertNumber(service.totalMoney) : convertNumber(calcPrice(service))}
          InputProps={{
            readOnly: true
          }}
        />
      </TableCell>
    </TableRow>
  );
});

function ServiceInvoiceTab(props) {
  const { services, fromDate, toDate, setFromDate, setToDate, onSave, disabled } = props;
  const renderTableFooter = useCallback(
    () => {
      let total = 0;
      for (let i = 0; i < services.length; i++) {
        // const item = services[i];
        // item.dataProduct = item.dataProduct ? item.dataProduct : item.stockId;
        // if (parseInt(item.costPrice || item.dataProduct && item.dataProduct.pricePolicy && item.dataProduct.pricePolicy.costPrice) > 0 && parseInt(item.amount) > 0) {
        //   total += item.dataProduct && parseInt((item.costPrice || item.dataProduct.pricePolicy.costPrice) * item.amount) + item.dataProduct.tax / 100 * parseInt((item.costPrice || item.dataProduct.pricePolicy.costPrice) * item.amount);
        // }
        const item = services[i];
        item.dataProduct = item.dataProduct ? item.dataProduct : item.stockId;
        const amount = Number(item.amount) > 0 ? Number(item.amount) : 0;
        const price = Number(item.price) > 0 ? Number(item.price) : Number(item.costPrice) > 0 ? Number(item.costPrice) : item.dataProduct && item.dataProduct.pricePolicy && item.dataProduct.pricePolicy.costPrice && Number(item.dataProduct.pricePolicy.costPrice) > 0 ? Number(item.dataProduct.pricePolicy.costPrice) : 0;
        const vat = item.dataProduct && Number(item.dataProduct.tax) > 0 ? Number(item.dataProduct.tax) : 0;
        total += (price * amount) * (1 + vat / 100);
      }

      return (
        <TableRow>
          <TableCell colSpan={8} />
          <TableCell> <Typography variant="subtitle1" gutterBottom component="div">
            Tổng tiền: {convertNumber(total)}
          </Typography>
          </TableCell>
          {/* <TableCell /> */}
        </TableRow>
      );
    },
    [services],
  );

  return (
    <Grid container spacing={8}>
      <Grid item xs={12}>
        <Paper>
          <Table stickyHeader size="small" padding="dense" style={{ overflowX: 'auto', display: 'block' }} >
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: 180, padding: '4px 20px 4px 20px' }}>Ngày bắt đầu</TableCell>
                <TableCell style={{ minWidth: 180, padding: '4px 20px 4px 20px' }}>Ngày kết thúc</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>Mã dịch vụ</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>Tên dịch vụ</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>Số lượng</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>Đơn vị</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>Đơn giá</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>VAT</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>Thành tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services && services.map(service => (
                <ServiceRow service={service} fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} disabled={disabled} />
              ))}
              {renderTableFooter()}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
}

ServiceInvoiceTab.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default memo(ServiceInvoiceTab);
