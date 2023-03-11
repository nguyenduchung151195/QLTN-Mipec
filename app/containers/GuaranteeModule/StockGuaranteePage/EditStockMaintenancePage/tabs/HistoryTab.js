/**
 *
 * HistoryTab
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';


import { Button, Grid, MenuItem, Paper, Step, StepLabel, Stepper, Tab, Tabs, Typography, withStyles } from '@material-ui/core';
import { DatePicker } from 'material-ui-pickers';


import { Grid as GridLT } from 'components/LifetekUi';
import { API_STOCK } from 'config/urlConfig';
import { AsyncAutocomplete } from 'components/LifetekUi';

import { TextField } from 'components/LifetekUi';
import styles from '../styles';
import SimpleListPage from '../../../../../components/List/SimpleListPage';
import { API_PERSONNEL } from '../../../../../config/urlConfig';

const columns = [
  {
    name: 'date',
    title: 'Thời gian',
    width: 300,
  },
  {
    name: 'employee',
    title: 'Nhân viên phụ trách',
    width: 300,
  },
  {
    name: 'information',
    title: 'Thông tin chi tiết',
    width: 400,
  },
  {
    name: 'event',
    title: 'Loại sự kiện',
    width: 300,
  },
]

function HistoryTab(props) {


  const { stockGuaranteePage, classes } = props;

  const [status, setStatus] = useState(0);

  const [value, setValue] = useState(0);

  const [filter] = useState({ level: 0 });

  const [employee, setEmployee] = useState(null);

  const [serial, setSerial] = useState('');

  const [fromDate, setFromDate] = useState(null);

  const [toDate, setToDate] = useState(null);

  const [note, setNote] = useState('');

  const [stockMaintenances, setStockMaintenances] = useState([])

  useEffect(() => {

  }, [])

  const handleChange = (event, value) => {
    setValue(value);
  };

  const handleChangeIndex = index => {
    setValue(value);
  };

  const handleDete = () => {

  }

  const handleSubmit = () => {

  }

  const handleGoback = () => {
    props.history.goBack();
  }

  return (
    <Grid container spacing={8}>
      <Grid item xs={4} >
        <DatePicker
          inputVariant="outlined"
          format="DD/MM/YYYY"
          value={fromDate}
          fullWidth
          variant="outlined"
          label="Từ ngày"
          margin="dense"
          onChange={date => setFromDate(date)}
        />
      </Grid>
      <Grid item xs={4} >
        <DatePicker
          inputVariant="outlined"
          format="DD/MM/YYYY"
          value={toDate}
          fullWidth
          variant="outlined"
          label="Đến ngày"
          margin="dense"
          onChange={date => setToDate(date)}
        />
      </Grid>
      <Grid item xs={4}>
        <AsyncAutocomplete
          name="Chọn nhân viên..."
          label="Nhân viên"
          onChange={value => setEmployee(value)}
          url={API_PERSONNEL}
          value={employee}
        />
      </Grid>
      <Grid item xs={12}>
        <SimpleListPage columns={columns} rows={stockMaintenances} onDeleteItem={handleDete} />
      </Grid>
    </Grid>
  );
}

HistoryTab.propTypes = {
  dispatch: PropTypes.func.isRequired,
};



export default HistoryTab;
