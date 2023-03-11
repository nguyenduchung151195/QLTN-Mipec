import React, { useEffect, useState } from 'react';
import { Loading } from '../../LifetekUi';
import { fetchData, serialize } from '../../../helper';

function ExportExcel(props) {
  const { filter, url, open, getRows, viewConfigs = [], onClose } = props;
  const [data, setData] = useState([]);

  useEffect(
    () => {
      if (url && open) {
        getData();
      }
    },
    [filter, open, url],
  );

  const getData = async () => {
    try {
      const query = serialize(filter);
      console.log('query', query);
      const apiUrl = `${url}?${query}`;
      const res = await fetchData(apiUrl);
      console.log('res', res);
      if (res && res.status !== 0) {
        let result = getRows(res);
        console.log('result', result);
        if (Array.isArray(result)) {
          setData(result);
        }
        onClose();
      }
    } catch (error) {
      console.log(1, error);
    }
  };
  const mapFunction = item => {
    console.log('item', item);
    // item.totalDebt=!isNaN(item.totalDebt) ? Number(item.totalDebt).toLocaleString("en-IE", { maximumFractionDigits: 3 }): item.totalDebt;
    // item.firtDebt=!isNaN(item.firtDebt) ? Number(item.firtDebt).toLocaleString("en-IE", { maximumFractionDigits: 3 }): item.firtDebt;
    // item.secDebt=!isNaN(item.secDebt) ? Number(item.secDebt).toLocaleString("en-IE", { maximumFractionDigits: 3 }): item.secDebt;
    // item.thirdDebt=!isNaN(item.thirdDebt) ? Number(item.thirdDebt).toLocaleString("en-IE", { maximumFractionDigits: 3 }): item.thirdDebt;
    // item.forthDebt=!isNaN(item.forthDebt) ? Number(item.forthDebt).toLocaleString("en-IE", { maximumFractionDigits: 3 }): item.forthDebt;
    // item.fifthDebt=!isNaN(item.fifthDebt) ? Number(item.fifthDebt).toLocaleString("en-IE", { maximumFractionDigits: 3 }): item.fifthDebt;
    return item;
  };
  return (
    <React.Fragment>
      {open ? (
        <Loading />
      ) : (
        <table id="excel-table-diary" style={{ display: 'none' }}>
          <thead>
            <tr >
              {viewConfigs && viewConfigs.map(th => <th style={{ background: '#959a95' }} >{th.title}</th>)}
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map(mapFunction).map(item => (
                <tr>
                  <td style={{ border: '1px solid gray' }}>{item.assetCode}</td>
                  <td style={{ border: '1px solid gray' }}>{item.assetName}</td>
                  <td style={{ border: '1px solid gray' }}>{item.createdAt}</td>
                  <td style={{ border: '1px solid gray' }}>{item.actionType}</td>
                  <td style={{ border: '1px solid gray' }}>{item.kanbanStatus}</td>
                  <td style={{ border: '1px solid gray' }}>{item.userReceive}</td>
                  <td style={{ border: '1px solid gray' }}>{item.userReceiveName}</td>
                  <td style={{ border: '1px solid gray' }}>{item.createdBy}</td>
                  <td style={{ border: '1px solid gray' }}>{item.createdByName}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </React.Fragment>
  );
}
export default ExportExcel;
