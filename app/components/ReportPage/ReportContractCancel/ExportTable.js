import React, { useEffect, useState } from 'react';
import { Loading } from '../../LifetekUi';
import { fetchData, serialize } from '../../../helper';

function ExportExcel(props) {
  const { filter, url, open = false, getRows, viewConfigs = [], onClose } = props;
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
        if (Array.isArray(result) && result.length >= 0) {
          setData(result);
        }
        onClose();
      }
    } catch (error) {
      console.log(1, error);
    }
  };
  const mapFunction = item => {
    return {
      ...item,
      typeContract: item.typeContract === '1' ? 'HỢP ĐỒNG KH' : 'HỢP ĐỒNG NCC',
      supplierId: item.typeContract === '2' ? item.supplierId && item.supplierId.name : item.customerId && item.customerId.name,
    };
  };
  return (
    <React.Fragment>
      {open ? (
        <Loading />
      ) : (
        <table id="excel-table-contact-cancel" style={{ display: 'none' }}>
          <thead>
            <tr style={{ background: '#959a95' }}>{viewConfigs && viewConfigs.map(th => <th>{th.title}</th>)}</tr>
          </thead>
          <tbody>
            {data &&
              data.map(mapFunction).map(item => (
                <tr>
                  <td style={{ border: '1px solid gray' }}>{item.name}</td>
                  <td style={{ border: '1px solid gray' }}>{item.code}</td>
                  <td style={{ border: '1px solid gray' }}>{item.supplierId}</td>
                  <td style={{ border: '1px solid gray' }}>{item.typeContract}</td>
                  <td style={{ border: '1px solid gray' }}>{item.contractSigningDate}</td>
                  <td style={{ border: '1px solid gray' }}>{item.expirationDay}</td>
                  <td style={{ border: '1px solid gray' }}>{item.updatedAt}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </React.Fragment>
  );
}
export default ExportExcel;
