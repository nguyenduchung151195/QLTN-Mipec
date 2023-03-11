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
import { TextValidator } from 'react-material-ui-form-validator';
import { TextField } from 'components/LifetekUi';
import Buttons from 'components/CustomButtons/Button';
import { DatePicker } from 'material-ui-pickers';
import CustomDatePicker from 'components/CustomDatePicker';
import request from '../../../../../utils/request';
import { API_TAX } from '../../../../../config/urlConfig';

function ElectricianInvoiceTab(props) {
  // const { invoice, onSave, products = [], invoices = [], fromDate, toDate, product } = props;
  // console.clear();
  const { onSave, electricOnePrice, fromDate, toDate, checkCount, disabled, fee, resFee } = props;
  const vatFixed =
    Array.isArray(electricOnePrice) &&
    electricOnePrice[0] &&
    electricOnePrice[0].dataProduct &&
    !isNaN(electricOnePrice[0].dataProduct.tax) &&
    Number(electricOnePrice[0].dataProduct.tax) > 0
      ? Number(electricOnePrice[0].dataProduct.tax)
      : (electricOnePrice[0] && electricOnePrice[0].vat) || 0;
  const [vat, setVat] = useState(0);
  let totalPrice = 0;
  let totalPriceOne = 0;
  const [localProduct, setLocalProduct] = useState([]);
  useEffect(
    () => {
      if (electricOnePrice && electricOnePrice.length > 0) {
        setLocalProduct(electricOnePrice);
      }
    },
    [electricOnePrice],
  );
  const handleChangeItem = (
    e,
    index,
    { idInAsset, coefficient },
    { id, costPrice },
    startValue,
    allPrice,
    vat,
    item,
    assetIndex,
  ) => {
    const { name, value } = e.target;
    const fromValue = !isNaN(startValue.fromValue) ? Number(startValue.fromValue) : 0;
    const toValue = value && Number(value);
    const totalValueAsset =
      (name === 'toValue' && (Number(value) - Number(fromValue)) * coefficient) || 0;
    let assets = item.updateAsset ? item.updateAsset : item.asset;
    assets[assetIndex].totalValueAsset = totalValueAsset;
    assets[assetIndex].fromValue = fromValue;
    assets[assetIndex].toValue = toValue;

    // const totalValue = assets.reduce((total, asset) => total += (asset.totalValueAsset || 0), 0)

    // const totalValue = assets.reduce((total, asset) => total += ((Number(asset.toValue) - Number(fromValue))>0? (Number(asset.toValue) - Number(fromValue)): 0)*asset.coefficient, 0);
    let totalValue = 0;
    assets.map((asset, i) => {
      const value = resFee.elecFromValue
        ? Number(asset.toValue) - Number(resFee.elecFromValue) > 0
          ? (Number(asset.toValue) - Number(resFee.elecFromValue)) * Number(asset.coefficient || 1)
          : 0
        : Number(asset.toValue) - Number(asset.fromValue) > 0
          ? (Number(asset.toValue) - Number(asset.fromValue)) * Number(asset.coefficient || 1)
          : 0;
      totalValue += value;
    });
    const totalMoney = allPrice * (1 + vat / 100) || totalValue * costPrice * (1 + vat / 100) || 0;
    const newArray = [...electricOnePrice].map((item, i) => {
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
    props.setElectrictOnePrice(newArray);
    const array = electricOnePrice.map((item, i) => {
      if (index === i) {
        return {
          ...item,
          totalMoney: allPrice > 0 || totalValue > 0 ? totalMoney : 0,
          totalValue,
        };
      }
      return item;
    });
    onSave(array);
  };

  const displayValue = (totalValue, { maxkWh, minkWh, pricekWh }, vat) => {
    if (totalValue - maxkWh > minkWh) {
      return (maxkWh - minkWh) * pricekWh * (1 + Number(vat) / 100);
    }
    if (totalValue - maxkWh > 0 && totalValue - maxkWh <= minkWh) {
      return (maxkWh - minkWh) * pricekWh * (1 + Number(vat) / 100);
    }
    if (totalValue - maxkWh <= 0) {
      return totalValue - minkWh > 0
        ? (totalValue - minkWh) * pricekWh * (1 + Number(vat) / 100)
        : 0;
    }
    return 0;
  };

  const renderTableFooter = (electricPricePolicy, indexProduct, vat, totalValue) => {
    console.log('electricOnePrice', electricOnePrice);
    return (
      electricPricePolicy &&
      electricPricePolicy.map((price, index) => {
        let value = totalValue;

        if (
          electricPricePolicy &&
          index === electricPricePolicy.length - 1 &&
          value >= price.maxkWh
        ) {
          totalPrice += Number(displayValue(value, { ...price, maxkWh: value }, vat));
        } else {
          totalPrice += Number(displayValue(value, price, vat));
        }
        console.log('totalValue117', totalPrice);
        const newArray = electricOnePrice.map((x, i) => {
          if (i === indexProduct) {
            x.totalMoney = totalPrice;
          }
          return x;
        });
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
            {electricPricePolicy &&
              index === electricPricePolicy.length - 1 && (
                <>
                  {value >= price.maxkWh ? (
                    <TableCell>
                      {' '}
                      {Number(displayValue(value, { ...price, maxkWh: value }, vat)).toLocaleString(
                        'es-AR',
                        { maximumFractionDigits: 0 },
                      )}{' '}
                    </TableCell>
                  ) : (
                    <TableCell>
                      {' '}
                      {Number(displayValue(value, price, vat)).toLocaleString('es-AR', {
                        maximumFractionDigits: 0,
                      })}{' '}
                    </TableCell>
                  )}
                </>
              )}
            {electricPricePolicy &&
              index < electricPricePolicy.length - 1 && (
                <TableCell>
                  {' '}
                  {Number(displayValue(value, price, vat)).toLocaleString('es-AR', {
                    maximumFractionDigits: 0,
                  })}{' '}
                </TableCell>
              )}
          </TableRow>
        );
      })
    );
  };
  const getTotalMoney = () => {
    let total = 0;
    electricOnePrice.map(x => {
      if (x.totalMoney && !isNaN(x.totalMoney) && Number(x.totalMoney) > 0)
        total += Number(x.totalMoney);
    });
    return total;
  };
  return (
    <Grid container spacing={8}>
      <Grid item xs={12}>
        <Paper>
          <Table
            stickyHeader
            size="small"
            padding="dense"
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
                  Mã công tơ
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
                <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>
                  Thành tiền
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(electricOnePrice) &&
                electricOnePrice.length > 0 &&
                electricOnePrice.map((item, index) => {
                  let { asset = [], id, updateAsset = [] } = item;
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
                      ? item.vat
                      : item.dataProduct &&
                        !isNaN(item.dataProduct.tax) &&
                        Number(item.dataProduct.tax)) || 0;
                  totalPriceOne +=
                    item && item.totalValue * costPrice + (item.totalValue * costPrice * vat) / 100;
                  const totalMoney =
                    allPrice > 0 ? allPrice * (1 + vat / 100) : item.totalMoney || 0;
                  // const electricPricePolicy = dataProduct && dataProduct.pricePolicy && dataProduct.pricePolicy.priceLadderList || [];
                  const priceLadderList =
                    (Array.isArray(item.priceLadderList) && item.priceLadderList.length > 0
                      ? item.priceLadderList
                      : item.dataProduct &&
                        item.dataProduct.pricePolicy &&
                        item.dataProduct.pricePolicy.priceLadderList) || [];
                  const totalvalue = item.totalValue;
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
                            onChange={e => props.setFromDate(e)}
                            top={20}
                            right={24}
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
                            onChange={e => props.setToDate(e)}
                            top={20}
                            right={24}
                            disabled={disabled || checkCount}
                          />
                        </TableCell>
                        <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>
                          {Array.isArray(asset) &&
                            asset.map((x, i) => (
                              <TableRow>
                                <TableCell>{x.code}</TableCell>
                                {console.log(x)}
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
                        <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>
                          {/* {item.fromValue || 0} */}
                          {/* {fromValue} */}
                          {resFee.elecFromValue ? (
                            <TableRow>
                              <TableCell>{Number(resFee.elecFromValue)}</TableCell>
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
                        </TableCell>
                        <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>
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
                                        handleChangeItem(
                                          e,
                                          index,
                                          { _id: x._id, coefficient: x.coefficient },
                                          { id, costPrice },
                                          { fromValue: x.fromValue || x.meterNumberNearest },
                                          allPrice,
                                          vat,
                                          item,
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
                                        handleChangeItem(
                                          e,
                                          index,
                                          { _id: x._id, coefficient: x.coefficient },
                                          { id, costPrice },
                                          { fromValue: x.fromValue || x.meterNumberNearest },
                                          allPrice,
                                          vat,
                                          item,
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
                        </TableCell>
                        <TableCell style={{ minWidth: 120, padding: '4px 20px 4px 20px' }}>
                          {item && Number(item.totalValue) > 0 ? item.totalValue : 0}
                        </TableCell>
                        <TableCell />
                        <TableCell>
                          {allPrice > 0
                            ? Number(allPrice).toLocaleString('es-AR', { maximumFractionDigits: 0 })
                            : costPrice
                              ? Number(costPrice).toLocaleString('es-AR', {
                                  maximumFractionDigits: 0,
                                })
                              : 0}
                        </TableCell>
                        <TableCell>
                          {' '}
                          {((Number(totalMoney) * vatFixed) / (100 + vatFixed)).toLocaleString(
                            'es-AR',
                            { maximumFractionDigits: 0 },
                          )}{' '}
                        </TableCell>
                        {/* <TableCell>{item && Number((item.totalValue * costPrice) + (item.totalValue * costPrice) * vat / 100).toLocaleString("es-AR", { maximumFractionDigits: 0 })}</TableCell> */}
                        <TableCell>
                          {Number(totalMoney).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                        </TableCell>
                      </TableRow>
                      {priceLadderList.length > 1 &&
                        renderTableFooter(priceLadderList, index, vat, totalvalue)}
                      {/* {item.dataProduct && item.dataProduct.pricePolicy && Array.isArray(item.dataProduct.pricePolicy.priceLadderList) && item.dataProduct.pricePolicy.priceLadderList.length > 1 && renderTableFooter(electricPricePolicy, index, vat)} */}
                    </>
                  );
                })}
              {/* {allPrice === 0 && totalPrice === 0 && renderTableFooter()} */}
              <TableRow>
                <TableCell colSpan={10} />
                <TableCell>
                  <Typography variant="subtitle1" gutterBottom component="div">
                    Tổng tiền :{' '}
                    {getTotalMoney().toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                  </Typography>
                </TableCell>
                {/* {totalPriceOne === 0 ? (
                  <TableCell>{
                    allPrice === 0 && costPrice !== 0 && totalPrice === 0 && Number((costPrice * totalValue) + (costPrice * totalValue) * vat / 100).toLocaleString("es-AR", { maximumFractionDigits: 0 }) ||
                    allPrice !== 0 && costPrice === 0 && totalPrice === 0 && Number(allPrice + allPrice * vat / 100).toLocaleString("es-AR", { maximumFractionDigits: 0 }) ||
                    allPrice === 0 && costPrice === 0 && totalPrice !== 0 && Number(totalPrice + totalPrice * vat / 100).toLocaleString("es-AR", { maximumFractionDigits: 0 }) || 0}</TableCell>
                ) : (
                  <TableCell>{
                    Number(totalPriceOne + allPrice * (1 + vat / 100) + totalPrice * (1 + vat / 100)).toLocaleString("es-AR", { maximumFractionDigits: 0 })
                  }</TableCell>

                )} */}

                {/* <TableCell>
                  {getTotalMoney().toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                </TableCell> */}
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
}

ElectricianInvoiceTab.propTypes = {
  dispatch: PropTypes.func.isRequired,
  product: PropTypes.object,
};

export default memo(ElectricianInvoiceTab);
