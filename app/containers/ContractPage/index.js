/**
 *
 * Contract
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl } from 'react-intl';
import {
  Tabs,
  Tab,
  Grid,
  Select,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  MenuItem,
  FormControl,
  Button,
  // Badge,
  OutlinedInput,
  Tooltip,
  Paper,
} from '@material-ui/core';
import moment from 'moment';
import CustomButton from 'components/CustomButtons/Button';
import injectSaga from 'utils/injectSaga';
import Progressbar from 'react-progressbar';
import injectReducer from 'utils/injectReducer';
import dot from 'dot-object';
import HOCTable from '../HocTable';
// import lodash from 'lodash';
// import MainDialog from './component/ContractDialog';
import makeSelectContract from './selectors';
import reducer from './reducer';
import saga from './saga';
import { serialize } from '../../utils/common';
// import Table from './component/table';

import './styles.scss';
import { getContract, deleteContract, UpdateStatusAct, changeTabAct, mergeDataContract } from './actions';
import LoadingIndicator from '../../components/LoadingIndicator';
import Kanban from '../KanbanPlugin';
import { GET_CONTRACT } from '../../config/urlConfig';
import messages from './messages';
import BODialog from '../../components/LifetekUi/Planner/BODialog';
import makeSelectEditProfilePage from '../EditProfilePage/selectors';
import makeSelectDashboardPage from 'containers/Dashboard/selectors';
import { Dialog } from '../../components/LifetekUi';
/* eslint-disable react/prefer-stateless-function */
import ListPage from '../../components/List';
import { Add } from '@material-ui/icons';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },

  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
    paddingLeft: 0,
  },
});
const CustomCatalog = () => <div />;
const Catalogcontract = props => (
  <div>
    {props.item.catalogContract === '0'
      ? 'Hợp đồng nguyên tắc'
      : props.item.catalogContract === '1'
        ? 'Hợp đồng kinh tế'
        : props.item.catalogContract === '2'
          ? 'Hợp đồng thời vụ'
          : 'Hợp đồng bảo hành bảo trì'}
  </div>
);
const CustomKanbanStatus = props => {
  const propsFromTable = props.kanbanProps.slice();
  const laneStart = [];
  const laneAdd = [];
  const laneSucces = [];
  const laneFail = [];

  Array.isArray(propsFromTable) &&
    propsFromTable.forEach(item => {
      switch (item.code) {
        case 1:
          laneStart.push(item);
          break;
        case 2:
          laneAdd.push(item);
          break;

        case 3:
          laneSucces.push(item);
          break;

        case 4:
          laneFail.push(item);
          break;

        default:
          break;
      }
    });
  const sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
  const itemFromTable = Object.assign({}, props.item);
  const kanbanStatusNumber = sortedKanbanStatus.findIndex(n => String(n._id) === String(itemFromTable.kanbanStatus));
  const kanbanValue = ((kanbanStatusNumber + 1) / propsFromTable.length) * 100;
  return (
    <div>
      {sortedKanbanStatus[kanbanStatusNumber] !== undefined ? (
        <Progressbar color={sortedKanbanStatus[kanbanStatusNumber].color} completed={kanbanValue} />
      ) : (
        <span>Không xác định</span>
      )}
    </div>
  );
};
const TypeContract = props => {
  if (props.item.typeContract === '1') {
    return <div>HĐ Khách hàng</div>;
  }
  if (props.item.typeContract === '2') {
    return <div>HĐ Nhà Cung cấp</div>;
  }
  return <div />;
};

// const CustomResponsible = props => {
//   const name = dot
//     .object(props.item)
//     .responsible.map(elm => elm.name)
//     .join(', ');
//   return <p> {name}</p>;
// };

