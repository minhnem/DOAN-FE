import { Button, DatePicker, Form, Input, message, Modal, Select, Typography } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React, { useEffect, useState } from 'react'
import { TableModel, TableModelDetail } from '../models/TableModel'
import handleAPI from '../api/handleAPI'
import dayjs from 'dayjs'

interface Props {
    table?: TableModel,
    date?: string,
    time: string,
    visible: boolean,
    onAddNew: (val: any) => void,
    onClose: () => void
}

const ModalTableDetail = (props: Props) => {
    const { visible, onClose, table, date, time } = props

    const [isLoading, setIsLoading] = useState(false);
    const [tableDetail, setTableDetail] = useState<TableModelDetail>();

    const [form] = useForm()

    const handleClose = () => {
        form.resetFields()
        setTableDetail(undefined)
        onClose()
    }

    useEffect(() => {
        if (table) {
            getTableReservations(table._id)
        }
    }, [table]);

    const getTableReservations = async (id: string) => {
        try {
            setIsLoading(true)
            const api = `/table/get-table-reservations?id=${id}&date=${date ? date : ''}&time=${time ? time : ''}`
            const res = await handleAPI(api)
            if (res.data.reservations && Object.keys(res.data.reservations).length > 0) {
                form.setFieldsValue({ ...res.data.reservations, reservation_date: dayjs(res.data.reservations.reservation_date) })
                setTableDetail(res.data)
            }
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddTableDetail = async (values: any) => {
        const data: any = {}
        for (const i in values) {
            data[i] = values[i] ?? ''
        }
        data.table_id = table?._id
        data.reservation_time = time
        data.status = 'Đã xác nhận'
        try {
            setIsLoading(true)
            const api = tableDetail && Object.keys(tableDetail).length > 0 ?
                `/reservations/update-reservations?id=${tableDetail.reservations._id}` :
                '/reservations/add-new-reservations'
            const res: any = await handleAPI(api, data, tableDetail && Object.keys(tableDetail).length > 0 ? 'put' : 'post')
            res.data && console.log(res)
            message.success(res.message)
            handleClose()
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemoveTableReservations = async (id: string) => {
        setIsLoading(true)
        try {
            const api = `/reservations/delete-reservations?id=${id}`
            const res: any = await handleAPI(api, undefined, 'delete')
            message.success(res.message)
            handleClose()
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Modal
            title='Chi tiết bàn ăn'
            open={visible}
            onCancel={handleClose}
            footer={[
                <div key='footer-buttons' className='flex justify-end gap-3'>
                    <Button
                        key='delete'
                        disabled={tableDetail && Object.keys(tableDetail.reservations).length > 0 ? false : true}
                        onClick={() => tableDetail && handleRemoveTableReservations(tableDetail.reservations._id)}
                    >
                        Xóa thông tin
                    </Button>
                    <Button key='canCel' onClick={handleClose}>Hủy</Button>
                    <Button key='add' type='primary' loading={isLoading} onClick={() => form.submit()}>{tableDetail && Object.keys(tableDetail.reservations).length > 0 ? 'Sửa' : 'Thêm'}</Button>
                </div>
            ]}
        >
            <div className='flex justify-between my-5'>
                <Typography.Text>Tên bàn: {table?.name}</Typography.Text>
                <Typography.Text>Mã bàn: {table?._id}</Typography.Text>
            </div>
            <div className='flex justify-between mb-5'>
                <Typography.Text>Trạng thái: {table?.status}</Typography.Text>
                <Typography.Text>Thời gian: {time}</Typography.Text>
            </div>
            <Form
                form={form}
                size='large'
                layout='vertical'
                onFinish={handleAddTableDetail}
            >
                <Form.Item label='Chọn ngày' name='reservation_date' rules={[{ message: 'Vui lòng nhập ngày kết thúc !!', required: true }]}>
                    <DatePicker className='w-full' format={'DD/MM/YYYY'} placeholder='Chọn ngày' />
                </Form.Item>
                <div className='text-center'>
                    <Typography.Title level={5}>---------- Thông tin khách hàng ---------</Typography.Title>
                </div>
                <Form.Item name='name' label='Tên khách hàng:' rules={[{ required: true, message: 'Vui lòng nhập tên khác hàng!!' }]}>
                    <Input placeholder='Nhập tên' allowClear />
                </Form.Item>
                <Form.Item name='email' label='Email:' rules={[{ required: true, message: 'Vui lòng nhập email khác hàng!!' }]}>
                    <Input placeholder='Nhập Email' allowClear />
                </Form.Item>
                <Form.Item name='phone' label='Số điện thoại' rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!!' }]}>
                    <Input type='number' placeholder='Nhập số điện thoại' allowClear />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModalTableDetail
