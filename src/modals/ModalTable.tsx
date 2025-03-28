import { Form, Input, message, Modal, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React, { useEffect, useState } from 'react'
import { replaceName } from '../utils/repalceName'
import handleAPI from '../api/handleAPI'
import { TableModel } from '../models/TableModel'

interface Props {
    table?: TableModel,
    visible: boolean,
    onAddNew: (val: any) => void,
    onClose: () => void
}

const ModalTable = (props: Props) => {
    const { visible, onAddNew, onClose, table } = props

    const [isLoading, setIsLoading] = useState(false);

    const [form] = useForm()

    useEffect(() => {
        if(table) {
            form.setFieldsValue(table)
        }
    }, [table]);

    const handleClose = () => {
        form.resetFields()
        onClose()
    }

    const handleAddTable = async (values: any) => {
        const data = {...values, slug: replaceName(values.name)}
        try {
            setIsLoading(true)
            const api = table ? `/table/update-table?id=${table._id}` : '/table/add-new-table'
            const res: any = await handleAPI(api, data, table ? 'put' : 'post')
            if(res.data) {
                message.success(res.message)
                onAddNew(res.data)
                handleClose()
            }
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Modal 
            title={table ? 'Sửa bàn ăn' : 'Thêm mới bàn ăn'}
            open={visible}
            onClose={handleClose}
            onCancel={handleClose}
            onOk={form.submit}
            okButtonProps={{
                loading: isLoading
            }}
        >
            <Form
                disabled={isLoading}
                size='large'
                layout='vertical'
                onFinish={handleAddTable}
                form={form}
            >
                <Form.Item name='name' label='Tên bàn:' rules={[{required: true, message: 'Vui lòng nhập tên bàn ăn!!!'}]}>
                    <Input placeholder='Nhập tên' allowClear/>
                </Form.Item>
                <Form.Item name='status' label='Trạng thái:' initialValue={'Trống'}>
                    <Select options={[{value: 'Trống', label: 'Trống'}, {value: 'Đang phục vụ', label: 'Đang phục vụ'}, {value:'Chờ phục vụ', label: 'Chờ phục vụ'}]}/>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModalTable
