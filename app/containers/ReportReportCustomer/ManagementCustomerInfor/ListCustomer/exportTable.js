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
                <table id="excel-table-list-customer" style={{ display: 'none' }}>
                    <thead>
                        <tr style={{ background: '#959a95' }}>
                            <th>STT</th>
                            <th>Mã khách hàng</th>
                            <th>Tên khách hàng</th>
                            <th>Mã số thuế</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Diện tích</th>
                            <th>Mã dịch vụ</th>
                            <th>Tên dịch vụ</th>
                            {/* <th>Ngày bắt đầu</th> */}
                            <th>Ngày kết thúc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr>
                                <td style={{ border: '1px solid gray' }}>{index + Number(filter.skip||0) + 1}</td>
                                <td style={{ border: '1px solid gray' }}>{item.code}</td>
                                <td style={{ border: '1px solid gray' }}>{item.name}</td>
                                <td style={{ border: '1px solid gray' }}>{item['contract.materialRequest.order.product.productId']}</td>
                                <td style={{ border: '1px solid gray' }}>{item.email}</td>
                                <td style={{ border: '1px solid gray' }}>{item.phoneNumber}</td>
                                <td style={{ border: '1px solid gray' }}>{item['size.size']}</td>
                                <td style={{ border: '1px solid gray' }}>{item['size.code']}</td>
                                <td style={{ border: '1px solid gray' }}>{item['size.name']}</td>
                                {/* <td>{item.createdAt}</td> */}
                                <td style={{ border: '1px solid gray' }}>{item.expirationDay}</td>
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