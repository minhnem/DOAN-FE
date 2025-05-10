import { Button, Card, Divider, Form, Input, InputNumber, message, Select, TreeSelect, Typography, Upload, UploadProps } from 'antd'
import { useForm } from 'antd/es/form/Form'
import React, { useEffect, useRef, useState } from 'react'
import { TreeData } from '../../models/CategoryModel'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa6'
import FormItem from 'antd/es/form/FormItem'
import { Editor } from '@tinymce/tinymce-react'
import { replaceName } from '../../utils/repalceName'
import { uploadFile } from '../../utils/uploadFile'
import handleAPI from '../../api/handleAPI'
import { getTreevalues } from '../../utils/getTreevalues'
import ModalCategory from '../../modals/ModalCategory'


const AddDish = () => {
    const [isVisibleModalCategory, setIsVisibleModalCategory] = useState(false)
    const [categories, setCategories] = useState<TreeData[]>([])
    const [fileList, setFileList] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [content, setContent] = useState('')

    const editorRef = useRef<any>(null)

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
        } else {
            form.resetFields()
            getData()
        }
    }, [id])

    const getData = async () => {
        try {
            setIsLoading(true)
            await getCategories()
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const getCategories = async () => {
        const api = '/dish/get-categories'
        const res = await handleAPI(api)
        const datas = res.data.categories.length > 0 ? getTreevalues(res.data.categories) : []
        setCategories(datas)
    }

    const getDishDetail = async (id: string) => {
        try {
            const api = `/dish/get-dish-detail?id=${id}`
            const res = await handleAPI(api)
            const item = res.data
            if (item) {
                form.setFieldsValue(item)
                setContent(item.content)
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

    const handleAddDish = async (values: any) => {
        setIsLoading(true)
        const content = editorRef.current.getContent()
        const data: any = {}
        for (const i in values) {
            data[i] = values[i] ?? ''
        }
        data.content = content
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
        } else {
            data.images = []
        }
        try {
            console.log(data)
            const api = `/dish/${id ? `update-dish?id=${id}` : 'add-new-dish'}`
            const res: any = await handleAPI(api, data, `${id ? 'put' : 'post'}`)
            message.success(res.message)
            form.resetFields()
            navigate('/menu')
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
                <Typography.Title level={4}>{id ? 'Sửa món ăn' : 'Thêm mới món ăn'}</Typography.Title>
                <Form form={form} size='large' layout='vertical' onFinish={handleAddDish} disabled={isLoading}>
                    <div className='grid grid-cols-12 gap-10'>
                        <div className='col-span-8'>
                            <Card title='Chọn ảnh món ăn'>
                                <Upload listType='picture-card' fileList={fileList} onChange={handleChangeUpload}>
                                    <FaPlus style={{ marginRight: '5px' }} />
                                    Tải lên
                                </Upload>
                            </Card>
                            <FormItem name='title' label='Tên món ăn:' rules={[{ required: true, message: 'Vui lòng nhập tên món ăn.' }]}>
                                <Input placeholder='Nhập tên món ăn' allowClear maxLength={150} showCount />
                            </FormItem>
                            <FormItem name='description' label='Mô tả món ăn:'>
                                <Input.TextArea maxLength={1000} showCount allowClear />
                            </FormItem>
                            <div>
                                <Editor
                                    disabled={isLoading}
                                    apiKey='coe6w4dimiz7zarp3pxo9vcu389puehn385e39rkz6ywuv32'
                                    onInit={(evt, editor) => (editorRef.current = editor)}
                                    initialValue={content !== '' ? content : ''}
                                    init={{
                                        plugins: ['autolink', 'lists', 'link', 'image', 'media', 'table', 'wordcount'],
                                        toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | link image media | numlist bullist | removeformat',
                                        mergetags_list: [
                                            { value: 'First.Name', title: 'First Name' },
                                            { value: 'Email', title: 'Email' },
                                        ],
                                    }}
                                />
                            </div>
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
                                <FormItem name='price' label='Nhập giá bán:' rules={[{ required: true, message: 'Vui lòng nhập giá.' }]}>
                                    <Input type='number' placeholder='Nhập giá' min={0} className='w-full'/>
                                </FormItem>
                                <FormItem name='status' label='Chọn trạng thái:' initialValue={'Phục vụ'}>
                                    <Select options={[{value: 'Phục vụ', label: 'Phục vụ'}, {value: 'Không phục vụ', label: 'Không phục vụ'}]}/>
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

export default AddDish
