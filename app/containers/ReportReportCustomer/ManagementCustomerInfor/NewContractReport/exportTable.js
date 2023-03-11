import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Loading } from '../../../../components/LifetekUi';
import { fetchData, serialize } from '../../../../helper';


function ExportExcel(props) {

    const { filter, url, open, onClose } = props;
    const [data, setData] = useState([]);

    const viewConfig = JSON.parse(localStorage.getItem('crmSource'));
    const viewConfigCode = viewConfig.find(item => item.code === 'S15');
    const listCatalogContract = viewConfigCode ? viewConfigCode.data : []

    useEffect(() => {
        if (url && open) {
            getData();
        }
    }, [filter, open]);

    const getData = async () => {
        try {
            const query = serialize(filter);
            const apiUrl = `${url}?${query}`;
            // const apiUrl = `${url}?${filter}`

            const res = await fetchData(apiUrl);
            if (res && res.status !== 0) {
                setData(res.data);
                onClose();
            }
        } catch (error) {
            console.log(1, error);
        }
    }
    const newData = data.map((item) => {
        const newCatalogContract = Array.isArray(listCatalogContract) && listCatalogContract.find(f => f.value === item.typeContract);
        return {
            ...item,
            typeContract: newCatalogContract
        }
    })
    return (
        <React.Fragment>
            {open ? (
                <Loading />
            ) : (
                <table id="excel-table-list-new-contract" style={{ display: 'none' }}>
                    <thead>
                        <tr style={{ background: '#959a95' }}>
                            <th>STT</th>
                            <th>Năm</th>
                            <th>Mã HĐ</th>
                            <th>Đối tác</th>
                            <th>Tên HĐ</th>
                            <th>Loại HĐ</th>
                            <th>Ngày kí</th>
                            {/* <th>Ngày bắt đầu</th> */}
                            <th>Ngày kết thúc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newData.map((item, index) => (
                            <tr>
                                <td style={{ border: '1px solid gray' }}>{index + Number(filter.skip || 0) + 1}</td>
                                <td style={{ border: '1px solid gray' }}>{item.contractSigningDate && moment(item.contractSigningDate).format("YYYY")}</td>
                                <td style={{ border: '1px solid gray' }}>{item.code}</td>
                                <td style={{ border: '1px solid gray' }}>{item.customerId && item.customerId.name}</td>
                                <td style={{ border: '1px solid gray' }}>{item.name}</td>
                                <td style={{ border: '1px solid gray' }}>{item.typeContract && item.typeContract.title}</td>
                                <td style={{ border: '1px solid gray' }}>{item.contractSigningDate && moment(item.contractSigningDate).format("DD/MM/YYYY")}</td>
                                {/* <td>{item.startDay}</td> */}
                                <td style={{ border: '1px solid gray' }}>{item.expirationDay && moment(item.expirationDay).format("DD/MM/YYYY")}</td>
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