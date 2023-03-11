import React, { useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';
import { TextField as TextFieldLT, Grid, Paper, Autocomplete, SwipeableDrawer, TaskReport, AsyncAutocomplete } from '../../LifetekUi';
import Buttons from 'components/CustomButtons/Button';
import HistorySystem from 'containers/SystemConfigPage/HistorySystem';
// import ReportUserAction from 'components/Reportpage/ReportUserAction';

function ReportSystem(props) {
  const { customer = {}, onSelectCustomer } = props;
  const [tab, setTab] = useState();
  let tabIndex = 0;
  const [isDisplay, setIsDisplay] = useState();
  const [queryFilter, setQueryFilter] = useState({
    name: '',
    customer: '',
  });
  const handleOpenTab = value => {
    setTab(value);
  };

  useEffect(() => {
    try {
      let isDisplay = JSON.parse(localStorage.getItem('_isDisplay'));
      setIsDisplay(isDisplay);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const Tb = props => (
    <Buttons
      onClick={() => handleOpenTab(props.tabIndex)}
      {...props}
      color={props.tabIndex === tabIndex ? 'gradient' : 'simple'}
      left
      round
      style={{ fontSize: 11 }}
    >
      {props.children}
    </Buttons>
  );
  const Bt = props => (
    <Buttons onClick={() => handleOpenTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'} left round size="sm">
      {props.children}
    </Buttons>
  );

  //  filter:{
  //    customerId :" "
  //  }
  return (
    <Grid item xs={12}>
      <Grid item container spacing={24}>
        {/* <Grid md={12} item container /> */}
        <Grid item md={3}>
          {isDisplay ? (
            <TextField
              fullWidth
              label="Khách hàng"
              value={isDisplay.name ? isDisplay.name : ''}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          ) : null}
        </Grid>
        {isDisplay ? (
          <React.Fragment>
            {/* <Grid item md={6}>
              <TextField
                fullWidth
                label="Công ty"
                value=""
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid> */}
            {/* <Grid item md={6}>
              <TextField
                fullWidth
                label="Địa chỉ"
                value={isDisplay.address ? isDisplay.address : ''}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid> */}
            <Grid item md={3}>
              <TextField
                fullWidth
                label="Điện thoại"
                value={isDisplay.phoneNumber ? isDisplay.phoneNumber : ''}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </React.Fragment>
        ) : null}
      </Grid>
      {tabIndex === 0 ? (
        <div>
          <Grid container>
            <Grid item sm={12}>
              <Bt tab={1}>Nhật ký hệ thống</Bt>
            </Grid>
          </Grid>
          {tab === 1 ? <HistorySystem /> : null}
          {/* {tab === 2 ? <ReportUserAction /> : null} */}
        </div>
      ) : null}
    </Grid>
  );
}
export default ReportSystem;
