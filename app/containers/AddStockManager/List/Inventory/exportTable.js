import React, { useEffect, useState } from 'react';
import { Loading } from 'components/LifetekUi';
import { fetchData, serialize } from '../../../../helper';

function parseQuery(queryString) {
  if (typeof queryString === 'string') {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return { ...query, limit: Number(query.limit), skip: Number(query.skip) };
  }
  return queryString

}



function ExportExcel(props) {
  const { filter, url, open, onClose, customColumns, customRows } = props;
  const LIMIT = 5000;
  const [data, setData] = useState([]);

  const objFilter = parseQuery(filter);
  // useEffect(
  //   () => {
  //     if (url && open) {
  //       getData();
  //     }
  //   },
  //   [filter, open],
  // );

  useEffect(
    () => {
      if (url && open) {
        let totalPage = 0;
        const query = serialize({ ...filter, limit: LIMIT, skip: 0 });
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
      const query = serialize({ ...objFilter, skip: skip, limit: LIMIT });
      const apiUrl = `${url}?${query}`;

      // const apiUrl = `${url}?${filter}`

      const res = await fetchData(apiUrl);
      if (res && res.status !== 0) {
        const newData = Array.isArray(res.data) && res.data.map(item => {
          return {
            ...item,
            costPrice: Number(item.costPrice).toLocaleString("en-IE", { maximumFractionDigits: 0 }),
            importPrice: Number(item.importPrice).toLocaleString("en-IE", { maximumFractionDigits: 0 }),
            firstInventoryPrice: Number(item.firstInventoryPrice).toLocaleString("en-IE", { maximumFractionDigits: 0 }),
            lastInventoryPrice: Number(item.lastInventoryPrice).toLocaleString("en-IE", { maximumFractionDigits: 0 }),
            totalPriceImport: Number(item.totalPriceImport).toLocaleString("en-IE", { maximumFractionDigits: 0 }),
            totalPriceExport: Number(item.totalPriceExport).toLocaleString("en-IE", { maximumFractionDigits: 0 })
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
        <table id="excel-table-inventory" style={{ display: 'none' }}>
          <h2>Báo cáo xuất nhập kho theo sản phẩm</h2>
          <thead>
            <tr style={{ background: '#959a95' }}>
              <th>STT</th>
              {customColumns && customColumns.map(item => <th key={item}>{item}</th>)}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length >0 && data.map((item, index) => {
              const { code, name, adress } = item.supplier ? item.supplier.supplierId : { code: '' };
              const products = item.products ? item.products[0] : { name: '', unit: '', amount: '', importPrice: '', totalPrice: '' };
              try {
                return (
                  <tr key={index}>
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
