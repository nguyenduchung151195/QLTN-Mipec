import React, { useEffect, useCallback, useState } from 'react';
import { Grid, Paper, Button } from '@material-ui/core';
import moment from 'moment';
import ListPage from 'containers/ListPage';
import { API_GENERAL_REVENUE } from '../../../config/urlConfig';
import ExportTable from './ExportTable';
import FilterReport from '../../FilterReport';
import { serialize, exportTableToExcel, tableToPDF } from '../../../helper';

function ReportRevenueGeneral(props) {
  const INITIAL_QUERY = {
    filter: {
      periodStr: {
        $gte: moment().format('YYYY-MM'),
        $lte: moment().format('YYYY-MM'),
      },
    },
    limit: 10,
    skip: 0,
  };
  const [queryFilter, setQueryFilter] = useState(INITIAL_QUERY);
  const [exportExcel, setExportExcel] = useState(false);
  const [count, setCount] = useState(0);
  const [type, setType] = useState('PDF');
  const [carCharge, setCarCharge] = useState([]);

  useEffect(() => {
    fetch(`${API_GENERAL_REVENUE}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(data => data.json())
      .then(response => {
        setCarCharge(response.carCharge);
      });
  }, []);

  const getColumns = carCharge => {
    let viewConfig = [];
    viewConfig[0] = { name: 'order', title: 'STT', checked: true, width: 60 };
    viewConfig[1] = { name: 'apartmentCode', title: 'Mã khách hàng', checked: true, width: 120 };
    viewConfig[2] = { name: 'acreageOfService', title: 'Diện tích', checked: true, width: 120 };
    viewConfig[3] = { name: 'quality', title: 'Đơn giá', checked: true, width: 120 };
    viewConfig[4] = { name: 'serviceMoney', title: 'Thành tiền', checked: true, width: 120 };

    viewConfig[5] = { name: 'electric_startNumber', title: 'Số ĐK', checked: true, width: 120 };
    viewConfig[6] = { name: 'electric_endNumber', title: 'Số CK', checked: true, width: 120 };
    viewConfig[7] = { name: 'electric_quality', title: 'Điện TT', checked: true, width: 120 };
    viewConfig[8] = { name: 'electricMoney', title: 'Thành tiền', checked: true, width: 120 };

    viewConfig[9] = { name: 'water_startNumber', title: 'Số ĐK', checked: true, width: 120 };
    viewConfig[10] = { name: 'water_endNumber', title: 'Số CK', checked: true, width: 120 };
    viewConfig[11] = { name: 'water_quality', title: 'Nước TT', checked: true, width: 120 };
    viewConfig[viewConfig.length] = {
      name: 'waterMoney',
      title: 'Thành tiền',
      checked: true,
      width: 120,
    };
    if (Array.isArray(carCharge) && carCharge.length > 0) {
      for (let i = 0; i < carCharge.length; i++) {
        let currentIndex = viewConfig.length;
        viewConfig[currentIndex] = {
          name: carCharge[i].code,
          title: carCharge[i].name,
          checked: true,
          width: 120,
        };
      }
    }
    viewConfig[viewConfig.length] = { name: 'total', title: 'Tổng số', checked: true, width: 120 };

    // viewConfig[13] = { name: 'ot001', title: 'Ô tô', checked: true, width: 120 };
    // viewConfig[14] = { name: 'xm001', title: 'Xe máy', checked: true, width: 120 };
    // viewConfig[15] = { name: 'xd001', title: 'Xe đạp', checked: true, width: 120 };
    // viewConfig[16] = { name: 'xdd01', title: 'Xe đạp điện', checked: true, width: 120 };
    // viewConfig[17] = { name: 'xeMayDien', title: 'Xe máy điện', checked: true, width: 120 };
    // viewConfig[18] = { name: 'carMoney', title: 'Thành tiền', checked: true, width: 120 };

    return viewConfig;
  };
  const handleGetFilter = useCallback(
    obj => {
      console.log('obj',obj);
      let newFilter = {
        ...queryFilter,
        filter: {
          periodStr: {
            $gte: obj.periodStr ? moment(obj.periodStr.gte, 'YYYYMM').format('YYYY-MM') : null,
            $lte: obj.periodStr ? moment(obj.periodStr.lte, 'YYYYMM').format('YYYY-MM') : null,
          },
        },
      };
      if (!obj.group) {
        delete newFilter.filter.customerGroup;
      }else{
        newFilter.filter.customerGroup = obj.group && obj.group.value;
      }
      if (!obj.organizationUnitId ) {
        delete newFilter.filter.organizationUnitId;
      }else{
        newFilter.filter.organizationUnitId = obj.organizationUnitId;
      }
      console.log('newFilter',newFilter);

      setQueryFilter(newFilter);
    },
    [queryFilter.filter],
  );

  const handleLoadData = (page = 0, skip = 0, limit = 10) => {
    const newQuery = {
      filter: {
        ...queryFilter.filter,
      },
      skip,
      limit,
    };
    setQueryFilter(newQuery);
  };
  const getRows = ({ data = [], count }) => {
    let rows = [];
    // console.log(data);
    setCount(count);
    if (Array.isArray(data) && data.length > 0) {
      data.map((item, index) => {
        const elcStartNumber =
          Array.isArray(item.electricityCharge) &&
          Number(item.electricityCharge.length) === 1 &&
          Number(item.electricityCharge[0].updateAsset.length) === 1
            ? item.electricityCharge[0].updateAsset[0].fromValue
            : '';
        const elcEndNumber =
          Array.isArray(item.electricityCharge) &&
          Number(item.electricityCharge.length) === 1 &&
          Number(item.electricityCharge[0].updateAsset.length) === 1
            ? item.electricityCharge[0].updateAsset[0].toValue
            : '';
        const elcTotalValue =
          Array.isArray(item.electricityCharge) &&
          Number(item.electricityCharge.length) === 1 &&
          Number(item.electricityCharge[0].updateAsset.length) === 1 &&
          elcStartNumber &&
          elcEndNumber
            ? (Number(elcEndNumber) - Number(elcStartNumber)) *
              Number(item.electricityCharge[0].updateAsset[0].coefficient || 1)
            : '';
        const waterStartNumber =
          Array.isArray(item.waterCharge) &&
          Number(item.waterCharge.length) === 1 &&
          Number(item.waterCharge[0].updateAsset.length) === 1
            ? item.waterCharge[0].updateAsset[0].fromValue
            : '';
        const waterEndNumber =
          Array.isArray(item.waterCharge) &&
          Number(item.waterCharge.length) === 1 &&
          Number(item.waterCharge[0].updateAsset.length) === 1
            ? item.waterCharge[0].updateAsset[0].toValue
            : '';
        const waterTotalValue =
          Array.isArray(item.waterCharge) &&
          Number(item.waterCharge.length) === 1 &&
          Number(item.waterCharge[0].updateAsset.length) === 1 &&
          waterStartNumber &&
          waterEndNumber
            ? (Number(waterEndNumber) - Number(waterStartNumber)) *
              Number(item.waterCharge[0].updateAsset[0].coefficient || 1)
            : '';
        // const elcE
        let obj = {
          order: queryFilter.skip ? Number(queryFilter.skip) + index + 1 : index + 1,
          apartmentCode: item.apartmentCode ? item.apartmentCode : '',

          serviceMoney:
            item &&
            !isNaN(item.serviceChargeMoney) &&
            Number(item.serviceChargeMoney).toLocaleString('es-AR', { maximumFractionDigits: 0 }),

          electric_startNumber: elcStartNumber,
          electric_endNumber: elcEndNumber,
          electric_quality: elcTotalValue,
          electricMoney:
            item.electricityMoney &&
            !isNaN(item.electricityMoney) &&
            Number(item.electricityMoney).toLocaleString('es-AR', { maximumFractionDigits: 0 }),

          water_startNumber: waterStartNumber,
          water_endNumber: waterEndNumber,
          water_quality: waterTotalValue,
          waterMoney:
            item.waterChargeMoney &&
            !isNaN(item.waterChargeMoney) &&
            Number(item.waterChargeMoney).toLocaleString('es-AR', { maximumFractionDigits: 0 }),
          carMoney:
            item.carChargeMoney &&
            !isNaN(item.carChargeMoney) &&
            Number(item.carChargeMoney).toLocaleString('es-AR', { maximumFractionDigits: 0 }),

          total: item.totalMoney
            ? !isNaN(item.totalMoney) &&
              Number(item.totalMoney).toLocaleString('es-AR', { maximumFractionDigits: 0 })
            : '',
        };
        if (item.carCharge && item.carCharge.length > 0) {
          item.carCharge.map(carCharge => {
            obj[carCharge.code] = !isNaN(carCharge.totalMoney)
              ? Number(carCharge.totalMoney).toLocaleString('es-AR', { maximumFractionDigits: 0 })
              : 0;
          });
        }
        if (item.serviceCharge && item.serviceCharge.length > 0) {
          item.serviceCharge.map(ground => {
            obj.quality = !isNaN(ground.price)
              ? Number(ground.price).toLocaleString('es-AR', { maximumFractionDigits: 0 })
              : 0;
            obj.acreageOfService = ground.amount;
          });
        }
        rows.push(obj);
      });
    }
    return rows;
  };
  const handleExportExcel = () => {
    setExportExcel(true);
    setType('EXCEL');
  };

  const handleCloseExcel = useCallback(
    () => {
      setExportExcel(false);
      if (type === 'PDF') {
        let pdf = tableToPDF(
          'excel-table-general',
          'reportFinanceGeneralRevenue',
          'Báo cáo tổng hợp doanh thu',
        );
        let win = window.open('', '', 'height=700,width=700');
        win.document.write(pdf);
        win.document.close(); // CLOSE THE CURRENT WINDOW.
        win.print();
      } else {
        exportTableToExcel('excel-table-general', 'Báo cáo tổng hợp doanh thu');
      }
    },
    [type],
  );
  const handleExportPDF = () => {
    setExportExcel(true);
    setType('PDF');
  };

  return (
    <Paper>
      <div>
        <FilterReport
          queryFilter={queryFilter}
          isReport={true}
          onGetFilter={handleGetFilter}
          code="reportCostRevenue"
        />
      </div>
      <ListPage
        apiUrl={`${API_GENERAL_REVENUE}?${serialize(queryFilter)}`}
        columns={getColumns(carCharge)}
        customRows={getRows}
        perPage={queryFilter.limit}
        isReport={true}
        onLoad={handleLoadData}
        count={count}
        disableEdit
        disableAdd
        disableConfig
        disableSearch
        disableSelect
      />
      <ExportTable
        filter={queryFilter}
        getRows={getRows}
        viewConfigs={getColumns(carCharge)}
        url={API_GENERAL_REVENUE}
        open={exportExcel}
        onClose={handleCloseExcel}
      />
      <Grid
        container
        row
        spacing={8}
        alignItems="center"
        justify="flex-end"
        style={{ marginTop: '20px', padding:"0 20px 20px 0" }}
      >
        <Grid container item style={{ width: '357px', padding: '0', gap: '0 30px' }}>
          <Grid item spacing={4} style={{ flex: 1 }}>
            <Button variant="outlined" style={{ width: '100%' }} color="primary" onClick={handleExportExcel}>
              XUẤT FILE EXCEL
            </Button>
          </Grid>
          <Grid item spacing={4} style={{ flex: 1 }}>
            <Button variant="outlined" style={{ width: '100%' }} color="primary" onClick={handleExportPDF}>
              XUẤT FILE PDF
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
export default ReportRevenueGeneral;
