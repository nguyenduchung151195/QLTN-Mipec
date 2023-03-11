/**
 *
 * TowerContractPage
 *
 */

import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import {
  Grid,
  Step,
  StepLabel,
  Stepper,
  Button,
  TextField,
  MenuItem,
  Paper,
  Typography,
  withStyles,
} from '@material-ui/core';
import { ValidatorForm } from 'react-material-ui-form-validator';
import Buttons from 'components/CustomButtons/Button';
import makeSelectTowerContractPage from '../selectors';
import reducer from '../reducer';
import saga from '../saga';
import * as actions from '../actions';
import { fetchAllStatusAction } from '../actions';
import {
  API_CONTRACT_BY_APARTMENT,
  API_CUSTOMERS,
  API_STOCK,
  API_TASK_CONTRACT_PROJECT,
  API_TOWER_APARTMENT,
  API_TOWER_FLOOR,
  GET_CONTRACT,
  API_FEE,
} from '../../../../config/urlConfig';
import { Grid as GridLT, AsyncAutocomplete } from '../../../../components/LifetekUi';
import WaterInvoiceTab from './tabs/WaterInvoiceTab';
import ElectricianInvoiceTab from './tabs/ElectricianInvoiceTab';
import ServiceInvoiceTab from './tabs/ServiceInvoiceTab';
import { Link } from 'react-router-dom';
import styles from '../styles';
import { Breadcrumbs } from '@material-ui/lab';
import { DatePicker } from 'material-ui-pickers';
import VehicleInvoiceTab from './tabs/VehicleInvoiceTab';
import MaintenanceInvoiceTab from './tabs/MaintenanceInvoiceTab';
import GroundInvoiceTab from './tabs/GroundInvoiceTab';
import moment, { months } from 'moment';
import CustomDatePicker from 'components/CustomDatePicker';
import CustomAppBar from 'components/CustomAppBar';
import { serialize } from 'utils/common';
import { changeSnackbar } from 'containers/Dashboard/actions';
import makeSelectCrmConfigPage from '../selectors';
import makeSelectDashboardPage, { makeSelectMiniActive } from '../../../Dashboard/selectors';