export class Contract extends React.Component {
  state = {
    value: 0,
    typeContract: 1,
    catalogContract: 0,
    filter: {
      filter: {
        typeContract: 1,
      },
    },
    contracts: [],
    onDelete: false,
    idDelete: [],
    crmStatusSteps: [],
    pageDetail: {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
    },
    listContractTypes: [],
    kanbanFilter: {
      typeContract: 1,
    },
    kanbanData: {},
    openKanbanDialog: false,

    settingRole: {},
  };

  componentDidMount() {
    const { dashboardPage } = this.props;
    const { role = {} } = dashboardPage;
    const { roles } = role;

    const fakeModule = [{ name: 'Contract', typeContract: 1 }, { name: 'ContractSupper', typeContract: 2 }];

    if (!Object.keys(this.state.settingRole).length) {
      const getRole = moduleCode => {
        // console.log(moduleCode)
        const roleCode = roles.find(item => item.codeModleFunction === moduleCode);
        const newRoleModule = roleCode ? roleCode.methods : [];
        let getRole = newRoleModule.find(elm => elm.name === 'GET');
        let putRole = newRoleModule.find(elm => elm.name === 'PUT');
        let postRole = newRoleModule.find(elm => elm.name === 'POST');
        let deleteRole = newRoleModule.find(elm => elm.name === 'DELETE');
        let exportRole = newRoleModule.find(elm => elm.name === 'EXPORT');
        let importRole = newRoleModule.find(elm => elm.name === 'IMPORT');
        let viewConfigRole = newRoleModule.find(elm => elm.name === 'VIEWCONFIG');
        getRole = getRole && getRole.allow;
        putRole = putRole && putRole.allow;
        postRole = postRole && postRole.allow;
        deleteRole = deleteRole && deleteRole.allow;
        exportRole = exportRole && exportRole.allow;
        importRole = importRole && importRole.allow;
        viewConfigRole = viewConfigRole && viewConfigRole.allow;
        // console.log(getRole,moduleCode,'dddd')
        return { getRole, putRole, postRole, deleteRole, exportRole, importRole, viewConfigRole };
      };
      if (roles) {
        // this.setState({ synModuleLogRole: getRole('SynModuleLog')});
        // this.setState({ settingRole: getRole('RevenueExpenditure')});
        const ContractRole = getRole('Contract');
        const ContractSupperRole = getRole('ContractSupper');
        this.setState({ ContractRole: ContractRole });
        this.setState({ ContractSupperRole: ContractSupperRole });
        // setSettingRole(getRole('setting'));
        const newFakeModule = fakeModule
          .map(item => {
            if (getRole(item.name).getRole) {
              return item;
            }
          })
          .filter(f => f);
        if (!this.props.history.value)
          this.props.history.value = newFakeModule[0].typeContract;
        this.setState({ typeContract: newFakeModule[0].typeContract });
      }
    }

    // this.props.onGetContracts();
    // const { filter } = this.state;
    // const query = serialize(filter);
    // this.props.onGetContracts(query);
    const listCrmSource = JSON.parse(localStorage.getItem('crmSource')) || [];
    const contractTypeSource = listCrmSource.find(i => i.code === 'S15');
    let newListContractTypes = [];
    if (contractTypeSource) {
      newListContractTypes = contractTypeSource.data;
    }
    const listCrmStatus = JSON.parse(localStorage.getItem('crmStatus')) || []
    const currentCrmStatus = listCrmStatus[listCrmStatus.findIndex(d => d.code === 'ST05')];
    const laneStart = [];
    const laneAdd = [];
    const laneSucces = [];
    const laneFail = [];
    currentCrmStatus && 
    currentCrmStatus.data != 'undefined' &&
    currentCrmStatus.data.forEach(item => {
      switch (item.code) {
        case 1:
          laneStart.push(item);
          break;
        case 2:
          laneAdd.push(item);
          break;

        case 3:
          laneSucces.push(item);
          break;

        case 4:
          laneFail.push(item);
          break;

        default:
          break;
      }
    });
    const sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
    this.setState({ crmStatusSteps: sortedKanbanStatus, listContractTypes: newListContractTypes });
    if (this.props.history.value) {
      if (this.props.history.value === 1) {
        const filter = {
          filter: {
            typeContract: 1,
          },
        };
        this.state.filter = filter;
        this.setState({ filter });
      } else {
        const filter = {
          filter: {
            typeContract: 2,
          },
        };
        this.state.filter = filter;
        this.setState({ filter });
      }
      this.setState({ typeContract: this.props.history.value });
      this.props.history.value = undefined;
    }
    // console.log('check>>>>>filter', this.state.filter);
    // this.props.mergeDataContract({
    //   dashboard: 0,
    // });
  }

