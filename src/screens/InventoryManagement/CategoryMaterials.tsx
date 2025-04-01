import { Button, Card, Form, Input, message, Modal, Space, Table, TreeSelect, Typography } from 'antd'
import { useForm } from 'antd/es/form/Form'
import FormItem from 'antd/es/form/FormItem'
import React, { useEffect, useState } from 'react'
import { ColumnProps } from 'antd/es/table'
import { MdEditSquare } from 'react-icons/md';
import { MdDeleteForever } from 'react-icons/md';
import { getTreevalues } from '../../utils/getTreevalues'
import { replaceName } from '../../utils/repalceName'
import { CategoryModel, TreeData } from '../../models/CategoryModel'
import handleAPI from '../../api/handleAPI'

const { Title } = Typography
const { confirm } = Modal

const Category = () => {

    const [categoriesMaterials, setCategoriesMaterials] = useState<CategoryModel[]>([])
    const [categoryMaterialsSelected, setCategoryMaterialsSelected] = useState<CategoryModel>()
    const [treeValues, setTreeValues] = useState<TreeData[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(10)
    const [isLoading, setIsLoading] = useState(false)

    const [form] = useForm()

    const columns: ColumnProps<CategoryModel>[] = [
        {
            key: 'title',
            dataIndex: 'title',
            title: 'Tên danh mục'
        },
        {
            key: 'description',
            dataIndex: 'description',
            title: 'Mô tả'
        },
        {
            key: 'action',
            dataIndex: '',
            title: 'Lựa chọn',
            align: 'center',
            width: 160,
            fixed: 'right',
            render: (category: CategoryModel) => <Space>
                <Button
                    type='link'
                    color='default'
                    icon={<MdEditSquare color='#3b82f6 ' size={20} />}
                    onClick={() =>
                        setCategoryMaterialsSelected(category)
                    }
                />
                <Button
                    type='link'
                    color='default'
                    icon={<MdDeleteForever color='#ef4444' size={20}/>}
                    onClick={() =>
                        confirm({
                            title: 'Xác nhận',
                            content: 'Bạn có chắc muốn xóa danh mục này ?',
                            onOk: () => {
                                handleDeleteCategoryMaterials(category._id)
                            },
                        })
                    }
                />
            </Space>
        }
    ]

    useEffect(() => {
        if (categoryMaterialsSelected) {
            form.setFieldsValue(categoryMaterialsSelected)
        }
    }, [categoryMaterialsSelected])

    useEffect(() => {
        getCategoriesMaterials()
    }, [page, pageSize])

    useEffect(() => {
        getTreeValueCategoryMaterials()
    }, [])

    const getCategoriesMaterials = async () => {
        setIsLoading(true)
        const api = `/materials/get-categories`
        try {
            const res = await handleAPI(api)
            if (res.data) {
                setCategoriesMaterials(getTreevalues(res.data.categories, true))
                setTotal(res.data.total)
            }
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const getTreeValueCategoryMaterials = async () => {
        const api = '/materials/get-categories'
        try {
            const res = await handleAPI(api)
            const datas = res.data.categories.length > 0 ? getTreevalues(res.data.categories) : []
            setTreeValues(datas)
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        }
    }

    const handleAddCategoryMaterials = async (values: any) => {
        setIsLoading(true)
        const datas: any = {}
        for (const i in values) {
            datas[i] = values[i] ?? ''
        }
        datas.slug = replaceName(values.title)
        const api = '/materials/add-new-category'
        try {
            const res: any = await handleAPI(api, datas, 'post')
            message.success(res.message)
            form.resetFields()
            getCategoriesMaterials()
            getTreeValueCategoryMaterials()
        } catch (error: any) {
            message.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateCategoryMaterials = async (values: any) => {
        setIsLoading(true)
        const datas: any = {}
        for (const i in values) {
            datas[i] = values[i] ?? ''
        }
        datas.slug = replaceName(values.title)
        const api = `/materials/update-category?id=${categoryMaterialsSelected?._id}`
        try {
            const res: any = await handleAPI(api, datas, 'put')
            message.success(res.message)
            form.resetFields()
            setCategoryMaterialsSelected(undefined)
            getCategoriesMaterials()
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteCategoryMaterials = async (id: string) => {
        setIsLoading(true)
        const api = `/materials/delete-category?id=${id}`
        try {
            await handleAPI(api, undefined, 'delete')
            message.success('Xóa danh mục thành công.')
            setCategoriesMaterials(categoriesMaterials.filter((element) => element._id !== id))
            getTreeValueCategoryMaterials()
            getCategoriesMaterials()
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <div className='grid grid-cols-12 gap-8'>
                <div className='col-span-4'>
                    <Card title={categoryMaterialsSelected ? 'Sửa danh mục' : 'Thêm mới danh mục'}>
                        <Form
                            onFinish={categoryMaterialsSelected ? handleUpdateCategoryMaterials : handleAddCategoryMaterials}
                            form={form}
                            layout='vertical'
                            size='large'>
                            <FormItem name='parentId' label='Chọn danh mục'>
                                <TreeSelect treeData={treeValues} allowClear treeDefaultExpandAll placeholder='Chọn danh mục' />
                            </FormItem>
                            <FormItem name='title' label='Tên danh mục' rules={[{ required: true, message: 'Vui lòng nhập tên danh mục.' }]}>
                                <Input allowClear placeholder='Nhập tên danh mục' />
                            </FormItem>
                            <FormItem name='description' label='Mô tả'>
                                <Input.TextArea cols={4} allowClear />
                            </FormItem>
                            <div className='flex justify-end'>
                                <Space>
                                    <Button onClick={() => {
                                        setCategoryMaterialsSelected(undefined)
                                        form.resetFields()
                                    }}
                                    >
                                        Làm mới
                                    </Button>
                                    <Button
                                        loading={isLoading}
                                        type='primary'
                                        disabled={categoryMaterialsSelected ? false : true}
                                        onClick={() => form.submit()}
                                    >
                                        Sửa
                                    </Button>
                                    <Button
                                        loading={isLoading}
                                        type='primary'
                                        disabled={categoryMaterialsSelected ? true : false}
                                        onClick={() => form.submit()}
                                    >
                                        Thêm mới
                                    </Button>
                                </Space>
                            </div>
                        </Form>
                    </Card>
                </div>

                <div className='col-span-8'>
                    <Table
                        loading={isLoading}
                        bordered
                        columns={columns}
                        dataSource={categoriesMaterials}
                        pagination={{
                            showSizeChanger: true,
                            onShowSizeChange(current, size) {
                                setPageSize(size)
                            },
                            total,
                            onChange(page, pageSize) {
                                setPage(page)
                            },
                        }}
                        scroll={{
                            y: 'calc(100vh - 300px)'
                        }}
                        title={() => (
                            <div>
                                <Title style={{ margin: '0' }} level={5}>Bảng danh mục</Title>
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    )
}

export default Category