function KanbanStep(props) {
  const { kanbanStatus, currentStatus, onChange } = props;
  // eslint-disable-next-line eqeqeq
  const idx = kanbanStatus && kanbanStatus.findIndex(i => i.type == currentStatus);
  return (
    <Stepper style={{ background: 'transparent' }} activeStep={idx}>
      {kanbanStatus.map((item, i) => (
        <Step key={item.code} onClick={() => onChange(item.code)}>
          <StepLabel style={{ cursor: 'pointer' }}>{item.name}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

const listTags = ['Ô tô 1', 'Ô tô 2', 'Xe máy', 'Xe đạp', 'Xe đạp điện'];
function AddTowerContractPage(props) {
  // console.clear();
  const kanbanStatusSt = JSON.parse(localStorage.getItem('crmStatus'));
  const kanbanStatusSt1 =
    kanbanStatusSt && kanbanStatusSt.find(item => item.code === 'trangthaithongbaophi');

  const kanbanStatus = kanbanStatusSt1 && kanbanStatusSt1.data;
  const { classes } = props;

  const {
    towerContractPage,
    match,
    history,
    createContract,
    updateContract,
    getFee,
    cleanup,
    location,
  } = props;
  const { fee, createSuccess, updateSuccess } = towerContractPage;
  const [customer, setCustomer] = useState(null);

  const [contract, setContract] = useState(null);

  const [month, setMonth] = useState(null);

  const [paymentTerm, setPaymentTerm] = useState(null);

  // const [fromDate, setFromDate] = useState(null);

  const [fromDateWater, setFromDateWater] = useState(null);

  const [fromDateVehicle, setFromDateVehicle] = useState(null);

  const [fromDateElect, setFromDateElect] = useState(null);

  const [fromDateGroup, setFromDateGroup] = useState(null);

  const [fromDateMainten, setFromDateMainten] = useState(null);

  const [fromDateService, setFromDateService] = useState(null);

  // const [toDate, setToDate] = useState(null);

  const [toDateWater, setToDateWater] = useState(null);

  const [toDateVehicle, setToDateVehicle] = useState(null);

  const [toDateElect, setToDateElect] = useState(null);

  const [toDateGroup, setToDateGroup] = useState(null);

  const [toDateMainten, setToDateMainten] = useState(null);

  const [toDateService, setToDateService] = useState(null);

  const [tabIndex, setTabIndex] = useState(0);

  const [services, setServices] = useState([]);

  const [vehicles, setVehicles] = useState([]);

  const [grounds, setGrounds] = useState([]);

  const [maintenances, setMaintenances] = useState([]);

  const [waterInvoice, setWaterInvoice] = useState({});

  const [electricianInvoice, setElectricianInvoice] = useState({});

  const [vehicleInvoice, setVehicleInvoice] = useState({});

  const [newListVehicles, setNewListVehicles] = useState(vehicles);

  const [elecProduct, setElecProduct] = useState({});

  const [waterProduct, setWaterProduct] = useState({});

  const [status, setStatus] = useState(1);

  const [newVehicles, setNewVehicles] = useState([]);

  const [listElectric, setListElectric] = useState([]);
  const [resFee, setResFee] = useState([]);
  const [electrictInvoices, setElectrictInvoices] = useState([]);

  const [elct, setELct] = useState([]);

  const [electricOnePrice, setElectrictOnePrice] = useState([]);

  const [waterLists, setWaterLists] = useState([]);

  const [productsWater, setProductsWater] = useState([]);

  const [waterCharge, setWaterCharge] = useState([]);

  const [towerFeeList, setTowerFeeList] = useState([]);

  const setTimeoutSubmit = useRef();

  const [isReadySubmit, setIsReadySubmit] = useState(false);

  const [isEditPage, setIsEditPage] = useState(false);

  const [arrVehicles, setArrVehicles] = useState([]);
  const [checkCount, setCheckCount] = useState(false);
  const [type, setType] = useState('');
  useEffect(() => {
    if (match.params && match.params.id !== 'add') {
      setIsEditPage(true);
      getFee(match.params.id);
    }
    return () => {
      setIsEditPage(false);
      cleanup();
    };
  }, []);

  // useEffect(() => {
  //   const refs = window.location.href.split('/')[window.location.href.split('/').length - 1];
  //   setType(refs);
  //   //  props.onGetCRMStatus(refs ? refs : type);
  // }, []);
  // useEffect(() => {
  //   console.log('kanban....', props.crmConfigPage);
  // });
  useEffect(
    () => {
      if (fee) {
        if (fee.count > 0) {
          setCheckCount(true);
        }
        if (fee.contractId) {
          setContract(fee.contractId);
          if (fee.contractId.customerId) {
            setCustomer(fee.contractId.customerId);
          }
        }
        //set lại giá trị cho danh sách điện
        let listElectrict = [];
        if (fee.electricityCharge) {
          Object.keys(fee.electricityCharge)
            .filter(f => Number(f) || f == 0)
            .map(item => {
              listElectrict.push(fee.electricityCharge[item]);
            });
          fee.electricityCharge.totalMoney = listElectric.reduce(
            (total, el) => (total += el.totalMoney),
            0,
          );
        }
        listElectrict = listElectrict.map((item, index) => {
          let { asset = [], updateAsset = [] } = item;
          asset = asset.map((asset, index) => {
            const findIndex = updateAsset.findIndex(f => f.asset === asset._id);
            if (findIndex !== -1 && Array.isArray(updateAsset) && updateAsset.length > 0) {
              return {
                ...asset,
                fromValue:
                  updateAsset[findIndex] && updateAsset[findIndex].fromValue
                    ? updateAsset[findIndex].fromValue
                    : null,
                toValue:
                  updateAsset[findIndex] && updateAsset[findIndex].toValue
                    ? updateAsset[findIndex].toValue
                    : null,
              };
            }
            return asset;
          });
          let totalValue = 0;
          Array.isArray(updateAsset) &&
            updateAsset.map((as, i) => {
              totalValue +=
                (Number(as.toValue) - Number(as.fromValue)) * Number(as.coefficient || 1);
            });
          return {
            ...item,
            asset: asset,
            totalValue: totalValue,
          };
        });
        console.log('listElectrict', listElectrict);

        //set lại giá trị cho danh sách nước
        let listWaterFee = [];
        const waterFee = fee.waterCharge;
        if (waterFee) {
          Object.keys(waterFee)
            .filter(f => Number(f) || f == 0)
            .map(item => {
              listWaterFee.push(waterFee[item]);
            });
          waterFee.totalMoney = listWaterFee.reduce((total, el) => (total += el.totalMoney), 0);
        }
        listWaterFee = listWaterFee.map((item, index) => {
          let { asset = [], updateAsset = [] } = item;
          asset = asset.map((asset, index) => {
            const findIndex = updateAsset.findIndex(f => f.asset === asset._id);
            if (findIndex !== -1 && Array.isArray(updateAsset) && updateAsset.length > 0) {
              return {
                ...asset,
                fromValue:
                  updateAsset[findIndex] && updateAsset[findIndex].fromValue
                    ? updateAsset[findIndex].fromValue
                    : null,
                toValue:
                  updateAsset[findIndex] && updateAsset[findIndex].toValue
                    ? updateAsset[findIndex].toValue
                    : null,
              };
            }
            return asset;
          });
          let totalValue = 0;
          Array.isArray(updateAsset) &&
            updateAsset.map((as, i) => {
              totalValue +=
                (Number(as.toValue) - Number(as.fromValue)) * Number(as.coefficient || 1);
            });
          return {
            ...item,
            asset: asset,
            totalValue: totalValue,
          };
        });
        console.log('fee222', listWaterFee);

        const elecFee = fee.electricityCharge;
        const services = fee.serviceCharge.map((c, index) => ({ ...c, index }));
        const vehicleFee = fee.carCharge;
        const groupFee = fee.groundCharge;
        const maintenFee = fee.maintenanceCharge;
        setServices(services);
        // setWaterInvoice(waterFee);

        // if (Array.isArray(listElectrict) && listElectrict.length > 1) {
        //   setElectrictInvoices(listElectrict);
        // } else {
        //   setElectricianInvoice(elecFee);
        // }

        if (Array.isArray(listElectrict) && listElectrict.length) {
          setElectrictInvoices(listElectrict);
        }
        if (Array.isArray(listWaterFee) && listWaterFee.length) {
          setWaterInvoice(listWaterFee);
        }
        // setVehicleInvoice(vehicleFee);
        setVehicles(vehicleFee);
        setGrounds(groupFee);
        setMaintenances(maintenFee);
        setMonth(moment(fee.date));
        setPaymentTerm(moment(fee.datePaymentTerm));
        setStatus(Number(fee.kanbanStatus));
      }
    },
    [fee],
  );

  useEffect(
    () => {
      if (createSuccess && createSuccess === true) {
        history.goBack();
      }
    },
    [createSuccess],
  );

  useEffect(
    () => {
      if (updateSuccess && updateSuccess === true) {
        history.goBack();
      }
    },
    [updateSuccess],
  );

  useEffect(
    () => {
      if (month) {
        // setFromDate(month.clone().startOf('month'));
        // setToDate(month.clone().endOf('month'));
        setFromDateWater(month.clone().startOf('month'));
        setToDateWater(month.clone().endOf('month'));
        setFromDateVehicle(month.clone().startOf('month'));
        setToDateVehicle(month.clone().endOf('month'));
        setFromDateElect(month.clone().startOf('month'));
        setToDateElect(month.clone().endOf('month'));
        setFromDateGroup(month.clone().startOf('month'));
        setToDateGroup(month.clone().endOf('month'));
        setFromDateMainten(month.clone().startOf('month'));
        setToDateMainten(month.clone().endOf('month'));
        setFromDateService(month.clone().startOf('month'));
        setToDateService(month.clone().endOf('month'));
      }
    },
    [month],
  );

  useEffect(
    () => {
      if (!isEditPage) {
        if (contract) {
          if (contract.customerId) {
            setCustomer(contract.customerId);
          }
          fetch(`${GET_CONTRACT}/${contract._id}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
            .then(data => data.json())
            .then(response => {
              if (response.listProduct) {
                const { listProduct, vehicleList } = response;
                const newVehicleList = vehicleList.filter(
                  f =>
                    f.product.tags &&
                    listTags.includes(
                      f.product && Array.isArray(f.product.tags)
                        ? f.product.tags[0]
                        : f.product.tags,
                    ),
                );
                const serviceList = [];
                // const vehicleList = [];
                const groundList = [];
                const maintenanceList = [];
                let electricts = [];
                let waterList = [];
                for (let i = 0; i < listProduct.length; i++) {
                  const product = listProduct[i];
                  if (
                    (product && product.name) ||
                    (product.dataProduct && product.dataProduct.catalog)
                  ) {
                    let name = (product.name && product.name.split(' ')) || [];

                    if (
                      name.indexOf('Điện') !== -1 ||
                      product.dataProduct.catalog.name === 'Điện'
                    ) {
                      setElecProduct(product);
                      electricts.push(product);
                    } else if (
                      name.indexOf('Nước') !== -1 ||
                      product.dataProduct.catalog.name === 'nước' ||
                      product.dataProduct.catalog.name === 'Nước'
                    ) {
                      // setWaterProduct(product);
                      waterList.push(product);
                    } else if (product.dataProduct.catalog.name === 'Dịch vụ') {
                      serviceList.push(product);
                    }
                    // else if (product.dataProduct.catalog.name === "Xe") {
                    //   vehicleList.push(product);
                    // }
                    else if (product.dataProduct.catalog.name === 'Mặt bằng') {
                      groundList.push(product);
                    } else if (product.dataProduct.catalog.name === 'Bảo trì') {
                      maintenanceList.push(product);
                    }
                  }
                }
                setResFee(response);
                setListElectric(electricts);
                setWaterLists(waterList);
                setServices(serviceList);
                // setVehicles(vehicleList);
                setVehicles(newVehicleList);
                setGrounds(groundList);
                setMaintenances(maintenanceList);
              }
            });
        }
      }
    },
    [contract],
  );

  useEffect(
    () => {
      const query = {
        limit: 1,
        skip: 0,
        sort: '-periodStr',
        filter: {
          $or: [
            {
              apartmentCode: {
                $regex: contract ? contract.apartmentCode : null,
                $options: 'gi',
              },
            },
          ],
        },
      };
      fetch(`${API_FEE}?${serialize(query)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(data => data.json())
        .then(response => {
          setTowerFeeList(response.data);
        });
    },
    [contract],
  );

  useEffect(
    () => {
      //Chưa có thông báo phí nào cho mã căn này
      if (!towerFeeList.length || towerFeeList.length <= 0) {
        setIsReadySubmit(true);
        if (Array.isArray(electrictInvoices) && electrictInvoices.length > 0) {
          console.log('electrictInvoices', electrictInvoices);
          setElectrictOnePrice(electrictInvoices);
        } else {
          const newArray = Array.isArray(listElectric)
            ? listElectric.map((item, index) => {
              const allPrice =
                !isNaN(item.allPrice) && Number(item.allPrice) > 0
                  ? Number(item.allPrice)
                  : item.dataProduct &&
                    item.dataProduct.pricePolicy &&
                    !isNaN(item.dataProduct.pricePolicy.allPrice)
                    ? Number(item.dataProduct.pricePolicy.allPrice)
                    : 0;
              const vat =
                !isNaN(item.vat) && Number(item.vat) > 0
                  ? Number(item.vat)
                  : item.dataProduct && !isNaN(item.dataProduct.tax)
                    ? Number(item.dataProduct.tax)
                    : 0;
              const totalMoney =
                (allPrice > 0 ? allPrice * (1 + vat / 100) : item.totalMoney) || 0;
              return {
                ...item,
                totalMoney: totalMoney,
              };
            })
            : [];
          // setElectrictOnePrice(listElectric)
          console.log('1111', newArray);
          setElectrictOnePrice(newArray);
        }
      }
      // Đã có thông báo phí cho mã căn này
      if (Array.isArray(towerFeeList) && towerFeeList.length > 0) {
        const lastFee = towerFeeList[0];
        const elctLastFee = lastFee.electricityCharge;
        const periodStrOfLastFee = lastFee.periodStr;
        const nextPeriodStr = moment(periodStrOfLastFee, 'YYYY-MM')
          .add(1, 'M')
          .format('YYYY-MM');
        const currentPeriodStr = month ? moment(month).format('YYYY-MM') : null;
        const isReadySubmit = currentPeriodStr === nextPeriodStr ? true : false;
        if (isEditPage) {
          setIsReadySubmit(true);
        } else {
          setIsReadySubmit(isReadySubmit);
        }
        const listElct = electrictInvoices.length > 0 ? electrictInvoices : listElectric || [];

        const newArray =
          Array.isArray(listElct) && listElct.length > 0
            ? listElct.map((Electric, elctIndex) => {
              let { asset = [] } = Electric;
              asset =
                !isEditPage && Array.isArray(Electric.asset)
                  ? Electric.asset.map((item, index) => {
                    const currentId = item._id;
                    const fromValue = resFee.elecFromValue
                      ? resFee.elecFromValue
                      : (elctLastFee[elctIndex] &&
                        elctLastFee[elctIndex].updateAsset.find(f => f.asset === currentId) &&
                        elctLastFee[elctIndex].updateAsset.find(f => f.asset === currentId)
                          .toValue) ||
                      (elctLastFee[elctIndex] && elctLastFee[elctIndex].asset.meterNumber) ||
                      0;
                    console.log(
                      elctLastFee[elctIndex] &&
                      elctLastFee[elctIndex].updateAsset.find(f => f.asset === currentId),
                      elctLastFee[elctIndex] &&
                      elctLastFee[elctIndex].updateAsset.find(f => f.asset === currentId) &&
                      elctLastFee[elctIndex].updateAsset.find(f => f.asset === currentId)
                        .toValue,
                    );
                    return {
                      ...item,
                      fromValue: fromValue,
                    };
                  })
                  : asset;
              const allPrice =
                !isNaN(Electric.allPrice) && Number(Electric.allPrice) > 0
                  ? Number(Electric.allPrice)
                  : Electric.dataProduct &&
                    Electric.dataProduct.pricePolicy &&
                    !isNaN(Electric.dataProduct.pricePolicy.allPrice)
                    ? Number(Electric.dataProduct.pricePolicy.allPrice)
                    : 0;
              const vat =
                !isNaN(Electric.vat) && Number(Electric.vat) > 0
                  ? Number(Electric.vat)
                  : Electric.dataProduct && !isNaN(Electric.dataProduct.tax)
                    ? Number(Electric.dataProduct.tax)
                    : 0;
              const totalMoney =
                (allPrice > 0 ? allPrice * (1 + vat / 100) : Electric.totalMoney) || 0;
              return {
                ...Electric,
                asset: asset,
                totalMoney: totalMoney,
              };
            })
            : [];
        // setElectrictOnePrice(listElectric)
        console.log('2222', newArray);

        setElectrictOnePrice(newArray);
      }
    },
    [electrictInvoices, listElectric, month],
  );

  useEffect(
    () => {
      if (!towerFeeList.length || towerFeeList.length <= 0) {
        if (Array.isArray(waterInvoice) && waterInvoice.length > 0) {
          console.log('waterInvoice', waterInvoice);
          setProductsWater(waterInvoice);
        } else {
          const newArray = Array.isArray(waterLists)
            ? waterLists.map((item, index) => {
              const allPrice =
                !isNaN(item.allPrice) && Number(item.allPrice) > 0
                  ? Number(item.allPrice)
                  : item.dataProduct &&
                    item.dataProduct.pricePolicy &&
                    !isNaN(item.dataProduct.pricePolicy.allPrice)
                    ? Number(item.dataProduct.pricePolicy.allPrice)
                    : 0;
              const vat =
                !isNaN(item.vat) && Number(item.vat) > 0
                  ? Number(item.vat)
                  : item.dataProduct && !isNaN(item.dataProduct.tax)
                    ? Number(item.dataProduct.tax)
                    : 0;
              const env =
                !isNaN(item.vatEnv) && Number(item.vatEnv)
                  ? Number(item.vatEnv)
                  : item.dataProduct && !isNaN(item.dataProduct.environment)
                    ? Number(item.dataProduct.environment)
                    : 0;
              const totalMoney =
                (allPrice > 0 ? allPrice * (1 + (vat + env) / 100) : item.totalMoney) || 0;
              return {
                ...item,
                totalMoney: totalMoney,
              };
            })
            : [];
          console.log(646, newArray);
          setProductsWater(newArray);
          // setProductsWater(waterLists)
        }
        setIsReadySubmit(true);
      }
      if (Array.isArray(towerFeeList) && towerFeeList.length > 0) {
        const lastFee = towerFeeList[0];
        const waterLastFee = lastFee.waterCharge;
        const periodStrOfLastFee = lastFee.periodStr;
        const nextPeriodStr = moment(periodStrOfLastFee, 'YYYY-MM')
          .add(1, 'M')
          .format('YYYY-MM');
        const currentPeriodStr = month ? moment(month).format('YYYY-MM') : null;
        const isReadySubmit = currentPeriodStr === nextPeriodStr ? true : false;
        console.log(currentPeriodStr, nextPeriodStr);
        if (isEditPage) {
          setIsReadySubmit(true);
        } else {
          setIsReadySubmit(isReadySubmit);
        }
        const listWater = waterInvoice.length > 0 ? waterInvoice : waterLists;
        console.log('listWater 667', listWater);
        const newArray =
          Array.isArray(listWater) && listWater.length > 0
            ? listWater.map((water, waterIndex) => {
              let { asset = [] } = water;
              asset =
                !isEditPage && Array.isArray(water.asset)
                  ? water.asset.map((item, index) => {
                    const currentId = item._id;
                    const fromValue = resFee.waterFromValue
                      ? resFee.waterFromValue
                      : (waterLastFee[waterIndex] &&
                        waterLastFee[waterIndex].updateAsset.find(
                          f => f.asset === currentId,
                        ) &&
                        waterLastFee[waterIndex].updateAsset.find(f => f.asset === currentId)
                          .toValue) ||
                      (waterLastFee[waterIndex] &&
                        waterLastFee[waterIndex].asset.meterNumber) ||
                      0;
                    return {
                      ...item,
                      fromValue: fromValue,
                    };
                  })
                  : asset;

              const allPrice =
                !isNaN(water.allPrice) && Number(water.allPrice) > 0
                  ? Number(water.allPrice)
                  : water.dataProduct &&
                    water.dataProduct.pricePolicy &&
                    !isNaN(water.dataProduct.pricePolicy.allPrice)
                    ? Number(water.dataProduct.pricePolicy.allPrice)
                    : 0;
              const vat =
                !isNaN(water.vat) && Number(water.vat) > 0
                  ? Number(water.vat)
                  : water.dataProduct && !isNaN(water.dataProduct.tax)
                    ? Number(water.dataProduct.tax)
                    : 0;
              const env =
                !isNaN(water.vatEnv) && Number(water.vatEnv)
                  ? Number(water.vatEnv)
                  : water.dataProduct && !isNaN(water.dataProduct.environment)
                    ? Number(water.dataProduct.environment)
                    : 0;
              const totalMoney =
                (allPrice > 0 ? allPrice * (1 + (vat + env) / 100) : water.totalMoney) || 0;
              return {
                ...water,
                asset: asset,
                totalMoney: totalMoney,
              };
            })
            : [];
        console.log('newArray 721', newArray);
        setProductsWater(newArray);
      }
    },
    [waterInvoice, waterLists, month],
  );

  const handleSubmit = () => {
    //props.history.push('/tower');
    const serviceCharge = [];
    let carCharge = [];
    const maintenanceCharge = [];
    const groundCharge = [];
    const waterArr =
      Array.isArray(waterCharge) && waterCharge.length > 0
        ? waterCharge
        : Array.isArray(waterInvoice)
          ? waterInvoice
          : [];
    console.log(740, waterArr, waterCharge, waterInvoice);
    // const newWaterCharge = waterCharge.map((x, i) => {
    const newWaterCharge = waterArr.map((x, i) => {
      const asset = [];
      const vat =
        (Number(x.vat) > 0
          ? Number(x.vat)
          : x.dataProduct && !isNaN(x.dataProduct.tax) && Number(x.dataProduct.tax)) || 0;
      const vatEnv =
        (Number(x.vatEnv) > 0
          ? Number(x.vatEnv)
          : x.dataProduct &&
          !isNaN(x.dataProduct.environment) &&
          Number(x.dataProduct.environment)) || 0;
      const updateAsset = [];
      Array.isArray(x.updateAsset) &&
        x.updateAsset.map((item, index) => {
          let newAsset = {
            code: item.asset && item.asset[0] ? item.asset[0].code : item.code,
            name: item.asset && item.asset[0] ? item.asset[0].name : item.name,
            _id: item.asset && item.asset[0] ? item.asset[0]._id : item._id,
          };
          asset.push(newAsset);
          console.log(
            762,
            Number(item.toValue) > Number(item.fromValue) ? item.toValue : item.fromValue,
          );
          updateAsset.push({
            asset: newAsset,
            fromValue: resFee.waterFromValue ? resFee.waterFromValue : item.fromValue,
            toValue: Number(item.toValue) > Number(item.fromValue) ? item.toValue : item.fromValue,
            totalValueAsset: item.totalValueAsset,
            coefficient: item.coefficient,
          });
        });
      return {
        ...x,
        asset: asset,
        updateAsset: updateAsset,
        priceLadderList:
          (Array.isArray(x.priceLadderList) && x.priceLadderList.length > 0
            ? x.priceLadderList
            : x.dataProduct &&
            x.dataProduct.pricePolicy &&
            x.dataProduct.pricePolicy.priceLadderList) || [],
        totalValue:
          updateAsset.reduce(
            (total, up) =>
              (total += (Number(up.toValue) - Number(up.fromValue)) * Number(up.coefficient || 1)),
            0,
          ) || 0,
        allPrice:
          (Number(x.allPrice) > 0
            ? Number(x.allPrice)
            : x.dataProduct &&
            x.dataProduct.pricePolicy &&
            !isNaN(x.dataProduct.pricePolicy.allPrice) &&
            Number(x.dataProduct.pricePolicy.allPrice)) || 0,
        costPrice:
          Number(x.costPrice) > 0
            ? Number(x.costPrice)
            : (x.dataProduct &&
              x.dataProduct.pricePolicy &&
              !isNaN(x.dataProduct.pricePolicy.costPrice) &&
              Number(x.dataProduct.pricePolicy.costPrice)) ||
            0,
        vat: vat,
        vatEnv: vatEnv,
        fromValue: resFee.waterFromValue
          ? resFee.waterFromValue
          : Array.isArray(asset) && asset.length === 1
            ? updateAsset[0].fromValue
            : 0,
        toValue: Array.isArray(asset) && asset.length === 1 ? updateAsset[0].toValue : 0,
        taxVat: (Number(x.totalMoney) * vat) / (100 + (vat + vatEnv)),
        taxEnv: (Number(x.totalMoney) * vatEnv) / (100 + (vat + vatEnv)),
      };
    });
    const elctArr =
      Array.isArray(elct) && elct.length > 0
        ? elct
        : Array.isArray(electrictInvoices)
          ? electrictInvoices
          : [];

    // const newElctCharge = elct.map((x, i) => {
    console.log('elctArr', elctArr);
    const newElctCharge = elctArr.map((x, i) => {
      const asset = [];
      const vat =
        (Number(x.vat) > 0
          ? Number(x.vat)
          : x.dataProduct && !isNaN(x.dataProduct.tax) && Number(x.dataProduct.tax)) || 0;
      const updateAsset = [];

      Array.isArray(x.updateAsset) &&
        x.updateAsset.map((item, index) => {
          console.log('item', item);
          let newAsset = {
            code: item.asset && item.asset[0] ? item.asset[0].code : item.code,
            name: item.asset && item.asset[0] ? item.asset[0].name : item.name,
            _id: item.asset && item.asset[0] ? item.asset[0]._id : item._id,
          };
          asset.push(newAsset);
          updateAsset.push({
            asset: newAsset,
            fromValue: resFee.elecFromValue ? resFee.elecFromValue : item.fromValue,
            toValue: Number(item.toValue) > Number(item.fromValue) ? item.toValue : item.fromValue,
            totalValueAsset: item.totalValueAsset,
            coefficient: item.coefficient,
          });
        });
      return {
        ...x,
        asset: asset,
        updateAsset: updateAsset,
        priceLadderList:
          (Array.isArray(x.priceLadderList) && x.priceLadderList.length > 0
            ? x.priceLadderList
            : x.dataProduct &&
            x.dataProduct.pricePolicy &&
            x.dataProduct.pricePolicy.priceLadderList) || [],
        totalValue:
          updateAsset.reduce(
            (total, up) =>
              (total += (Number(up.toValue) - Number(up.fromValue)) * Number(up.coefficient || 1)),
            0,
          ) || 0,
        allPrice:
          (Number(x.allPrice) > 0
            ? Number(x.allPrice)
            : x.dataProduct &&
            x.dataProduct.pricePolicy &&
            !isNaN(x.dataProduct.pricePolicy.allPrice) &&
            Number(x.dataProduct.pricePolicy.allPrice)) || 0,
        costPrice:
          Number(x.costPrice) > 0
            ? Number(x.costPrice)
            : (x.dataProduct &&
              x.dataProduct.pricePolicy &&
              !isNaN(x.dataProduct.pricePolicy.costPrice) &&
              Number(x.dataProduct.pricePolicy.costPrice)) ||
            0,
        vat:
          (Number(x.vat) > 0
            ? Number(x.vat)
            : x.dataProduct && !isNaN(x.dataProduct.tax) && Number(x.dataProduct.tax)) || 0,
        fromValue: resFee.elecFromValue
          ? resFee.elecFromValue
          : Array.isArray(asset) && asset.length === 1
            ? updateAsset[0].fromValue
            : 0,
        toValue: Array.isArray(asset) && asset.length === 1 ? updateAsset[0].toValue : 0,
        taxVat: (Number(x.totalMoney) * vat) / (100 + vat),
      };
    });
    console.log('newElctCharge', newElctCharge);
    if (!contract || !month) {
      return;
    }
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      const dataProduct = service.dataProduct
        ? service.dataProduct
        : service.stockId
          ? service.stockId
          : {};
      const amount = Number(service.amount) > 0 ? Number(service.amount) : 0;
      const price =
        Number(service.costPrice) > 0
          ? Number(service.costPrice)
          : dataProduct.pricePolicy && Number(dataProduct.pricePolicy.costPrice) > 0
            ? Number(dataProduct.pricePolicy && dataProduct.pricePolicy.costPrice)
            : Number(service.price) > 0
              ? Number(service.price)
              : 0;
      const vat =
        Number(dataProduct.tax) > 0
          ? Number(dataProduct.tax)
          : Number(service.vat) > 0
            ? Number(service.vat)
            : 0;
      const totalMoney = amount * price * (1 + vat / 100);
      serviceCharge.push({
        stockId: service.id
          ? service.id
          : service.stockId && service.stockId._id
            ? service.stockId._id
            : '',
        totalMoney: totalMoney,
        amount: amount,
        price: price,
        name: service.name,
        unit: service.unit,
        vat: vat,
      });
    }
    // for (let i = 0; i < newVehicles.length; i++) {
    //   const vehicle = newVehicles[i];
    for (let i = 0; i < arrVehicles.length; i++) {
      const vehicle = arrVehicles[i];
      // vehicle.amount = vehicle.amount || 1;
      // vehicle.costPrice = vehicle.product && vehicle.product.costPrice ? vehicle.product.costPrice : 0;
      carCharge.push({
        name: vehicle.name,
        stockId: vehicle.product ? vehicle.product._id : vehicle.stockId ? vehicle.stockId : '',
        totalMoney: vehicle.totalMoney,
        amount: vehicle.amount,
        price: vehicle.price,
        unit: vehicle.unit,
        carPlate: vehicle.carPlate,
        vat: vehicle.vat,
        tags:
          vehicles.length > 0 &&
          (vehicle.tags
            ? vehicle.tags
            : vehicle.product && vehicle.product.tags
              ? vehicle.product.tags[0]
              : vehicle.stockId && vehicle.stockId.tags
                ? vehicle.stockId.tags[0]
                : ''),
      });
    }
    for (let i = 0; i < maintenances.length; i++) {
      const maintenance = maintenances[i];
      const { amount = 0, costPrice = 0 } = maintenance || {};
      const dataProduct = maintenance.dataProduct ? maintenance.dataProduct : maintenance.stockId;
      const price =
        maintenance.price && Number(maintenance.price) > 0
          ? Number(maintenance.price)
          : Number(costPrice) > 0
            ? Number(costPrice)
            : dataProduct &&
              dataProduct.pricePolicy &&
              Number(dataProduct.pricePolicy.costPrice) > 0
              ? Number(dataProduct.pricePolicy.costPrice)
              : 0;
      const tax =
        maintenance.vat && Number(maintenance.vat) > 0
          ? Number(maintenance.vat)
          : dataProduct && dataProduct.tax && Number(dataProduct.tax) > 0
            ? Number(dataProduct.tax)
            : 0;
      if (maintenance) {
        maintenanceCharge.push({
          stockId: maintenance.id
            ? maintenance.id
            : maintenance.stockId && maintenance.stockId._id
              ? maintenance.stockId._id
              : '',
          name: maintenance.name,
          totalMoney: Number(amount) * Number(price) * (1 + Number(tax) / 100),
          amount: amount,
          price: price,
          vat: tax,
        });
      }
    }

    for (let i = 0; i < grounds.length; i++) {
      const ground = grounds[i];
      let { amount = 0, costPrice = 0 } = ground || {};
      const dataProduct = ground.dataProduct ? ground.dataProduct : ground.stockId;
      const price =
        ground.price && Number(ground.price) > 0
          ? Number(ground.price)
          : Number(costPrice) > 0
            ? Number(costPrice)
            : dataProduct &&
              dataProduct.pricePolicy &&
              Number(dataProduct.pricePolicy.costPrice) > 0
              ? Number(dataProduct.pricePolicy.costPrice)
              : 0;
      const tax =
        ground.vat && Number(ground.vat) > 0
          ? Number(ground.vat)
          : dataProduct && dataProduct.tax && Number(dataProduct.tax) > 0
            ? Number(dataProduct.tax)
            : 0;
      groundCharge.push({
        stockId: ground.id
          ? ground.id
          : ground.stockId && ground.stockId._id
            ? ground.stockId._id
            : '',
        name: ground.name,
        totalMoney: Number(amount) * Number(price) * (1 + Number(tax) / 100),
        amount: Number(amount),
        price: price,
        vat: tax,
      });
    }
    let apartmentCode;
    apartmentCode = contract ? contract.apartmentCode : '';
    const newFees = {
      ...fee,
      contractId: contract._id,
      date: moment(month).toString(),
      // datePaymentTerm: paymentTerm.toDate(),
      // fromDate,
      fromDateWater,
      fromDateVehicle,
      fromDateElect,
      fromDateGroup,
      fromDateMainten,
      fromDateService,
      // toDate,
      toDateWater,
      toDateVehicle,
      toDateElect,
      toDateGroup,
      toDateMainten,
      toDateService,
      period: parseInt(month.format('M')),
      year: moment().year(),
      waterCharge: newWaterCharge,
      taxVAT:
        (Array.isArray(newWaterCharge) &&
          newWaterCharge.reduce((total, water) => (total += water.taxVat), 0)) ||
        0,
      taxEnv:
        (Array.isArray(newWaterCharge) &&
          newWaterCharge.reduce((total, water) => (total += water.taxEnv), 0)) ||
        0,
      waterChargeMoney:
        (Array.isArray(waterArr) &&
          waterArr.reduce((total, water) => (total += water.totalMoney), 0)) ||
        0,
      // waterChargeMoney: Array.isArray(waterCharge) && waterCharge.reduce((total, water) => total += water.totalMoney, 0) || 0,
      groundChargeMoney:
        (groundCharge &&
          Array.isArray(groundCharge) &&
          groundCharge.reduce((total, el) => (total += el.totalMoney), 0)) ||
        0,
      maintenanceChargeMoney:
        (maintenanceCharge &&
          Array.isArray(maintenanceCharge) &&
          maintenanceCharge.reduce((total, el) => (total += el.totalMoney), 0)) ||
        0,
      serviceChargeMoney:
        (serviceCharge &&
          Array.isArray(serviceCharge) &&
          serviceCharge.reduce((total, el) => (total += el.totalMoney), 0)) ||
        0,
      // electricityCharge: listElectric.length === 1 ? elecProduct ? {
      //   stockId: elecProduct.id,
      //   asset: electricianInvoice.asset,
      //   fromValue: electricianInvoice.fromValue,
      //   toValue: electricianInvoice.toValue,
      //   totalMoney: electricianInvoice.totalMoney,
      //   amount: (electricianInvoice.toValue || 0) - (electricianInvoice.fromValue || 0),
      //   priceLadderList: electricianInvoice.priceLadderList,
      // } : null : { totalMoney: electrictInvoices.reduce((total, el) => total += el.totalMoney, 0), ...electrictInvoices },
      electricityCharge: newElctCharge,
      electricityChargeMoney:
        (Array.isArray(newElctCharge) &&
          newElctCharge.length > 0 &&
          newElctCharge.reduce((total, el) => (total += el.totalMoney), 0)) ||
        0,
      // electricityCharge: listElectric.length === 1 ? elecProduct ? [{
      //   stockId: elecProduct.id,
      //   asset: electricianInvoice.asset,
      //   fromValue: electricianInvoice.fromValue,
      //   toValue: electricianInvoice.toValue,
      //   totalMoney: electricianInvoice.totalMoney,
      //   amount: (electricianInvoice.toValue || 0) - (electricianInvoice.fromValue || 0),
      //   priceLadderList: electricianInvoice.priceLadderList,
      // }] : null :elct,
      serviceCharge,
      carChargeMoney:
        (Array.isArray(carCharge) &&
          carCharge.length > 0 &&
          carCharge.reduce((total, el) => (total += el.totalMoney), 0)) ||
        0,
      carCharge,
      maintenanceCharge,
      groundCharge,
      kanbanStatus: status,
      apartmentCode: apartmentCode,
    };
    // if (newFees.waterCharge && newFees.waterCharge.amount < 0) {
    //   return;
    // }
    // if (newFees.electricityCharge && newFees.electricityCharge.amount < 0) {
    //   return;
    // }
    if (!isReadySubmit) {
      return props.onChangeSnackbar({
        status: true,
        message: 'Vui lòng nhập thông báo phí của kỳ gần nhất',
        variant: 'error',
      });
    }
    if (newFees.waterCharge && newFees.waterCharge.totalValue < 0) {
      return;
    }
    if (newFees.electricityCharge && newFees.electricityCharge.amount < 0) {
      return;
    }
    console.log('newFees 1136', newFees);
    if (match.params && match.params.id !== 'add') {
      updateContract(newFees);
    } else {
      createContract(newFees);
    }
  };

  const handleSaveServices = useCallback(
    services => {
      setServices([...services]);
    },
    [services],
  );

  const handleSaveWaterInvoice = useCallback(
    waters => {
      setWaterCharge([...waters]);
    },
    [productsWater],
  );

  const handleSaveElectInvoice = useCallback(
    invoice => {
      if (Array.isArray(invoice)) {
        // setElectrictInvoices([...invoice]);
        setELct([...invoice]);
      } else {
        setElectricianInvoice({ ...invoice });
      }
    },
    [electricianInvoice],
  );
  const handleClose = () => {
    props.history.push('/tower/fee');
  };

  const customFee = option => {
    const customerName = option.apartmentCode ? option.apartmentCode : '';
    if (customerName) {
      return `${customerName}`;
    }
    return '';
  };

  const ButtonUI = props => (
    <Buttons
      onClick={() => setTabIndex(props.index)}
      color={props.index === tabIndex ? 'gradient' : 'simple'}
    >
      {props.children}
    </Buttons>
  );

  // -->xử lý logic cho dịch vụ xe

  const getRangeTime = (fromDate, toDate) => {
    let result = [];
    let rangeTime = moment(toDate).diff(fromDate, 'd');
    let count = 0;

    while (count <= rangeTime) {
      let nextDay = moment(fromDate)
        .add(count, 'day')
        .format('MMYYYY');
      result.push(nextDay);
      count += 1;
    }
    return result;
  };
  useEffect(
    () => {
      if (Array.isArray(vehicles) && vehicles.length > 0) {
        if (!isEditPage) {
          let listVehicle = [];
          const currentMonth = moment(fromDateVehicle).format('MMYYYY');
          vehicles.map(vehicle => {
            const rangeContract = getRangeTime(
              moment(vehicle.searchStartDay, 'YYYY-MM-DD').format('YYYY-MM-DD'),
              moment(vehicle.searchEndDay, 'YYYY-MM-DD').format('YYYY-MM-DD'),
            );
            const newArray = [...new Set(rangeContract)];
            if (newArray.filter(f => f === currentMonth).length > 0) {
              listVehicle.push(vehicle);
            }
          });
          setNewListVehicles(listVehicle);
        } else {
          setNewListVehicles(vehicles);
        }
      }
    },
    [fromDateVehicle, toDateVehicle, vehicles],
  );

  const convertToNumber = obj => {
    if (typeof obj === 'number') return obj;
    else if (typeof obj === 'string') return parseFloat(obj.replace(/,/g, ''));
    else return 0;
  };
  const calcPrice = useCallback(
    vehicle => {
      const costPrice = convertToNumber(
        (vehicle.product && vehicle.product.costPrice) ||
        (vehicle.product &&
          vehicle.product.pricePolicy &&
          vehicle.product.pricePolicy.costPrice) ||
        0,
      );
      const vat =
        vehicle.product && convertToNumber(vehicle.product.tax) > 0
          ? convertToNumber(vehicle.product.tax)
          : vehicle.vat
            ? vehicle.vat
            : 0;
      const amount =
        vehicle.product && vehicle.product.unit && vehicle.product.unit.name === 'Ngày'
          ? convertToNumber(vehicle.amount)
          : 1;
      // return Math.ceil(parseFloat(costPrice) * month * (1 + vat / 100));
      return Math.round(costPrice * amount * (1 + vat / 100));
    },
    [newListVehicles],
  );
  useEffect(
    () => {
      const arr = Array.isArray(newListVehicles)
        ? newListVehicles.map((vehicle, index) => {
          const startDate = fromDateVehicle
            ? moment(vehicle.searchStartDay, 'YYYY-MM-DD').diff(moment(fromDateVehicle), 'day') <
              0
              ? fromDateVehicle
              : vehicle.searchStartDay
            : vehicle.searchStartDay;
          const endtDate = toDateVehicle
            ? moment(vehicle.searchEndDay, 'YYYY-MM-DD').diff(moment(toDateVehicle), 'day') < 0
              ? vehicle.searchEndDay
              : toDateVehicle
            : vehicle.searchEndDay;
          const carPlate = (vehicle.product && vehicle.product.carPlate) || vehicle.carPlate;
          const vehicleName = (vehicle.product && vehicle.product.name) || vehicle.name;
          const vehicleUnit =
            (vehicle.product && vehicle.product.unit && vehicle.product.unit.name) ||
            vehicle.unit;
          const amount =
            vehicle.product && vehicle.product.unit && vehicle.product.unit.name === 'Ngày'
              ? convertToNumber(vehicle.amount)
              : 1;
          const price =
            (vehicle.product &&
              (vehicle.product.costPrice ||
                (vehicle.product.pricePolicy && vehicle.product.pricePolicy.costPrice))) ||
            vehicle.price ||
            0;
          const vat =
            vehicle.product && Number(vehicle.product.tax) > 0
              ? Number(vehicle.product.tax)
              : Number(vehicle.vat) > 0
                ? Number(vehicle.vat)
                : 0;
          const totalMoney =
            (newListVehicles.length > 0 && calcPrice(vehicle)) ||
            price * amount * (1 + vat / 100) ||
            vehicle.totalMoney ||
            0;
          // const unit=

          const item = {
            startDate: startDate,
            endDate: endtDate,
            carPlate: carPlate,
            name: vehicleName,
            unit: vehicleUnit,
            amount: amount,
            price: price,
            vat: vat,
            totalMoney: totalMoney,
          };
          return { ...vehicle, ...item };
        })
        : [];
      setArrVehicles([...arr]);
    },
    [newListVehicles],
  );
  // <--xử lý logic dịch vụ xe
  // --> Xử lý logic bảo trì

  // <-- Xử lý logic bảo trì
  // --> Xử lý logic mặt bằng

  // <-- Xử lý logic mặt bằng
  return (
    <div>
      <CustomAppBar
        title={match.params.id === 'add' ? 'Thêm mới thông báo phí' : 'Cập nhật phí'}
        onGoBack={handleClose}
        onSubmit={() => {
          if (setTimeoutSubmit.current) {
            clearTimeout(setTimeoutSubmit.current);
          }
          setTimeoutSubmit.current = setTimeout(() => {
            handleSubmit();
          }, 200);
        }}
        disabled={location.state === '1'}
      />
      {/* <Paper className={classes.breadcrumbs}>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Breadcrumbs aria-label="Breadcrumb">
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/">
                Dashboard
              </Link>
              <Link style={{ color: '#0795db', textDecoration: 'none' }} to="/tower/fee">
                Thông báo phí
              </Link>
              <Typography color="textPrimary">{match.params.id === 'add' ? 'Tạo phí' : 'Cập nhật phí'}</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper> */}
      <div className="project-main">
        <div className="bg-color" />
        <ValidatorForm>
          <GridLT container spacing={16}>
            <Grid item xs={12}>
              <KanbanStep kanbanStatus={kanbanStatus} currentStatus={status} onChange={setStatus} />
            </Grid>

            {/* <Grid item xs={4}>
              <AsyncAutocomplete
                name="Chọn khách hàng..."
                label="Khách hàng"
                optionValue="value"
                onChange={value => setCustomer(value)}
                url={API_CUSTOMERS}
                value={customer}
                cacheOptions={false}
                required
              />
              <CustomDatePicker
                label="Hạn thanh toán"
                value={paymentTerm}
                onChange={datePaymentTerm => setPaymentTerm(datePaymentTerm)}
                //onChange={this.handleChange('implementationDate')}
                style={{ width: '100%', zIndex: 0 }}
              />
            </Grid> */}
            <Grid item xs={4}>
              <AsyncAutocomplete
                name="Chọn hợp đồng..."
                label="Mã căn"
                optionValue="value"
                onChange={value => setContract(value)}
                url={GET_CONTRACT}
                value={contract}
                isDisabled={isEditPage}
                error={!contract}
                cacheOptions={false}
                customOptionLabel={customFee}
                filters={['apartmentCode']}
                // filter={customer ? { customerId: customer._id, apartmentCode: { $exists: true, $ne: "" } } : { apartmentCode: { $exists: true, $ne: "" }}}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <DatePicker
                style={{ marginLeft: '20px' }}
                inputVariant="outlined"
                format="MM/YYYY"
                fullWidth
                value={month}
                variant="outlined"
                label="Chọn tháng"
                margin="dense"
                views={['month']}
                maxDate={moment([moment().year(), 0, 31]).month(moment().month() + 1).format("YYYY-MM-DD")}
                onChange={date => setMonth(date)}
                disabled={isEditPage ? true : false}
                required
                error={!month}
              />
            </Grid>
            <Grid item sm={12}>
              <Grid container>
                <Grid item>
                  <ButtonUI index={0}>Tiền điện</ButtonUI>
                </Grid>
                <Grid item>
                  <ButtonUI index={1}>Tiền nước</ButtonUI>
                </Grid>
                <Grid item>
                  <ButtonUI index={2}>Xe</ButtonUI>
                </Grid>
                <Grid item>
                  <ButtonUI index={3}>Dịch vụ</ButtonUI>
                </Grid>
                <Grid item>
                  <ButtonUI index={4}>Bảo trì</ButtonUI>
                </Grid>
                <Grid item>
                  <ButtonUI index={5}>Mặt bằng</ButtonUI>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={12}>
              {tabIndex === 0 && (
                <ElectricianInvoiceTab
                  // product={elecProduct}
                  // products={listElectric}
                  // invoice={electricianInvoice}
                  // invoices={electrictInvoices}
                  checkCount={checkCount}
                  electricOnePrice={electricOnePrice}
                  setElectrictOnePrice={setElectrictOnePrice}
                  fee={fee}
                  resFee={resFee}
                  fromDate={fromDateElect}
                  toDate={toDateElect}
                  onSave={handleSaveElectInvoice}
                  setFromDate={setFromDateElect}
                  setToDate={setToDateElect}
                  disabled={location.state === '1'}
                />
              )}
              {tabIndex === 1 && (
                <WaterInvoiceTab
                  // invoice={waterInvoice}
                  // product={waterProduct}
                  products={productsWater}
                  setProductsWater={setProductsWater}
                  fromDate={fromDateWater}
                  toDate={toDateWater}
                  onSave={handleSaveWaterInvoice}
                  setFromDate={setFromDateWater}
                  setToDate={setToDateWater}
                  checkCount={checkCount}
                  disabled={location.state === '1'}
                  resFee={resFee}
                />
              )}
              {tabIndex === 2 && (
                <VehicleInvoiceTab
                  vehicles={arrVehicles}
                  fromDate={fromDateVehicle}
                  toDate={toDateVehicle}
                  onSave={handleSaveWaterInvoice}
                  handleSubmit={handleSubmit}
                  setNewVehicles={setNewVehicles}
                  setArrVehicles={setArrVehicles}
                  checkCount={checkCount}
                />
              )}
              {tabIndex === 3 && (
                <ServiceInvoiceTab
                  services={services}
                  fromDate={fromDateService}
                  toDate={toDateService}
                  onSave={handleSaveServices}
                  setFromDate={setFromDateService}
                  setToDate={setToDateService}
                  checkCount={checkCount}
                  disabled={location.state === '1'}
                />
              )}
              {tabIndex === 4 && (
                <MaintenanceInvoiceTab
                  invoice={waterInvoice}
                  maintenances={maintenances}
                  fromDate={fromDateMainten}
                  toDate={toDateMainten}
                  onSave={handleSaveWaterInvoice}
                  setFromDate={setFromDateMainten}
                  setToDate={setToDateMainten}
                  checkCount={checkCount}
                  disabled={location.state === '1'}
                />
              )}
              {tabIndex === 5 && (
                <GroundInvoiceTab
                  invoice={waterInvoice}
                  checkCount={checkCount}
                  grounds={grounds}
                  fromDate={fromDateGroup}
                  toDate={toDateGroup}
                  onSave={handleSaveWaterInvoice}
                  setFromDate={setFromDateGroup}
                  setToDate={setToDateGroup}
                  disabled={location.state === '1'}
                />
              )}
            </Grid>
            {/* <Grid item xs={12}>
              <Grid container justify="flex-end">
                <Button style={{ marginRight: 5 }} variant="outlined" color="primary" onClick={handleSubmit}>
                  Lưu
              </Button>
                <Button variant="outlined" color="secondary" onClick={handleClose}>
                  Hủy
              </Button>
              </Grid>
            </Grid> */}
          </GridLT>
        </ValidatorForm>
      </div>
    </div>
  );
}

AddTowerContractPage.propTypes = {};

const mapStateToProps = createStructuredSelector({
  towerContractPage: makeSelectTowerContractPage(),
  crmConfigPage: makeSelectCrmConfigPage(),
  dashboardPage: makeSelectDashboardPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    getFee: id => dispatch(actions.getFee(id)),
    createContract: fees => dispatch(actions.createContract(fees)),
    updateContract: fees => dispatch(actions.updateContract(fees)),
    cleanup: () => dispatch(actions.cleanup()),
    onChangeSnackbar: obj => {
      dispatch(changeSnackbar(obj));
    },
    // onGetCRMStatus: type => {
    //   dispatch(fetchAllStatusAction(type));
    // },
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
)(AddTowerContractPage);
