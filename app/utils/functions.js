import React from 'react';
import moment from 'moment';

const checkValidation = (field, value) => {

}

const checkValidNumber = (e) => {
  if (["e", "+", "-", "."].includes(e.key)) e.preventDefault();
};

const checkValidStringSpecial = (value) => {
  const partent = /[~!@#$%^&*()?><\\|":',.]/g;
  if (Array.isArray(value.match(partent)) && value.match(partent) > 0) {
    return false;
  }
  return true;
};

const getTemplateByCode = (code, data, viewConfigData, totalPage, pageNumber) => {
  let template = {
    fee: (
      <table>
        <thead>
          <th>Từ ngày</th>
          <th>Đến ngày</th>
          <th>Tên hợp đồng</th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </thead>
        <tbody>
          {data && data.map(item => (
            <tr>
              <td>{moment(item.fromDate, 'DD/MM/YYYY').format('DD/MM/YYYY')}</td>
              <td>{moment(item.toDate, 'DD/MM/YYYY').format('DD/MM/YYYY')}</td>
              <td>{item.contractId}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
    stock: (
      <>
        <table>
          <tbody>
            <tr>
              <td />
              <td>Ngày xuất báo cáo:</td>
              <td>{moment().format('DD/MM/YYYY')}</td>
            </tr>
            <tr />
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th style={{ width: 80 }}>STT</th>
              {viewConfigData.map(cols => (
                <th style={{ width: cols.width }}>{cols.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data && data.map((row, index) => {
              return (
                <tr>
                  <td style={{ width: 80 }}>{index + 1}</td>
                  {viewConfigData.map(cols => (
                    <td
                      style={{
                        width: cols.width,
                        textAlign: cols.type === 'Date' || cols.type === 'Number' ? 'center' : null,
                        paddingTop: cols.type === 'Number' ? '10px' : null,
                        paddingRight: cols.type === 'Number' ? 0 : null,
                      }}
                    >
                      {typeof row[cols.name] === 'string' || typeof row[cols.name] === 'number' ? row[cols.name] : ''}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td />
              <td />
              <td />
              <td />
              <td />
              <td />
              <td />
              <td style={{ textAlign: 'center', background: '#959a95' }}>Trang số </td>
              <td style={{ textAlign: 'center', background: '#959a95' }}>{pageNumber}</td>
            </tr>
            <tr>
              <td />
              <td />
              <td />
              <td />
              <td />
              <td />
              <td />
              <td style={{ textAlign: 'center', background: '#959a95' }}>Tổng số trang</td>
              <td style={{ textAlign: 'center', background: '#959a95' }}>{totalPage}</td>
            </tr>
          </tfoot>
        </table>
      </>
    ),
    documentary: (
      <>
        <table>
          <tbody>
            <tr>
              <td />
              <td>Ngày xuất báo cáo:</td>
              <td>{moment().format('DD/MM/YYYY')}</td>
            </tr>
            <tr />
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th style={{ width: 80 }}>STT</th>
              {viewConfigData.map(cols => (
                <th style={{ width: cols.width }}>{cols.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data && data.map((row, index) => {
              return (
                <tr>
                  <td style={{ width: 80 }}>{index + 1}</td>
                  {viewConfigData.map(cols => (
                    <td
                      style={{
                        width: cols.width,
                        textAlign: cols.type === 'Date' || cols.type === 'Number' ? 'center' : null,
                        paddingTop: cols.type === 'Number' ? '10px' : null,
                        paddingRight: cols.type === 'Number' ? 0 : null,
                      }}
                    >
                      {typeof row[cols.name] === 'string' || typeof row[cols.name] === 'number' ? row[cols.name] : ''}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td />
              <td />
              <td />
              <td />
              <td />
              <td />
              <td />
              <td style={{ textAlign: 'center', background: '#959a95' }}>Trang số </td>
              <td style={{ textAlign: 'center', background: '#959a95' }}>{pageNumber}</td>
            </tr>
            <tr>
              <td />
              <td />
              <td />
              <td />
              <td />
              <td />
              <td />
              <td style={{ textAlign: 'center', background: '#959a95' }}>Tổng số trang</td>
              <td style={{ textAlign: 'center', background: '#959a95' }}>{totalPage}</td>
            </tr>
          </tfoot>
        </table>
      </>
    )
  };
  return template[code.toLowerCase()]
}

export const getTableBy = (code, data, viewConfigData = [], totalPage = 1, pageNumber = 1) => {
  console.log(code);
  console.log(viewConfigData)
  let temp = getTemplateByCode(code, data, viewConfigData, totalPage, pageNumber);
  return temp;
}