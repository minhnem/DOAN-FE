import { Card, Radio } from "antd";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import handleAPI from "../api/handleAPI";
import { formatDateMonth } from "../utils/formatDate";

const SalesAndPurchase = () => {

  const [timeType, setTimeType] = useState('Tuần');
  const [isLoading, setIsLoading] = useState(false);
  const [datas, setDatas] = useState<{
    date: string,
    data: number
  }[]>([]);

  useEffect(() => {
    getDataTime(timeType)
  }, [timeType]);

  const getDataTime = async (timeType: string) => {
    try {
      setIsLoading(true)
      const api = `report/get-data-time?timeType=${timeType}`
      const res = await handleAPI(api)
      const data = res.data.results.map((item: any) => ({date: formatDateMonth(item.date), data: item.data.revenue}))
      setDatas(data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div >
        <Card title="Biểu đồ tổng doanh thu"
          extra={
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
          }
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datas}>
              <XAxis dataKey="date"/>
              <YAxis />
              <Tooltip />
              <Bar dataKey="data" fill="#8884d8" name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
    </div>
  );
};

export default SalesAndPurchase;
