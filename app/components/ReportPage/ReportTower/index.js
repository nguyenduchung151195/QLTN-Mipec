import React, { useEffect, useState } from 'react';
import { TextField, Tab, Tabs, withStyles } from '@material-ui/core';
import { TextField as TextFieldLT, Grid, Paper, Autocomplete, SwipeableDrawer, TaskReport, AsyncAutocomplete } from '../../LifetekUi';
import Buttons from 'components/CustomButtons/Button';

import ReportContractNeedExtended from '../ReportContractNeedExtended';
import ReportContractCancel from '../ReportContractCancel';
import ReportDebtGeneral from '../ReportDebtGeneral';
import ReportDebtOver from '../ReportDebtOver';
import ReportShowsMessage from '../ReportShowsMessage';
import ReportRevenueSummary from '../ReportRevenueSummary';
import ReportListCustomer from 'containers/ReportReportCustomer/ManagementCustomerInfor/ListCustomer';
import ListContractExpires from 'containers/ReportReportCustomer/ManagementCustomerInfor/ListContractExpires';
import NewContractReport from 'containers/ReportReportCustomer/ManagementCustomerInfor/NewContractReport';
import ListContract from 'containers/ReportReportCustomer/ManagementCustomerInfor/ListContract';
import ExpenditureCustomers from 'containers/ReportReportCustomer/ManagementCustomerInfor/ExpenditureCustomers';

import makeSelectDashboardPage,{ makeSelectProfile } from '../../../containers/Dashboard/selectors';
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
  root: {
    minWidth: '350px',
    width:'100%',
  },
}))(Tab);
function ReportTower(props) {
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
  const [openEight, setOpenEight] = useState(false);
  const [openNine, setOpenNine] = useState(false);
  const [openTen, setOpenTen] = useState(false);
  useEffect(() => {
    try {
      const { role } = dashboardPage;
      const { roles } = role;
      const roleMeter = roles.find(it => {
        return it.codeModleFunction === 'meterHistories';
      });
      const roleMeterMethodView = roleMeter && roleMeter.methods && roleMeter.methods.find(item => item.name === 'GET');
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
    <Buttons onClick={() => handleOpenTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'} left round size="sm">
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
      case 8: {
        setOpenEight(true);
        break;
      }
      case 9: {
        setOpenNine(true);
        break;
      }
      case 10: {
        setOpenTen(true);
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
      case 8: {
        setOpenEight(false);
        break;
      }
      case 9: {
        setOpenNine(false);
        break;
      }
      case 10:{
        setOpenTen(false);
        break;
      }
      default: {
      }
    }
  };
  return (
    <Grid item xs={12}>
      <div>
        <VerticalTabs value={tab} wrapped={true}>
          <VerticalTab
            style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
            label="Báo cáo danh sách các hợp đồng cần gia hạn"
            onClick={() => handleOpen(0)}
          />
          <VerticalTab
            style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
            label="Báo cáo danh sách hợp đồng hủy"
            onClick={() => handleOpen(1)}
          />
          <VerticalTab
            style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
            label="Báo cáo công nợ quá hạn"
            onClick={() => handleOpen(2)}
          />
          <VerticalTab
            style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
            label="Báo cáo tổng hợp công nợ"
            onClick={() => handleOpen(3)}
          />
          <VerticalTab style={{ textAlign: 'left', textTransform: 'none', width: 400 }} label="Danh sách khách hàng" onClick={() => handleOpen(4)} />
          <VerticalTab style={{ textAlign: 'left', textTransform: 'none', width: 400 }} label="Danh sách hợp đồng" onClick={() => handleOpen(5)} />
          <VerticalTab
            style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
            label="Báo cáo hợp đồng hết hạn"
            onClick={() => handleOpen(6)}
          />
          <VerticalTab
            style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
            label="Báo cáo hợp đồng mới kí"
            onClick={() => handleOpen(7)}
          />
          <VerticalTab style={{ textAlign: 'left', textTransform: 'none', width: 400 }} label="Thu chi" onClick={() => handleOpen(8)} />
          <VerticalTab style={{ textAlign: 'left', textTransform: 'none', width: 400 }} label="Báo cáo tổng hợp doanh thu" onClick={() => handleOpen(9)} />
          <VerticalTab style={{ textAlign: 'left', textTransform: 'none', width: 400 }} label="Báo cáo số lần hiển thị thông báo phí" onClick={() => handleOpen(10)} />
        </VerticalTabs>

        <SwipeableDrawer anchor="right" open={openZero} width={window.innerWidth - 260}>
          <ReportContractNeedExtended tab={tab} onClose={() => handleClose(0)} />
        </SwipeableDrawer>
        <SwipeableDrawer anchor="right" open={openOne} width={window.innerWidth - 260}>
          <ReportContractCancel tab={tab} onClose={() => handleClose(1)} />
        </SwipeableDrawer>
        <SwipeableDrawer anchor="right" open={openTwo} width={window.innerWidth - 260}>
          <ReportDebtOver tab={tab} onClose={() => handleClose(2)} />
        </SwipeableDrawer>
        <SwipeableDrawer anchor="right" open={openThree} width={window.innerWidth - 260}>
          <ReportDebtGeneral tab={tab} onClose={() => handleClose(3)} />
        </SwipeableDrawer>
        <SwipeableDrawer anchor="right" open={openFour} width={window.innerWidth - 260}>
          {!isDisplay ? <ReportListCustomer tab={tab} onClose={() => handleClose(4)} /> : null}
        </SwipeableDrawer>
        <SwipeableDrawer anchor="right" open={openFive} width={window.innerWidth - 260}>
          <ListContract customerInfo={isDisplay} onClose={() => handleClose(5)} />
        </SwipeableDrawer>
        <SwipeableDrawer anchor="right" open={openSix} width={window.innerWidth - 260}>
          <ListContractExpires customerInfo={isDisplay} onClose={() => handleClose(6)} />
        </SwipeableDrawer>
        <SwipeableDrawer anchor="right" open={openSeven} width={window.innerWidth - 260}>
          <NewContractReport customerInfo={isDisplay} onClose={() => handleClose(7)} />
        </SwipeableDrawer>
        <SwipeableDrawer anchor="right" open={openEight} width={window.innerWidth - 260}>
          <ExpenditureCustomers customerInfo={isDisplay} onClose={() => handleClose(8)} />
        </SwipeableDrawer>
        <SwipeableDrawer anchor="right" open={openNine} width={window.innerWidth - 260}>
          <ReportRevenueSummary profile={props.profile} onClose={() => handleClose(9)} />
        </SwipeableDrawer>
        <SwipeableDrawer anchor="right" open={openTen} width={window.innerWidth - 260}>
          <ReportShowsMessage customerInfo={isDisplay} onClose={() => handleClose(10)} />
        </SwipeableDrawer>
      </div>
    </Grid>
  );
}

const mapStateToProps = createStructuredSelector({
  dashboardPage: makeSelectDashboardPage(),
  profile: makeSelectProfile(),

});

const withConnect = connect(mapStateToProps);
export default compose(withConnect)(ReportTower);

// export default ReportAsset;
