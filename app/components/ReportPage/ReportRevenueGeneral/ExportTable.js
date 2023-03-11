import React, { useEffect, useState } from 'react';
import { Loading } from '../../LifetekUi';
import { fetchData, serialize } from '../../../helper';


function ExportExcel(props) {

    const { filter, url, open, getRows, viewConfigs, onClose } = props;
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
                let result = getRows && getRows(res);
                if (Array.isArray(result)) {
                    setData(result);
                    onClose();
                }

            }
        } catch (error) {
            console.log(1, error);
        }
    }

    const coverStringToValue = (str, key) => {
        if (typeof str === 'string') {
            const newStr = str.replaceAll(".", "").replaceAll(",", ".");
            if (!isNaN(newStr) && key !== '') {
                return Number(newStr).toLocaleString("en-IE", { maximumFractionDigits: 3 })
            }
            else return str
        }
        else return str;
    }
    const mapFunction = (item) => {
        const listKeys = Object.keys(item);
        listKeys.map((key, index) => {
            item[key] = coverStringToValue(item[key], key)
        });
        return item
    }
    // useEffect(() => {
    //     if (data && data.length > 0) {
    //         generatePeriodByItem(data)
    //     }
    // }, [data])
    return (
        <React.Fragment>
            {open ? (
                <Loading />
            ) : (
                <table id="excel-table-general" style={{ display: 'none' }}>
                    <thead>
                        <tr >
                            {viewConfigs && viewConfigs.map(th => (
                                <th style={{ background: '#959a95' }}>{th.title}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) && data.length > 0 && data.map(mapFunction).map(item => (
                            <tr>
                                <td style={{ border: '1px solid gray' }}>{item.order}</td>
                                <td style={{ border: '1px solid gray' }}>{item.apartmentCode}</td>
                                <td style={{ border: '1px solid gray' }}>{item.acreageOfService}</td>
                                <td style={{ border: '1px solid gray' }}>{item.quality}</td>
                                <td style={{ border: '1px solid gray' }}>{item.serviceMoney}</td>
                                <td style={{ border: '1px solid gray' }}>{item.electric_startNumber}</td>
                                <td style={{ border: '1px solid gray' }}>{item.electric_endNumber}</td>
                                <td style={{ border: '1px solid gray' }}>{item.electric_quality}</td>
                                <td style={{ border: '1px solid gray' }}>{item.electricMoney}</td>
                                <td style={{ border: '1px solid gray' }}>{item.water_startNumber}</td>
                                <td style={{ border: '1px solid gray' }}>{item.water_endNumber}</td>
                                <td style={{ border: '1px solid gray' }}>{item.water_quality}</td>
                                <td style={{ border: '1px solid gray' }}>{item.waterMoney}</td>
                                <td style={{ border: '1px solid gray' }}>{item.ZX01}</td>
                                <td style={{ border: '1px solid gray' }}>{item.ZX05}</td>
                                <td style={{ border: '1px solid gray' }}>{item.ZX02}</td>
                                <td style={{ border: '1px solid gray' }}>{item.ZX03}</td>
                                <td style={{ border: '1px solid gray' }}>{item.ZX04}</td>
                                {/* <td style={{ border: '1px solid gray' }}>{item.carMoney}</td> */}
                                <td style={{ border: '1px solid gray' }}>{item.total}</td>
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