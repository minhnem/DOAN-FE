import { Button, Card, Form, Input, message, Modal, Select, Space, Table, Typography } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React, { useEffect, useState } from 'react'
import { PersonnelModel } from '../../models/PersonnelModel'
import { ColumnProps } from 'antd/es/table'
import handleAPI from '../../api/handleAPI'
import { replaceName } from '../../utils/repalceName'

const { confirm } = Modal

const PersonnelManagement = () => {

    const [form] = useForm()

    const [isLoading, setIsLoading] = useState(false)
    const [personnel, setPersonnel] = useState<PersonnelModel[]>([]);
    const [personnelSelected, setPersonnelSelected] = useState<PersonnelModel>();

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
            key: 'buttonAction',
            dataIndex: '',
            title: 'Tùy chọn',
            fixed: 'right',
            align: 'center',
            width: 140,
            render: (personnel: PersonnelModel) => <>
                <Space>
                    <Button
                        type='primary'
                        onClick={() => {
                            setPersonnelSelected(personnel)
                        }}
                    >
                        chọn
                    </Button>
                    <Button onClick={() => {
                        confirm({
                            title: 'Xác nhận',
                            content: 'Bạn có chắc nhân viên này không ?',
                            onOk: () => {
                                handleRemovePersonnel(personnel._id)
                                setPersonnelSelected(undefined)
                            }
                        })
                    }}>Xóa</Button>
                </Space>
            </>
        }
    ]

    useEffect(() => {
        getAllPersonnel()
    }, []);

    useEffect(() => {
        if (personnelSelected) {
            form.setFieldsValue(personnelSelected)
        }
    }, [personnelSelected]);

    const getAllPersonnel = async () => {
        setIsLoading(true)
        try {
            const api = '/personnel/get-all-personnel'
            const res = await handleAPI(api)
            console.log(res.data)
            setPersonnel(res.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const getPersonnelById = async (id: string) => {
        setIsLoading(true)
        try {
            const api = `/personnel/get-personnel?id=${id}`
            const res = await handleAPI(api)
            setPersonnelSelected(res.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }


    const handleAddPersonnel = async (values: any) => {
        setIsLoading(true)
        try {
            const api = personnelSelected ? `/personnel/update-personnel?id=${personnelSelected._id}` : '/personnel/add-new'
            await handleAPI(api, { ...values, slug: replaceName(values.name) }, personnelSelected ? 'put' : 'post')
            message.success(personnelSelected ? 'Sửa thông tin nhân viên thành công' : 'Thêm nhân viên mới thành công')
            getAllPersonnel()
            form.resetFields()
        } catch (error) {
            console.log(error)
            message.error(personnelSelected ? 'Sửa thông tin nhân viên không thành công' : 'Thêm nhân viên mới không thành công')
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemovePersonnel = async (id: string) => {
        setIsLoading(true)
        try {
            const api = `/personnel/delete-personnel?id=${id}`
            await handleAPI(api, undefined, 'delete')
            message.success('Xóa nhân viên thành công')
            getAllPersonnel()
        } catch (error) {
            console.log(error)
            message.error('Xóa nhân viên không thành công')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <Card className='mb-5'>
                <Typography.Title level={2}>Quản lý nhân viên</Typography.Title>
                <Form form={form} size='large' layout='vertical' onFinish={handleAddPersonnel}>
                    <div className='grid grid-cols-12 gap-5'>
                        <div className='col-span-5'>
                            <Form.Item name='name' label='Tên:' rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!!' }]}>
                                <Input placeholder='Nhập tên' allowClear />
                            </Form.Item>
                            <Form.Item name='email' label='Email:' rules={[{ required: true, message: 'Vui lòng nhập email nhân viên!!' }]}>
                                <Input placeholder='Nhập Email' allowClear />
                            </Form.Item>
                        </div>
                        <div className='col-span-5'>
                            <Form.Item name='phone' label='Số điện thoại:' rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!!' }]}>
                                <Input type='number' placeholder='Nhập số điện thoại' allowClear />
                            </Form.Item>
                            <Form.Item name='role' label='Chức năng:' initialValue={'Nhân viên'}>
                                <Select
                                    className='w-full'
                                    placeholder='Chọn thời gian'
                                    options={[
                                        { label: 'Nhân viên', value: 'Nhân viên' },
                                        { label: 'Đầu bếp', value: 'Đầu bếp' },
                                    ]}
                                />
                            </Form.Item>
                        </div>
                        <div className='col-span-2 flex justify-center items-center'>
                            <Button type='primary' loading={isLoading} onClick={() => form.submit()}>
                                {personnelSelected ? 'Sửa' : 'Thêm mới'}
                            </Button>
                        </div>
                    </div>
                </Form>
            </Card>
            <Table
                dataSource={personnel}
                bordered
                rowKey={'_id'}
                columns={columns}
                scroll={{
                    y: 'calc(100vh - 300px)'
                }}
            />
        </div>
    )
}

export default PersonnelManagement
