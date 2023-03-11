import React, { useEffect, useState } from 'react';
import { Loading } from '../../LifetekUi';
import { fetchData, serialize } from '../../../helper';

function ExportExcel(props) {
  const { userAcount, allFunctionForAdd,rowAdd } = props;
  return (
    <React.Fragment>
      {userAcount &&
        allFunctionForAdd && (
          <div id="excel-table-detail-roles" style={{ display: 'none' }}>
            {userAcount.map((user, index) => {
              return (
                <table>
                  <thead>
                    <tr style={{ background: '#959a95' }}>
                      <th>{user && user.name}</th>
                    </tr>
                    <tr>
                      <th>Phân quyền chức năng</th>
                      <th>Xem</th>
                      <th>Thêm</th>
                      <th>Sửa</th>
                      <th>Xóa</th>
                      <th>Xuất file</th>
                      <th>Import file</th>
                      <th>View Config</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowAdd &&
                      Array.isArray(rowAdd[index]) &&
                      rowAdd[index].map((row, i) => {
                        return (
                          <tr key={row.codeModleFunction}>
                            <td>{row.titleFunction}</td>
                            <td>{row.methods.find(item => item.name === 'GET').allow === true ? 'true' : ''}</td>
                            <td>{row.methods.find(item => item.name === 'POST').allow === true ? 'true' : ''}</td>
                            <td>{row.methods.find(item => item.name === 'PUT').allow === true ? 'true' : ''}</td>
                            <td>{row.methods.find(item => item.name === 'DELETE').allow === true ? 'true' : ''}</td>
                            <td>{row.methods.find(item => item.name === 'EXPORT').allow === true ? 'true' : ''}</td>
                            <td>{row.methods.find(item => item.name === 'IMPORT').allow === true ? 'true' : ''}</td>
                            <td>{row.methods.find(item => item.name === 'VIEWCONFIG').allow === true ? 'true' : ''}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              );
            })}
          </div>
        )}
    </React.Fragment>
  );
}
export default ExportExcel;
