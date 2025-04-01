import { Button, Card, Divider, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import MenuItemComponent from '../../components/MenuItemComponent';
import OrderItemComponent from '../../components/OrderItemComponent';

const Order = () => {

  return (
    <div className='grid grid-cols-12 gap-5'>
      <Card className='col-span-8'>
        <div className='grid grid-cols-3 gap-3'>
          <MenuItemComponent/>
        </div>
      </Card>
      <Card className='col-span-4 h-full'>
        <OrderItemComponent/>
        <div className='mt-auto'>
            <Divider/>
            <div className='flex justify-between items-center mb-6'>
              <Typography.Title level={4} style={{margin: '0'}}>Tổng giá:</Typography.Title>
              <Typography.Title level={4} style={{margin: '0'}}>500.000đ</Typography.Title>
            </div>
            <Button className='w-full' type='primary' size='large'>Đặt món</Button>
        </div>
      </Card>
    </div>
  )
}

export default Order
