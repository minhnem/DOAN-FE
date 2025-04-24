import { Button, message, Radio, Space, Table, Typography } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React, { useEffect, useState } from 'react'
import { PersonnelModel } from '../../models/PersonnelModel'
import { ColumnProps } from 'antd/es/table'
import handleAPI from '../../api/handleAPI'

const Attendances = () => {

    const [form] = useForm()

    const [isLoading, setIsLoading] = useState(false)
    const [personnel, setPersonnel] = useState<PersonnelModel[]>([])
    const [timeType, setTimeType] = useState('Tháng')

    const columns: ColumnProps<PersonnelModel>[] = [
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Tên nhân viên',
            width: 200
        },
        {
            key: 'email',
            dataIndex: 'email',
            title: 'Email',
            width: 250
        },
        {
            key: 'phone',
            dataIndex: 'phone',
            title: 'Số điện thoại',
            width: 150,
        },
        {
            key: 'role',
            dataIndex: 'role',
            title: 'Chức vụ',
            width: 150,
        },
        {
            key: 'total',
            dataIndex: 'totalAttendance',
            title: 'Tổng công',
            width: 150,
            render: (total: number) => total ? total : 0
        },
        {
            key: 'buttonAction',
            dataIndex: '',
            title: 'Chấm công hôm nay',
            fixed: 'right',
            align: 'center',
            width: 150,
            render: (personnel: PersonnelModel) => <>
                <Space>
                    <Button
                        onClick={() => {
                            handleAddAttendance(personnel._id, 'Sáng')
                        }}
                    >
                        Sáng
                    </Button>
                    <Button
                        onClick={() => {
                            handleAddAttendance(personnel._id, 'Tối')
                        }}
                    >
                        Tối
                    </Button>
                </Space>
            </>
        }
    ]

    useEffect(() => {
        getDataTime(timeType)
    }, [timeType])

    const getDataTime = async (timeType: string) => {
        try {
            setIsLoading(true)
            const api = `/attendance/get-time-personnel-attendance?time=${timeType}`
            const res = await handleAPI(api)
            setPersonnel(res.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddAttendance = async (personnelId: string, shift: string) => {
        try {
            setIsLoading(true)
            const api = '/attendance/add-attendance'
            await handleAPI(api, { personnelId: personnelId, shift: shift }, 'post')
            message.success('Điểm danh thành công')
            getDataTime(timeType)
        } catch (error) {
            console.log(error)
            message.error('Điểm danh không thành công!!!')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <Table
                dataSource={personnel}
                bordered
                rowKey={'_id'}
                columns={columns}
                scroll={{
                    y: 'calc(100vh - 300px)'
                }}
                title={() => <>
                    <div className='flex justify-between'>
                        <Typography.Title level={2}>Bảng thống kê</Typography.Title>
                        <Radio.Group
                            block
                            options={[
                                { label: 'Ngày', value: 'Ngày' },
                                { label: 'Tuần', value: 'Tuần' },
                                { label: 'Tháng', value: 'Tháng' },
                                { label: 'Năm', value: 'Năm' },
                            ]}
                            defaultValue="Ngày"
                            optionType="button"
                            buttonStyle="solid"
                            onChange={(val) => setTimeType(val.target.value)}
                        />
                    </div>
                </>}
            />
        </div>
    )
}

export default Attendances
