import { Button, Card, Form, message, Select, Slider, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import handleAPI from '../api/handleAPI'
import { Categories, CategoryModel } from '../models/CategoryModel'
import { useForm } from 'antd/es/form/Form'
import FormItem from 'antd/es/form/FormItem'
import { DishModel } from '../models/DishModel'

export interface FilterProductValue {
  categories?: string[],
  price?: number[],
}

interface Props {
  value: FilterProductValue,
  onFilter: (val: FilterProductValue) => void
}

const FilterProduct = (props: Props) => {

  const { onFilter } = props

  const [isLoading, setIsLoading] = useState(false)
  const [selectData, setSelectData] = useState<{
    categories: Categories[]
    price: number[]
  }>(
    {
      categories: [],
      price: []
    }
  )

  const [form] = useForm()

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      setIsLoading(true)
      await getCategories()
      await getDishes()
    } catch (error: any) {
      message.error(error.messase)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCategories = async () => {
    const api = '/dish/get-all-categories'
    const res = await handleAPI(api)
    const data = res.data && res.data.map((item: CategoryModel) => ({ label: item.title, value: item._id }))
    setSelectData(prev => ({ ...prev, categories: data }))
  }

  const getDishes = async () => {
    const api = '/dish/get-all-dish'
    const res = await handleAPI(api)
    const price = res.data && res.data.map((item: DishModel) => item.price)
    setSelectData(prev => ({...prev, price: price}))
  }

  const handleFilter = (values: any) => {
    onFilter(values)
  }

  return (
    <Card className='filter-cart' style={{ width: '400px' }}>
      {isLoading ? <Spin /> : <>
        <Form
          size='large'
          layout='vertical'
          onFinish={handleFilter}
          form={form}
        >
          <FormItem label='Danh mục:' name='categories'>
            <Select options={selectData.categories} allowClear mode='multiple' placeholder='Danh mục' />
          </FormItem>
          <FormItem label='Giá:' name='price'>
            <Slider range min={Math.min(...selectData.price)} max={Math.max(...selectData.price)} />
          </FormItem>
        </Form>
        <div className='text-right'>
          <Button type='primary' onClick={() => form.submit()}>Lọc</Button>
        </div>
      </>}
    </Card>
  )
}

export default FilterProduct
