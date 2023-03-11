/* eslint-disable radix */
/**
 *
 * TowerContractPage
 *
 */

import React, { useState, useEffect, memo, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Paper,
  Typography,
} from '@material-ui/core';
import { TextField } from 'components/LifetekUi';
import { TextValidator } from 'react-material-ui-form-validator';
import Buttons from 'components/CustomButtons/Button';
import { DatePicker } from 'material-ui-pickers';
import CustomDatePicker from 'components/CustomDatePicker';

import { API_TAX } from '../../../../../config/urlConfig';
import request from '../../../../../utils/request';

function WaterInvoiceTab(props) {
  // console.clear();
  const { onSave, fromDate, toDate, products = [], disabled, checkCount, resFee } = props;
  console.log('products 24', products);
  const vatFixed =
    Array.isArray(products) &&
      products[0] &&
      products[0].dataProduct &&
      !isNaN(products[0].dataProduct.tax) &&
      Number(products[0].dataProduct.tax) > 0
      ? Number(products[0].dataProduct.tax)
      : (products[0] && products[0].vat) || 0;
  const envFixed =
    Array.isArray(products) &&
      products[0] &&
      products[0].dataProduct &&
      !isNaN(products[0].dataProduct.environment) &&
      Number(products[0].dataProduct.environment) > 0
      ? Number(products[0].dataProduct.environment)
      : (products[0] && products[0].vatEnv) || 0;
  let totalPrice = 0;
  let totalPriceOne = 0;
  const [localProduct, setLocalProduct] = useState([]);

  useEffect(
    () => {
      if (products && products.length > 0) {
        setLocalProduct(products);
      }
    },
    [products],
  );

  const convertNumber = num => {
    if (isNaN(Number(num))) return;
    if (!isNaN(Number(num)))
      return Number(num).toLocaleString('es-AR', { maximumFractionDigits: 0 });
  };
  const handleChange = (
    e,
    index,
    item,
    startValue,
    costPrice,
    allPrice,
    coefficient,
    vat,
    env,
    assetIndex,
  ) => {
    const { name, value } = e.target;
    const fromValue = startValue.fromValue;
    const toValue = value && Number(value);
    console.log('item', item);
    console.log('assetIndex', assetIndex);

    const totalValueAsset =
      (name === 'toValue' && (Number(value) - Number(fromValue)) * coefficient) || 0;
    let assets = item.updateAsset ? item.updateAsset : item.asset;
    assets[assetIndex].totalValueAsset = totalValueAsset;
    assets[assetIndex].fromValue = fromValue;
    assets[assetIndex].toValue = toValue;
    assets[assetIndex].totalValueAsset = totalValueAsset;
    console.log('assets', assets);

    // const totalValue = assets.reduce((total, asset) => total += (asset.totalValueAsset || 0), 0)
    // const totalValue = assets.reduce((total, asset) => total += ((Number(asset.toValue) - Number(fromValue)) > 0 ? (Number(asset.toValue) - Number(fromValue)) : 0) * asset.coefficient, 0)
    let totalValue = 0;
    assets.map((asset, i) => {
      const value = resFee.waterFromValue
        ? Number(asset.toValue) - Number(resFee.waterFromValue) > 0
          ? (Number(asset.toValue) - Number(resFee.waterFromValue)) * Number(asset.coefficient || 1)
          : 0
        : Number(asset.toValue) - Number(asset.fromValue) > 0
          ? (Number(asset.toValue) - Number(asset.fromValue)) * Number(asset.coefficient || 1)
          : 0;
      totalValue += value;
    });
    const totalMoney =
      allPrice * (1 + (vat + env) / 100) || totalValue * costPrice * (1 + (vat + env) / 100) || 0;

    const newArray = [...products].map((item, i) => {
      if (i === index) {
        return {
          ...item,
          updateAsset: assets,
          totalValue,
          totalMoney: allPrice > 0 || totalValue > 0 ? totalMoney : 0,
        };
      }
      return item;
    });
    props.setProductsWater(newArray);
    const array = products.map((item, i) => {
      if (index === i) {
        return {
          ...item,
          totalMoney: allPrice > 0 || totalValue > 0 ? totalMoney : 0,
          totalValue,
        };
      }
      return item;
    });
    console.log('array', array);
    onSave(array);
  };

  const displayValue = (totalValue, { maxkWh, minkWh, pricekWh }, vat, env) => {
    const newVat = vat || 0;
    const newEnv = env || 0;
    if (totalValue - maxkWh > minkWh) {
      return (maxkWh - minkWh) * pricekWh * (1 + (newVat + newEnv) / 100);
    }
    if (totalValue - maxkWh > 0 && totalValue - maxkWh <= minkWh) {
      return (maxkWh - minkWh) * pricekWh * (1 + (newVat + newEnv) / 100);
    }
    if (totalValue - maxkWh <= 0) {
      return totalValue - minkWh > 0
        ? (totalValue - minkWh) * pricekWh * (1 + (newVat + newEnv) / 100)
        : 0;
    }
    return 0;
  };

  const renderTableFooter = (waterPricePolicy, indexProduct, vat, env, totalValue, asset) => {
    // let totalValue = 0;
    // Array.isArray(products) && products.map((x, i) => {
    //   if (i === indexProduct) {
    //     totalValue = x.totalValue
    //   }
    // })

    return (
      waterPricePolicy &&
      waterPricePolicy.map((price, index) => {
        let value = totalValue;
        if (waterPricePolicy && index === waterPricePolicy.length - 1 && value >= price.maxkWh) {
          totalPrice += Number(displayValue(value, { ...price, maxkWh: value }, vat, env));
        } else {
          totalPrice += Number(displayValue(value, price, vat, env));
        }
        const newArray = products.map((x, i) => {
          if (i === indexProduct) {
            x.totalMoney = totalPrice;
          }
          return x;
        });
        console.log('newArray', newArray)
        onSave(newArray);
        return (
          <TableRow>
            <TableCell colSpan={7} />
            <TableCell>
              {price.minkWh} - {price.maxkWh}
            </TableCell>
            <TableCell>
              {Number(price.pricekWh).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
            </TableCell>
            <TableCell />
            <TableCell />
            {waterPricePolicy &&
              index === waterPricePolicy.length - 1 && (
                <>
                  {value >= price.maxkWh ? (
                    <TableCell>
                      {' '}
                      {convertNumber(
                        displayValue(value, { ...price, maxkWh: value }, vat, env),
                      )}{' '}
                    </TableCell>
                  ) : (
                    <TableCell> {convertNumber(displayValue(value, price, vat, env))} </TableCell>
                  )}
                </>
              )}
            {waterPricePolicy &&
              index < waterPricePolicy.length - 1 && (
                <TableCell> {convertNumber(displayValue(value, price, vat, env))} </TableCell>
              )}
          </TableRow>
        );
      })
    );
  };
  const getTotalMoney = () => {
    let total = 0;

    products && Array.isArray(products) && products.map(x => {
      if (x.totalMoney && !isNaN(x.totalMoney) && Number(x.totalMoney) > 0)
        total += Number(x.totalMoney);
    });
    totalPrice = total;

    return total;
  };
  return (
    <Grid container spacing={8}>
      <Grid item xs={12}>
        <Paper>
          <Table
            stickyHeader
            size="small"
            variant="scrollable"
            padding="dense"
            scrollButtons="on"
            style={{ overflowX: 'auto', display: 'block' }}
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: 180, padding: '4px 20px 4px 20px' }}>
                  Ngày bắt đầu
                </TableCell>
                <TableCell style={{ minWidth: 180, padding: '4px 20px 4px 20px' }}>
                  Ngày kết thúc
                </TableCell>
                <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>
                  Số công tơ
                </TableCell>
                <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>
                  Hệ số nhân
                </TableCell>
                <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>
                  Chỉ số đầu kỳ
                </TableCell>
                <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>
                  Chỉ số cuối kỳ
                </TableCell>
                <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>
                  Tổng tiêu thụ
                </TableCell>
                <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>
                  Định mức tiêu thụ
                </TableCell>
                <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>
                  Đơn giá
                </TableCell>
                <TableCell
                  style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}
                >{`VAT ${vatFixed}%`}</TableCell>
                <TableCell
                  style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}
                >{`Phí bảo vệ môi trường ${envFixed}%`}</TableCell>
                <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>
                  Thành tiền
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {console.log('products', products)}
              {Array.isArray(products) &&
                products.length > 0 &&
                products.map((item, index) => {
                  let { asset = [] } = item;
                  let { updateAsset = [] } = item;
                  const allPrice =
                    (Number(item.allPrice) > 0
                      ? item.allPrice
                      : item.dataProduct &&
                      item.dataProduct.pricePolicy &&
                      !isNaN(item.dataProduct.pricePolicy.allPrice) &&
                      Number(item.dataProduct.pricePolicy.allPrice)) || 0;
                  const costPrice =
                    (Number(item.costPrice) > 0
                      ? item.costPrice
                      : item.dataProduct &&
                      item.dataProduct.pricePolicy &&
                      !isNaN(item.dataProduct.pricePolicy.costPrice) &&
                      Number(item.dataProduct.pricePolicy.costPrice)) || 0;
                  const vat =
                    (Number(item.vat) > 0
                      ? Number(item.vat)
                      : item.dataProduct &&
                      !isNaN(item.dataProduct.tax) &&
                      Number(item.dataProduct.tax)) || 0;
                  const env =
                    (Number(item.vatEnv) > 0
                      ? Number(item.vatEnv)
                      : item.dataProduct &&
                      !isNaN(item.dataProduct.environment) &&
                      Number(item.dataProduct.environment)) || 0;
                  totalPriceOne +=
                    item &&
                    item.totalValue * costPrice + (item.totalValue * costPrice * (vat + env)) / 100;
                  const totalMoney =
                    allPrice > 0 ? allPrice * (1 + (vat + env) / 100) : item.totalMoney || 0;
                  // const electricPricePolicy = dataProduct && dataProduct.pricePolicy && dataProduct.pricePolicy.priceLadderList || [];
                  const priceLadderList =
                    (Array.isArray(item.priceLadderList) && item.priceLadderList.length > 0
                      ? item.priceLadderList
                      : item.dataProduct &&
                      item.dataProduct.pricePolicy &&
                      item.dataProduct.pricePolicy.priceLadderList) || [];
                  const totalValue = item.totalValue;
                  return (
                    <>
                      <TableRow>
                        <TableCell style={{ minWidth: 210, padding: '4px 20px 4px 20px' }}>
                          <CustomDatePicker
                            label="Ngày bắt đầu"
                            value={fromDate}
                            variant="outlined"
                            name="note"
                            margin="normal"
                            top={20}
                            right={24}
                            onChange={e => props.setFromDate(e)}
                            disabled={disabled || checkCount}
                          />
                        </TableCell>
                        <TableCell style={{ minWidth: 210, padding: '4px 20px 4px 20px' }}>
                          <CustomDatePicker
                            label="Ngày kết thúc"
                            value={toDate}
                            variant="outlined"
                            name="note"
                            margin="normal"
                            top={20}
                            right={24}
                            onChange={e => props.setToDate(e)}
                            disabled={disabled || checkCount}
                          />
                        </TableCell>
                        <TableCell style={{ minWidth: 160, padding: '4px 20px 4px 20px' }}>
                          {Array.isArray(asset) &&
                            asset.map((x, i) => (
                              <TableRow>
                                <TableCell>{x.code}</TableCell>
                              </TableRow>
                            ))}
                          {/* {code || ''} */}
                        </TableCell>
                        <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>
                          {/* {coefficient || 1} */}
                          {Array.isArray(updateAsset) &&
                            updateAsset.map((x, i) => (
                              <TableRow>
                                <TableCell>{x.coefficient}</TableCell>
                              </TableRow>
                            ))}
                        </TableCell>
                        <TableCell style={{ minWidth: 160, padding: '4px 20px 4px 20px' }}>
                          {/* {item.fromValue || 0} */}
                          {/* {fromValue} */}
                          {resFee.waterFromValue ? (
                            <TableRow>
                              <TableCell>{Number(resFee.waterFromValue)}</TableCell>
                            </TableRow>
                          ) : item.updateAsset ? (
                            Array.isArray(updateAsset) &&
                            updateAsset.map((x, i) => (
                              <TableRow>
                                <TableCell>
                                  {Number(x.fromValue) > 0
                                    ? x.fromValue
                                    : Number(x.meterNumberNearest) > 0
                                      ? x.meterNumberNearest
                                      : 0}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            Array.isArray(asset) &&
                            asset.map((x, i) => (
                              <TableRow>
                                <TableCell>
                                  {Number(x.fromValue) > 0
                                    ? x.fromValue
                                    : Number(x.meterNumberNearest) > 0
                                      ? x.meterNumberNearest
                                      : 0}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                          {/* {Array.isArray(asset) && asset.map((x, i) => (
                            <TableRow>
                              <TableCell>{Number(x.fromValue) > 0 ? x.fromValue : Number(x.meterNumber) > 0 ? x.meterNumber : 0}</TableCell>
                            </TableRow>
                          ))} */}
                        </TableCell>
                        <TableCell style={{ minWidth: 160, padding: '4px 20px 4px 20px' }}>
                          {item.updateAsset
                            ? Array.isArray(updateAsset) &&
                            updateAsset.map((x, assetIndex) => (
                              <TableRow style={{ width: '100%' }}>
                                <TableCell style={{ minWidth: 120, padding: 0 }}>
                                  <TextValidator
                                    type="number"
                                    value={x.toValue}
                                    name="toValue"
                                    onChange={e =>
                                      handleChange(
                                        e,
                                        index,
                                        item,
                                        { fromValue: x.fromValue || x.meterNumberNearest },
                                        costPrice,
                                        allPrice,
                                        x.coefficient,
                                        vat,
                                        env,
                                        assetIndex,
                                      )
                                    }
                                    disabled={disabled || checkCount}
                                    validators={[
                                      `minNumber:${x.fromValue || x.meterNumberNearest || 0}`,
                                      'required',
                                    ]}
                                    errorMessages={[
                                      'Chỉ số cuối kì phải lớn hơn hoặc bằng chỉ số đầu kì',
                                    ]}
                                    fullWidth
                                  />
                                </TableCell>
                              </TableRow>
                            ))
                            : Array.isArray(asset) &&
                            asset.map((x, assetIndex) => (
                              <TableRow style={{ width: '100%' }}>
                                <TableCell style={{ minWidth: 120, padding: 0 }}>
                                  <TextValidator
                                    type="number"
                                    value={x.toValue}
                                    name="toValue"
                                    onChange={e =>
                                      handleChange(
                                        e,
                                        index,
                                        item,
                                        { fromValue: x.fromValue || x.meterNumberNearest },
                                        costPrice,
                                        allPrice,
                                        x.coefficient,
                                        vat,
                                        env,
                                        assetIndex,
                                      )
                                    }
                                    disabled={disabled || checkCount}
                                    validators={[
                                      `minNumber:${x.fromValue || x.meterNumberNearest || 0}`,
                                      'required',
                                    ]}
                                    errorMessages={[
                                      'Chỉ số cuối kì phải lớn hơn hoặc bằng chỉ số đầu kì',
                                    ]}
                                    fullWidth
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          {/* {Array.isArray(asset) && asset.map((x, assetIndex) => (
                            <TableRow style={{ width: "100%" }}>
                              <TableCell style={{ minWidth: 120, padding: 0 }}>
                                <TextValidator
                                  type="number"
                                  value={x.toValue}
                                  name="toValue"
                                  onChange={(e) => handleChange(e, index, item, { fromValue: x.fromValue || x.meterNumber }, costPrice, allPrice, x.coefficient, vat, env, assetIndex)}
                                  validators={[`minNumber:${x.fromValue || x.meterNumber || 0}`]}
                                  errorMessages={['Chỉ số cuối kì phải lớn hơn hoặc bằng chỉ số đầu kì']}
                                  fullWidth
                                  disabled={disabled || checkCount}
                                />
                              </TableCell>
                            </TableRow>
                          ))} */}
                        </TableCell>
                        <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>
                          {item && Number(item.totalValue) > 0 ? item.totalValue : 0}
                        </TableCell>
                        <TableCell />
                        <TableCell>
                          {allPrice > 0
                            ? Number(allPrice).toLocaleString('es-AR', { maximumFractionDigits: 0 })
                            : costPrice > 0
                              ? Number(costPrice).toLocaleString('es-AR', {
                                maximumFractionDigits: 0,
                              })
                              : 0}
                        </TableCell>
                        <TableCell>
                          {' '}
                          {(
                            (Number(totalMoney) * vatFixed) /
                            (100 + (vatFixed + envFixed))
                          ).toLocaleString('es-AR', {
                            maximumFractionDigits: 0,
                          })}{' '}
                        </TableCell>
                        <TableCell>
                          {' '}
                          {(
                            (Number(totalMoney) * envFixed) /
                            (100 + (vatFixed + envFixed))
                          ).toLocaleString('es-AR', {
                            maximumFractionDigits: 0,
                          })}{' '}
                        </TableCell>
                        <TableCell>
                          {Number(totalMoney).toLocaleString('es-AR', { maximumFractionDigits: 0 })}{' '}
                        </TableCell>
                      </TableRow>
                      {priceLadderList.length > 1 &&
                        renderTableFooter(priceLadderList, index, vat, env, totalValue)}
                    </>
                  );
                })}
              <TableRow>
                <TableCell colSpan={11} />
                <TableCell>
                  <Typography variant="subtitle1" gutterBottom component="div">
                    Tổng tiền:{' '}
                    {getTotalMoney().toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                  </Typography>
                </TableCell>
                {/* <TableCell>{getTotalMoney().toLocaleString("es-AR", { maximumFractionDigits: 0 })}</TableCell> */}
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
}

WaterInvoiceTab.propTypes = {
  dispatch: PropTypes.func.isRequired,
  product: PropTypes.object,
};

export default memo(WaterInvoiceTab);
