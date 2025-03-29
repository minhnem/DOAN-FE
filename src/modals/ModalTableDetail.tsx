import { Button, Form, Input, message, Modal, Typography } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React, { useEffect, useState } from 'react'
import { TableModel } from '../models/TableModel'
import handleAPI from '../api/handleAPI'

interface Props {
    table?: TableModel,
    visible: boolean,
    onAddNew: (val: any) => void,
    onClose: () => void
}

const ModalTableDetail = (props: Props) => {
    const { visible, onClose, table } = props

    const [isLoading, setIsLoading] = useState(false);
    const [tableDetail, setTableDetail] = useState<TableModel>();

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
            const api = `/table/get-table-reservations?id=${id}`
            const res = await handleAPI(api)
            if (res.data.reservations && Object.keys(res.data.reservations).length > 0) {
                form.setFieldsValue(res.data.reservations)
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
        try {
            setIsLoading(true)
            const api = tableDetail && Object.keys(tableDetail).length > 0 ? `/reservations/update-reservations?id=${tableDetail.reservations._id}` : '/reservations/add-new-reservations'
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
            <div className='mb-5'>
                <Typography.Text>Trạng thái: {table?.status}</Typography.Text>
            </div>
            <Form
                form={form}
                size='large'
                layout='vertical'
                onFinish={handleAddTableDetail}
            >
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
