import { Button, Card, List, Radio, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import icon1 from '../assets/icons/icons8-sales-50.png';
import icon2 from '../assets/icons/icons8-revenue-50.png';
import icon3 from '../assets/icons/icons8-prefix-80.png';
import icon4 from '../assets/icons/icons8-cost-50.png';
import StatisticComponent from '../components/StatisticComponent'
import handleAPI from '../api/handleAPI';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { formatDateMonth } from '../utils/formatDate';
import { getBestSellingDishes } from '../utils/getBestSellingDishes';

const Report = () => {
    const [timeType, setTimeType] = useState('Tuần');
    const [isLoading, setIsLoading] = useState(false);
    const [datas, setDatas] = useState<{
        date: string,
        data: number
    }[]>([]);
    const [revenue, setRevenue] = useState<{
        revenueTime: number,
        costMaterial: number,
        totalBill: number
    }>({
        revenueTime: 0,
        costMaterial: 0,
        totalBill: 0
    });
    const [bestSelling, setBestSelling] = useState<{ title: string, count: number }[]>([]);
    const [predictRevenue, setPredictRevenue] = useState<{
        count: string,
        data: number
    }[]>([]);
    const [predictTopDish, setPredictTopDish] = useState<{ title: string, totalPredicted: number }[]>([]);

    useEffect(() => {
        getDataTime(timeType)
    }, [timeType]);

    const getDataTime = async (timeType: string) => {
        try {
            setIsLoading(true)
            const api = `report/get-data-time?timeType=${timeType}`
            const res = await handleAPI(api)
            console.log(res.data)
            const data = res.data.results.map((item: any) => ({ date: formatDateMonth(item.date), data: item.data.revenue }))
            const value = {
                revenueTime: res.data.results.reduce((a: number, b: any) => a + b.data.revenue, 0),
                costMaterial: res.data.costMaterial,
                totalBill: res.data.results.reduce((a: number, b: any) => a + b.data.totalBill, 0)
            }
            const topsale = res.data.bills
            setBestSelling(getBestSellingDishes(topsale))
            setDatas(data)
            setRevenue(value)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePredictions = async () => {
        try {
            const api = '/report/predictions'
            const res = await handleAPI(api)
            setPredictRevenue(res.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }  

    const handlePredicTopDish = async () => {
        try {
            const api = '/report/predict-top-sale'
            const res = await handleAPI(api)
            console.log(res.data)
            setPredictTopDish(res.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <Card className='mb-8'>
                <div className='flex justify-between mb-5'>
                    <Typography.Title level={4} className="mb-5">
                        Tổng quan doanh số
                    </Typography.Title>
                    <Radio.Group
                        block
                        options={[
                            { label: 'Tuần', value: 'Tuần' },
                            { label: 'Tháng', value: 'Tháng' },
                            { label: 'Năm', value: 'Năm' },
                        ]}
                        defaultValue="Tuần"
                        optionType="button"
                        buttonStyle="solid"
                        onChange={(val) => setTimeType(val.target.value)}
                    />
                    <Button onClick={() => {
                        handlePredictions()
                        handlePredicTopDish()
                    }}>Dự đoán</Button>
                </div>
                <div className="grid grid-cols-4">
                    <StatisticComponent
                        icon={icon2}
                        value={revenue.totalBill}
                        label={'Đơn hàng'}
                        layout={''}
                        bgIcon={'#a13ac032'}
                        borderRight={true}
                        valueIsNotMoney={true}
                    />
                    <StatisticComponent
                        icon={icon1}
                        value={revenue.revenueTime}
                        label={'Doanh thu'}
                        layout={''}
                        bgIcon={'#0eb2e42f'}
                        borderRight={true}
                    />
                    <StatisticComponent
                        icon={icon3}
                        value={revenue.revenueTime - revenue.costMaterial}
                        label={'Lợi nhuận'}
                        layout={''}
                        bgIcon={'#2caf391a'}
                        borderRight={true}
                    />
                    <StatisticComponent
                        icon={icon4}
                        value={revenue.costMaterial}
                        label={'Chi phí'}
                        layout={''}
                        bgIcon={'#a4af2c1a'}
                        borderRight={false}
                    />
                </div>
            </Card>
            <div className='grid grid-cols-12 gap-5'>
                <div className='col-span-8'>
                    <Card title="Biểu đồ tổng doanh thu">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={datas}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="data" fill="#8884d8" name="Doanh thu" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
                <div className='col-span-4'>
                    <Card title="Sản phẩm bán chạy nhất">
                        <List
                            dataSource={bestSelling}
                            renderItem={(item) => (
                                <List.Item>
                                    <div className="flex justify-between w-full">
                                        <h2 className='font-semibold text-[1.2rem]'>{item.title}</h2>
                                        <span>số lượng: {item.count}</span>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </div>
            </div>
            {
                predictRevenue.length > 0 ? (
                    <div className='grid grid-cols-12 gap-5 mt-5'>
                        <div className='col-span-8'>
                            <Card title="Biểu đồ dự đoán doanh thu doanh thu">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={predictRevenue}>
                                        <XAxis dataKey="count" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="data" fill="#8884d8" name="Doanh thu" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                        <div className='col-span-4'>
                            <Card title="Dự đoán sản phẩm bán chạy nhất">
                                <List
                                    dataSource={predictTopDish}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <div className="flex justify-between w-full">
                                                <h2 className='font-semibold text-[1.2rem]'>{item.title}</h2>
                                                <span>số lượng: {item.totalPredicted}</span>
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </div>
                    </div>
                ) : ''
            }
        </div>
    )
}

export default Report
