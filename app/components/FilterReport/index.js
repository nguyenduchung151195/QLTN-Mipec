import React, { useState, useEffect } from 'react';
import { Grid, MenuItem} from '@material-ui/core';
import { makeSelectProfile } from '../../containers/Dashboard/selectors';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DepartmentAndEmployee from 'components/Filter/DepartmentAndEmployee';
import CustomInputField from '../Input/CustomInputField';
import { DatePicker } from 'material-ui-pickers';
import moment from 'moment';
import '../../containers/AddSalesManager/style.css';
import { Grid as GridLT, AsyncAutocomplete,TextField  } from '../../components/LifetekUi';
import { GET_CONTRACT, API_ASSET, API_ORIGANIZATION } from '../../config/urlConfig';
import CustomInputBase from '../../components/Input/CustomInputBase';
import { fetchData } from '../../helper';

function FilterReport(props) {
  const {
    onGetFilter,
    profile,
    isReport = false,
    code = '',
    disableDepartmentAndEmployee,
    disableCustomer,
    handleChangeDate,
    valueDate,
    handleChangePerod,
    contract,
    reportMeter,
    isDebtOver,
    label,
  } = props;
  const [show, setShow] = useState(true);
  const [project, setProject] = useState();
  const [isDebtOverData, setIsDebtOverData] = useState([]);

  const [filter, setFilter] = useState({
    periodStr: {
      gte: moment().format('YYYY-MM'),
      lte: moment().format('YYYY-MM'),
    },
    year: moment().format('YYYY'),

    organizationUnitId: '',
    group: '',
    skip: 0,
    limit: 10,
  });

  const [isClear, setIsClear] = useState(true);

  const checkShow = value => {
    setShow(value);
  };
  const handleChangeValue = (name, value) => {
    let obj = {
      ...filter,
      [name]: value,
    };
    setFilter(obj);
  };
  const customFee = option => {
    const customerName = option.apartmentCode ? option.apartmentCode : '';
    if (customerName) {
      return `${customerName}`;
    }
    return '';
  };
  const customAsset = option => {
    const customerName = option.name ? option.name : '';
    if (customerName) {
      return `${customerName}`;
    }
    return '';
  };
  useEffect(
    () => {
      onGetFilter(filter);
    },
    [filter],
  );
  useEffect(() => {
    if (code === 'reportFinanceDebtOver') {
      fetchData(`${API_ORIGANIZATION}?isSmallest=true`, 'GET', null).then(data => {
        // let newData = []
        // data.map((item)=>{
        //     newData.push(item.name)
        // })
        setIsDebtOverData(data);
      });
    }

    if (props.listCustomer === true) {
      setFilter({
        ...filter,
        startDate: moment()
          .startOf('month')
          .format('YYYY-MM-DD'),
        endDate: moment()
          .endOf('month')
          .format('YYYY-MM-DD'),
      });
    }
  }, []);
  return (
    <Grid container alignItems="center" style={{ padding: 10 }} spacing={8}>
      {code !== 'reportFinanceGeneralDebt' &&
        code !== 'reportFinanceDebtOver' &&
        code !== 'reportDiaryAsset' &&
        code !== 'reportEnterBill' &&
        code !== 'reportEnterCoupon' &&
        code !== 'reportMeter' &&
        code !== 'reportImportReport' &&
        code !== 'reportExportReport' &&
        code !== 'reportGetContractNeedExtended' &&
        code !== 'reportGetContractCancel' &&
        code !== 'reportInventoryStock' &&
        code !== 'reportInventoryAsset' &&
        !props.listCustomer && (
          <>
            <Grid item md={2}>
              <div className="marginNew">
                <DatePicker
                  inputVariant="outlined"
                  format="MM/YYYY"
                  fullWidth
                  value={filter.periodStr ? filter.periodStr.lte : moment()}
                  variant="outlined"
                  label="Kỳ"
                  margin="dense"
                  views={['month']}
                  onChange={date =>
                    setFilter({
                      ...filter,
                      periodStr: {
                        gte: moment(date, 'MM/YYYY').format('YYYYMM'),
                        lte: moment(date, 'MM/YYYY').format('YYYYMM'),
                      },
                    })
                  }
                  required
                  error={filter && !filter.periodStr}
                />
              </div>
            </Grid>
          </>
        )}
      {reportMeter ? (
        <>
          <Grid item md={2}>
            <AsyncAutocomplete
              name="contract"
              label="Mã căn"
              optionValue="value"
              onChange={value => {
                setFilter({
                  ...filter,
                  apartmentCode: value,
                });
              }}
              url={GET_CONTRACT}
              // value={contract}
              // error={!contract}
              // cacheOptions={false}
              customOptionLabel={customFee}
              // filters={['apartmentCode']}
              // filter={customer ? { customerId: customer._id, apartmentCode: { $exists: true, $ne: "" } } : { apartmentCode: { $exists: true, $ne: "" }}}
            />
          </Grid>
          <Grid item md={2}>
            <AsyncAutocomplete
              // isMulti
              name="Chọn... "
              label="Mã công tơ"
              optionValue="value"
              onChange={value => {
                setFilter({
                  ...filter,
                  name: value,
                });
              }}
              // filter={this.state.assetFilter}
              url={API_ASSET}
              customOptionLabel={customAsset}

              // value={this.state.chooseAssets}
            />
          </Grid>
        </>
      ) : (
        ''
      )}
      {(code === 'reportFinanceGeneralDebt' ||
        code === 'reportFinanceDebtOver' ||
        code === 'reportMeter' ||
        code === 'reportImportReport' ||
        code === 'reportExportReport') && (
        <>
          <Grid item md={2}>
            <div className="marginNew">
              <DatePicker
                inputVariant="outlined"
                format="MM/YYYY"
                fullWidth
                value={filter && filter.periodStr ? filter.periodStr.gte : moment()}
                variant="outlined"
                label="Từ kỳ"
                margin="dense"
                views={['month']}
                onChange={date => {
                  setFilter({
                    ...filter,
                    periodStr: {
                      ...filter.periodStr,
                      gte: moment(date, 'MM/YYYY').format('YYYYMM'),
                    },
                  });
                }}
                maxDate={filter && filter.periodStr ? filter.periodStr.lte : moment()}
                required
                error={filter.periodStr && !filter.periodStr.gte}
              />
            </div>
          </Grid>
          <Grid item md={2}>
            <div className="marginNew">
              <DatePicker
                inputVariant="outlined"
                format="MM/YYYY"
                fullWidth
                value={filter && filter.periodStr ? filter.periodStr.lte : moment()}
                variant="outlined"
                label="Đến kỳ"
                margin="dense"
                views={['month']}
                onChange={date => {
                  setFilter({
                    ...filter,
                    periodStr: {
                      ...filter.periodStr,
                      lte: moment(date, 'MM/YYYY').format('YYYYMM'),
                    },
                  });
                }}
                minDate={filter && filter.periodStr ? filter.periodStr.gte : moment()}
                required
                error={filter.periodStr && !filter.periodStr.lte}
              />
            </div>
          </Grid>
          {code === 'reportFinanceDebtOver' && (
            <>
              <Grid item md={2}>
                <CustomInputBase
                  label="Dự án"
                  value={project}
                  onChange={e => {
                    let value = e.target.value;
                    console.log('value', value);
                    console.log('111', isDebtOverData[value - 1]);
                    setFilter({
                      ...filter,
                      organizationUnitId: isDebtOverData && isDebtOverData[value - 1] && isDebtOverData[value - 1]._id,
                    });
                    setProject(value);
                  }}
                  select
                  fullWidth
                >
                  {isDebtOverData.map((it, idx) => (
                    <MenuItem value={idx + 1}>{it.name}</MenuItem>
                  ))}
                </CustomInputBase>
              </Grid>
            </>
          )}
        </>
      )}

      {code === 'reportCustomerFrequencySell' &&
        props.listCustomer === true && (
          <>
            <Grid item md={2}>
              <div className="marginNew">
                <DatePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  fullWidth
                  value={filter ? filter.startDate : null}
                  variant="outlined"
                  label="Từ ngày"
                  margin="dense"
                  maxDate={filter && filter.endDate}
                  // views={['day, month, year']}
                  onChange={date =>
                    setFilter({
                      ...filter,
                      startDate: moment(date, 'DD/MM/YYYY').format('YYYYMMDD'),
                    })
                  }
                  required
                  error={filter.startDate && !filter.startDate}
                />
              </div>
            </Grid>
            <Grid item md={2}>
              <div className="marginNew">
                <DatePicker
                  inputVariant="outlined"
                  format="DD/MM/YYYY"
                  fullWidth
                  value={filter ? filter.endDate : null}
                  variant="outlined"
                  label="Đến ngày"
                  margin="dense"
                  minDate={filter && filter.startDate}
                  // views={['day,month, year']}
                  onChange={date =>
                    setFilter({
                      ...filter,
                      endDate: moment(date, 'DD/MM/YYYY').format('YYYYMMDD'),
                    })
                  }
                  required
                  error={filter.endDate && !filter.endDate}
                />
              </div>
            </Grid>
          </>
        )}
      {(code === 'reportDiaryAsset' || code === 'reportEnterBill' || code === 'reportEnterCoupon' || code === 'reportInventoryAsset' || code ==='reportInventoryStock') && (
        <>
          <Grid item md={2}>
            <div className="marginNew">
              <DatePicker
                inputVariant="outlined"
                format="DD/MM/YYYY"
                fullWidth
                value={valueDate ? valueDate.startDate : null}
                variant="outlined"
                label={label ? 'Ngày đầu kỳ ' : 'Từ ngày'}
                margin="dense"
                // views={['day, month, year']}
                onChange={date => handleChangeDate(date, 'startDate')}
                required
              />
            </div>
          </Grid>
          <Grid item md={2}>
            <div className="marginNew">
              <DatePicker
                inputVariant="outlined"
                format="DD/MM/YYYY"
                fullWidth
                value={valueDate ? valueDate.endDate : null}
                variant="outlined"
                label={label ? 'Ngày cuối kỳ' : 'Đến ngày'}
                margin="dense"
                // views={['day,month, year']}
                onChange={date => handleChangeDate(date, 'endDate')}
                required
                error={valueDate.endDate && !valueDate.endDate}
              />
            </div>
          </Grid>
        </>
      )}
      {disableDepartmentAndEmployee ? (
        ''
      ) : (
        <Grid item md={3}>
          <DepartmentAndEmployee
            onChangeShow={s => checkShow(s)}
            isClear={isClear}
            onClearSuccess={() => setIsClear(false)}
            onChange={result => {
              const newFilter = {};
              if (result) {
                if (result.department) {
                  newFilter['organizationUnitId'] = result.department;
                }
              }
              setFilter(pre => ({
                ...pre,
                organizationUnitId: newFilter && newFilter.organizationUnitId ? newFilter.organizationUnitId : null,
              }));
            }}
            profile={profile}
            isReport={isReport}
            moduleCode="Employee"
          />
        </Grid>
      )}
      {disableCustomer ? (
        ''
      ) : (
        <Grid item md={3}>
          <CustomInputField
            label="Nhóm khách hàng"
            type="vl"
            configType="crmSource"
            configCode="S07"
            name="group"
            value={filter && filter.group ? filter.group : ''}
            onChange={e => handleChangeValue(e.target.name, e.target.value)}
          />
        </Grid>
      )}
      {code === 'reportGetContractNeedExtended' && (
        <Grid item md={2}>
          <div className="marginNew">
            <DatePicker
              inputVariant="outlined"
              format="YYYY"
              fullWidth
              value={filter.year ? filter.year : moment()}
              variant="outlined"
              label="Năm"
              margin="dense"
              views={['year']}
              onChange={date =>
                setFilter({
                  ...filter,
                  year: moment(date, 'YYYY').format('YYYY'),
                })
              }
            />
          </div>
        </Grid>
      )}
        {code === 'reportSendTimes' && (
        <Grid item md={2}>
          <div className="marginNew">
          <TextField
            label="Lọc theo số lần gửi tin nhắn"
            type="number"
            name="count"
            value={filter && filter.count ? filter.count : ''}
            onChange={e => handleChangeValue(e.target.name, e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          </div>
        </Grid>
      )}
      {code === 'reportGetContractCancel' &&
        !props.listCustomer && (
          <>
            <Grid item md={2}>
              <div className="marginNew">
                <DatePicker
                  inputVariant="outlined"
                  format="YYYY"
                  fullWidth
                  value={filter.year ? filter.year : moment()}
                  variant="outlined"
                  label="Năm"
                  margin="dense"
                  views={['year']}
                  onChange={date =>
                    setFilter({
                      ...filter,
                      year: moment(date, 'YYYY').format('YYYY'),
                    })
                  }
                />
              </div>
            </Grid>
            {code !== 'reportGetContractCancel' ? (
              <Grid item md={2}>
                <CustomInputBase
                  label="Loại hợp đồng"
                  value={filter && filter.filter ? filter.filter.typeContract : 3}
                  onChange={e => {
                    let value = e.target.value;
                    console.log('value', value);
                    setFilter({
                      ...filter,
                      filter: {
                        typeContract: value,
                      },
                    });
                  }}
                  select
                  fullWidth
                >
                  <MenuItem value={3}>--Chọn--</MenuItem>
                  <MenuItem value={1}>HỢP ĐỒNG KH</MenuItem>
                  <MenuItem value={2}>HỢP ĐỒNG NCC</MenuItem>
                </CustomInputBase>
              </Grid>
            ) : (
              ''
            )}
          </>
        )}
        
    </Grid>
  );
}

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(FilterReport);
