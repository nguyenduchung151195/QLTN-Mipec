import React, { useEffect, useState } from 'react';
import { Loading } from '../../../../components/LifetekUi';
import { fetchData, serialize } from '../../../../helper';


function ExportExcel(props) {

    const { filter, url, open, onClose } = props;
    const [data, setData] = useState([]);

    useEffect(() => {
        if (url && open) {
            getData();
        }
    }, [filter, open]);

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
    }
    return (
        <React.Fragment>
            {open ? (
                <Loading />
            ) : (
                <table id="excel-table-revenue-expenditure" style={{ display: 'none' }}>
                    <thead>
                        <tr style={{ background: '#959a95' }}>
                            <th>STT</th>
                            <th>Mã KH</th>
                            <th>Tên KH</th>
                            <th>Loại</th>
                            <th>Kiểu</th>
                            <th>Phương thức thanh toán</th>
                            <th>Tổng tiền</th>
                            <th>Đã thanh toán </th>
                            <th>Còn thiếu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr>
                                <td style={{ border: '1px solid gray' }}>{index + Number(filter.skip||0)+ 1}</td>
                                <td style={{ border: '1px solid gray' }}>{item.fee && item.fee.customerId && item.fee.customerId.code}</td>
                                <td style={{ border: '1px solid gray' }}>{item.fee && item.fee.customerId && item.fee.customerId.name}</td>
                                <td style={{ border: '1px solid gray' }}>{item.type}</td>
                                <td style={{ border: '1px solid gray' }}>{item.costType}</td>
                                <td style={{ border: '1px solid gray' }}>{item.payMethod}</td>
                                <td style={{ border: '1px solid gray' }}>{item.amount}</td>
                                <td style={{ border: '1px solid gray' }}>{item.total}</td>
                                <td style={{ border: '1px solid gray' }}>{item.totalAmount}</td>
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