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
      const apiUrl = `${url}?${query}`;

      const res = await fetchData(apiUrl);
      if (res && res.status !== 0) {
        let result = getRows(res);
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
    item.totalDebt = !isNaN(item.totalDebt) ? Number(item.totalDebt).toLocaleString('en-IE', { maximumFractionDigits: 3 }) : item.totalDebt;
    item.firtDebt = !isNaN(item.firtDebt) ? Number(item.firtDebt).toLocaleString('en-IE', { maximumFractionDigits: 3 }) : item.firtDebt;
    item.secDebt = !isNaN(item.secDebt) ? Number(item.secDebt).toLocaleString('en-IE', { maximumFractionDigits: 3 }) : item.secDebt;
    item.thirdDebt = !isNaN(item.thirdDebt) ? Number(item.thirdDebt).toLocaleString('en-IE', { maximumFractionDigits: 3 }) : item.thirdDebt;
    item.forthDebt = !isNaN(item.forthDebt) ? Number(item.forthDebt).toLocaleString('en-IE', { maximumFractionDigits: 3 }) : item.forthDebt;
    item.fifthDebt = !isNaN(item.fifthDebt) ? Number(item.fifthDebt).toLocaleString('en-IE', { maximumFractionDigits: 3 }) : item.fifthDebt;
    return item;
  };
  return (
    <React.Fragment>
      {open ? (
        <Loading />
      ) : (
        <table id="excel-table-bos" style={{ display: 'none' }}>
          <thead>
            <tr style={{ background: '#959a95' }}>{viewConfigs && viewConfigs.map(th => <th>{th.title}</th>)}</tr>
          </thead>
          <tbody>
            {data &&
              data.map(mapFunction).map(item => (
                <tr>
                  <td style={{ border: '1px solid gray' }}>{item.order}</td>
                  <td style={{ border: '1px solid gray' }}>{item.apartmentCode}</td>
                  <td style={{ border: '1px solid gray' }}>{item.code}</td>
                  <td style={{ border: '1px solid gray' }}>{item.firstSendDate}</td>
                  <td style={{ border: '1px solid gray' }}>{item.totalDebt}</td>
                  <td style={{ border: '1px solid gray' }}>{item.firtDebt}</td>
                  <td style={{ border: '1px solid gray' }}>{item.secDebt}</td>
                  <td style={{ border: '1px solid gray' }}>{item.thirdDebt}</td>
                  <td style={{ border: '1px solid gray' }}>{item.forthDebt}</td>
                  <td style={{ border: '1px solid gray' }}>{item.fifthDebt}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </React.Fragment>
  );
}
export default ExportExcel;
