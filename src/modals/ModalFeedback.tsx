import { Form, Input, message, Modal, Typography } from 'antd'
import React, { useState } from 'react'
import { FeedbackModel } from '../models/FeedbackModel'
import { useForm } from 'antd/es/form/Form'
import handleAPI from '../api/handleAPI'

interface Props {
    feedback?: FeedbackModel,
    visible: boolean,
    onReply: () => void,
    onClose: () => void
}

const ModalFeedback = (props: Props) => {
    const { visible, onClose, onReply, feedback } = props

    const [isLoading, setIsLoading] = useState(false);

    const [form] = useForm()

    const handleClose = () => {
        form.resetFields()
        onClose()
    }

    const handleReply = async (values: any) => {
        try {
            setIsLoading(true)
            const api = `/feedback/reply-feedback?id=${feedback?._id}`
            const res: any = await handleAPI(api, values, 'put')
            res.data && message.success('Phản hồi đến khác hàng thành công')
            onReply()
            handleClose() 
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal
            title='Trả lời phản hồi'
            open={visible}
            onCancel={handleClose}
            okText='Trả lời'
            onOk={() => form.submit()}
            okButtonProps={{ loading: isLoading }}
        >
            <label>Phản hồi của khách hàng: </label>
            <Typography.Paragraph>{feedback?.content}</Typography.Paragraph>
            <div className='text-center'>
                <Typography.Title level={5}>---------- Trả lời ---------</Typography.Title>
            </div>
            <Form
                form={form}
                size='large'
                layout='vertical'
                onFinish={handleReply}
            >
                <Form.Item name='description' label='Nhập câu trả lời:'>
                    <Input.TextArea className='mb-5' maxLength={1000} showCount rows={5} allowClear />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModalFeedback
