/**
 *
 * TowerContractPage
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { Link, Paper, Typography, withStyles, Grid as GridUI, Menu, MenuItem, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import makeSelectTowerContractPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import ListPage from '../../../components/List';
import makeSelectDashboardPage from 'containers/Dashboard/selectors';
import { API_CUSTOMERS, API_FEE, API_TOWER_APARTMENT, API_TOWER_FLOOR, API_CONTRACT_BY_APARTMENT, GET_CONTRACT } from '../../../config/urlConfig';
import { Grid, AsyncAutocomplete, Fab, TextField, Dialog as DialogUI } from '../../../components/LifetekUi';
import { handleChange } from '../../AddSampleProcess/actions';
import { useEffect } from 'react';
import * as actions from './actions';
import { Breadcrumbs } from '@material-ui/lab';
import styles from './styles';
import _ from 'lodash';
import { Send } from '@material-ui/icons';
import DialogSendMail from './Dialogs/DialogSendMail/Loadable';
import DialogSendNoti from './Dialogs/DialogSendNoti';
import { changeSnackbar } from '../../Dashboard/actions';

const MenuAction = memo(({ handleClose, anchorEl, openSendEmail, openSendNoti, templates }) => {
  const [sendType, setSendType] = useState('send-notify');
  const [template, setTemplate] = useState('');
  return (
    <DialogUI
      onSave={() => {
        if (sendType === 'send-notify') {
          openSendNoti(template);
        }
        if (sendType === 'send-mail') {
          openSendEmail(template);
        }
      }}
      open={anchorEl}
      onClose={handleClose}
      saveText="Gửi"
    >
      <TextField value={sendType} fullWidth select onChange={e => setSendType(e.target.value)} label="Phương thức">
        <MenuItem value="send-notify">Thông báo</MenuItem>
        <MenuItem value="send-mail">Email</MenuItem>
      </TextField>
      <TextField value={template} fullWidth select onChange={e => setTemplate(e.target.value)} label="Biểu mẫu">
        {Array.isArray(templates) &&
          templates.map(item => (
            <MenuItem key={item._id} value={item._id}>
              {item.title}
            </MenuItem>
          ))}
      </TextField>
    </DialogUI>
    // <div>
    //   <Menu open={Boolean(anchorEl)} onClose={handleClose} anchorEl={anchorEl} keepMounted>
    //     <MenuItem onClick={openSendEmail}>Gửi email</MenuItem>
    //     <MenuItem onClick={openSendNoti}>Gửi thông báo</MenuItem>
    //   </Menu>

    //   {/* <div style={{ width: '100vw' }} id="divToPrint" /> */}
    // </div>
  );
});

