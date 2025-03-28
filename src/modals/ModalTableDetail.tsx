import { Form, Input, message, Modal, Select, Typography } from 'antd'
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
    const { visible, onAddNew, onClose, table } = props

    const [isLoading, setIsLoading] = useState(false);
    const [tableDetail, setTableDetail] = useState<TableModel>();

    const [form] = useForm()

    const handleClose = () => {
        form.resetFields()
        onClose()
    }

    useEffect(() => {
        if (table) {
            getTableDetail(table._id)
        }
    }, [table, tableDetail]);

    const getTableDetail = async (id: string) => {
        try {
            setIsLoading(true)
            console.log(id)
            // const api = `/table/get-table-detail?id=${id}`
            // const res = await handleAPI(api)
            // res.data && setTableDetail(res.data)
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddTableDetail = async (values: any) => {
        try {
            setIsLoading(true)
            console.log(values)

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
            onClose={handleClose}
            onCancel={handleClose}
            onOk={form.submit}
            okButtonProps={{
                loading: isLoading
            }}
        >
            <div className='flex justify-between my-5'>
                <Typography.Text>Tên bàn: {table?.name}</Typography.Text>
                <Typography.Text>Mã bàn: {table?._id}</Typography.Text>
            </div>
            <div  className='mb-5'>
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
