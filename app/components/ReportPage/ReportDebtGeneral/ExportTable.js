import React, { useEffect, useState } from 'react';
import { Loading } from '../../LifetekUi';
import { fetchData, serialize } from '../../../helper';
import moment from 'moment';

function ExportExcel(props) {

    const { filter, url, open, getRows, onClose, viewConfigs } = props;
    const [data, setData] = useState([]);

    useEffect(() => {
        if (url && open) {
            getData();
        }
    }, [filter, open, url]);

    const getData = async () => {
        try {
            const query = serialize(filter);
            const apiUrl = `${url}?${query}`;

            const res = await fetchData(apiUrl);
            if (res && res.status !== 0) {
                let result = getRows(res);
                setData(result);
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
                <table id="excel-table-general" style={{ display: 'none' }}>
                    <thead>
                        <tr >
                            {viewConfigs && viewConfigs.map(th => (
                                <th style={{ background: '#959a95', width: `${th.width}` }}>{th.title}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map(item => (
                            <tr>
                                <td style={{ border: '1px solid gray' ,textAlign : 'center'}}>{item.order}</td>
                                <td style={{ border: '1px solid gray'}}>{item.apartmentCode}</td>
                                <td style={{ border: '1px solid gray'}}>{item.code}</td>
                                <td style={{ border: '1px solid gray'}}>{item.periodStr}</td>
                                <td style={{ border: '1px solid gray'}}>{item.totalAmount}</td>
                                <td style={{ border: '1px solid gray'}}>{item.totalPaid}</td>
                                <td style={{ border: '1px solid gray'}}>{item.debt}</td>
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