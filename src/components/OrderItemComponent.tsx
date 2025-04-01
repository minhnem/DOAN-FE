import React from 'react'
import image from '../assets/image/image1.jpg'
import { Button, Space, Typography } from 'antd'
import { HiMinusSm } from 'react-icons/hi'
import { colors } from '../constants/colors'
import { FiPlus } from 'react-icons/fi'
import { DishModel } from '../models/DishModel'

interface Props {
    orderItem?: DishModel
}

const OrderItemComponent = (props: Props) => {
    return (
        <div className='grid grid-cols-12 gap-2'>
            <div className='col-span-3'>
                <img
                    src={image}
                    alt='iimage'
                    style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        border: '1px solid #ccc',
                        borderRadius: '12px',
                        objectFit: 'cover'
                    }} />
            </div>
            <div className='col-span-6'>
                <div className='flex justify-center flex-col h-full'>
                    <Typography.Paragraph
                        ellipsis={{ rows: 1, expandable: false }}
                        style={{
                            margin: '0',
                            fontSize: '1.2rem',
                            fontWeight: '600'
                        }}
                    >
                        Món ăn này được làm từ rất nhiều nguyên liệu
                    </Typography.Paragraph>
                    <Typography.Title level={5} style={{ margin: '0', color: colors.primary }}>50.000đ</Typography.Title>
                </div>
            </div>
            <div className='col-span-3'>
                <div className='flex items-center h-full'>
                    <Space>
                        <Button icon={<HiMinusSm />} />
                        <span style={{ fontWeight: '400' }}>1</span>
                        <Button type='primary' icon={<FiPlus />} />
                    </Space>
                </div>
            </div>
        </div>
    )
}

export default OrderItemComponent
