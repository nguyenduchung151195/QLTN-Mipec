/**
 *
 * TimekeepTable
 *
 */

import React, { memo, useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import { Grid, MenuItem, TextField, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import messages from './messages';
import { injectIntl } from 'react-intl';
import { generateTimekeepingData } from '../../../../../../utils/common';
import TimekeepingTableCell from './TimekeepingTableCell';
import CellEditingModal from '../CellEditingModal';
import _ from 'lodash';
/* eslint-disable react/prefer-stateless-function */
const styles = theme => ({
  root: {
    width: '100%',
    overflow: 'auto',
    paddingBottom: 10,
    paddingRight: 5,
    height: 700
  },
  tablecell: {
    border: '1px solid rgba(224, 224, 224, 1)',
    width: '100%',
    textAlign: 'center',
    padding: '0px 16px',
  },
  table: {
    minWidth: 600,

  },
  fixRow: {
    position: "sticky",
    top: 0,
    border: '1px solid rgba(224, 224, 224, 1)',
    width: '100%',
    textAlign: 'center',
    padding: '1px 16px',
    backgroundColor: '#FFFFFF',
    zIndex: 999,
  },
  fixRow2: {
    position: "sticky",
    top: 54,
    border: '1px solid rgba(224, 224, 224, 1)',
    width: '100%',
    textAlign: 'center',
    padding: '0px 5px',
    backgroundColor: '#FFFFFF',
    zIndex: 999,
  },
  fixColumn: {
    position: "sticky",
    left: 0,
    border: '1px solid rgba(224, 224, 224, 1)',
    width: '100%',
    textAlign: 'center',
    padding: '0px 16px',
    backgroundColor: '#FFFFFF'
  },
  name: {
    width: 150,
    textAlign: 'left'
  }
});

function TimekeepTable(props) {
  const { data, classes, intl, allSymbol, onSaveCellData, updateCellDataSuccess, timekeepTypes, onClose } = props;
  const [rows, setRow] = useState([]);
  const month = moment().get('month');
  const year = moment().get('year');

  const formatDayInWeek = date => {
    const dayInWeek = date.day();
    const dayInMonth = date.date();
    const str = intl.formatMessage(messages[`dayInWeek_${dayInWeek}`] || { id: `dayInWeek_${dayInWeek}`, formatMessage: 'monday' }).toUpperCase();
    return { dayInWeek: str, dayInMonth };
  };
  const [days, setDays] = useState(generateTimekeepingData(month, year).map(item => ({ ...item, ...formatDayInWeek(item.date) })));
  const [openCellEditingModal, setOpenCellEditingModal] = useState(false);
  const [selectedCellData, setSelectedCellData] = useState(null);

  useEffect(
    () => {
      if (data && data.month && data.year) {
        setDays(generateTimekeepingData(data.month - 1, data.year).map(item => ({ ...item, ...formatDayInWeek(item.date) })));
        setRow(data.data);
      }
    },
    [data],
  );
  // useEffect(
  //   () => {fillTimekeepingTypeCount(rows, allSymbol, timekeepTypes)},
  //   []
  // )

  useEffect(() => {
    if (updateCellDataSuccess === true) {
      setOpenCellEditingModal(false);
    }
  }, [updateCellDataSuccess]);

  const fillTimekeepingTypeCount = (timekeepings, symbols, timekeepingTypes) => {
    const initSymbolCount = {};
    const symbol2type = {};
    symbols.forEach((s) => {
      initSymbolCount[s.symbol] = 0;
      const initSymbol2Type = {};
      s.data.forEach((m) => {
        initSymbol2Type[m.hrmTimekeepingTypeCode] = parseInt(m.value, 10) || 0;
      });
      symbol2type[s.symbol] = initSymbol2Type;
    });

    const timekeepingTypeCountObj = {};
    timekeepingTypes.forEach((t) => {
      timekeepingTypeCountObj[t.code] = 0;
    });

    const symbolCountObj = _.reduce(
      timekeepings,
      (result, item) => {
        // console.log('result', result, ', item', item)
        const newResults = {};
        Object.keys(result).forEach((symbol) => {
          if (item.symbol === symbol) {
            newResults[symbol] += 1;
            Object.keys(symbol2type[symbol]).forEach((timekeepingCode) => {
              timekeepingTypeCountObj[timekeepingCode] += symbol2type[symbol][timekeepingCode];
            });
          } else {
            newResults[symbol] = result[symbol];
          }
        });
        return newResults;
      },
      { ...initSymbolCount },
    );
    return timekeepingTypeCountObj;
  };

  const handleChange = (newSymbol, day, row) => {
    if (row && row._id) {
      const newRows = [...rows];
      const foundRow = newRows.find(item => item._id === row._id);
      if (foundRow && day && day._id) {
        const foundDay = foundRow.timekeepingData.find(item => item._id === day._id);
        foundDay.symbol = newSymbol;
        foundDay.shifts = day.shifts
        setRow(newRows);
      }
    }
  };

  const handleSaveCellData = (newData) => {
    handleChange(newData.day.symbol, newData.day, newData.row);
    if (onSaveCellData) {
      setOpenCellEditingModal(false)
      // onClose()
      onSaveCellData(newData);
    }
  }

  const handleCellClick = (e, day, row) => {
    setSelectedCellData({
      day,
      row
    });
    if (day.symbol === 'NP') {
      setOpenCellEditingModal(false);
    } else {
      setOpenCellEditingModal(true);
    }
  };

  const handleCloseCellEditingModal = () => {
    setOpenCellEditingModal(false);
  }
  return (
    <>
      <Grid className={classes.root}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow >
              <TableCell className={classes.fixRow} rowSpan={2}>
                STT
              </TableCell>
              <TableCell className={classes.fixRow} rowSpan={2}>
                Tên
              </TableCell>
              {days.map(day => (
                <TableCell className={classes.fixRow}>{day.dayInMonth}</TableCell>
              ))}
              {timekeepTypes.map(item => (
                <TableCell className={classes.fixRow} rowSpan={2}>
                  {item.name}
                </TableCell>
              ))}
              <TableCell className={classes.fixRow} rowSpan={2}>
                Tổng cộng
              </TableCell>
              <TableCell className={classes.fixRow} rowSpan={2}>
                Ngày nghỉ
              </TableCell>
              <TableCell className={classes.fixRow} rowSpan={2}>
                Ngày đi
              </TableCell>

            </TableRow>
            <TableRow>
              {days.map(day => (
                <TableCell className={classes.fixRow2}>{day.dayInWeek}</TableCell>
              ))}

            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index + 1}>
                <TableCell className={classes.tablecell}>{index + 1}</TableCell>
                <TableCell className={classes.fixColumn}>
                  <Typography className={classes.name}>{row.hrmEmployeeId ? row.hrmEmployeeId.name : 'Không có dữ liệu'}</Typography>
                </TableCell>

                {row.timekeepingData.map(day => (
                  <TimekeepingTableCell symbols={allSymbol} onSymbolChange={handleChange} onCellClick={handleCellClick} day={day} row={row} />
                ))}
                {timekeepTypes.map(item => (
                  <TableCell className={classes.tablecell}>{fillTimekeepingTypeCount(row.timekeepingData, allSymbol, timekeepTypes)[item.code]}</TableCell>
                ))}
                <TableCell className={classes.tablecell} />
                <TableCell className={classes.tablecell} />
                <TableCell className={classes.tablecell} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
      <CellEditingModal symbols={allSymbol} open={openCellEditingModal} cellData={selectedCellData} onSave={handleSaveCellData} onClose={handleCloseCellEditingModal} />
    </>
  );
}

TimekeepTable.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  // dispatch: PropTypes.func.isRequired,
};

export default compose(
  injectIntl,
  withStyles(styles),
  memo,
)(TimekeepTable);
