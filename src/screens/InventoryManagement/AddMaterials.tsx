import { Button, Card, DatePicker, Divider, Form, Input, message, Select, TreeSelect, Typography, Upload, UploadProps } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React, { useEffect, useState } from 'react'
import { TreeData } from '../../models/CategoryModel'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa6'
import FormItem from 'antd/es/form/FormItem'
import { replaceName } from '../../utils/repalceName'
import { uploadFile } from '../../utils/uploadFile'
import handleAPI from '../../api/handleAPI'
import { getTreevalues } from '../../utils/getTreevalues'
import ModalCategory from '../../modals/ModalCategory'
import dayjs from 'dayjs'


const AddMaterials = () => {
    const [isVisibleModalCategory, setIsVisibleModalCategory] = useState(false)
    const [supplierOptions, setSupplierOptions] = useState<any[]>([])
    const [categories, setCategories] = useState<TreeData[]>([])
    const [fileList, setFileList] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const id = searchParams.get('id')

    const [form] = useForm()

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        if (id) {
            getDishDetail(id)
        }
    }, [id])

    const getData = async () => {
        try {
            setIsLoading(true)
            await getSuppliers()
            await getCategories()
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const getSuppliers = async () => {
        const api = '/supplier'
        const res = await handleAPI(api)
        const items = res.data.suppliers.map((item: any) => ({ label: item.name, value: item._id }))
        setSupplierOptions(items)
    }

    const getCategories = async () => {
        const api = '/materials/get-categories'
        const res = await handleAPI(api)
        const datas = res.data.categories.length > 0 ? getTreevalues(res.data.categories) : []
        setCategories(datas)
    }

    const getDishDetail = async (id: string) => {
        try {
            const api = `/materials/get-materials-detail?id=${id}`
            const res = await handleAPI(api)
            const item = res.data
            if (item) {
                form.setFieldsValue({...item, importDate: dayjs(item.importDate), expiryDate: dayjs(item.expiryDate)})
                if (item.images && item.images.length > 0) {
                    const images = [...fileList]
                    item.images.forEach((url: string) => images.push({
                        uid: `${Math.floor(Math.random() * 100000)}`,
                        name: url,
                        status: 'done',
                        url,
                    }))
                    setFileList(images)
                }
            }
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        }
    }

    const handleChangeUpload: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        const items = newFileList.map((file) => file.originFileObj
            ? { ...file, url: file.originFileObj && URL.createObjectURL(file.originFileObj), status: 'done' }
            : { ...file }
        )
        setFileList(items)
    }

    const handleAddMaterials = async (values: any) => {
        setIsLoading(true)
        const data: any = {}
        for (const i in values) {
            data[i] = values[i] ?? ''
        }
        data.slug = replaceName(values.title)
        if (fileList.length > 0) {
            const urls: string[] = []
            for (const file of fileList) {
                if (file.originFileObj) {
                    const url = await uploadFile(file.originFileObj)
                    urls.push(url)
                } else {
                    urls.push(file.url)
                }
            }
            data.images = urls
        }
        data.importDate = new Date(values.importDate)
        data.expiryDate = new Date(values.expiryDate)
        try {
            console.log(data)
            const api = `/materials/${id ? `update-materials?id=${id}` : 'add-new-materials'}`
            const res: any = await handleAPI(api, data, `${id ? 'put' : 'post'}`)
            console.log(res.data)
            message.success(res.message)
            form.resetFields()
            navigate('/inventory')
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        } finally {
            setIsLoading(false)
        }

    }

    return (
        <div>
            <div>
                <Typography.Title level={4}>{id ? 'Sửa nguyên liệu' : 'Thêm mới nguyên liệu'}</Typography.Title>
                <Form form={form} size='large' layout='vertical' onFinish={handleAddMaterials} disabled={isLoading}>
                    <div className='grid grid-cols-12 gap-10'>
                        <div className='col-span-8'>
                            <Card title='Chọn ảnh nguyên liệu'>
                                <Upload listType='picture-card' fileList={fileList} onChange={handleChangeUpload}>
                                    <FaPlus style={{ marginRight: '5px' }} />
                                    Tải lên
                                </Upload>
                            </Card>
                            <Card className='mt-5'>
                                <FormItem name='title' label='Tên nguyên liệu:' rules={[{ required: true, message: 'Vui lòng nhập tên nguyên liệu.' }]}>
                                    <Input placeholder='Nhập tên nguyên liệu' allowClear maxLength={150} showCount />
                                </FormItem>
                                <FormItem name='description' label='Mô tả nguyên liệu:'>
                                    <Input.TextArea maxLength={1000} showCount allowClear />
                                </FormItem>
                                <div className='grid grid-cols-2 gap-5'>
                                    <FormItem label='Ngày nhập vào:' name='importDate' rules={[{ message: 'Vui lòng nhập vào ngày nhập nguyên liệu!!', required: true }]}>
                                        <DatePicker className='w-full' format={'DD/MM/YYYY'} placeholder='Chọn ngày nhập vào' />
                                    </FormItem>
                                    <FormItem label='Hạn sử dụng:' name='expiryDate'>
                                        <DatePicker className='w-full' format={'DD/MM/YYYY'} placeholder='Chọn ngày hết hạn' />
                                    </FormItem>
                                </div>
                            </Card>
                        </div>

                        <div className='col-span-4'>
                            <Card title='Nhập thông tin'>
                                <FormItem name='categories' label='Chọn danh mục:' rules={[{ required: true, message: 'Vui lòng chọn danh mục.' }]}>
                                    <TreeSelect
                                        treeData={categories}
                                        multiple
                                        dropdownRender={(menu) => (
                                            <>
                                                {menu}
                                                <Divider className='mb-1' />
                                                <div className='flex justify-end'>
                                                    <Button
                                                        className='m-2'
                                                        onClick={() => setIsVisibleModalCategory(true)}
                                                    >
                                                        Thêm mới
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    />
                                </FormItem>
                                <FormItem name='supplier' label='Chọn nhà cung cấp:' rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp.' }]}>
                                        <Select
                                            showSearch
                                            options={supplierOptions}
                                            optionFilterProp='label'
                                            filterOption={(input, option) => replaceName(option?.label ? option.label : '').includes(replaceName(input))}
                                        />
                                    </FormItem>
                                <FormItem name='cost' label='Giá nhập vào:' rules={[{ required: true, message: 'Vui lòng nhập giá.' }]}>
                                    <Input type='number' placeholder='Giá nhập vào' min={0} className='w-full' />
                                </FormItem>
                                <FormItem name='mass' label='Khối lượng:'>
                                    <Input placeholder='Nhập khối lượng' min={0} className='w-full' />
                                </FormItem>
                               
                            </Card>
                            <Card className='mt-5 text-end'>
                                <Button loading={isLoading} type='primary' onClick={() => form.submit()}>{id ? 'Sửa' : 'Thêm mới'}</Button>
                            </Card>
                        </div>
                    </div>
                    <ModalCategory
                        visible={isVisibleModalCategory}
                        onClose={() => setIsVisibleModalCategory(false)}
                        values={categories}
                        onAddNew={async () => await getCategories()}
                    />
                </Form>
            </div>
        </div>
    )
}

export default AddMaterials
