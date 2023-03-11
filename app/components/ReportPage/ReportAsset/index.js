import React, { useEffect, useState } from 'react';
import { TextField, Tab, Tabs, withStyles } from '@material-ui/core';
import {
  TextField as TextFieldLT,
  Grid,
  Paper,
  Autocomplete,
  SwipeableDrawer,
  TaskReport,
  AsyncAutocomplete,
} from '../../LifetekUi';
import Buttons from 'components/CustomButtons/Button';
import ReportDiaryAsset from '../ReportDiaryAsset';
import ReportEnterCoupon from '../ReportEnterCoupon';
import ReportMeter from '../ReportMeter';
import ReportEnterBill from '../ReportEnterBill';
import ReportImportReport from '../ReportImportReport';
import ReportExportReport from '../ReportExportReport';
import ReportInventoryStock from '../ReportInventoryStock';
import ReportInventoryAsset from '../ReportInventoryAsset';
import makeSelectDashboardPage from '../../../containers/Dashboard/selectors';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
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
function ReportAsset(props) {
  const { customer = {}, onSelectCustomer, dashboardPage } = props;
  const [tab, setTab] = useState();
  let tabIndex = 0;
  const [isDisplay, setIsDisplay] = useState();
  const [queryFilter, setQueryFilter] = useState({
    name: '',
    customer: '',
  });
  const [roleViewMeter, setRoleViewMeter] = useState();

  const handleOpenTab = value => {
    setTab(value);
  };
  const [openZero, setOpenZero] = useState(false);
  const [openOne, setOpenOne] = useState(false);
  const [openTwo, setOpenTwo] = useState(false);
  const [openThree, setOpenThree] = useState(false);
  const [openFour, setOpenFour] = useState(false);
  const [openFive, setOpenFive] = useState(false);
  const [openSix, setOpenSix] = useState(false);
  const [openSeven, setOpenSeven] = useState(false);
  useEffect(() => {
    try {
      const { role } = dashboardPage;
      const { roles } = role;
      const roleMeter = roles.find(it => {
        return it.codeModleFunction === 'meterHistories';
      });
      const roleMeterMethodView =
        roleMeter && roleMeter.methods && roleMeter.methods.find(item => item.name === 'GET');
      setRoleViewMeter(roleMeterMethodView && roleMeterMethodView.allow);

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
    <Buttons
      onClick={() => handleOpenTab(props.tab)}
      {...props}
      color={props.tab === tab ? 'gradient' : 'simple'}
      left
      round
      size="sm"
    >
      {props.children}
    </Buttons>
  );

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
      case 5: {
        setOpenFive(true);
        break;
      }
      case 6: {
        setOpenSix(true);
        break;
      }
      case 7: {
        setOpenSeven(true);
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
      case 5: {
        setOpenFive(false);
        break;
      }
      case 6: {
        setOpenSix(false);
        break;
      }
      case 7: {
        setOpenSeven(false);
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
        <div>
          {/* <Grid container>
            <Grid item sm={12}>
              <Bt tab={1}>Nhật ký tài sản</Bt>
              <Bt tab={2}>Nhập xuất tồn tài sản</Bt>
              <Bt tab={3}>Theo dõi nhập xuất tài sản</Bt>
              <Bt tab={4}>Bảng kê phiếu nhập</Bt>
              <Bt tab={5}>Bảng kê phiếu xuất</Bt>
              <Bt tab={6}>Tổng hợp nhập hàng </Bt>
              <Bt tab={7}>Tổng hợp hàng xuất</Bt>
              {roleViewMeter ? <Bt tab={8}>NK Công tơ</Bt> : ''}
            </Grid>
          </Grid>
          {tab === 1 ? <ReportDiaryAsset /> : null}
          {tab === 2 ? <ListContractExpires customerInfo={isDisplay}/> : null}
          {tab === 3 ? <NewContractReport customerInfo={isDisplay} /> : null}
          {tab === 4 ? <ReportEnterCoupon /> : null}
          {tab === 5 ? <ReportEnterBill /> : null}
          {tab === 6 ? <ReportImportReport /> : null}
          {tab === 7 ? <ReportExportReport /> : null}
          {tab === 8 ? <ReportMeter /> : null} */}
          <VerticalTabs value={tab} wrapped={true}>
            <VerticalTab
              style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
              label="Nhật ký tài sản"
              onClick={() => handleOpen(0)}
            />
            {/* <VerticalTab
              style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
              label="Nhập xuất tồn tài sản"
              onClick={() => handleOpen(1)}
            />
            <VerticalTab
              style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
              label="Theo dõi nhập xuất tài sản"
              onClick={() => handleOpen(2)}
            /> */}
            <VerticalTab
              style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
              label="Bảng kê phiếu nhập"
              onClick={() => handleOpen(1)}
            />
            <VerticalTab
              style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
              label="Bảng kê phiếu xuất"
              onClick={() => handleOpen(2)}
            />
            <VerticalTab
              style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
              label="Tổng hợp nhập hàng "
              onClick={() => handleOpen(3)}
            />
            <VerticalTab
              style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
              label="Tổng hợp hàng xuất"
              onClick={() => handleOpen(4)}
            />
            {roleViewMeter ? (
              <VerticalTab
                style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
                label="NK Công tơ"
                onClick={() => handleOpen(5)}
              />
            ) : (
              ''
            )}
            <VerticalTab
              style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
              label="Tổng hợp nhập, xuất, tồn"
              onClick={() => handleOpen(6)}
            />
            <VerticalTab
              style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
              label="Tồn kho thiết bị"
              onClick={() => handleOpen(7)}
            />
          </VerticalTabs>

          <SwipeableDrawer anchor="right" open={openZero} width={window.innerWidth - 260}>
            {!isDisplay ? <ReportDiaryAsset tab={tab} onClose={() => handleClose(0)} /> : null}
          </SwipeableDrawer>
          {/* <SwipeableDrawer anchor="right" onClose={() => handleClose(1)} open={openOne} width={window.innerWidth - 260}>
            <ListContractExpires customerInfo={isDisplay} onClose={() => handleClose(1)} />
          </SwipeableDrawer>
          <SwipeableDrawer anchor="right" onClose={() => handleClose(2)} open={openTwo} width={window.innerWidth - 260}>
            <NewContractReport customerInfo={isDisplay} onClose={() => handleClose(2)} />
          </SwipeableDrawer> */}
          <SwipeableDrawer anchor="right" open={openOne} width={window.innerWidth - 260}>
            <ReportEnterCoupon onClose={() => handleClose(1)} />
          </SwipeableDrawer>
          <SwipeableDrawer anchor="right" open={openTwo} width={window.innerWidth - 260}>
            <ReportEnterBill onClose={() => handleClose(2)} />
          </SwipeableDrawer>
          <SwipeableDrawer anchor="right" open={openThree} width={window.innerWidth - 260}>
            <ReportImportReport onClose={() => handleClose(3)} />
          </SwipeableDrawer>
          <SwipeableDrawer anchor="right" open={openFour} width={window.innerWidth - 260}>
            <ReportExportReport onClose={() => handleClose(4)} />
          </SwipeableDrawer>
          <SwipeableDrawer anchor="right" open={openFive} width={window.innerWidth - 260}>
            <ReportMeter onClose={() => handleClose(5)} />
          </SwipeableDrawer>
          <SwipeableDrawer anchor="right" open={openSix} width={window.innerWidth - 260}>
            <ReportInventoryStock onClose={() => handleClose(6)} />
          </SwipeableDrawer>
          <SwipeableDrawer anchor="right" open={openSeven} width={window.innerWidth - 260}>
            <ReportInventoryAsset onClose={() => handleClose(7)} />
          </SwipeableDrawer>
        </div>
      ) : null}
    </Grid>
  );
}

const mapStateToProps = createStructuredSelector({
  dashboardPage: makeSelectDashboardPage(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(ReportAsset);

// export default ReportAsset;
