import React, { useEffect, useState } from 'react';
import { Loading } from '../../../components/LifetekUi';
import { fetchData, serialize } from '../../../helper';


function ExportExcel(props) {

  const LIMIT = 2000;
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
      const query = serialize({ ...filter, limit: LIMIT, skip: skip });
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
          {/* <thead>
                        <tr style={{background: '#959a95'}}>
                            <th>STT</th>
                            <th>Năm</th>
                            <th>Mã CV đến</th>
                            <th>Tên CV đến</th>
                            <th>Nơi gửi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index)=> (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{item.toDate}</td>
                                <td>{item.code}</td>
                                <td>{item.name}</td>
                                <td>{item.toUsers.reduce((previousValue, currentValue,i,array)=>{
                                    if (i < array.length-1)
                                        return previousValue.concat(currentValue.name,",")
                                    return previousValue.concat(currentValue.name)
                                },"")}</td>
                            </tr>
                        ))}
                    </tbody> */}
          <thead>
            <tr style={{ background: '#959a95' }}>
              <th>STT</th>
              <th>Phòng ban gửi</th>
              <th>Loại Công văn</th>
              <th>Tổng số</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{item.organizationUnit[0]}</td>
                <td>{item.typeDocument}</td>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )

      }
    </React.Fragment>
  );
}
export default ExportExcel;