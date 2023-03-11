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
        <table id="excel-table-meter" style={{ display: 'none' }}>
          <thead>
            <tr style={{ background: '#959a95' }}>{viewConfigs && viewConfigs.map(th => <th>{th.title}</th>)}</tr>
          </thead>
          <tbody>
            {console.log('data', data)}
            {data &&
              data.map(mapFunction).map(item => (
                <tr>
                  <td style={{ border: '1px solid gray' }}>{item.apartmentCode}</td>
                  <td style={{ border: '1px solid gray' }}>
                    {item.waterCharge &&
                      item.waterCharge[0] &&
                      item.waterCharge[0].asset &&
                      item.waterCharge[0].asset[0] &&
                      item.waterCharge[0].asset[0].code}
                  </td>
                  <td style={{ border: '1px solid gray' }}>
                    {' '}
                    {item.waterCharge &&
                      item.waterCharge[0] &&
                      item.waterCharge[0].asset &&
                      item.waterCharge[0].asset[0] &&
                      item.waterCharge[0].asset[0].name}
                  </td>
                  <td style={{ border: '1px solid gray' }}>{item.waterFromValue}</td>
                  <td style={{ border: '1px solid gray' }}>{item.waterToValue}</td>
                  <td style={{ border: '1px solid gray' }}>
                    {item.electricityCharge &&
                      item.electricityCharge[0] &&
                      item.electricityCharge[0].asset &&
                      item.electricityCharge[0].asset[0] &&
                      item.electricityCharge[0].asset[0].code}
                  </td>
                  <td style={{ border: '1px solid gray' }}>
                    {item.electricityCharge &&
                      item.electricityCharge[0] &&
                      item.electricityCharge[0].asset &&
                      item.electricityCharge[0].asset[0] &&
                      item.electricityCharge[0].asset[0].name}
                  </td>
                  <td style={{ border: '1px solid gray' }}>{item.elecFromValue}</td>
                  <td style={{ border: '1px solid gray' }}>{item.elecToValue}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </React.Fragment>
  );
}
export default ExportExcel;