  handleChange = name => event => {
    // console.log('check>>>>filterChange', name, 'hahaha>>>>', event);
    if (this.state.filter.expirationDay) {
      delete this.state.filter.filter.expirationDay;
    }
    if (event.target.value && event.target.value !== 'defaulValue') {
      this.state.filter.filter[name] = event.target.value;
      // const { filter } = this.state;
    } else {
      delete this.state.filter.filter[name];
      // const { filter } = this.state;
    }
    this.state.filter.skip = 0;
    this.state.filter.limit = 10;
    const query = serialize(this.state.filter);
    this.props.onGetContracts(query);
    const pageDetail = {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
    };
    this.props.mergeDataContract({ reload: false });
    this.setState({ [name]: event.target.value, value: 0, pageDetail }, () => this.props.mergeDataContract({ reload: true }));
  };

  handleTab(tab) {
    this.props.onChangeTab(tab);
  }

  callBack = (cmd, data) => {
    switch (cmd) {
      case 'create-bo':
        // console.log('xxx');
        // this.props.onAddBo(dot.object(data));
        this.props.history.push(`/tower/Contract/add/${this.state.typeContract}`);
        break;
      case 'update-bo':
        // console.log(data);
        break;
      case 'kanban-dragndrop-con': {
        // const { contracts } = this.state;
        // const currentCard = contracts[contracts.findIndex(d => d._id === data.cardId)]; // tìm cơ hội kinh doanh hiện tại
        // currentCard.kanbanStatus = data.newKanbanStatus;
        this.props.onUpdate(data);
        break;
      }
      case 'update-viewconfig': {
        const localStorageViewConfig = JSON.parse(localStorage.getItem('viewConfig'));
        const currentViewConfigIndex = localStorageViewConfig.findIndex(d => d.path === '/crm/BusinessOpportunities');
        const { others } = localStorageViewConfig[currentViewConfigIndex].listDisplay.type.fields.type;
        const newOthers = [...others, ...data];
        localStorageViewConfig[currentViewConfigIndex].listDisplay.type.fields.type.others = newOthers;
        localStorage.setItem('viewConfig', JSON.stringify(localStorageViewConfig));
        this.props.onEditViewConfig(localStorageViewConfig[currentViewConfigIndex]);
        break;
      }
      case 'quick-add': {
        if (this.state.typeContract === 2) {
          this.props.history.push(`/tower/Contract/supplier/add/${this.state.typeContract}`);
        } else {
          this.props.history.push(`/tower/Contract/add/${this.state.typeContract}`);
        }
        break;
      }
      case 'CommentDialog': {
        this.setState({ openKanbanDialog: true, kanbanData: data });
        break;
      }

      default:
        break;
    }
  };

  handleAddClick = () => {
    if (this.state.typeContract === 2) {
      this.props.history.push(`/tower/Contract/supplier/add/${this.state.typeContract}`);
    } else {
      this.props.history.push(`/tower/Contract/add/${this.state.typeContract}`);
    }
  };

  addItem = () => (
    <Tooltip title="Thêm mới" aria-label="add">
      <Add onClick={this.handleAddClick} />
    </Tooltip>
  );

  handleEdiClick = props => {
    // this.props.history.push(`/crm/Contract/edit/${props._id}`);
    if (this.state.typeContract === 2) {
      this.props.history.push(`/tower/Contract/supplier/edit/${props._id}`);
    } else {
      this.props.history.push(`/tower/Contract/edit/${props._id}`);
    }
  };

