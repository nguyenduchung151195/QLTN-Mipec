/**
 *
 * TimekeepTable
 *
 */

import React, { memo, useState, useEffect, useCallback } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import { Grid, MenuItem, TextField, Typography, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@material-ui/core';

/* eslint-disable react/prefer-stateless-function */

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    paddingBottom: 10,
    paddingRight: 5,
  },
  tablecell: {
    border: '1px solid rgba(224, 224, 224, 1)',
    width: '100%',
    textAlign: 'center',
    // padding: 8
  },
  table: {
    minWidth: 700,
  },
  name: {
    width: 150,
  },
});

function TimekeepTable(props) {
  const { symbols, onSymbolChange, onCellClick, day, row, classes, onShow} = props;
  const handleChange = e => {
    onSymbolChange(e, day, row);
  };
  const handleClick = e => {
    onCellClick(e, day, row);
  };
  function handleInfo(){
    let data= [];
    if(day.faceTk){
     data = day.faceTk
    }
    return(
      <>
        {
        data.length > 0 ? data.map(
          item =>(
            <>
              <div>Giờ vào: {item.in}</div>
              <div>Giờ ra:{item.out} </div>
            </>
          )
        ): (<div>Không có thông tin giờ vào giờ ra</div>)}
      </>
      )
  }
  // useEffect(()=>{
  //   if(day.faceTk.time){
  //     console.log('aaaaaaaaaaa')
  //   }
  // },[])

  const colorCell = () => {
    if (day) {
      switch (day.symbol) {
        case "X":
          return '#FFFF66';
        case "4X":
          return '#99FFFF';
        case "P":
          return '#FFCC00';
        default:
          return '#FFFFFF';
      }
    }
  }
  return (
    <>
      {/* <Tooltip title={handleInfo()}> */}
        <TableCell style={{backgroundColor: colorCell()}} onClick={handleClick} align="center" className={classes.tablecell} >
          <>
            {day && day.symbol ? day.symbol : ''}
            {day.faceTk ? day.faceTk.map(item => {
              if (typeof item.in === 'string') {
                return <div>In: {item.in}</div>
              }
              if (typeof item.out === 'string') {
                return <div>Out: {item.out}</div>
              }
              return null;
            }) : null}
          </>
        </TableCell>
      {/* </Tooltip> */}
    </>
  );
}

TimekeepTable.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  // dispatch: PropTypes.func.isRequired,
};

export default compose(
  withStyles(styles),
  memo,
)(TimekeepTable);
