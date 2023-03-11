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
import { DatePicker } from 'material-ui-pickers';
import moment from 'moment';

const VehicleRow = memo((props) => {
  const startDate=props.vehicle.startDate;
  const endDate=props.vehicle.endDate;
  const vehicleName=props.vehicle.name;
  const carPlate=props.vehicle.carPlate;
  const amount=props.vehicle.amount;
  const unit=props.vehicle.unit;
  const price=props.vehicle.price;
  const vat=props.vehicle.vat;
  const totalMoney=props.vehicle.totalMoney;
  // console.clear()
  const {vehicles}=props;
  const {vehicleIndex, setArrVehicles,checkCount}=props
  

  const handleChangeAmount = (e) => {
    const newLists = vehicles.map((item, i) => {
      const value = e.target.value;
      const amount=Number(e.target.value) >= 1 ? e.target.value : 1;
      const price=Number(item.price)||0;
      const totalMoney=amount*price*(1+vat/100)
      if (vehicleIndex === i) {
        return ({
          ...item,
          amount: value,
          totalMoney: totalMoney
        })
      }
      return item
    })
    setArrVehicles(newLists)
  }
  const handleBlurAmount = (e) => {
    const newLists = vehicles.map((item, i) => {
      const amount=Number(e.target.value) >= 1 ? e.target.value : 1;
      const price=Number(item.price)||0;
      const vat=Number(item.vat)||0;
      const totalMoney=amount*price*(1+vat/100)
      if (vehicleIndex === i) {
        return ({
          ...item,
          amount: Number(e.target.value) >= 1 ? e.target.value : 1,
          totalMoney: totalMoney
        })
      }
      return item
    })
    setArrVehicles(newLists)
  }
  return (
    <TableRow>
      <TableCell>
        <DatePicker
          inputVariant="outlined"
          format="DD/MM/YYYY"
          // value={fromDate}
          value={startDate}
          variant="outlined"
          label="Ngày bắt đầu"
          margin="dense"
          InputProps={{
            readOnly: true
          }}
          fullWidth
        />
      </TableCell>
      <TableCell>
        <DatePicker
          inputVariant="outlined"
          format="DD/MM/YYYY"
          // value={toDate}
          value={endDate}
          variant="outlined"
          label="Ngày kết thúc"
          margin="dense"
          InputProps={{
            readOnly: true
          }}
          fullWidth
        />
      </TableCell>
      <TableCell>
        <TextField variant="standard"  value={carPlate} name="carPlate" InputProps={{
            readOnly: true
          }} 
          fullWidth
          />
      </TableCell>
      {/* <TableCell width={300}>
        <TextField disabled value={vehicle.unit || 0} name="unit" disabled />
      </TableCell> */}
      <TableCell>
        <TextField variant="standard"  value={vehicleName} name="name" InputProps={{
            readOnly: true
          }} fullWidth />
      </TableCell>
      <TableCell>
        <TextField variant="standard"  value={unit} name="unit" InputProps={{
            readOnly: true
          }}
          fullWidth
          />
      </TableCell>
      <TableCell>
        {unit !== "Ngày" ?
          <TextField
            variant="standard"
            name="amount"
            value={1}
            InputProps={{
              readOnly: true
            }}
            fullWidth
          />
          : <TextField
            variant="standard"
            name="amount"
            type="number"

            value={amount}
            onChange={e => handleChangeAmount(e)}
            onBlur={e => handleBlurAmount(e)}
            fullWidth
          />
        }

      </TableCell>
      {/* <TableCell width={300}>
        <TextField disabled value={vehicle.costPrice || 0} name="costPrice" disabled />
      </TableCell> */}
      <TableCell>
        <TextField variant="standard"  value={Number(price).toLocaleString("es-AR", { maximumFractionDigits: 0 })} name="costPrice" InputProps={{
            readOnly: true
          }}
          fullWidth />
      </TableCell>
      <TableCell>
        <TextField variant="standard"  value={vat} name="vat" InputProps={{
            readOnly: true
          }} 
          fullWidth
          />
      </TableCell>
      <TableCell >
        <TextField
          variant="standard"
          required
          // type="number"
          type="text"
          value={Number(totalMoney).toLocaleString("es-AR", { maximumFractionDigits: 0 })}
          InputProps={{
            readOnly: true
          }}
          fullWidth
        />
      </TableCell>
    </TableRow>
  );
});
function VehicleInvoiceTab(props) {
  const { vehicles, toDate, fromDate, onSave, setArrVehicles } = props;
  
  const renderTableFooter = useCallback(() => {
    if (vehicles) {
      let total = 0;
      let totalAmount = 0;
      Array.isArray(vehicles) && vehicles.map(item => {
        total += Number(item.totalMoney)
        totalAmount += Number(item.amount) || 1;
      })
      
      return (
        <TableRow>
          <TableCell colSpan={5} />
          <TableCell><Typography variant="subtitle1" gutterBottom component="div">Tổng số: {totalAmount}</Typography></TableCell>
          <TableCell colSpan={2} />
          <TableCell>
            <Typography variant="subtitle1" gutterBottom component="div">Tổng tiền: {Number(total).toLocaleString("es-AR", { maximumFractionDigits: 0 })}</Typography>
          </TableCell>
          {/* <TableCell /> */}
        </TableRow>
      );
    }
  }, [vehicles]);

  return (
    <Grid container spacing={8}>
      <Grid item xs={12}>
        <Paper>
          <Table stickyHeader size="small" padding="dense" style={{ overflowX: 'auto', display: 'block' }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: 180, padding: '4px 20px 4px 20px' }}>Ngày bắt đầu</TableCell>
                <TableCell style={{ minWidth: 180, padding: '4px 20px 4px 20px' }}>Ngày kết thúc</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>Biển số xe</TableCell>
                {/* <TableCell style={{minWidth: 120, padding: '4px 20px 4px 20px'}}>Loại phí</TableCell> */}
                <TableCell style={{ minWidth: 350, padding: '4px 20px 4px 20px' }}>Tên sản phẩm</TableCell>
                <TableCell style={{ minWidth: 100, padding: '4px 20px 4px 20px' }}>Đơn vị</TableCell>
                <TableCell style={{ minWidth: 100, padding: '4px 20px 4px 20px' }}>Số lượng</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>Đơn giá</TableCell>
                <TableCell style={{ minWidth: 100, padding: '4px 20px 4px 20px' }}>VAT</TableCell>
                <TableCell style={{ minWidth: 140, padding: '4px 20px 4px 20px' }}>Thành tiền</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(vehicles) && vehicles.map((vehicle, index) => (
                <VehicleRow vehicle={vehicle} fromDate={fromDate} toDate={toDate}  vehicles={vehicles} vehicleIndex={index} setArrVehicles={setArrVehicles}/>
                // <VehicleRow vehicle={vehicle} fromDate={fromDateDefault} toDate={toDateDefault} />
              ))}
              {renderTableFooter()}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
}

VehicleInvoiceTab.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default memo(VehicleInvoiceTab);