  handleDeleteClick = props => {
    const { contracts } = this.state;
    const ids = [];
    props.forEach(index => {
      ids.push(contracts[index]._id);
    });
    this.setState({ idDelete: ids, onDelete: true });
    // this.props.onDeleteContract({ ids });
  };

  handleDelete = () => {
    this.setState({ onDelete: false });
    const { filter } = this.state;
    const query = serialize(filter);
    const pageDetail = {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
    };
    this.setState({ pageDetail });
    this.props.onDeleteContract({ ids: this.state.idDelete, query });
  };

  handleChangeTabList = (event, value) => {
    console.log("handleChangeTabList")
    const { typeContract } = this.state
    const listKanBan = JSON.parse(localStorage.getItem('crmStatus'))
    const statusKanban = JSON.parse(localStorage.getItem('crmStatus'))
      .find(x => x.code === 'ST05')
      .data.find(x => x.code === 4)._id;
    const listStatusKanbanNCC = listKanBan && listKanBan.find(x => x.code === 'ST30')
    const statusKanbanNCC = listStatusKanbanNCC && listStatusKanbanNCC.data && listStatusKanbanNCC.data.find(x => x.code === 4) && listStatusKanbanNCC.data.find(x => x.code === 4)._id;
    if (value === 0 || value === 3) {
      delete this.state.filter.type;
      delete this.state.filter.filter.expirationDay;
      delete this.state.filter.filter.kanbanStatus;
      this.state.filter.filter.typeContract = this.state.typeContract;
    } else if (value === 1) {
      this.state.filter.type = 1;
      // delete this.state.filter.filter.expirationDay;
      this.state.filter.filter.kanbanStatus = statusKanban;
      this.state.filter.filter.typeContract = this.state.typeContract;
      if (Number(typeContract) === 2) {
        this.state.filter.filter.kanbanStatus = statusKanbanNCC

      }
    } else {
      delete this.state.filter.type;
      delete this.state.filter.filter.kanbanStatus;
      // this.state.filter.filter.expirationDay = {
      //   $lt: moment().format(),
      // };
      this.state.filter = {
        filter: {
          expirationDay: {
            $lt: moment().format(),
          },
          kanbanStatus: {
            $ne: statusKanban,
          },
          typeContract: this.state.typeContract,
        },
      };
    }
    this.state.filter.skip = 0;
    this.state.filter.limit = 10;
    const pageDetail = {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
    };
    this.props.onGetContracts(serialize(this.state.filter));
    console.log("value: ", value)
    this.setState({ value, pageDetail });
    this.props.mergeDataContract({
      dashboard: 0,
    });
  };

  changeContractType = typeContract => {
    const { filter } = this.state;
    filter.filter.typeContract = typeContract;
    if (filter.type) {
      delete filter.type;
    }
    if (filter.filter.expirationDay) {
      delete filter.filter.expirationDay;
    }
    filter.skip = 0;
    filter.limit = 10;
    const query = serialize(filter);
    this.props.onGetContracts(query);
    const pageDetail = {
      currentPage: 0,
      pageSize: 0,
      totalCount: 0,
    };
    this.props.mergeDataContract({ reload: false });
    const newKanbanFilter = this.state.kanbanFilter || {};
    newKanbanFilter.typeContract = typeContract;
    //this.setState({ typeContract, filter, value: 0, pageDetail }), () => this.props.mergeDataContract({ reload: true });
    this.setState({ typeContract, filter, value: 0, pageDetail, kanbanFilter: newKanbanFilter }, () =>
      this.props.mergeDataContract({ reload: true }),
    );
  };

