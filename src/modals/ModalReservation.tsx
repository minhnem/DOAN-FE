import { Button, DatePicker, Form, Input, message, Modal, Select, Typography } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React, { useEffect, useState } from 'react'
import handleAPI from '../api/handleAPI'
import { ReservationsModel } from '../models/ReservationsModel'
import dayjs from 'dayjs'
import { TableModel, TableOptions } from '../models/TableModel'
import { replaceName } from '../utils/repalceName'

interface Props {
    reservation?: ReservationsModel,
    visible: boolean,
    onAddNew: () => void,
    onClose: () => void
}

const ModalReservation = (props: Props) => {
    const { visible, onClose, onAddNew, reservation } = props

    const [isLoading, setIsLoading] = useState(false);
    const [tableOptions, setTableOptions] = useState<TableOptions[]>([]);

    const [form] = useForm()

    useEffect(() => {
        if (reservation) {
            form.setFieldsValue({ ...reservation, reservation_date: dayjs(reservation.reservation_date) })
        }
    }, [reservation]);

    useEffect(() => {
        getAllTable()
    }, []);

    const handleClose = () => {
        form.resetFields()
        onClose()
    }

    const getAllTable = async () => {
        try {
          const api = '/table'
          const res: any = await handleAPI(api)
          if (res.data) {
            const options = res.data.map((item: TableModel) => ({ value: item._id, label: item.name }))
            setTableOptions(options)
          }
        } catch (error: any) {
          console.log(error)
        } 
      }

    const handleConfirm = async (values: any) => {
        try {
            setIsLoading(true)
            const api = `/reservations/update-reservations?id=${reservation?._id}`
            const res: any = await handleAPI(api, { ...values, status: 'Đã xác nhận' }, 'put')
            res.data && message.success(res.message)
            onAddNew()
            handleClose()
        } catch (error: any) {
            console.log(error)
            message.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal
            title='Chi tiết đơn đặt'
            open={visible}
            onCancel={handleClose}
            okText='Xác nhận'
            onOk={() => form.submit()}
            okButtonProps={{ loading: isLoading }}
        >
            <Form
                form={form}
                size='large'
                layout='vertical'
                onFinish={handleConfirm}
            >
                <Form.Item name='table_id' label='Chọn bàn:' rules={[{ required: true, message: 'Vui lòng chọn bàn.' }]}>
                    <Select
                        showSearch
                        options={tableOptions}
                        optionFilterProp='label'
                        filterOption={(input, option) => replaceName(option?.label ? option.label : '').includes(replaceName(input))}
                    />
                </Form.Item>
                <Form.Item label='Chọn ngày' name='reservation_date' rules={[{ message: 'Vui lòng nhập ngày kết thúc !!', required: true }]}>
                    <DatePicker className='w-full' format={'DD/MM/YYYY'} placeholder='Chọn ngày' />
                </Form.Item>
                <Form.Item name='reservation_time' rules={[{ required: true, message: 'Bạn chưa chọn thời gian!!!' }]}>
                    <Select
                        className='w-full'
                        placeholder='Chọn thời gian'
                        options={[
                            { label: '10:00 - 14:00', value: '10:00 - 14:00' },
                            { label: '17:00 - 22:00', value: '17:00 - 22:00' },
                        ]}
                    />
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

export default ModalReservation
