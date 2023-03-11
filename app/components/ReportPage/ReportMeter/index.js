import React, { useCallback, useState } from 'react';
import { Paper, Grid, Button } from '@material-ui/core';
import ListPage from 'containers/ListPage';

import moment from 'moment';

import FilterReport from '../../FilterReport';
import { API_METER, GET_CONTRACT } from '../../../config/urlConfig';
import { serialize, exportTableToExcel, exportTableToExcelXSLX, tableToPDF } from '../../../helper';
import ExportTable from './ExportTable';
import { Grid as GridLT, AsyncAutocomplete } from '../../../components/LifetekUi';
import CustomAppBar from 'components/CustomAppBar';

export default function ReportMeter(props) {
  const { onClose } = props;
  const INITIAL_QUERY = {
    limit: 10,
    skip: 0,
  };
  const [queryFilter, setQueryFilter] = useState(INITIAL_QUERY);
  const [count, setCount] = useState(0);
  const [exportExcel, setExportExcel] = useState(false);
  const [type, setType] = useState('PDF');
  const [contract, setContract] = useState();
  const getColumns = () => {
    const viewConfig = [];
    viewConfig[0] = { name: 'apartmentCode', title: 'Mã căn hộ', checked: true, width: 150 };
    viewConfig[1] = {
      name: 'waterChargeCode',
      title: 'Mã công tơ nước',
      checked: true,
      width: 150,
    };
    viewConfig[2] = {
      name: 'waterChargeName',
      title: 'Tên công tơ nước',
      checked: true,
      width: 150,
    };
    viewConfig[3] = {
      name: 'waterFromValue',
      title: 'Chỉ số nước đầu kỳ',
      checked: true,
      width: 150,
    };
    viewConfig[4] = {
      name: 'waterToValue',
      title: 'Chỉ số nước cuối kỳ',
      checked: true,
      width: 150,
    };
    viewConfig[5] = {
      name: 'electricityChargeCode',
      title: 'Mã công tơ điện',
      checked: true,
      width: 150,
    };
    viewConfig[6] = {
      name: 'electricityChargeName',
      title: 'Tên công tơ điện',
      checked: true,
      width: 150,
    };
    viewConfig[7] = {
      name: 'elecFromValue',
      title: 'Chỉ số điện đầu kỳ',
      checked: true,
      width: 150,
    };
    viewConfig[8] = {
      name: 'elecToValue',
      title: 'Chỉ số điện cuối kỳ',
      checked: true,
      width: 150,
    };
    return viewConfig;
  };

  const handleGetFilter = useCallback(
    obj => {
      console.log('obj', obj);
      let newFilter;
      if (obj && obj.apartmentCode) {
        if (obj.name) {
          newFilter = {
            filter: {
              periodStr: {
                $gte: obj.periodStr ? moment(obj.periodStr.gte, 'YYYYMM').format('YYYY-MM') : null,
                $lte: obj.periodStr ? moment(obj.periodStr.lte, 'YYYYMM').format('YYYY-MM') : null,
              },
              apartmentCode: obj.apartmentCode && obj.apartmentCode.apartmentCode,
              ['electricityCharge.asset.code']: obj.name && obj.name.name,
              ['waterCharge.asset.code']: obj.name && obj.name.name,
            },
          };
        } else {
          newFilter = {
            filter: {
              periodStr: {
                $gte: obj.periodStr ? moment(obj.periodStr.gte, 'YYYYMM').format('YYYY-MM') : null,
                $lte: obj.periodStr ? moment(obj.periodStr.lte, 'YYYYMM').format('YYYY-MM') : null,
              },
              apartmentCode: obj.apartmentCode && obj.apartmentCode.apartmentCode,
            },
          };
        }
      } else {
        if (obj.name) {
          newFilter = {
            filter: {
              periodStr: {
                $gte: obj.periodStr ? moment(obj.periodStr.gte, 'YYYYMM').format('YYYY-MM') : null,
                $lte: obj.periodStr ? moment(obj.periodStr.lte, 'YYYYMM').format('YYYY-MM') : null,
              },
              ['electricityCharge.asset.code']: obj.name && obj.name.name,
              ['waterCharge.asset.code']: obj.name && obj.name.name,
            },
          };
        } else {
          newFilter = {
            filter: {
              periodStr: {
                $gte: obj.periodStr ? moment(obj.periodStr.gte, 'YYYYMM').format('YYYY-MM') : null,
                $lte: obj.periodStr ? moment(obj.periodStr.lte, 'YYYYMM').format('YYYY-MM') : null,
              },
            },
          };
        }
      }

      console.log('newFilter', newFilter);
      setQueryFilter(newFilter);
    },
    [queryFilter.filter],
  );
  const getRows = ({ data = [], count, skip }) => {
    let result = [];
    setCount(count);
    if (Array.isArray(data) && data.length > 0) {
      data.map((item, index) => {
        if (item.items) {
          let { items = [], ...rest } = item;
          let obj = {
            ...rest,
            order: index + Number(skip) + 1,
          };
          result.push(obj);
          if (Array.isArray(items) && items.length > 0) {
            items.map(i => {
              let obj = {
                ...i,
                order: '',
                apartmentCode: '',
              };
              result.push(obj);
            });
          }
        } else {
          let obj = {
            ...item,
            order: index + Number(skip) + 1,
          };
          result.push(obj);
        }
      });
    }
    return result || [];
  };

  const handleLoadData = (page = 0, skip = 0, limit = 10) => {
    const newQuery = {
      ...queryFilter,
      skip,
      limit,
    };
    {
      console.log('newQuery', newQuery);
    }

    setQueryFilter(newQuery);
  };

  // const handleChangePerod = (e, fieldName) => {
  //   let name = fieldName;
  //   let value = moment(e).format('YYYY/MM');

  //   console.log('name', name);
  //   console.log('value', value);
  //   console.log('queryFilter', queryFilter);
  //   setQueryFilter({
  //     ...queryFilter,
  //     periodStr
  //     // filter: {
  //     //   ...queryFilter.filter,
  //     //   [name]: value,
  //     // },
  //   });
  // };
  const handleExportExcel = () => {
    setExportExcel(true);
    setType('EXCEL');
  };

  const handleCloseExcel = useCallback(
    () => {
      setExportExcel(false);
      if (type === 'PDF') {
        let pdf = tableToPDF('excel-table-meter', 'reportFinanceDebtOver', 'Báo cáo nk công tơ');
        let win = window.open('', '', 'height=700,width=700');
        win.document.write(pdf);
        win.document.close(); // CLOSE THE CURRENT WINDOW.
        win.print();
      } else {
        exportTableToExcel('excel-table-meter', 'Báo cáo nk công tơ');
      }
    },
    [type],
  );
  const handleExportPDF = () => {
    setExportExcel(true);
    setType('PDF');
  };
  const mapFunction = item => {
    return {
      waterChargeCode:
        item.waterCharge &&
        item.waterCharge[0] &&
        item.waterCharge[0].asset &&
        item.waterCharge[0].asset[0] &&
        item.waterCharge[0].asset[0].code,
      waterChargeName:
        item.waterCharge &&
        item.waterCharge[0] &&
        item.waterCharge[0].asset &&
        item.waterCharge[0].asset[0] &&
        item.waterCharge[0].asset[0].name,
      waterFromValue: item.waterFromValue,
      waterToValue: item.waterToValue,
      electricityChargeCode:
        item.electricityCharge &&
        item.electricityCharge[0] &&
        item.electricityCharge[0].asset &&
        item.electricityCharge[0].asset[0] &&
        item.electricityCharge[0].asset[0].code,
      electricityChargeName:
        item.electricityCharge &&
        item.electricityCharge[0] &&
        item.electricityCharge[0].asset &&
        item.electricityCharge[0].asset[0] &&
        item.electricityCharge[0].asset[0].name,
      elecFromValue: item.elecFromValue,
      elecToValue: item.elecToValue,
      ...item,
    };
  };
  return (
    <>
      <CustomAppBar title={'Báo cáo nk công tơ'} onGoBack={onClose} disableAdd />
      <Paper style={{ padding: ' 80px 20px 0 20px' }}>
        <div>
          <FilterReport
            onGetFilter={handleGetFilter}
            // handleChangePerod={handleChangePerod}
            valueDate={queryFilter}
            isReport={true}
            // handleChangeDate={handleChangeDate}
            code="reportMeter"
            disableCustomer
            reportMeter
          />
        </div>

        <ListPage
          apiUrl={`${API_METER}?${serialize(queryFilter)}`}
          customColumns={getColumns}
          columns={getColumns()}
          customRows={getRows || []}
          perPage={queryFilter.limit}
          mapFunction={mapFunction}
          isReport={true}
          onLoad={handleLoadData}
          // filter={queryFilter}
          count={count}
          isSpecialList={true}
          disableEdit
          disableAdd
          disableSearch
          disableConfig
          disableSelect
        />
        <ExportTable
          filter={queryFilter}
          viewConfigs={getColumns()}
          getRows={getRows}
          url={API_METER}
          open={exportExcel}
          onClose={handleCloseExcel}
        />
        <Grid
          container
          row
          spacing={8}
          alignItems="center"
          justify="flex-end"
          style={{ marginTop: '20px' }}
        >
          <Grid container item style={{ width: 350 }}>
            <Grid item xs={6} spacing={4}>
              <Button variant="outlined" color="primary" onClick={handleExportExcel}>
                XUẤT FILE EXCEL
              </Button>
            </Grid>
            <Grid item xs={6} spacing={4}>
              <Button variant="outlined" color="primary" onClick={handleExportPDF}>
                XUẤT FILE PDF
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
