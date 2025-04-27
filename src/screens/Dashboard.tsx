import React, { useEffect, useState } from 'react'
import StatisticComponent from '../components/StatisticComponent'
import icon1 from '../assets/icons/icons8-sales-50.png';
import icon2 from '../assets/icons/icons8-revenue-50.png';
import icon3 from '../assets/icons/icons8-prefix-80.png';
import icon4 from '../assets/icons/icons8-cost-50.png';
import icon5 from '../assets/icons/icons8-hamburger-80.png';
import icon6 from '../assets/icons/icons8-inventory-50.png';
import icon8 from '../assets/icons/icons8-cancel-50.png';
import icon10 from '../assets/icons/icons8-supplier-50.png';
import { Card } from 'antd';
import handleAPI from '../api/handleAPI';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Line,
  LineChart,
} from "recharts";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [datas, setDatas] = useState<{
    totalBill: number,
    priceBill: number,
    totalMaterial: number,
    costMaterial: number,
    totalSupplier: number,
    totalDish: number,
    totalRejectReservation: number
  }>({
    totalBill: 0,
    priceBill: 0,
    totalMaterial: 0,
    costMaterial: 0,
    totalSupplier: 0,
    totalDish: 0,
    totalRejectReservation: 0
  })
  const [dataChart, setDataChart] = useState<{
    month: string,
    total: number,
  }[]>([]);

  useEffect(() => {
    getAllData()
    getAllDataChart()
  }, []);

  const getAllData = async () => {
    try {
      setIsLoading(true)
      const api = '/dashboard'
      const res = await handleAPI(api)
      setDatas(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAllDataChart = async () => {
    try {
      setIsLoading(true)
      const api = '/dashboard/get-data-chart'
      const res = await handleAPI(api)
      setDataChart(res.data)
      console.log(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Card className='mb-8' title='Tổng quan doanh thu'>
        <div className="grid grid-cols-4">
          <StatisticComponent
            icon={icon2}
            value={datas.totalBill}
            label={'Đơn hàng'}
            layout={''}
            bgIcon={'#a13ac032'}
            borderRight={true}
            valueIsNotMoney={true}
          />
          <StatisticComponent
            icon={icon1}
            value={datas.priceBill}
            label={'Doanh thu'}
            layout={''}
            bgIcon={'#0eb2e42f'}
            borderRight={true}
          />
          <StatisticComponent
            icon={icon3}
            value={datas.priceBill - datas.costMaterial}
            label={'Lợi nhuận'}
            layout={''}
            bgIcon={'#2caf391a'}
            borderRight={true}
          />
          <StatisticComponent
            icon={icon4}
            value={datas.costMaterial}
            label={'Chi phí'}
            layout={''}
            bgIcon={'#a4af2c1a'}
            borderRight={false}
          />
        </div>
      </Card>
      <Card className='mb-8' title='Thông tin chung'>
        <div className="grid grid-cols-4">
          <StatisticComponent
            icon={icon6}
            value={datas.totalMaterial}
            label={'Tổng nguyên vật liệu'}
            layout={''}
            bgIcon={'#E49B0E3D'}
            borderRight={true}
            valueIsNotMoney={true}
          />
          <StatisticComponent
            icon={icon10}
            value={datas.totalSupplier}
            label={'Tổng nhà cung cấp'}
            layout={''}
            bgIcon={'#0eb2e42f'}
            borderRight={true}
            valueIsNotMoney={true}
          />
          <StatisticComponent
            icon={icon5}
            value={datas.totalDish}
            label={'Tổng Món ăn'}
            layout={''}
            bgIcon={'#a4af2c1a'}
            borderRight={true}
            valueIsNotMoney={true}
          />
          <StatisticComponent
            icon={icon8}
            value={datas.totalRejectReservation}
            label={'Từ chối đơn'}
            layout={''}
            bgIcon={'#E4350E45'}
            borderRight={false}
            valueIsNotMoney={true}
          />
        </div>
      </Card>
      <div className='grid grid-cols-12 gap-5'>
        <div className='col-span-8'>
          <Card title="Biểu đồ tổng doanh thu (12 tháng)">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={dataChart}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#8884d8" name="Doanh thu" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <div className='col-span-4'>
          <Card title="Biểu đồ tổng doanh thu (12 tháng)">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dataChart}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#8884d8" name="Doanh thu" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
