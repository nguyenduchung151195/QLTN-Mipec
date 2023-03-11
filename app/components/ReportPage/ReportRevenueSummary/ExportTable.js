import React, { useEffect, useState } from 'react';
import { Loading } from '../../LifetekUi';
import { fetchData, serialize } from '../../../helper';

const services = ['Nước', 'Điện', 'Xe', 'Dịch vụ', 'Mặt bằng', 'Bảo trì'];
const codeService = ['ZD', 'ZN', 'ZX', 'ZP', 'ZBT', '2003'];
const columns = ['Tên NH', 'Lũy kế', 'Tháng trước', 'Tháng này', 'Tăng trưởng'];
const typeMoneys = ['Cư dân', 'Hợp đồng', 'Tổng'];
const statusMoneys = ['Doanh số', 'Thanh toán	', 'Dư nợ', 'Tỷ lệ nợ'];
function ExportExcel(props) {
  const { open = false, convertData, onClose, filter, url, sumStatusMoneys, sumSales } = props;
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
        let result = res.data;
        console.log('result', result);
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
        <table id="excel-table-revenue-summary" style={{ display: 'none' }}>
          <thead>
            <tr>
              <td style={{ border: '1px solid gray', textAlign: 'center' }} rowspan="2" colspan="2">
                Tên phòng ban
              </td>
              <td style={{ border: '1px solid gray', textAlign: 'center' }} />
              <td style={{ border: '1px solid gray', textAlign: 'center' }} colspan="4">
                Doanh số
              </td>
              <td style={{ border: '1px solid gray', textAlign: 'center' }} rowspan="2">
                Tăng trưởng
              </td>
              {typeMoneys.map((typeMoney, index) => (
                <td style={{ border: '1px solid gray', textAlign: 'center' }} colspan="4">
                  {typeMoney}
                </td>
              ))}
            </tr>
            <tr>
              {columns.map(column => (
                <td style={{ border: '1px solid gray', textAlign: 'center' }}>{column}</td>
              ))}
              {typeMoneys.map((typeMoney, index) =>
                statusMoneys.map(statusMoney => <td style={{ border: '1px solid gray', textAlign: 'center' }}>{statusMoney}</td>),
              )}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((dt, i) => {
                let newData = convertData(dt);
                let total = sumSales(dt);
                let totalContract = sumStatusMoneys(dt, 'contract');
                let totalResident = sumStatusMoneys(dt, 'resident');
                let totalSum = [];
                if (totalContract) {
                  totalContract.map((item, i) => {
                    totalSum[i] = totalContract[i] + totalResident[i];
                  });
                }
                return (
                  <>
                    <tr>
                      <td style={{ border: '1px solid gray', textAlign: 'center', alignItems: 'center !important' }} colspan="2">
                      </td>
                      <td style={{ border: '1px solid gray', textAlign: 'center', alignItems: 'center !important' }}>Doanh số các dịch vụ</td>
                      {total && total.map((tt, index) => <td style={{ border: '1px solid gray', textAlign: 'center', alignItems: 'center !important' }}>{tt}</td>)}

                      {totalResident &&
                        totalResident.map((tt, index) => (
                          <td style={{ border: '1px solid gray', textAlign: 'center', alignItems: 'center !important' }}>{tt}</td>
                        ))}
                      {totalContract &&
                        totalContract.map((tt, index) => (
                          <td style={{ border: '1px solid gray', textAlign: 'center', alignItems: 'center !important' }}>{tt}</td>
                        ))}
                      {totalSum &&
                        totalSum.map((tt, index) => (
                          <td style={{ border: '1px solid gray', textAlign: 'center', alignItems: 'center !important' }}>{tt}</td>
                        ))}
                    </tr>
                    <td style={{ border: '1px solid gray', textAlign: 'center', alignItems: 'center !important' }} rowspan="7" colspan="2">
                      {newData[0]}
                    </td>
                    {newData &&
                      services.map((service, index) => (
                        <tr key={index}>
                          <td style={{ border: '1px solid gray', textAlign: 'center' }}>{service}</td>
                          <td style={{ border: '1px solid gray', textAlign: 'center' }}>{newData[index + 1].acrual}</td>
                          <td style={{ border: '1px solid gray', textAlign: 'center' }}>{newData[index + 1].pre}</td>
                          <td style={{ border: '1px solid gray', textAlign: 'center' }}>{newData[index + 1].current}</td>
                          <td style={{ border: '1px solid gray', textAlign: 'center' }}>{newData[index + 1].growth}</td>
                          <td style={{ border: '1px solid gray', textAlign: 'center' }}>{newData[index + 1].percentGrowth}</td>
                          {statusMoneys.map((statusMoney, i) => (
                            <td style={{ border: '1px solid gray', textAlign: 'center' }}>{Object.values(newData[index + 1].resident)[i]}</td>
                          ))}
                          {statusMoneys.map((statusMoney, i) => (
                            <td style={{ border: '1px solid gray', textAlign: 'center' }}>{Object.values(newData[index + 1].contract)[i]}</td>
                          ))}
                          {statusMoneys.map((statusMoney, i) => (
                            <td style={{ border: '1px solid gray', textAlign: 'center' }}>
                              {Object.values(newData[index + 1].resident)[i] + Object.values(newData[index + 1].contract)[i]}
                            </td>
                          ))}
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
