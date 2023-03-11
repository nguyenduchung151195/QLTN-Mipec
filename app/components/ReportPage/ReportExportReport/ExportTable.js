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
        <table id="excel-table-export-report" style={{ display: 'none' }}>
          <thead>
            <tr style={{ background: '#959a95' }}>{viewConfigs && viewConfigs.map(th => <th>{th.title}</th>)}</tr>
          </thead>
          <tbody>
            {/* {console.log(4444, data)} */}
            {data &&
              data.map(mapFunction).map(item => (
                <tr>
                  <td style={{ border: '1px solid gray' }}>{item.supplierCode}</td>
                  <td style={{ border: '1px solid gray' }}>{item.supplier}</td>
                  <td style={{ border: '1px solid gray' }}>{item.address}</td>
                  <td style={{ border: '1px solid gray' }}>{item.taxCode}</td>
                  <td style={{ border: '1px solid gray' }}>{item.productId}</td>
                  <td style={{ border: '1px solid gray' }}>{item.name}</td>
                  <td style={{ border: '1px solid gray' }}>{item.amount}</td>
                  <td style={{ border: '1px solid gray' }}>{item.price}</td>
                  {/* <td style={{ border: '1px solid gray' }}>{item.createdByName}</td> */}
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </React.Fragment>
  );
}
export default ExportExcel;
