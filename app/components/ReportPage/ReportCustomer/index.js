import React, { useEffect, useState } from 'react';
import { TextField, Tab, Tabs, withStyles } from '@material-ui/core';
import { TextField as TextFieldLT, Grid, Paper, Autocomplete, SwipeableDrawer, TaskReport, AsyncAutocomplete } from '../../LifetekUi';
import Buttons from 'components/CustomButtons/Button';
import ReportListCustomer from 'containers/ReportReportCustomer/ManagementCustomerInfor/ListCustomer';
import ListContractExpires from 'containers/ReportReportCustomer/ManagementCustomerInfor/ListContractExpires';
import NewContractReport from 'containers/ReportReportCustomer/ManagementCustomerInfor/NewContractReport';
import ListContract from 'containers/ReportReportCustomer/ManagementCustomerInfor/ListContract';
import ExpenditureCustomers from 'containers/ReportReportCustomer/ManagementCustomerInfor/ExpenditureCustomers';

const VerticalTabs = withStyles(() => ({
  flexContainer: {
    flexDirection: 'column',
  },
  indicator: {
    display: 'none',
  },
}))(Tabs);

const VerticalTab = withStyles(() => ({
  selected: {
    color: 'white',
    backgroundColor: `#2196F3`,
    borderRadius: '5px',
    boxShadow: '3px 5.5px 7px rgba(0, 0, 0, 0.15)',
  },
  root: {},
}))(Tab);
function ReportCustomerManager(props) {
  const { customer = {}, onSelectCustomer } = props;
  // const [tab, setTab] = useState();
  let tabIndex = 0;
  const [isDisplay, setIsDisplay] = useState();
  const [queryFilter, setQueryFilter] = useState({
    name: '',
    customer: '',
  });
  const handleOpenTab = value => {
    setTab(value);
  };
  const [tab, setTab] = useState();
  const [openZero, setOpenZero] = useState(false);
  const [openOne, setOpenOne] = useState(false);
  const [openTwo, setOpenTwo] = useState(false);
  const [openThree, setOpenThree] = useState(false);
  const [openFour, setOpenFour] = useState(false);

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

  const handleOpen = value => {
    setTab(value);
    switch (value) {
      case 0: {
        setOpenZero(true);
        break;
      }
      case 1: {
        setOpenOne(true);
        break;
      }
      case 2: {
        setOpenTwo(true);
        break;
      }
      case 3: {
        setOpenThree(true);
        break;
      }
      case 4: {
        setOpenFour(true);
        break;
      }
      default: {
        break;
      }
    }
  };
  const handleClose = value => {
    console.log('value', value);
    switch (value) {
      case 0: {
        setOpenZero(false);
        break;
      }
      case 1: {
        setOpenOne(false);
        break;
      }
      case 2: {
        setOpenTwo(false);
        break;
      }
      case 3: {
        setOpenThree(false);
        break;
      }
      case 4: {
        setOpenFour(false);
        break;
      }
      default: {
      }
    }
  };
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
        // <div>
        //   <Grid container>
        //     <Grid item sm={12}>
        //       {isDisplay? null: <Bt tab={0}>Danh sách khách hàng</Bt>}
        //       <Bt tab={1}>Danh sách hợp đồng</Bt>
        //       <Bt tab={2}>Báo cáo hợp đồng hết hạn</Bt>
        //       <Bt tab={3}>Báo cáo hợp đồng mới kí</Bt>
        //       <Bt tab={4}>Thu chi</Bt>
        //     </Grid>
        //   </Grid>
        //   {tab === 0  && !isDisplay ? <ReportListCustomer /> : null}
        //   {tab === 1 ? <ListContract customerInfo={isDisplay} /> : null}
        //   {tab === 2 ? <ListContractExpires customerInfo={isDisplay}/> : null}
        //   {tab === 3 ? <NewContractReport customerInfo={isDisplay} /> : null}
        //   {tab === 4 ? <ExpenditureCustomers customerInfo={isDisplay}/> : null}
        // </div>
        <>
          <VerticalTabs value={tab} wrapped={true}>
            <VerticalTab
              style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
              label="Danh sách khách hàng"
              onClick={() => handleOpen(0)}
            />
            <VerticalTab style={{ textAlign: 'left', textTransform: 'none', width: 400 }} label="Danh sách hợp đồng" onClick={() => handleOpen(1)} />
            <VerticalTab
              style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
              label="Báo cáo hợp đồng hết hạn"
              onClick={() => handleOpen(2)}
            />
            <VerticalTab
              style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
              label="Báo cáo hợp đồng mới kí"
              onClick={() => handleOpen(3)}
            />
            <VerticalTab style={{ textAlign: 'left', textTransform: 'none', width: 400 }} label="Thu chi" onClick={() => handleOpen(4)} />
          </VerticalTabs>

          <SwipeableDrawer anchor="right" open={openZero} width={window.innerWidth - 260}>
            {!isDisplay ? <ReportListCustomer tab={tab}   onClose={() => handleClose(0)}/> : null}
          </SwipeableDrawer>
          <SwipeableDrawer anchor="right" onClose={() => handleClose(1)} open={openOne} width={window.innerWidth - 260}>
            <ListContract customerInfo={isDisplay} onClose={() => handleClose(1)} />
          </SwipeableDrawer>
          <SwipeableDrawer anchor="right" onClose={() => handleClose(2)} open={openTwo} width={window.innerWidth - 260}>
            <ListContractExpires customerInfo={isDisplay} onClose={() => handleClose(2)} />
          </SwipeableDrawer>
          <SwipeableDrawer anchor="right" onClose={() => handleClose(3)} open={openThree} width={window.innerWidth - 260}>
            <NewContractReport customerInfo={isDisplay} onClose={() => handleClose(3)} />
          </SwipeableDrawer>
          <SwipeableDrawer anchor="right" open={openFour} width={window.innerWidth - 260}>
            <ExpenditureCustomers customerInfo={isDisplay} onClose={() => handleClose(4)} />
          </SwipeableDrawer>
        </>
      ) : null}
    </Grid>
  );
}
export default ReportCustomerManager;