function TowerContractPage(props) {
  const { cleanup, classes, towerContractPage, getModuleFee, onSendMail, onSendNoti, getAllFees, dashboardPage } = props;
  const allTemplates = dashboardPage.allTemplates || [];
  const { templates, fees_data } = towerContractPage;
  const [filter, setFilter] = useState({});

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  const [contract, setContract] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const [openSendEmail, setOpenSendEmail] = useState(false);

  const [openSendNoti, setOpenSendNoti] = useState(false);

  const [selected, setSelected] = useState([]);

  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    getModuleFee();
    getAllFees();
    return () => {
      cleanup();
    };
  }, []);

  const handleChangeStartDate = date => {
    setStartDate(date);
    if (date) {
      setFilter({
        ...filter,
        date: {
          ...filter.date,
          $gte: date.toISOString(),
        },
      });
    } else {
      delete filter.date.$gte;
    }
  };

  const handleChangeEndDate = date => {
    setEndDate(date);
    if (date) {
      setFilter({
        ...filter,
        date: {
          ...filter.date,
          $lte: date.toISOString(),
        },
      });
    } else {
      delete filter.date.$lte;
    }
  };

  const handleChangeContract = contract => {
    setContract(contract);
    if (contract) {
      setFilter({
        ...filter,
        contractId: contract._id,
      });
    } else {
      delete filter.contractId;
    }
  };
  const sendingStatus = ['Chưa gửi mail', 'Đã gửi mail'];
  const createRevenueStatus = ['Đã tạo phiếu thu / thông báo', 'Chưa tạo phiếu thu / thông báo'];
  const mapFunction = item => {
    const keys = Object.keys(item).filter(f => f.includes('totalMoney') || f.includes('ChargeMoney') || f.includes('Money'));
    const newItem = { ...item };
    let totalMoney = null;
    Array.isArray(newItem.originItem.carCharge) &&
      newItem.originItem.carCharge.length > 0 &&
      newItem.originItem.carCharge.map(x => (totalMoney += Number(x.totalMoney)));

    Array.isArray(keys) &&
      keys.map(name => {
        newItem.contractId = item['contractId.name'];
        newItem.carCharge =
          Array.isArray(item.originItem.carCharge) && item.originItem.carCharge.length > 0 && item.originItem.carCharge[0].totalMoney;
        newItem.sendingStatus = sendingStatus[item['sendingStatus']];
        newItem.createRevenueStatus = createRevenueStatus[item['createRevenueStatus']];
        newItem[name] = (!isNaN(item[name]) && Number(item[name]).toLocaleString('es-AR', { maximumFractionDigits: 0 })) || 0;
        newItem.debt = (!isNaN(item[`debt`]) && Number(item[`debt`]).toLocaleString('es-AR', { maximumFractionDigits: 0 })) || 0;
        newItem.totalDebt = (!isNaN(item[`totalDebt`]) && Number(item[`totalDebt`]).toLocaleString('es-AR', { maximumFractionDigits: 0 })) || 0;
        newItem.totalPaid = (!isNaN(item[`totalPaid`]) && Number(item[`totalPaid`]).toLocaleString('es-AR', { maximumFractionDigits: 0 })) || 0;
        newItem.taxVAT = (!isNaN(item.taxVAT) && Number(item.taxVAT).toLocaleString('es-AR', { maximumFractionDigits: 0 })) || 0;
        newItem.taxEnv = (!isNaN(item.taxEnv) && Number(item.taxEnv).toLocaleString('es-AR', { maximumFractionDigits: 0 })) || 0;

        newItem['electricityCharge.totalMoney'] =
          (!isNaN(item.electricityMoney) && Number(item.electricityMoney).toLocaleString('es-AR', { maximumFractionDigits: 0 })) || 0;
        newItem['waterCharge.totalMoney'] =
          (!isNaN(item.waterChargeMoney) && Number(item.waterChargeMoney).toLocaleString('es-AR', { maximumFractionDigits: 0 })) || 0;

        // newItem['electricityCharge.fromValue'] = item.originItem.electricityCharge.length === 1 && item.originItem.electricityCharge[0].assetId.length == 1 ?
        //   item.originItem.electricityCharge[0].updateAsset[0].fromValue : 0;
        // newItem['electricityCharge.toValue'] = item.originItem.electricityCharge.length === 1 && item.originItem.electricityCharge[0].assetId.length == 1 ?
        //   item.originItem.electricityCharge[0].updateAsset[0].toValue : 0;
        // newItem['waterCharge.fromValue'] = item.originItem.waterCharge.length === 1 && item.originItem.waterCharge[0].assetId.length == 1 ?
        //   item.originItem.waterCharge[0].updateAsset[0].fromValue : 0;
        // newItem['waterCharge.toValue'] = item.originItem.waterCharge.length === 1 && item.originItem.waterCharge[0].assetId.length == 1 ?
        //   item.originItem.waterCharge[0].updateAsset[0].toValue : 0;

        newItem['electricityCharge.fromValue'] =
          item.originItem.electricityCharge.length === 1 &&
          Array.isArray(item.originItem.electricityCharge[0].assetId) &&
          item.originItem.electricityCharge[0].assetId.length == 1
            ? item.originItem.electricityCharge[0].fromValue
            : 0;
        newItem['electricityCharge.toValue'] =
          item.originItem.electricityCharge.length === 1 &&
          Array.isArray(item.originItem.electricityCharge[0].assetId) &&
          item.originItem.electricityCharge[0].assetId.length == 1
            ? item.originItem.electricityCharge[0].toValue
            : 0;
        newItem['waterCharge.fromValue'] =
          item.originItem.waterCharge.length === 1 &&
          Array.isArray(item.originItem.waterCharge[0].assetId) &&
          item.originItem.waterCharge[0].assetId.length == 1
            ? item.originItem.waterCharge[0].fromValue
            : 0;
        newItem['waterCharge.toValue'] =
          item.originItem.waterCharge.length === 1 &&
          Array.isArray(item.originItem.waterCharge[0].assetId) &&
          item.originItem.waterCharge[0].assetId.length == 1
            ? item.originItem.waterCharge[0].toValue
            : 0;
        newItem['waterCharge.value'] =
          item.originItem.waterCharge.length === 1 &&
          Array.isArray(item.originItem.waterCharge[0].assetId) &&
          item.originItem.waterCharge[0].assetId.length == 1
            ? item.originItem.waterCharge[0].totalValue
            : 0;
      });
    // let totalMoney = null;
    // Array.isArray(item.originItem.carCharge) &&
    //   item.originItem.carCharge.length > 0 &&
    //   item.originItem.carCharge.map(x => (totalMoney += Number(x.totalMoney)));
    // return {
    //   ...item,
    //   contractId: item['contractId.name'],
    //   carCharge: Array.isArray(item.originItem.carCharge) && item.originItem.carCharge.length > 0 && item.originItem.carCharge[0].totalMoney,
    //   sendingStatus: sendingStatus[item['sendingStatus']],
    //   createRevenueStatus: createRevenueStatus[item['createRevenueStatus']],
    //   // ['others.term']: moment(item.formDate).format("MM-YYYY")
    // };
    console.log('newItem', newItem);
    return newItem;
  };
  const editTowerContract = item => {
    props.history.push(`/tower/fee/${item._id}`, item.state);
  };

  const handleChangeSelectTower = newSelected => {
    let newArr = [];
    newSelected.forEach(item => {
      Array.isArray(item) &&
        item.length > 0 &&
        item.forEach(items => {
          newArr.push(items);
        });
    });
    setSelected(newArr);
  };

  const handleClick = e => {
    //check phe duyet thong bao phi
    const checkState = selected.every(item => item.state !== '0');
    if (checkState) {
      setAnchorEl(e.currentTarget);
    } else props.onChangeSnackbar({ status: true, message: 'Có thông báo phí đang yêu cầu phê duyệt cần phê duyệt trước khi gửi', variant: 'error' });
    // setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpenSendEmail = template => {
    setSelectedTemplate(template);
    setOpenSendEmail(true);
  };

  const handleOpenSendNoti = template => {
    setSelectedTemplate(template);
    setOpenSendNoti(true);
  };
  return (
    <div>
      <Paper className={classes.breadcrumbs}>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Breadcrumbs aria-label="Breadcrumb">
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
                Dashboard
              </Link>
              <Typography color="textPrimary">Thông báo phí</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
      <Paper>
        <Grid container spacing={8}>
          {/* <Grid item xs={8}>
            <Grid container spacing={8}>
              <Grid item>
                <DateTimePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY HH:mm"
                  value={startDate}
                  variant="outlined"
                  label="Ngày bắt đầu"
                  margin="dense"
                  clearable
                  onChange={date => handleChangeStartDate(date)}
                />
              </Grid>
              <Grid item>
                <DateTimePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY HH:mm"
                  value={endDate}
                  variant="outlined"
                  label="Ngày kết thúc"
                  margin="dense"
                  clearable
                  onChange={date => handleChangeEndDate(date)}
                />
              </Grid>
              <Grid item xs={5}>
                <AsyncAutocomplete
                  name="Chọn hợp đồng..."
                  label="Hợp đồng"
                  optionValue="value"
                  onChange={value => handleChangeContract(value)}
                  url={GET_CONTRACT}
                  filter={{apartmentCode: {$exists: true, $ne: "" }}}
                  value={contract}
                />
              </Grid>
            </Grid>
          </Grid> */}
          <Grid item xs={12}>
            <ListPage
              code="Fee"
              exportExcel
              // noKanban
              apiUrl={API_FEE}
              mapFunction={mapFunction}
              filter={filter}
              onEdit={editTowerContract}
              onSelectCustomers={handleChangeSelectTower}
              advanceAction={
                <Fab onClick={handleClick}>
                  <Send />
                </Fab>
              }
            />
            <MenuAction
              handleClose={handleClose}
              anchorEl={anchorEl}
              openSendEmail={handleOpenSendEmail}
              openSendNoti={handleOpenSendNoti}
              templates={allTemplates.filter(t => t.moduleCode === 'Fee')}
            />
          </Grid>

          {/* Gui mail */}
          <DialogSendMail
            open={openSendEmail}
            code="Fee"
            onClose={() => setOpenSendEmail(false)}
            selected={selected}
            templates={templates}
            onSend={data => {
              if (selectedTemplate) {
                data.template = allTemplates.find(t => t._id === selectedTemplate);
              }
              onSendMail(data);
            }}
            data={fees_data}
          />
          <DialogSendNoti
            open={openSendNoti}
            code="Fee"
            onClose={() => setOpenSendNoti(false)}
            selected={selected}
            onSend={data => {
              if (selectedTemplate) {
                data.template = allTemplates.find(t => t._id === selectedTemplate);
              }
              onSendNoti(data);
            }}
          />
        </Grid>
      </Paper>
    </div>
  );
}

TowerContractPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  towerContractPage: makeSelectTowerContractPage(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    cleanup: () => dispatch(actions.cleanup()),
    getModuleFee: () => dispatch(actions.getModuleFee()),
    onSendMail: data => {
      dispatch(actions.sendMailFees(data));
    },
    onSendNoti: data => {
      dispatch(actions.sendNotiFees(data));
    },
    getAllFees: () => dispatch(actions.getAllFees()),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'towerContractPage', reducer });
const withSaga = injectSaga({ key: 'towerContractPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(TowerContractPage);
