import React, { useEffect, useState } from 'react';
import { Loading } from '../../LifetekUi';
import { fetchData, serialize } from '../../../helper';
const inventoryColumns = ['Tồn đầu kỳ', 'Tồn cuối kỳ', 'Tăng /giảm', 'Tỷ lệ'];
const importColumns = ['Tồn cuối kỳ', 'Nhập', 'Chuyển về'];
const exportColumns = ['Xuất', 'Trả', 'Chuyển đi'];
function ExportExcel(props) {
  const { open = false, onClose, filter, url } = props;
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
        console.log('res', res);
        let result = res.dataInventory;
        if (Array.isArray(result) && result.length >= 0) {
          setData(result);
        }
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
        <table id="excel-table-inventory-stock" style={{ display: 'none' }}>
          <thead>
            <tr>
              <td style={{ border: '1px solid gray', textAlign: 'center' }} rowspan="2" colspan="2">
                Tên phòng ban
              </td>
              <td />
              <td style={{ border: '1px solid gray', textAlign: 'center' }} colspan="4">
                Tồn kho
              </td>
              <td style={{ border: '1px solid gray', textAlign: 'center' }} colspan="3">
                Nhập
              </td>
              <td style={{ border: '1px solid gray', textAlign: 'center' }} colspan="3">
                Chi tiết
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid gray', textAlign: 'center' }}>Tên nhóm sản phẩm</td>
              {inventoryColumns.map(column => (
                <td style={{ border: '1px solid gray', textAlign: 'center' }}>{column}</td>
              ))}
              {importColumns.map(column => (
                <td style={{ border: '1px solid gray', textAlign: 'center' }}>{column}</td>
              ))}
              {exportColumns.map(column => (
                <td style={{ border: '1px solid gray', textAlign: 'center' }}>{column}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((dt, i) => {
                const { origin, dataStock } = dt;
                const count = dataStock.length + 1;
                return (
                  <>
                    {dataStock.length !== 0 && (
                      <td style={{ border: '1px solid gray', textAlign: 'center' ,alignItems :'center' ,justifyContent :'center' ,justifyItems : 'center'}} rowSpan={count} colSpan={2}>
                        {origin.name}
                      </td>
                    )}

                    {dataStock.length !== 0 &&
                      dataStock.map((item, index) => (
                        <tr>
                          <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.tags && item.tags.toString()}</td>
                          <td style={{ border: '1px solid gray', textAlign: 'center' }}>
                            {(item.amountLast + item.amountExport - item.amountImport) * item.price}
                          </td>
                          <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.amountLastPrice}</td>
                          <td style={{ border: '1px solid gray', textAlign: 'center' }}>
                            {item.amountLastPrice - (item.amountLast + item.amountExport - item.amountImport) * item.price}
                          </td>
                          <td style={{ border: '1px solid gray', textAlign: 'center' }}>
                            {isNaN((item.amountLastPrice - (item.amountLast + item.amountExport - item.amountImport) * item.price) /
                              ((item.amountLast + item.amountExport - item.amountImport) * item.price)) ? 0 : (item.amountLastPrice - (item.amountLast + item.amountExport - item.amountImport) * item.price) /
                            ((item.amountLast + item.amountExport - item.amountImport) * item.price)}
                          </td>
                          <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.amountLastPrice}</td>
                          <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.importPrice}</td>
                          <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.TakePrice}</td>
                          <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.exportPrice}</td>
                          <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.paidGoodsPrice}</td>
                          <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.TransferPrice}</td>
                        </tr>
                      ))}
                  </>

                );
              })}
          </tbody>
        </table>
      )}
    </React.Fragment>
  );
}
export default ExportExcel;
