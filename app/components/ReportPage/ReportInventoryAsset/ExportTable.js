import React, { useEffect, useState } from 'react';
import { Loading } from '../../LifetekUi';
import { fetchData, serialize } from '../../../helper';

const statusAsset = ['Tồn đầu kỳ', 'Nhập trong kỳ', 'Xuất trong kỳ', 'Chuyển vào trong kỳ', 'Chuyển đi`trong kỳ', 'Tồn cuối kỳ'];

function ExportExcel(props) {
  const { open = false, convertData, onClose, filter, url } = props;
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
        <table id="excel-table-inventory-asset" style={{ display: 'none' }}>
          <thead>
          <tr>
              <td style={{ border: '1px solid gray', textAlign: 'center' }} rowSpan={2} colSpan={2}>
                  Tên phòng ban
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'center' }} rowSpan={2}>
                  Mã vật tư
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'center' }} rowSpan={2}>
                  Tên vật tư
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'center' }} rowSpan={2}>
                  Đơn vị
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'center' }} rowSpan={2}>
                  Đơn giá
                </td>
                {statusAsset.map(item => (
                  <td style={{ border: '1px solid gray', textAlign: 'center' }} colSpan={2}>
                    {item}
                  </td>
                ))}
              </tr>
              <tr>
                {statusAsset.map(item => (
                  <>
                    <td style={{ border: '1px solid gray', textAlign: 'center' }}>SL</td>
                    <td style={{ border: '1px solid gray', textAlign: 'center' }}>Thành tiền</td>
                  </>
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
                        <td style={{ border: '1px solid gray', textAlign: 'center' }} rowSpan={count} colSpan={2}>
                          {origin.name}
                        </td>
                      )}

                      {dataStock.length !== 0 &&
                        dataStock.map((item, index) => (
                          <>
                            <tr>
                              <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.code}</td>
                              <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.name}</td>
                              <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.unit && item.unit.name}</td>
                              <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.price || 0}</td>
                              <td style={{ border: '1px solid gray', textAlign: 'center' }}>
                               {item.amount + item.amountExport -item.amountImport }
                              </td>
                              <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.price ? (item.amount +item.amountExport -item.amountImport)*item.price : 0}</td>
                              <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.amountImport}</td>
                              <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.price ? item.amountImport * item.price :0}</td>
                              <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.amountExport}</td>
                              <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.price ? item.amountExport * item.price : 0}</td>
                              <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.amountTake }</td>
                              <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.price ? item.amountTake  * item.price : 0}</td>
                              <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.amountTransfer}</td>
                              <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.price ? item.amountTransfer * item.price : 0}</td>
                              <td style={{ border: '1px solid gray', textAlign: 'center' }}>
                               {item.amount}
                              </td>
                              <td style={{ border: '1px solid gray', textAlign: 'center' }}>{item.price ? (item.amount )*item.price : 0}</td>
                            </tr>
                          </>
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
