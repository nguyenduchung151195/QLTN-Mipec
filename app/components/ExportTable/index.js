import React, { useEffect, useState } from 'react';
import { Loading } from 'components/LifetekUi';
import { fetchData, serialize } from '../../helper';

function ExportExcel(props) {
  const { filter, url, open, onClose, customColumns, customRows } = props;
  const [data, setData] = useState([]);

  useEffect(
    () => {
      if (url && open) {
        getData();
      }
    },
    [filter, open],
  );

  const getData = async () => {
    try {
      const query = serialize(filter);
      const apiUrl = `${url}?${query}`;

      const res = await fetchData(apiUrl);
      if (res && res.status !== 0) {
        setData(res.data);
        onClose();
      }
    } catch (error) {
      console.log(1, error);
    }
  };
  return (
    <React.Fragment>
      {open ? (
        <Loading />
      ) : (
        <table id="excel-table-bos" style={{ display: 'none' }}>
          <thead>
            <tr style={{ background: '#959a95' }}>
              <th>STT</th>
              {customColumns && customColumns.map(item => <th key={item}>{item}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                {customRows && customRows.map(name => <td key="name">{item[name]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </React.Fragment>
  );
}
export default ExportExcel;
