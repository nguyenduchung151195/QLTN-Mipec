/**
 *
 * StockManager
 *
 */

import React, { useState } from 'react';
import { Tab, Tabs, withStyles } from '@material-ui/core';
import AddStockManager from 'containers/AddStockManager';
import { SwipeableDrawer } from '../../components/LifetekUi';
const VerticalTabs = withStyles(() => ({
  flexContainer: {
    flexDirection: 'column',
  },
  indicator: {
    display: 'none',
  },
}))(Tabs);

const VerticalTab = withStyles(() => ({
  selected: {
    color: 'white',
    backgroundColor: `#2196F3`,
    borderRadius: '5px',
    boxShadow: '3px 5.5px 7px rgba(0, 0, 0, 0.15)',
  },
  root: {
    minWidth:'100%',
  },
}))(Tab);

/* eslint-disable react/prefer-stateless-function */
function StockManager(props) {
  const { roles = [] } = props;
  const [tab, setTab] = useState();
  const [open, setOpen] = useState(false);

  const handleOpen = value => {
    setTab(value);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const hasPermission = moduleCode => {
    return Array.isArray(roles) && roles.find(r => r.codeModleFunction === moduleCode && r.methods && r.methods[0] && r.methods[0].allow);
  };
  console.log('roles', roles)
  return (
    <div>
      <VerticalTabs value={tab} wrapped={true}>
        {hasPermission('reportStockGeneral') && (
          <VerticalTab
            style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
            label="Báo cáo xuất nhập tồn kho theo sản phẩm"
            onClick={() => handleOpen(0)}
          />
        )}
        {hasPermission('reportStockImportByProduct') && (
          <VerticalTab
            style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
            label="Báo cáo nhập hàng theo sản phẩm"
            onClick={() => handleOpen(1)}
          />
        )}
        {hasPermission('reportStockExportByProduct') && (
          <VerticalTab
            style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
            label="Báo cáo xuất hàng theo sản phẩm"
            onClick={() => handleOpen(2)}
          />
        )}
        {hasPermission('reportStockByAsset') && (
          <VerticalTab
            style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
            label="Báo cáo xuất nhập tồn kho theo tài sản"
            onClick={() => handleOpen(3)}
          />
        )}
        {hasPermission('reportStockImportByAsset') && (
          <VerticalTab
            style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
            label="Báo cáo nhập hàng theo tài sản"
            onClick={() => handleOpen(4)}
          />
        )}
        {hasPermission('reportStockExportByAsset') && (
          <VerticalTab
            style={{ textAlign: 'left', textTransform: 'none', width: 400 }}
            label="Báo cáo xuất hàng theo tài sản"
            onClick={() => handleOpen(5)}
          />
        )}
      </VerticalTabs>
      <SwipeableDrawer anchor="right" onClose={handleClose} open={open} width={window.innerWidth - 260}>
        <AddStockManager onClose={handleClose} tab={tab} />
      </SwipeableDrawer>
    </div>
  );
}

export default StockManager;
