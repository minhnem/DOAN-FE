import { Button, Card, Divider, message, Select, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import MenuItemComponent from '../../components/MenuItemComponent';
import OrderItemComponent from '../../components/OrderItemComponent';
import handleAPI from '../../api/handleAPI';
import { DishModel } from '../../models/DishModel';
import { TableModel, TableOptions } from '../../models/TableModel';
import { useDispatch, useSelector } from 'react-redux';
import { addDish, orderSelector, removeDish, syncOrder } from '../../redux/reducers/orderReducer';
import { VND } from '../../utils/handleCurrency';

const Order = () => {
  const [menuItems, setMenuItems] = useState<DishModel[]>([]);
  const [tableOptions, setTableOptions] = useState<TableOptions[]>([]);
  const [tableId, setTableId] = useState();

  const order: DishModel[] = useSelector(orderSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    getMenuItem()
    getAllTable()
  }, []);

  useEffect(() => {
    if(tableId){
      getOrder(tableId)
    }
  }, [tableId]);

  const getOrder = async (id: string) => {
    try {
      const api = `/order?tableId=${id}`
      const res = await handleAPI(api)
      res.data && dispatch(syncOrder(res.data))
    } catch (error) {
      console.log(error)
    }
  }

  const getMenuItem = async () => {
    try {
      const api = '/dish/get-all-dish'
      const res = await handleAPI(api)
      res.data && setMenuItems(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateOrder = async (data: DishModel[]) => {
    for(const element of data) {
      const api = `/order/add-new-order${element.dishId && element.tableId ? `?dishId=${element.dishId}&tableId=${element.tableId}` : ''}`
      const value = {
        tableId: element.tableId,
        dishId: element._id,
        count: element.count,
        title: element.title,
        price: element.price,
        images: Array.isArray(element.images) ? [...element.images] : [],
      }
      try {
        const res = await handleAPI(api, value, 'post')
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    }
    tableId && getOrder(tableId)
  }

  const handleRemoveMenuItem = async (val: any) => {
    if(val.dishId) {
      try {
        const api = `/order/delete-dish-order?id=${val.dishId}&tableId=${val.tableId}`
        await handleAPI(api, undefined, 'delete')
        tableId && getOrder(tableId)
      } catch (error) {
        console.log(error)
      }
    } else {
      dispatch(removeDish(val))
    }
  }


  const getAllTable = async () => {
    try {
      const api = '/table'
      const res: any = await handleAPI(api)
      if (res.data) {
        const options = res.data.map((item: TableModel) => ({ value: item._id, label: item.name }))
        setTableOptions(options)
      }
    } catch (error: any) {
      console.log(error)
    }
  }

  const handleOrder = (item: DishModel) => {
    if (tableId) {
      const dish = { ...item, tableId: tableId, count: 1 }
      dispatch(addDish(dish))
    } else {
      message.error('Vui lòng chọn 1 bàn cần gọi món!!')
    }
  }

  return (
    <div className='grid grid-cols-12 gap-5'>
      <Card className='col-span-8'>
        <Typography.Title level={3}>Đặt món</Typography.Title>
        <div className='grid grid-cols-2 gap-5 mb-5'>
          <div>
            <p>Chọn bàn:</p>
            <Select
              className='w-full'
              options={tableOptions}
              placeholder='Chọn bàn ăn'
              size='large'
              onChange={val => setTableId(val)}
            />
          </div>
          <div></div>
        </div>
        <div className='grid grid-cols-3 gap-3'>
          {menuItems.length > 0 && menuItems.map((item, index) => (
            <MenuItemComponent key={index} menuItem={item} onClick={(val) => handleOrder(val)} />
          ))}
        </div>
      </Card>
      <Card className='col-span-4 h-full'>
        <Typography.Title level={3}>Đơn đặt</Typography.Title>
        <p className='mb-5'>Mã bàn: {tableId}</p>
        <p className='mb-5'>Tên bàn: {tableOptions && tableOptions.find((elment) => elment.value === tableId)?.label}</p>
        {order.length > 0 ?
          order.map((item, index) => (
            <OrderItemComponent key={index} orderItem={item} onRemove={(val) => handleRemoveMenuItem(val)}/>
          ))
          : ''}
        <div className='mt-auto'>
          <Divider />
          <div className='flex justify-between items-center mb-6'>
            <Typography.Title level={4} style={{ margin: '0' }}>Tổng giá:</Typography.Title>
            <Typography.Title level={4} style={{ margin: '0' }}>
              {VND.format(order.reduce((a, b) => a + (b.count * b.price), 0))}
            </Typography.Title>
          </div>
          <Button
            className='w-full'
            type='primary'
            size='large'
            onClick={() => {
              if (order && order.length > 0) {
                handleUpdateOrder(order)
              }
            }}
          >
            Đặt món
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Order
