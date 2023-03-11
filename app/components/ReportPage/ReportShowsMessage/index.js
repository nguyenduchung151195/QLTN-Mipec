import React, { useEffect, useCallback, useState } from 'react';
import { Grid, Paper, Button } from '@material-ui/core';
import moment from 'moment';
import ListPage from 'containers/ListPage';
import { API_REPORT_SEND_TIMES } from '../../../config/urlConfig';
import ExportTable from './ExportTable';
import FilterReport from '../../FilterReport';
import { serialize, exportTableToExcel, tableToPDF } from '../../../helper';
import CustomAppBar from 'components/CustomAppBar';

function ReportRevenueGeneral(props) {
  const { onClose } = props;
  const INITIAL_QUERY = {
    filter: {
      periodStr: moment().format('YYYY-MM'),
    },
    limit: 10,
    skip: 0,
  };
  const [queryFilter, setQueryFilter] = useState(INITIAL_QUERY);
  const [exportExcel, setExportExcel] = useState(false);
  const [count, setCount] = useState(0);
  const [type, setType] = useState('PDF');



  const getColumns = () => {
    let viewConfig = [];
    viewConfig[0] = { name: 'index', title: 'STT', checked: true, width: 120 };
    viewConfig[1] = { name: 'organizationUnitId', title: 'Phòng ban', checked: true, width: 300 };
    viewConfig[2] = { name: 'count', title: 'Số lần gửi Thông báo', checked: true, width: 300 };
    viewConfig[3] = { name: 'total', title: 'Tổng số', checked: true, width: 300 };
    return viewConfig;
  };

  const handleGetFilter = useCallback(
    obj => {
      console.log('obj', obj);
      let newFilter = {
        filter: {
          periodStr: obj.periodStr ?   moment(obj.periodStr.gte).format('YYYY-MM') : ''
        },
      };

      if (obj.organizationUnitId !== '') {
        delete newFilter.filter.organizationUnitId;
        newFilter.filter.organizationUnitId = obj.organizationUnitId;
      } else {
        delete newFilter.filter.organizationUnitId;
      }

      if (!obj.count) {
        delete newFilter.filter.count;
      } else {
        newFilter.filter.count = obj.count;
      }
      console.log('newFilter', newFilter);

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
  // const getRows = ({ data = [], count }) => { 
  //   let rows = [];
  //   console.log(data); 
  //   setCount(count);
  //   if (Array.isArray(data) && data.length > 0) {
  //     data.map((item, index) => {   
  //       rows.push(item)
  //     });
  //   }
  //   return rows;
  // };


  const getRows = ({ data = [], count, skip }) => {
    if (!data) return [];
    setCount(count);
    let result = [];
    Array.isArray(data) &&
      data.map((item, index) => {
        let data = [];
        let i = 0
        if (!item) return []
        Object.keys(item).map((it, idx) => {
          console.log('it',it);
          console.log('idx',idx);
          switch (it) {
            case "send0Time":
              data.push({
                index: idx === 1 ? item.index :  '',
                organizationUnitId:idx === 1 ?  item.organizationName :'',
                count: 0,
                total: item.send0Time
              });
              break;
            case "send1Time":
              data.push({
                index: idx === 1 ? item.index :  '',
                organizationUnitId:idx === 1 ?  item.organizationName :'',
                count: 1,
                total: item.send1Time
              });
              break;
              case "send2Time":
              data.push({
                index: idx === 1 ? item.index :  '',
                organizationUnitId:idx === 1 ?  item.organizationName :'',
                count: 1,
                total: item.send2Time
              });
              break;
              case "send3Time":
              data.push({
                index: idx === 1 ? item.index :  '',
                organizationUnitId:idx === 1 ?  item.organizationName :'',
                count: 3,
                total: item.send3Time
              });
              break;
              case "send4Time":
              data.push({
                index: idx === 1 ? item.index :  '',
                organizationUnitId:idx === 1 ?  item.organizationName :'',
                count: 4,
                total: item.send4Time
              });
              break;
            default:
              break;
          }
          // if (it.includes("send0Time")) {
          //   data.push({
          //     index: index + 1,
          //     organizationUnitId: item.organizationName,
          //     count: i,
          //     total: item.send0Time
          //   });
          //   i++
          // } else if (it.includes("send")) {
          //   data.push({
          //     count: i,
          //     total: item[it]
          //   });
          //   i++
          // }
        });
        result = result.concat(data);
      });
    return result || [];
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
          'excel-table-general-number',
          'ReportShowsMessage',
          'Báo cáo số lần hiển thị thông báo phí',
        );
        let win = window.open('', '', 'height=700,width=700');
        win.document.write(pdf);
        win.document.close(); // CLOSE THE CURRENT WINDOW.
        win.print();
      } else {
        exportTableToExcel('excel-table-general-number', 'Báo cáo số lần hiển thị thông báo phí');
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
      <CustomAppBar title={'Báo cáo số lần hiển thị thông báo phí'} onGoBack={onClose} disableAdd />
      <Paper style={{ padding: ' 80px 20px 0 20px' }}>
        <div>
          <FilterReport
            queryFilter={queryFilter}
            isReport={true}
            onGetFilter={handleGetFilter}
            code="reportSendTimes"
            disableCustomer
          />
        </div>
        <ListPage
          apiUrl={`${API_REPORT_SEND_TIMES}?${serialize(queryFilter)}`}
          customColumns={getColumns}
          columns={getColumns()}
          customRows={getRows || []}
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
          viewConfigs={getColumns()}
          getRows={getRows}
          url={API_REPORT_SEND_TIMES}
          open={exportExcel}
          onClose={handleCloseExcel}
        />
        <Grid
          container
          row
          spacing={8}
          alignItems="center"
          justify="flex-end"
          style={{ marginTop: '20px', padding: "0 20px 20px 0" }}
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
    </>
  );
}
export default ReportRevenueGeneral;
