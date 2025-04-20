import React, { useEffect, useState } from 'react'
import { FeedbackModel } from '../models/FeedbackModel';
import Table, { ColumnProps } from 'antd/es/table';
import { Button, message, Radio, Space, Tooltip } from 'antd';
import { FiFilter } from 'react-icons/fi';
import Title from 'antd/es/typography/Title';
import ModalFeedback from '../modals/ModalFeedback';
import handleAPI from '../api/handleAPI';

const FeedbackManagement = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isVisibleModalFeedback, setIsVisibleModalFeedback] = useState(false);
    const [status, setStatus] = useState('Đã phản hồi')
    const [feedback, setFeedback] = useState<FeedbackModel[]>([]);
    const [feedbackSelected, setFeedbackSelected] = useState<FeedbackModel>();

    const columns: ColumnProps<FeedbackModel>[] = [
        {
            key: 'name',
            dataIndex: 'name',
            title: 'Tên khách hàng',
            width: 200
        },
        {
            key: 'email',
            dataIndex: 'email',
            title: 'Email',
            width: 250
        },
        {
            key: 'content',
            dataIndex: 'content',
            title: 'Nội dung',
            width: 450,
            render: (content: string) => <Tooltip style={{ width: '420px' }} title={content}>
                <div className='text-clamp'>
                    {content}
                </div>
            </Tooltip>
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: 'Tình trạng',
            width: 150,
        },
        {
            key: 'buttonAction',
            dataIndex: '',
            title: 'Tùy chọn',
            fixed: 'right',
            align: 'center',
            width: 200,
            render: (feedback: FeedbackModel) => <>
                <Space>
                    <Button
                        type='primary'
                        onClick={() => {
                            setFeedbackSelected(feedback)
                            setIsVisibleModalFeedback(true)
                        }}
                    >
                        Phản hồi
                    </Button>
                    <Button onClick={() => handleRemoveFeedback(feedback._id)}>Xóa</Button>
                </Space>
            </>
        }
    ]

    useEffect(() => {
        if (status) {
            getFeedbackStatus(status)
        }
    }, [status]);

    const getFeedbackStatus = async (status: string) => {
        setIsLoading(true)
        try {
            const api = `/feedback/get-feedback-status?status=${status}`
            const res = await handleAPI(api)
            setFeedback(res.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemoveFeedback = async (id: string) => {
        setIsLoading(true)
        try {
            const api = `/feedback/delete-feedback?id=${id}`
            await handleAPI(api, undefined, 'delete')
            getFeedbackStatus(status)
            message.success('Xóa phản hồi thành công')
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <Table
                loading={isLoading}
                dataSource={feedback}
                rowKey={'_id'}
                columns={columns}
                scroll={{
                    y: 'calc(100vh - 300px)'
                }}
                bordered
                title={() => (
                    <div>
                        <div className='grid grid-rows-1 grid-cols-2'>
                            <div>
                                <Title level={5}>Bảng quản lý đơn đặt bàn</Title>
                            </div>
                            <div className='text-end'>
                                <Space>
                                    <Button icon={<FiFilter />}>Lọc</Button>
                                </Space>
                            </div>
                        </div>
                        <div className='w-1/3 mt-4'>
                            <Radio.Group
                                block
                                options={[
                                    { label: 'Đã phản hồi', value: 'Đã phản hồi' },
                                    { label: 'Chưa phản hổi', value: 'Chưa phản hổi' },
                                ]}
                                defaultValue="Đã phản hồi"
                                optionType="button"
                                buttonStyle="solid"
                                onChange={(val) => setStatus(val.target.value)}
                            />
                        </div>
                    </div>
                )}
            />
            <ModalFeedback
                visible={isVisibleModalFeedback}
                feedback={feedbackSelected}
                onReply={() => getFeedbackStatus(status)}
                onClose={() => {
                    setIsVisibleModalFeedback(false)
                    setFeedbackSelected(undefined)
                }}
            />
        </div>
    )
}

export default FeedbackManagement
