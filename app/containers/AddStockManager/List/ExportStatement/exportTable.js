import React, { useEffect, useState } from 'react';
import { Loading } from '../../../../components/LifetekUi';
import { fetchData, serialize } from '../../../../helper';

function ExportExcel(props) {
  const LIMIT = 20;
  const { filter, url, open, onClose } = props;
  const [data, setData] = useState([]);
  const [allExSkip, setAllExSkip] = useState(0)

  useEffect(
    () => {
      if (url && open) {
        let totalPage = 0;
        const query = serialize({ ...filter, limit: LIMIT, skip: allExSkip });
        const apiUrl = `${url}?${query}`;
        const fetchDataExport = async () => {
          const res = await fetchData(apiUrl);
          const count = res.count;
          totalPage = Math.ceil(count / LIMIT);
          for (let i = 0; i < totalPage; i++) {
            getData(i * LIMIT);
          }
        }

        fetchDataExport()

      }
    },
    [filter, open],
  );

  const getData = async (skip) => {
    try {
      // const query = serialize(filter);
      const query = serialize({ ...filter, limit: 20, skip: skip });
      const apiUrl = `${url}?${query}`;

      const res = await fetchData(apiUrl);
      if (res && res.status !== 0) {
        const newData = Array.isArray(res.data) && res.data.map(item => {
          return {
            ...item,
            importPrice: Number(item.importPrice).toLocaleString("en-IE", { maximumFractionDigits: 0 }),
            totalPrice: Number(item.totalPrice).toLocaleString("en-IE", { maximumFractionDigits: 0 }),
          }
        })
        // setData(res.data);
        setData(newData)
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
          <h2>Báo cáo xuất kho theo sản phẩm</h2>
          <thead>
            <tr style={{ background: '#959a95' }}>
              <th>STT</th>
              {props.customColumns && props.customColumns.map(item => <th key={item}>{item}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const products = item.products ? item.products[0] : { name: '', unit: '', amount: '', importPrice: '', totalPrice: '' };
              try {
                return (
                  <tr>
                    <td style={{ border: '1px solid gray' }}>{index + 1}</td>
                    {props.customRows.map(row => (
                      <td style={{ border: '1px solid gray' }}>{item[row]}</td>
                    ))}
                  </tr>
                );
              } catch (e) {
                console.log(e);
              }
            })}
          </tbody>
        </table>
      )}
    </React.Fragment>
  );
}
export default ExportExcel;
