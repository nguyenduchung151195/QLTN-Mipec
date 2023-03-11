import React, { memo, useState, useEffect } from 'react';

import { Grid as GridMaterialUI } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import toVietNamDate from '../../helper';
import moment from 'moment';
import axios from 'axios';
import { API_APPROVE, API_COMMON } from '../../config/urlConfig';
import { serialize } from '../../utils/common';
import dot from 'dot-object';

const TypographyDetail = ({ children, data }) => {
  return (
    <div className="task-info-detail">
      <p>{children}:</p>
      <p>{data}</p>
    </div>
  );
};
function ViewContent(props) {
  const [urlData, setUrlData] = useState([]);
  const [dataInfor, setDataInfor] = useState(props.dataInfo);
  const dataInfo = dataInfor ? (dataInfor.length > 2 ? dataInfor.find(e => e._id === props.id) : dataInfor) : null;
  let code = '';
  if (props.code === 'Tas') {
    code = 'Task';
  } else {
    code = props.code;
  }
  if (dataInfor.isFinished) {
    code = 'StockImport';
  }
  const viewConfig = JSON.parse(localStorage.getItem('viewConfig'));
  const list = viewConfig.find(item => item.code === code);
  let data = [];
  if (list) {
    data = list.listDisplay.type.fields.type.columns.filter(i => i.checked).filter(f => f.name !== "category" && f.name !== "contractCode");
  }
  useEffect(
    () => {
      let mdcode = '';
      let mdItem = '';
      if (props.code === 'Tas') {
        mdcode = 'Task';
        mdItem = props.objectId ? props.objectId : props.id;
      } else {
        mdcode = props.code;
        mdItem = props.idItem ? props.idItem : props.id;
      }
      //test 13/12/2021
      if (dataInfo.isFinished) {
        mdcode = 'StockImport'
      }

      const api = `${API_COMMON}/${mdcode}/${mdItem}`;
      axios
        .get(api, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })
        .then(res => {
          setDataInfor(res.data);
        })
        .catch(error => console.log(error, props, 'kkkk'));
    },
    [props.code, props.idItem, props.objectId],
  );
  const convertType = (rowType) => {
    if (props.code === "StockExport") {
      const type = Number(rowType);
      switch (type) {
        case 1:
          return 'Xuất hàng trực tiếp theo sản phẩm';
        case 2:
          return 'Trả hàng';
        case 3:
          return 'Yêu cầu chuyển kho theo sản phẩm';
        case 6:
          return 'Xuất hàng trực tiếp theo tài sản';
        case 7:
          return 'Yêu cầu chuyển kho theo tài sản'
        default:
          return 'Xuât hàng trực tiếp theo sản phẩm';
      }
    }
    if (props.dataInfo && props.dataInfo.isFinished) {
      const type = Number(rowType);
      switch (type) {
        case 1:
          return 'Nhập hàng trực tiếp theo sản phẩm';
        case 3:
          return 'Phê duyệt chuyển kho theo sản phẩm';
        case 6:
          return 'Nhập hàng trực tiếp theo tài sản';
        case 7:
          return 'Phê duyệt chuyển kho theo tài sản'
        default:
          return 'Nhập hàng trực tiếp theo sản phẩm';
      }
    }
    return rowType
  }
  const dotDataInfo = dot.dot({ ...dataInfo, type: convertType(dataInfo.type) });
  const newData = (props.code === "StockExport" || (props.dataInfo && props.dataInfo.isFinished)) ? data.filter(f => f.name !== 'supplier.name' && f.name !== 'organizationUnitId.name').map((item, index) => {
    if (item.name === "type") {
      return {
        ...item,
        menuItem: null
      }
    }
    return item
  }) : data;
  return (
    <div>
      <GridMaterialUI container>
        {dotDataInfo
          ? newData.map(item => (
            <GridMaterialUI item xs={6}>
              <TypographyDetail
                data={
                  ["join", "support", "inCharge", "taskManager"].findIndex(f => f === item.name) === -1 ?
                    Array.isArray(dotDataInfo[item.name]) ?
                      dotDataInfo[item.name].map(i => {
                        typeof i === Object ? (i ? `${i.name}` : []) : i ? `${i}` : [];
                      }) :
                      ["priority", "type", "state", "taskStatus"].findIndex(f => f === item.name) !== -1 && Array.isArray(item.menuItem) ? item.menuItem.findIndex(f => f.code === Number(dotDataInfo[item.name])) !== -1 ? item.menuItem.find(f => f.code === Number(dotDataInfo[item.name])).name : ''
                        : dotDataInfo[`${item.name}.name`] ? dotDataInfo[`${item.name}.name`] :
                          dotDataInfo[item.name]
                    : dotDataInfo[`${item.name}Str`]
                }
              >
                {item.title}
              </TypographyDetail>
            </GridMaterialUI>
          ))
          : null}
      </GridMaterialUI>
    </div>
  );
}

export default memo(ViewContent);
