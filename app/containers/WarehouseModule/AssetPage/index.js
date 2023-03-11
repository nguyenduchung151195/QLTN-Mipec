/**
 *
 * AssetPage
 *
 */

import React, { useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid, Paper, Typography, withStyles } from '@material-ui/core';
import Buttons from 'components/CustomButtons/Button';
import { DateTimePicker } from 'material-ui-pickers';
import dot from 'dot-object';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAssetPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { AsyncAutocomplete, Grid as GridLT } from '../../../components/LifetekUi';
import {
  API_ASSET,
  API_ORIGANIZATION,
  API_TAG_STOCK,
  API_USERS,
  API_ASSET_TYPE_STOCK,
} from '../../../config/urlConfig';
import ListPage from '../../../components/List';
import styles from './styles';
import { Breadcrumbs } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import { setTabIndex } from './actions';

const tabs = [
  {
    name: 'Tất cả',
    index: -1,
  },
  {
    name: 'Đang sử dụng',
    index: 0,
  },
  {
    name: 'Bảo hành',
    index: 1,
  },
  {
    name: 'Bảo trì',
    index: 2,
  },
  {
    name: 'Hỏng',
    index: 3,
  },
  {
    name: 'Mất',
    index: 4,
  },
  {
    name: 'Thanh lý',
    index: 5,
  },
];

const extraColumns = [
  { checked: true, name: 'amount', order: 46, title: 'TỔNG SỐ LƯỢNG' },
  // { checked: true, name: "inventory", order: 47, title: "HÀNG TỒN KHO", }
];

