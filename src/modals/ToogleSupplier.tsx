import { Avatar, Button, Form, Input, message, Modal, Select, Typography } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { FaRegUser } from "react-icons/fa";
import { colors } from '../constants/colors';
import { uploadFile } from '../utils/uploadFile';
import { replaceName } from '../utils/repalceName';
import handleAPI from '../api/handleAPI';
import { SupplierModel } from '../models/SupplierModel';

const { Paragraph } = Typography


interface Props {
  visible: boolean,
  onClose: () => void,
  onAddNew: (val: SupplierModel) => void,
  supplier?: SupplierModel
}

const ToogleSupplier = (props: Props) => {
  const { visible, onClose, onAddNew, supplier } = props

  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<any>()

  const inpRef = useRef<any>(null)

  const [form] = Form.useForm()

  useEffect(() => {
    if (supplier) {
      form.setFieldsValue(supplier)
    }
  }, [supplier])

  const addNewSupplier = async (values: any) => {
    setIsLoading(true)
    const data: any = {}

    for (const i in values) {
      data[i] = values[i] ?? ''
    }

    data.price = values.price ? parseFloat(data.price) : 0

    if (file) {
      data.photoUrl = await uploadFile(file)
    }

    data.slug = replaceName(values.name)

    try {
      const res: any = await handleAPI(`/supplier/${supplier ? `update?id=${supplier._id}` : 'add-new'}`, data, supplier ? 'put' : 'post')
      message.success(res.message)
      onAddNew(res.data)
      handleClose()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    form.resetFields()
    setFile(undefined)
    onClose()
  }
  return (
    <Modal
      closable={!isLoading}
      width={700}
      open={visible}
      onClose={handleClose}
      onCancel={handleClose}
      onOk={() => form.submit()}
      okButtonProps={{ loading: isLoading }}
      title={supplier ? 'Sửa' : 'Thêm Mới'}
      okText={supplier ? 'Sửa' : 'Thêm Mới'}
      cancelText='Hủy'>

      <label htmlFor='inpFile' className='flex justify-center items-center gap-5 my-5'>
        <div className='flex justify-center'>
          {file ? (
            <Avatar
              size={100}
              style={{
                backgroundColor: 'white',
                border: '2px dashed #5d6679',
                textAlign: 'center'
              }}
              src={URL.createObjectURL(file)} />
          ) : supplier ? (
            <Avatar
              size={100}
              style={{
                backgroundColor: 'white',
                border: '2px dashed #5d6679',
                textAlign: 'center'
              }}
              src={supplier.photoUrl} />
          ) : (
            <Avatar
              size={100}
              style={{
                backgroundColor: 'white',
                border: '2px dashed #5d6679',
                textAlign: 'center'
              }}>
              <FaRegUser size={70} style={{ color: colors.grey600 }} />
            </Avatar>
          )}
        </div>
        <div>
          <Paragraph style={{ margin: '0px' }}>Kéo hình ảnh vào đây</Paragraph>
          <Paragraph style={{ margin: '0px' }}>hoặc</Paragraph>
          <Button onClick={() => inpRef.current.click()} type='link' style={{ padding: '0px' }}>Chọn file</Button>
        </div>
      </label>

      <Form
        disabled={isLoading}
        onFinish={addNewSupplier}
        layout='horizontal'
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        size='large'>
        <Form.Item name={'name'} label={'Tên nhà cung cấp'} rules={[{ required: true, message: 'Vui lòng nhạp tên nhà cung cấp.' }]}>
          <Input placeholder='Nhập tên nhà cung cấp' allowClear />
        </Form.Item>
        <Form.Item name={'product'} label={'Sản phẩm'}>
          <Input placeholder='Nhập tên sản phẩm' allowClear />
        </Form.Item>
        <Form.Item name={'price'} label={'Giá'}>
          <Input placeholder='Nhập giá sản phẩm' type='number' allowClear />
        </Form.Item>
        <Form.Item name={'email'} label={'Email'}>
          <Input placeholder='Nhập email nhà cung cấp' type='email' allowClear />
        </Form.Item>
        <Form.Item name={'contact'} label={'Số điện thoại'}>
          <Input placeholder='Nhập số điện thoại nhà cung cấp' allowClear />
        </Form.Item>
      </Form>

      <div className='hidden'>
        <input ref={inpRef} accept='image/*' type='file' id='inpFile' onChange={(val: any) => setFile(val.target.files[0])} />
      </div>
    </Modal>
  )
}

export default ToogleSupplier
