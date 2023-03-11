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

const GroundRow = memo(props => {
  const { ground, fromDate, toDate, setFromDate, setToDate } = props;
  ground.dataProduct = ground.dataProduct ? ground.dataProduct : ground.stockId;
  const price=Number(ground.price)>0?Number(ground.price): Number(ground.costPrice)>0? Number(ground.costPrice) : ground.dataProduct.pricePolicy && Number(ground.dataProduct.pricePolicy.costPrice)>0 ?
   Number(ground.dataProduct.pricePolicy.costPrice):0;
  const vat=Number(ground.vat)>0?Number(ground.vat): ground.dataProduct && Number(ground.dataProduct.tax)>0?Number(ground.dataProduct.tax): 0;
  ground.price=price;
  ground.vat=vat;
  const name=ground.name?ground.name: ground.dataProduct.name;
  const calcPrice = ({ amount = 0, price = 0, vat=0 }) => {
    return Number(amount*price*(1+vat/100));
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
        <TextField style={{minWidth: 200}} fullWidth variant="standard"  value={ground.dataProduct.code || ''} name="code"  InputProps={{
            readOnly: true
          }} />
      </TableCell>
      <TableCell >
        <TextField style={{minWidth: 200}} fullWidth variant="standard"  value={name} name="type" InputProps={{
            readOnly: true
          }} />
      </TableCell>
      <TableCell>
        <TextField variant="standard"  value={ground.amount || ''} name="count"  InputProps={{
            readOnly: true
          }}/>
      </TableCell>
      <TableCell>
        {/* <TextField type="number" required value={ground.costPrice}  name="price" /> */}
        <TextField  variant="standard" type="text" required value={Number(price).toLocaleString("es-AR", { maximumFractionDigits: 0 })}  name="price" InputProps={{
            readOnly: true
          }}/>
      </TableCell>
      <TableCell > {vat} </TableCell>
      <TableCell >
        <TextField
          variant="standard"
          required
          // type="number"
          type="text"
          value={calcPrice(ground).toLocaleString("es-AR", { maximumFractionDigits: 0 })}
          InputProps={{
            readOnly: true
          }}
        />
      </TableCell>
    </TableRow>
  );
});
function GroundInvoiceTab(props) {
  const { grounds, toDate, fromDate, setFromDate, setToDate } = props;

  const renderTableFooter = useCallback(() => {
    if (grounds) {
      let total = 0;
      for (let i = 0; i < grounds.length; i++) {
        const item = grounds[i];
        item.dataProduct = item.dataProduct ? item.dataProduct : item.stockId;
        const amount=Number(item.amount)>0?Number(item.amount): 0;
        const price=Number(item.price)>0? Number(item.price): Number(item.costPrice)>0? Number(item.costPrice) : item.dataProduct && item.dataProduct.pricePolicy && item.dataProduct.pricePolicy.costPrice && Number(item.dataProduct.pricePolicy.costPrice)>0?Number(item.dataProduct.pricePolicy.costPrice):0;
        const vat=item.dataProduct && Number(item.dataProduct.tax)>0?Number(item.dataProduct.tax):0;
        total += (price* amount)*(1 + vat/100); 
      }
      return (
        <TableRow>
          <TableCell colSpan={7} />
          <TableCell><Typography variant="subtitle1" gutterBottom component="div">Tổng tiền: {Number(total).toLocaleString("es-AR", { maximumFractionDigits: 0 })}</Typography></TableCell>
          {/* <TableCell /> */}
        </TableRow>
      );
    }
  }, [grounds]);

  return (
    <Grid container spacing={8}>
      <Grid item xs={12}>
        <Paper>
          <Table stickyHeader size="small" padding="dense" style={{ overflowX: 'auto', display: 'block' }} >
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: 180, padding: '4px 20px 4px 20px' }}>Ngày bắt đầu</TableCell>
                <TableCell style={{ minWidth: 180, padding: '4px 20px 4px 20px' }}>Ngày kết thúc</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>Mã mặt bằng</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>Tên mặt bằng</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>Diện tích</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>Đơn giá</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>VAT</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>Thành tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grounds && grounds.map(ground => (
                <GroundRow ground={ground} fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} />
              ))}
              {renderTableFooter()}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
}

GroundInvoiceTab.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default memo(GroundInvoiceTab);
