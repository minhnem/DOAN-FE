import { Button, Card, Divider, Input, message, Select, Typography } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import MenuItemComponent from '../../components/MenuItemComponent';
import OrderItemComponent from '../../components/OrderItemComponent';
import handleAPI from '../../api/handleAPI';
import { DishModel } from '../../models/DishModel';
import { TableModel, TableOptions } from '../../models/TableModel';
import { useDispatch, useSelector } from 'react-redux';
import { addDish, orderSelector, removeDish, syncOrder } from '../../redux/reducers/orderReducer';
import { VND } from '../../utils/handleCurrency';
import { useSearchParams } from 'react-router-dom';
import BillModal from '../../modals/BillKetchenModal';
import BillPayment from '../../modals/BillPaymentModal';
import { Bill } from '../../models/BillsModel';

const Order = () => {
  const [menuItems, setMenuItems] = useState<DishModel[]>([]);
  const [tableOptions, setTableOptions] = useState<TableOptions[]>([]);
  const [tableId, setTableId] = useState('');
  const [visibleBillModal, setVisibleBillModal] = useState(false);
  const [bill, setBill] = useState<Bill>();
  const [visibleBillPaymentModal, setVisibleBillPaymentModal] = useState(false);
  const [promotion, setPromotion] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const order: DishModel[] = useSelector(orderSelector)
  const dispatch = useDispatch()

  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')

  const inputRef = useRef<any>(null)

  useEffect(() => {
    getMenuItem()
    getAllTable()
  }, []);

  useEffect(() => {
    if (id) {
      setTableId(id)
    }
  }, []);

  useEffect(() => {
    if (tableId && tableOptions.length > 0) {
      getOrder(tableId)
    } else {
      dispatch(syncOrder([]))
    }
  }, [tableId, tableOptions, promotion]);

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

  const getOrder = async (id: string) => {
    try {
      const api = `/order?tableId=${id}`
      const res = await handleAPI(api)
      if (res.data) {
        dispatch(syncOrder(res.data))
        const bill = res.data.map((element: DishModel) => ({
          title: element.title,
          count: element.count,
          price: element.price,
        }))
        setBill({
          tableId: tableId,
          tableName: tableOptions ? tableOptions.find((element) => element.value === tableId)?.label ?? ' ' : '',
          dishItem: bill,
          discount: promotion,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getMenuItem = async () => {
    try {
      const api = '/dish/get-all-dish'
      const res = await handleAPI(api)
      if (res.data) {
        setMenuItems(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getPromotion = async () => {
    const promotion = inputRef.current.input.value
    try {
      setIsLoading(true)
      const api = `/promotion/check-promotion?value=${promotion}`
      const res: any = await handleAPI(api)
      message.success(res.message)
      setPromotion(res.data.value)
    } catch (error: any) {
      message.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateOrder = async (data: DishModel[]) => {
    const bill: any = {
      tableId: tableId,
    }
    const dishItems: any[] = []
    for (const element of data) {
      const api = `/order/add-new-order${element.dishId && element.tableId ? `?dishId=${element.dishId}&tableId=${element.tableId}` : ''}`
      const value = {
        tableId: element.tableId,
        dishId: element._id,
        count: element.count,
        title: element.title,
        price: element.price,
        images: Array.isArray(element.images) ? [...element.images] : [],
      }
      dishItems.push({ title: element.title, count: element.count, price: element.price })
      try {
        const res = await handleAPI(api, value, 'post')
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    }
    bill.dishItem = dishItems
    bill.tableName = tableOptions && tableOptions.find((element) => element.value === tableId)?.label
    setBill(bill)
    tableId && getOrder(tableId)
    updateStatusTable()
  }

  const updateStatusTable = async () => {
    try {
      const api = `/table/update-status-table?id=${tableId}`
      await handleAPI(api, undefined, 'put')
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemoveMenuItem = async (val: any) => {
    if (val.dishId) {
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
              value={tableId}
              onChange={val => setTableId(val)}
            />
          </div>
          <div></div>
        </div>
        <div className='grid grid-cols-3 gap-3' style={{ maxHeight: '100vh', overflowY: 'auto', paddingRight: '8px', }}>
          {menuItems.length > 0 && menuItems.map((item, index) => (
            <MenuItemComponent key={index} menuItem={item} onClick={(val) => handleOrder(val)} />
          ))}
        </div>
      </Card>
      <Card className='col-span-4 h-full'>
        <Typography.Title level={3}>Đơn đặt</Typography.Title>
        <p className='mb-5'>Mã bàn: {tableId}</p>
        <p className='mb-5'>Tên bàn: {tableOptions && tableOptions.find((elment) => elment.value === tableId)?.label}</p>
        <div style={{ maxHeight: '40vh', overflowY: 'auto', paddingRight: '8px', }}>
          {order.length > 0 ?
            order.map((item, index) => (
              <OrderItemComponent key={index} orderItem={item} onRemove={(val) => handleRemoveMenuItem(val)} />
            ))
            : ''}
        </div>
        <div className='mt-auto'>
          <Divider />
          <div className='flex justify-between items-center gap-3'>
            <Input ref={inputRef} size='large' placeholder='Nhập mã giảm giá' allowClear />
            <Button size='large' type='primary' loading={isLoading} onClick={() => getPromotion()}>Xác nhận</Button>
          </div>
          <Divider />
          <div className='flex justify-between items-center mb-6'>
            <Typography.Title level={5} style={{ margin: '0' }}>giảm giá:</Typography.Title>
            <Typography.Title level={5} style={{ margin: '0' }}>
              {VND.format((order.reduce((a, b) => a + (b.count * b.price), 0) * promotion) / 100)}
            </Typography.Title>
          </div>
          <div className='flex justify-between items-center mb-6'>
            <Typography.Title level={4} style={{ margin: '0' }}>Tổng giá:</Typography.Title>
            <Typography.Title level={4} style={{ margin: '0' }}>
              {VND.format(order.reduce((a, b) => a + (b.count * b.price), 0) - ((order.reduce((a, b) => a + (b.count * b.price), 0) * promotion) / 100))}
            </Typography.Title>
          </div>
          <Button
            className='w-full mb-5'
            size='large'
            onClick={() => {
              if (order && order.length > 0) {
                handleUpdateOrder(order)
                setVisibleBillModal(true)
              }
            }}
          >
            Đặt món
          </Button>
          <Button
            className='w-full'
            type='primary'
            size='large'
            onClick={() => {
              setVisibleBillPaymentModal(true)
            }}
          >
            Thanh toán
          </Button>
        </div>
      </Card>
      <BillModal visible={visibleBillModal} onClose={() => setVisibleBillModal(false)} bill={bill} />
      <BillPayment
        visible={visibleBillPaymentModal}
        onClose={() => setVisibleBillPaymentModal(false)}
        bill={bill}
        onAddNew={() => {
          dispatch(syncOrder([]))
        }} />
    </div>
  )
}

export default Order
