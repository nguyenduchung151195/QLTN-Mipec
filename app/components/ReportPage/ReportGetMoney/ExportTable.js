import React, { useEffect, useState } from 'react';
import { Loading } from '../../LifetekUi';
import { fetchData, serialize } from '../../../helper';


function ExportExcel(props) {

    const { filter, url, open = false, getRows, viewConfigs = [], onClose } = props;
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
                if (Array.isArray(result) && result.length >= 0) {
                    setData(result);
                }
                onClose();
            }
        } catch (error) {
            console.log(1, error);
        }
    }
    const mapFunction = (item) => {
        const listKeys = Object.keys(item);
        listKeys.map(key => {
            item[key] = !isNaN(item[key]) ? Number(item[key]).toLocaleString("en-IE", { maximumFractionDigits: 3 }) : item[key]
        });
        return item;
    }
    return (
        <React.Fragment>
            {open ? (
                <Loading />
            ) : (
                <table id="excel-table-report-get-money" style={{ display: 'none' }}>
                    <thead>
                        <tr >
                            {viewConfigs && viewConfigs.map(th => (
                                <th style={{ background: '#959a95' }} width={`${th.width}px`} >{th.title}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map(item => (
                            <tr>
                                <td style={{ border: '1px solid gray',textAlign : 'center'}}>{item.order}</td>
                                <td style={{ border: '1px solid gray' }}>{item.apartmentCode}</td>
                                <td style={{ border: '1px solid gray' }}>{item.code}</td>
                                <td style={{ border: '1px solid gray' }}>{item.totalMoney}</td>
                                <td style={{ border: '1px solid gray' }}>{item.totalPaid}</td>
                                <td style={{ border: '1px solid gray' }}>{item.totalDebt}</td>
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