  componentWillReceiveProps(props) {
    if (props !== this.props) {
      const { contract } = props;

      if (props.contract.dashboard === 1) {
        this.state.contracts = contract.contractDashboard || [];
        this.state.pageDetail.totalCount = contract.contractDashboard.length || 0;
        this.state.pageDetail.currentPage = Number(contract.contractDashboard.skip || 0) || 0;
        this.state.pageDetail.pageSize = contract.contractDashboard.limit || 0;
      } else {
        this.state.contracts = contract.contracts || [];
        this.state.pageDetail.totalCount = contract.count || 0;
        this.state.pageDetail.currentPage = Number(contract.skip || 0) || 0;
        this.state.pageDetail.pageSize = contract.limit || 0;
      }
    }
  }

  mapFunction = item => {
    let label = item.catalogContract;
    const value = this.state.listContractTypes.find(t => t.value === `${item.catalogContract}`);

    if (value) {
      label = value.title;
    }
    if (Number(this.state.typeContract) === 1) {
      return {
        ...item,
        contractHandoverDate: item.contractHandoverDate ? moment(item.contractHandoverDate).format('DD/MM/YYYY') : '',
        catalogContract: label,
        customerId: item.customerIdName
          ? `${item.customerIdName ? item.customerIdName : ''}  ${item.phoneCustomer ? '-' : ''} ${item.phoneCustomer ? item.phoneCustomer : ''}`
          : null,
        createdBy: item.createdByName || item.createdBy,
        'exchangingAgreement.exchangingAgreementId': item.exchangingAgreementCode ? item.exchangingAgreementCode : null,
        'order.orderId': item.orderCode ? item.orderCode : null,
      };
    } else if (Number(this.state.typeContract) === 2) {
      console.log(333);
      return {
        ...item,
        catalogContract: label,
        customerId: item.customerIdName
          ? `${item.customerIdName ? item.customerIdName : ''}  ${item.phoneCustomer ? '-' : ''} ${item.phoneCustomer ? item.phoneCustomer : ''}`
          : null,
        createdBy: item.createdByName || item.createdBy,
        'exchangingAgreement.exchangingAgreementId': item.exchangingAgreementCode ? item.exchangingAgreementCode : null,
        'order.orderId': item.orderCode ? item.orderCode : null,
        'supplier.name': item['supplierId.name'],
      };
    }
  };

