/* eslint-disable radix */
/**
 *
 * TowerContractPage
 *
 */

 import React, { useState, useEffect, useCallback, memo } from 'react';
 import PropTypes from 'prop-types';

 import { Grid, Table, TableBody, TableCell, TableRow, TableHead, Fab, Paper } from '@material-ui/core';
 import { TextField } from 'components/LifetekUi';
 import { Add, Check, Edit, Remove } from '@material-ui/icons';
 import { AsyncAutocomplete } from '../../../../../components/LifetekUi';
 import { API_STOCK } from '../../../../../config/urlConfig';
 import { DatePicker } from 'material-ui-pickers';

 const GroundRow = memo(props => {
   const {  fromDate, toDate } = props;
   const calcPrice = () => {
    //  return ground.amount * ground.costPrice;
     return 1;
   };


   return (
     <TableRow>
       <TableCell>
         <DatePicker
           inputVariant="outlined"
           format="DD/MM/YYYY"
           value={fromDate}
           variant="outlined"
           label="Ngày kết thúc"
           margin="dense"
           disabled
         />
       </TableCell>
       <TableCell>
         <DatePicker
           inputVariant="outlined"
           format="DD/MM/YYYY"
           value={toDate}
           variant="outlined"
           label="Ngày kết thúc"
           margin="dense"
           disabled
         />
       </TableCell>
       <TableCell>
         <TextField disabled value={ground.dataProduct.code || ''} name="code" disabled />
       </TableCell>
       <TableCell width={300}>
         <TextField disabled value={ground.name || ''} name="type" disabled />
       </TableCell>
       <TableCell width={300}>
         <TextField disabled value={ground.amount || ''} name="count" disabled />
       </TableCell>
       <TableCell>
         <TextField type="number" required value={ground.costPrice && Number(ground.costPrice).toLocaleString("es-AR", { maximumFractionDigits: 0 })} disabled name="price" />
       </TableCell>
       <TableCell />
       <TableCell >
         <TextField
           variant="standard"
           required
          //  type="number"
          type="text"
           value={Number(calcPrice()).toLocaleString("es-AR", { maximumFractionDigits: 0 })}
           disabled
         />
       </TableCell>
     </TableRow>
   );
 });

 function Electrician3levelInvoiceTab(props) {
   const {    electrician3Level, invoice, grounds, toDate, fromDate } = props;
   const renderTableFooter = useCallback(() => {
     if (grounds) {
       let total = 0;
       for (let i = 0; i < grounds.length; i++) {
         const item = grounds[i];
         if (item.costPrice && parseInt(item.costPrice) > 0 && parseInt(item.amount) > 0) {
           total += parseInt(item.costPrice * item.amount);
         }
       }
       return (
         <TableRow>
           <TableCell colSpan={4} />
           <TableCell>{Number(total).toLocaleString("es-AR", { maximumFractionDigits: 0 })}</TableCell>
           <TableCell />
         </TableRow>
       );
     }
   }, [grounds]);

   return (
     <Grid container spacing={8}>
       <Grid item xs={12}>
         <Paper>
           <Table stickyHeader size="small" padding="dense" >
             <TableHead>
               <TableRow>
                 <TableCell align="center">Ngày bắt đầu</TableCell>
                 <TableCell align="center">Ngày kết thúc</TableCell>
                 <TableCell align="center">Mã mặt bằng</TableCell>
                 <TableCell align="center">Tên mặt bằng</TableCell>
                 <TableCell align="center">Diện tích</TableCell>
                 <TableCell align="center">Đơn giá</TableCell>
                 <TableCell align="center">VAT</TableCell>
                 <TableCell align="center">Thành tiền</TableCell>
                 <TableCell />
               </TableRow>
             </TableHead>
             <TableBody>
               {grounds && grounds.map(ground => (
                 <GroundRow ground={ground} fromDate={fromDate} toDate={toDate} />
               ))}
               {renderTableFooter()}
             </TableBody>
           </Table>
         </Paper>
       </Grid>
     </Grid>
   );
 }

 Electrician3levelInvoiceTab.propTypes = {
   dispatch: PropTypes.func.isRequired,
 };

 export default memo(Electrician3levelInvoiceTab);
