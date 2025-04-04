import React, { useState } from 'react'
import { Button, Space, Typography } from 'antd'
import { HiMinusSm } from 'react-icons/hi'
import { colors } from '../constants/colors'
import { FiPlus } from 'react-icons/fi'
import { DishModel } from '../models/DishModel'
import { VND } from '../utils/handleCurrency'
import { MdDeleteForever } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { addDish, minusCount } from '../redux/reducers/orderReducer'

interface Props {
    orderItem: DishModel,
    onRemove: (val: any) => void
    [key: string]: any
}

const OrderItemComponent = (props: Props) => {
    const { orderItem, onRemove, ...rest } = props
    const dispatch = useDispatch()
    return (
        <div {...rest} className='grid grid-cols-12 gap-2 mb-4 p-1 border-[1px] border-solid border-[#ccc] rounded-xl'>
            <div className='col-span-3'>
                <img
                    src={orderItem.images[0]}
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
                        {orderItem.title}
                    </Typography.Paragraph>
                    <Typography.Title level={5} style={{ margin: '0', color: colors.primary }}>{VND.format(orderItem.price)}</Typography.Title>
                </div>
            </div>
            <div className='col-span-3'>
                <div className='flex items-center justify-around h-full flex-col'>
                    <div className='text-end w-full'>
                        <Button
                            type='text'
                            className='flex items-center text-[#ef4444]'
                            onClick={() => {
                                onRemove(orderItem)
                            }}>
                            <MdDeleteForever size={20} color='#ef4444 ' />
                            xóa
                        </Button>
                    </div>
                    <Space>
                        <Button 
                            icon={<HiMinusSm />}
                            onClick={() => {
                                dispatch(minusCount(orderItem))
                            }}
                        />
                        <span style={{ fontWeight: '400' }}>{orderItem.count}</span>
                        <Button
                            type='primary'
                            icon={<FiPlus />}
                            onClick={() => {
                                dispatch(addDish({...orderItem, count: 1}))
                            }}
                        />
                    </Space>
                </div>
            </div>
        </div>
    )
}

export default OrderItemComponent
