import React, { useEffect, useState } from 'react';
import { Loading } from '../../LifetekUi';
import { fetchData, serialize } from '../../../helper';
// import {DataGrid} from'@material-ui/core'

function ExportExcel(props) {
  const { filter, url, open, getRows, viewConfigs, onClose } = props;
  const [data, setData] = useState([]);

  useEffect(
    () => {
      console.log('open', open);
      if (url && open) {
        getData();
      }
    },
    [filter, open, url],
  );

  const getData = async () => {
    try {
      const query = serialize(filter);
      const apiUrl = `${url}?${query}`;
      const res = await fetchData(apiUrl);
      if (res && res.status !== 0) {
        let result = getRows && getRows(res);
        if (Array.isArray(result)) {
          setData(result);
          onClose();
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <React.Fragment>
      {console.log('data111', data)}
      {open ? (
        <Loading />
      ) : (
        <table id="excel-table-general-number" style={{ display: 'none' }}>
          <thead>
            <tr >{viewConfigs && viewConfigs.map(th => <th style={{ background: '#959a95' }}>{th.title}</th>)}</tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.length > 0 &&
              data.map(item => (
                <>
                  <tr>
                    <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.index}</td>
                    <td style={{ border: '1px solid gray' }}>{item.organizationUnitId}</td>
                    <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.count}</td>
                    <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.total}</td>
                  </tr>
                </>
              ))}
          </tbody>
        </table>
      )}
    </React.Fragment>
  );
}
export default ExportExcel;