  render() {
    const { classes, contract, intl, profile } = this.props;
    const { tab, reload } = this.props.contract;
    const { listContractTypes, ContractRole, ContractSupperRole } = this.state;
    // console.log('dashboard', this.props.contract);
    const Bt = props => (
      <CustomButton onClick={() => this.handleTab(props.tab)} {...props} color={props.tab === tab ? 'gradient' : 'simple'} right round size="sm">
        {props.children}
      </CustomButton>
    );
    const newContracts = Array.isArray(this.state.contracts) && this.state.contracts.map(item => dot.dot(item));
    const nameCallBack = 'con';
    return (
      <div>
        {/* {contract.loading ? <LoadingIndicator /> : null} */}
        <Paper>
          <Grid container>
            <Grid item sm="12">
              <Bt tab={1}>Kanban</Bt>
              <Bt tab={0}>{intl.formatMessage(messages.list || { id: 'list', defaultMessage: 'list' })}</Bt>
            </Grid>
          </Grid>
          <Grid container className="p-3">
            <Grid item sm={2}>
              {/* <TextField label="Tìm kiếm" variant="outlined" /> */}
              <FormControl fullWidth>
                <Select
                  // variant="outlined"
                  value={this.state.catalogContract}
                  onChange={this.handleChange('catalogContract')}
                  input={<OutlinedInput name="catalogContract" id="age-native-label-placeholder" />}
                >
                  <MenuItem selected value="defaulValue">
                    {intl.formatMessage(messages.typeContract || { id: 'typeContract', defaultMessage: 'typeContract' })}
                  </MenuItem>
                  {listContractTypes.map(i => (
                    <MenuItem value={i.value}>{i.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid className="px-3" item sm={2} />
            <Grid item sm={2} />
            <Grid item sm={6} className="text-right">
              {ContractRole &&
                ContractRole.getRole && (
                  <Button
                    onClick={() => {
                      this.changeContractType(1);
                    }}
                    className="mx-2"
                    variant={this.state.typeContract === 1 ? 'contained' : 'outlined'}
                    color="primary"
                  >
                    {intl.formatMessage(messages.typeCustomer || { id: 'typeCustomer', defaultMessage: 'typeCustomer' })}
                  </Button>
                )}
              {ContractSupperRole &&
                ContractSupperRole.getRole && (
                  <Button
                    onClick={() => {
                      this.changeContractType(2);
                    }}
                    className="mx-2"
                    variant={this.state.typeContract === 2 ? 'contained' : 'outlined'}
                    color="primary"
                  >
                    {intl.formatMessage(messages.typeSupplier || { id: 'typeSupplier', defaultMessage: 'typeSupplier' })}
                  </Button>
                )}
            </Grid>
            <Grid item sm={12} className="mt-3">
              <Tabs value={this.state.value} indicatorColor="primary" textColor="primary" onChange={this.handleChangeTabList}>
                <Tab
                  label={
                    // <Badge color="primary" badgeContent={this.props.contract.contractCount} max={9999}>
                    <Typography className={classes.padding}>
                      {intl.formatMessage(messages.listOfContract || { id: 'listOfContract', defaultMessage: 'listOfContract' })}
                    </Typography>
                    // </Badge>
                  }
                />
                {/* <Tab
                style={this.state.catalogContract !== 1 ? {} : { display: 'none' }}
                label={
                  // <Badge color="primary" badgeContent={this.props.contract.cycleCount} max={9999}>
                  <Typography className={classes.padding}>
                    {intl.formatMessage(messages.serviceCycle || { id: 'serviceCycle', defaultMessage: 'serviceCycle' })}
                  </Typography>
                  // </Badge>
                }
              /> */}
                <Tab
                  label={
                    // <Badge color="primary" badgeContent={this.props.contract.contractExpireCount} max={9999}>
                    <Typography className={classes.padding}>
                      {intl.formatMessage(messages.contractExpired || { id: 'contractExpired', defaultMessage: 'contractExpired' })}
                    </Typography>
                    // </Badge>
                  }
                />

                <Tab
                  style={{ maxWidth: 'none' }}
                  label={
                    // <Badge color="primary" badgeContent={this.props.contract.contractExpireCount} max={9999}>
                    <Typography className={classes.padding}>HỢP ĐỒNG QUÁ HẠN CẦN GIA HẠN</Typography>
                    // </Badge>
                  }
                />
              </Tabs>

              {/* {this.state.value === 0 && ( */}
              {/* -------------------- Bảng --------------------- */}
              {tab === 1 ? (
                <Kanban
                  isOpenSinglePage
                  enableAdd
                  titleField="name"
                  callBack={this.callBack}
                  path={`${GET_CONTRACT}`}
                  code="ST05"
                  reload={reload}
                  filter={this.state.kanbanFilter}
                  customContent={customContent}
                  nameCallBack={nameCallBack}
                  typeContract={this.state.typeContract}
                  customActions={[
                    {
                      action: 'comment',
                      // params: 'typeLine=4',
                    },
                  ]}
                  history={this.props.history}
                  params={`Contract/${this.state.typeContract === 2 ? 'supplier/' : ''}edit`}
                />
              ) : null}
              {
                console.log("tab: ", tab, this.state.value, this.state.typeContract)
              }
              {tab === 0 ? (
                <>
                  {
                    Number(this.state.typeContract) === 1 ? <>
                      <ListPage
                        showDepartmentAndEmployeeFilter
                        apiUrl={`${GET_CONTRACT}`}
                        defaultValue={this.state.filter.filter}
                        filter={this.state.filter.filter}
                        exportExcel
                        // code={Number(this.state.typeContract) === 1 ? 'Contract' : 'ContractSupper'}
                        code='Contract'
                        module="Contract"
                        kanban="ST05"
                        kanbanKey="_id"
                        withPagination
                        mapFunction={this.mapFunction}
                        settingBar={[this.addItem()]}
                        onEdit={this.handleEdiClick}
                        disableAdd
                        reload={reload}
                      />
                    </> : null
                  }
                  {
                    Number(this.state.typeContract) === 2 ? <>
                      <ListPage
                        showDepartmentAndEmployeeFilter
                        apiUrl={`${GET_CONTRACT}`}
                        defaultValue={this.state.filter.filter}
                        filter={this.state.filter.filter}
                        exportExcel
                        // code={Number(this.state.typeContract) === 1 ? 'Contract' : 'ContractSupper'}
                        code={'ContractSupper'}
                        module="Contract"
                        // kanban="ST05"
                        kanban={'ST30'}
                        kanbanKey="_id"
                        withPagination
                        mapFunction={this.mapFunction}
                        settingBar={[this.addItem()]}
                        onEdit={this.handleEdiClick}
                        disableAdd
                        reload={reload}
                      />
                    </> : null
                  }
                </>
              ) : null}

              {tab === 3 ? (
                <ListPage
                  apiUrl={`${GET_CONTRACT}`}
                  filter={this.state.filter.filter}
                  exportExcel
                  code="Contract"
                  kanban="ST05"
                  kanbanKey="_id"
                  withPagination
                  mapFunction={this.mapFunction}
                  settingBar={[this.addItem()]}
                  onEdit={this.handleEdiClick}
                  disableAdd
                  reload={reload}
                />
              ) : null}
            </Grid>
          </Grid>
          <Dialog
            open={this.state.onDelete}
            onClose={this.handleCloseDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Thông báo</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">Bạn có chắc chắn muốn xóa?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={() => this.handleDelete()}>
                Đồng ý
              </Button>
              <Button onClick={this.handleCloseDelete} color="primary" autoFocus>
                Đóng
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog dialogAction={false} onClose={() => this.setState({ openKanbanDialog: false })} open={this.state.openKanbanDialog}>
            <BODialog
              setCoverTask={() => { }}
              profile={profile}
              taskId={this.state.kanbanData._id}
              // filterItem={innerFilterItem}
              data={this.state.kanbanData}
              API={GET_CONTRACT}
              customContent={customContent}
            />
          </Dialog>
        </Paper>
      </div>
    );
  }

  onGetContractsCustom = params1 => {
    let { filter } = this.state;
    filter.skip = params1.skip;
    filter.limit = params1.limit;
    delete filter.skip;
    delete filter.limit;
    filter = {
      ...filter,
      ...params1,
    };
    if (this.props.history.value) {
      filter.filter.typeContract = this.props.history.value;
      this.props.onGetContracts(serialize(filter));
    } else {
      this.props.onGetContracts(serialize(filter));
    }
  };

  handleCloseDelete = () => {
    this.setState({ onDelete: false });
  };
}

Contract.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  contract: makeSelectContract(),
  profile: makeSelectEditProfilePage(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetContracts: query => {
      dispatch(getContract(query));
    },
    onDeleteContract: body => {
      dispatch(deleteContract(body));
    },
    onUpdate: body => {
      dispatch(UpdateStatusAct(body));
    },
    onChangeTab: val => {
      dispatch(changeTabAct(val));
    },
    mergeDataContract: val => {
      dispatch(mergeDataContract(val));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'contract', reducer });
const withSaga = injectSaga({ key: 'contract', saga });

export default compose(
  injectIntl,
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles, { withTheme: true }),
)(Contract);
const customContent = [
  {
    title: 'Mã căn hộ',
    fieldName: 'apartmentCode',
    type: 'string',
  },
  {
    title: 'Khách hàng',
    fieldName: 'customerIdName',
    type: 'string',
  },
  {
    title: 'Người tạo',
    fieldName: 'createdByName',
    type: 'string',
  },
];
