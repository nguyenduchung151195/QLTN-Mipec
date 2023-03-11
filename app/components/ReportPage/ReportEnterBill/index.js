import React, { useCallback, useState } from 'react';
import { Paper, Grid, Button } from '@material-ui/core';
import ListPage from 'containers/ListPage';
import CustomAppBar from 'components/CustomAppBar';

import moment from 'moment';

import FilterReport from '../../FilterReport';
import { API_STOCK_EXPORT_PRODUCT } from '../../../config/urlConfig';
import { serialize, exportTableToExcel, exportTableToExcelXSLX, tableToPDF } from '../../../helper';
import ExportTable from './ExportTable';

export default function ReportEnterBill(props) {
  const { onClose } = props;
  const INITIAL_QUERY = {
    limit: 10,
    skip: 0,
  };
  const [queryFilter, setQueryFilter] = useState(INITIAL_QUERY);
  const [count, setCount] = useState(0);
  const [exportExcel, setExportExcel] = useState(false);
  const [type, setType] = useState('PDF');
  const getColumns = () => {
    const viewConfig = [];
    viewConfig[0] = { name: 'code', title: 'Số chứng từ xuất', checked: true, width: 150 };
    viewConfig[1] = { name: 'exportDate', title: 'Ngày xuất', checked: true, width: 150 }; // chua co data ngay xuat
    viewConfig[2] = { name: 'supplier', title: 'Nhà cung cấp', checked: true, width: 150 };
    viewConfig[3] = { name: 'status', title: 'Trạng thái', checked: true, width: 150 };
    viewConfig[4] = { name: 'productCode', title: 'Mã sản phẩm', checked: true, width: 150 };
    viewConfig[5] = { name: 'productName', title: 'Tên sản phẩm', checked: true, width: 150 };
    viewConfig[6] = { name: 'unit', title: 'Đơn vị tính', checked: true, width: 150 };
    viewConfig[7] = { name: 'amount', title: 'Số lượng', checked: true, width: 150 };
    viewConfig[8] = { name: 'importPrice', title: 'Đơn giá', checked: true, width: 150 };
    viewConfig[9] = { name: 'intoMoney', title: 'Thành tiền', checked: true, width: 150 };

    //     viewConfig[8] = { name: 'createdByName', title: 'Tên người chỉnh sửa', checked: true, width: 150 };
    return viewConfig;
  };
  const handleGetFilter = useCallback(
    obj => {
      console.log('obj', obj);

      if (!obj.organizationUnitId) {
        delete queryFilter.organizationUnitId;
        setQueryFilter({ ...queryFilter });
      } else {
        setQueryFilter({ ...queryFilter, organizationUnitId: obj.organizationUnitId });
        console.log('queryFilter', queryFilter);
      }
    },
    [queryFilter],
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

    setQueryFilter(newQuery);
  };

  const handleChangeDate = (e, fieldName) => {
    let name = fieldName;
    let value = moment(e).format('YYYY/MM/DD');
    setQueryFilter({
      ...queryFilter,
      [name]: value,
    });
  };

  const handleExportExcel = () => {
    setExportExcel(true);
    setType('EXCEL');
  };

  const handleCloseExcel = useCallback(
    () => {
      setExportExcel(false);
      if (type === 'PDF') {
        let pdf = tableToPDF('excel-table-enter-bill', 'reportEnterBill', 'Bảng kê phiếu xuất');
        let win = window.open('', '', 'height=700,width=700');
        win.document.write(pdf);
        win.document.close(); // CLOSE THE CURRENT WINDOW.
        win.print();
      } else {
        exportTableToExcel('excel-table-enter-bill', 'Bảng kê phiếu xuất');
      }
    },
    [type],
  );
  const handleExportPDF = () => {
    setExportExcel(true);
    setType('PDF');
  };

  return (
    <>
      <CustomAppBar title={'Bảng kê phiếu xuất'} onGoBack={onClose} disableAdd />
      <Paper style={{ padding: ' 80px 20px 170px 20px' }}>
        <div>
          <FilterReport
            onGetFilter={handleGetFilter}
            valueDate={queryFilter}
            isReport={true}
            handleChangeDate={handleChangeDate}
            code="reportEnterBill"
            disableCustomer
          />
        </div>
        <ListPage

          apiUrl={`${API_STOCK_EXPORT_PRODUCT}?${serialize(queryFilter)}`}
          // apiUrl={API_ASSET_ALLOCATE_LOG}
          customColumns={getColumns}
          columns={getColumns()}
          customRows={getRows || []}
          perPage={queryFilter.limit}
          // mapFunction={mapFunction}
          isReport={true}
          onLoad={handleLoadData}
          // filter={queryFilter}
          count={count}
          isCoupon
          // isSpecialList={true}
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
          url={API_STOCK_EXPORT_PRODUCT}
          open={exportExcel}
          onClose={handleCloseExcel}
        />
        <Grid
          container
          row
          spacing={8}
          alignItems="center"
          justify="flex-end"
          style={{ marginTop: '20px', padding: '0 15px 30px 0' }}
        >
          <Grid container item style={{ width: '375px', padding: '0', gap: '0 30px' }}>
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
    </>
  );
}