const CustomName = props => (
  <Typography
    component="div"
    style={{ fontSize: '13px', cursor: 'pointer', color: '#0795db' }}
    onClick={() => props.callBack('custom-click', props.item.originItem, 'name')}
  // onClick={() => props.customClick('name')}
  >
    {props.item.name}
  </Typography>
);
const CustomTotal = memo(props => {
  const item = dot.object(props.item);
  if (!item.isService) {
    let amount = 0;
    let text = 0;
    if (item.sellingPoint) {
      item.sellingPoint.forEach(item1 => {
        amount += item1.amount;
      });
      text = `${amount} ${item.unit && item.unit.name ? item.unit.name : ''}`;
    }
    return (
      <Typography
        component="div"
        style={{ fontSize: '13px', cursor: 'pointer', color: '#0795db' }}
        // onClick={() => props.customClick('total')}
        onClick={() => props.callBack('custom-click', props.item, 'amount')}
      >
        {text}
      </Typography>
    );
  }
  return <Typography component="div">là dịch vụ</Typography>;
});
function AssetPage(props) {
  const { classes, assetPage, setTabIndex } = props;

  const { tabIndex } = assetPage;

  // const [tabIndex, setTabIndex] = useState(0);

  const [filter, setFilter] = useState({ level: 0 });

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  const [tag, setTag] = useState(null);

  const [employee, setEmployee] = useState(null);

  const [org, setOrg] = useState(null);
  const [state, setState] = useState({});

  useEffect(
    () => {
      if (tabIndex === -1) {
        setFilter({ level: 0 });
      } else if (tabIndex > 5) {
        setFilter({ level: 0 });
      } else {
        setFilter({
          ...filter,
          assetStatus: tabIndex,
        });
      }
    },
    [tabIndex],
  );

  const callBack = (cmd, data, msg) => {
    console.log(cmd, data, msg);
    const dataNew = data && dot.object(data);
    switch (cmd) {
      case 'custom-click':
        switch (msg) {
          case 'name':
            setState({ openDetail: true, currentProduct: dataNew });
            break;
          case 'amount':
            setState({ openInventory: true, currentProduct: dataNew });
            break;
          case 'inventory':
            setState({ openToEdit: true, currentProduct: dataNew });

            break;
        }
        break;

      default:
        break;
    }
  };

  const mapFunctionProject = item => {
    console.log(item);
    return {
      ...item,
      name: <CustomName item={item} callBack={callBack} />,
      // total: <CustomTotal item={item.originItem} callBack={callBack} />,
      unit: item['unit.name'] || '',
      supplierId: item['supplierId.name'] || '',
      type: item['type.name'] || '',
      amount: !item.amount ? '0' : item.amount,
      level:
        item.level === 0
          ? 'Chưa cấp phát'
          : item.level === 1
            ? 'Đã cấp phát'
            : item.level === 2
              ? 'Thu hồi'
              : '',
      assetStatus:
        item.assetStatus === 0
          ? 'Đang hoạt động'
          : item.assetStatus === 1
            ? 'Bảo hành'
            : item.assetStatus === 2
              ? 'Bảo trì'
              : item.assetStatus === 3
                ? 'Hỏng'
                : item.assetStatus === 4
                  ? 'Mất'
                  : item.assetStatus === 5
                    ? 'Thanh lý'
                    : '',
    };
  };

  const addNewAssert = () => {
    props.history.push('/Stock/asset/add');
  };

  const addLiquidation = () => {
    props.history.push('/Stock/Liquidation/add');
  };

  const editLiquidation = item => {
    props.history.push(`/Stock/Liquidation/${item._id}`);
  };

  const handleChangeTab = index => {
    setTabIndex(index);
    // if (index === -1) {
    //   setFilter({ level: 0 });
    // } else if (index > 5) {
    //   setFilter({ level: 0 });
    // } else {
    //   setFilter({
    //     ...filter,
    //     assetStatus: index,
    //   });
    // }
  };

  const ButtonUI = props => (
    <Buttons
      onClick={() => handleChangeTab(props.index)}
      color={props.index === tabIndex ? 'gradient' : 'simple'}
    >
      {props.children}
    </Buttons>
  );

  return (
    <div>
      <Paper className={classes.breadcrumbs}>
        <Grid container spacing={24}>
          <Grid item xs={12} style={{ margin: 2 }}>
            <Breadcrumbs aria-label="Breadcrumb">
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
                Dashboard
              </Link>
              <Typography color="textPrimary">Tài sản </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
      <Paper>
        <GridLT container spacing={16}>
          <Grid item sm={12}>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <Grid container spacing={8}>
                  {tabIndex !== 7 &&
                    tabIndex !== 8 && (
                      <Grid item xs={3}>
                        <AsyncAutocomplete
                          name="Chọn loại..."
                          label="Loại"
                          onChange={value => {
                            setTag(value);
                            if (value) {
                              setFilter({
                                ...filter,
                                type: value._id,
                              });
                            } else {
                              let tempFilter = filter;
                              delete tempFilter.type;
                              setFilter(tempFilter);
                            }
                          }}
                          url={API_ASSET_TYPE_STOCK}
                          value={tag}
                        />
                      </Grid>
                    )}

                  {(tabIndex === 7 || tabIndex === 8) && (
                    <React.Fragment>
                      <Grid item xs={3}>
                        <DateTimePicker
                          inputVariant="outlined"
                          format="DD/MM/YYYY HH:mm"
                          value={startDate}
                          variant="outlined"
                          label="Ngày bắt đầu"
                          margin="dense"
                          fullWidth
                          onChange={date => setStartDate(date)}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <DateTimePicker
                          inputVariant="outlined"
                          format="DD/MM/YYYY HH:mm"
                          value={endDate}
                          variant="outlined"
                          label="Ngày kết thúc"
                          fullWidth
                          margin="dense"
                          onChange={date => setEndDate(date)}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <AsyncAutocomplete
                          name="Chọn phòng ban..."
                          label="Phòng/ban"
                          onChange={value => setOrg(value)}
                          url={API_ORIGANIZATION}
                          value={org}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <AsyncAutocomplete
                          name="Chọn nhân viên..."
                          label="nhân viên"
                          onChange={value => setEmployee(value)}
                          url={API_USERS}
                          value={employee}
                        />
                      </Grid>
                    </React.Fragment>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={12}>
            <Grid container>
              {tabs.map(tab => (
                <Grid item>
                  <ButtonUI index={tab.index} onClick={() => setTabIndex(tab.index)}>
                    {tab.name}
                  </ButtonUI>
                </Grid>
              ))}
            </Grid>
          </Grid>
          {tabIndex !== 9 ? (
            <Grid item xs={12}>
              <ListPage
                titleHeader='Quản lý tài sản'
                code="Asset"
                apiUrl={API_ASSET}
                mapFunction={mapFunctionProject}
                filter={filter}
                addFunction={addNewAssert}
                exportExcel
                extraColumns={extraColumns}
              />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <ListPage
                titleHeader='Quản lý tài sản'
                code="Asset"
                apiUrl={API_ASSET}
                mapFunction={mapFunctionProject}
                filter={filter}
                addFunction={addLiquidation}
                onEdit={editLiquidation}
                exportExcel
              />
            </Grid>
          )}
        </GridLT>
      </Paper>
    </div>
  );
}

AssetPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  assetPage: makeSelectAssetPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    setTabIndex: tabIndex => dispatch(setTabIndex(tabIndex)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'assetPage', reducer });
const withSaga = injectSaga({ key: 'assetPage', saga });

export default compose(
  withReducer,
  withSaga,
  withStyles(styles),
  withConnect,
)(AssetPage);
