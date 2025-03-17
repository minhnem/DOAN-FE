import { Avatar, Button, Dropdown, Input, message, Modal, Space, TableProps, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { DishModel } from '../../models/DishModel';
import Table, { ColumnProps } from 'antd/es/table';
import CategoryComponent from '../../components/CategoryComponent';
import { MdDeleteForever, MdEditSquare } from 'react-icons/md';
import handleAPI from '../../api/handleAPI';
import { replaceName } from '../../utils/repalceName';
import FilterProduct from '../../components/FilterProduct';
import { FiFilter } from 'react-icons/fi';
import { VND } from '../../utils/handleCurrency';

const { Title } = Typography
const { confirm } = Modal

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

const MenuManagement = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<DishModel[]>([])
  const [productsFilter, setProductsFilter] = useState<DishModel[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [productSelected, setProductSelected] = useState<DishModel>()
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  const [searchKey, setSearchKey] = useState<string>('')

  const navigate = useNavigate()

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<DishModel> = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const columns: ColumnProps<DishModel>[] = [
    {
      key: 'title',
      dataIndex: 'title',
      title: 'Tên sản phẩm',
      width: 300,
    },
    {
      key: 'images',
      dataIndex: 'images',
      title: 'Hình ảnh',
      width: 300,
      render: (imgs: string[]) => imgs.length > 0 && (
        <Space>
          {imgs.map((url, index) => (<Avatar key={index} src={url} size={50} style={{ border: '1px solid black' }} />))}
        </Space>
      )
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: 'Mô tả',
      width: 350,
      render: (desc: string) => <Tooltip style={{ width: '320px' }} title={desc}>
        <div className='text-clamp'>
          {desc}
        </div>
      </Tooltip>
    },
    {
      key: 'categories',
      dataIndex: 'categories',
      title: 'Danh mục',
      width: 300,
      render: (ids: string[]) => ids.length > 0 && (
        <Space>
          {ids.map((id, index) => (<CategoryComponent id={id} key={index} />))}
        </Space>
      )
    },
    {
      key: 'price',
      dataIndex: 'price',
      title: 'Giá bán',
      width: 150,
      render: (price: number) => VND.format(price)
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Trạng thái',
      width: 150,
    },
    {
      key: 'action',
      title: 'Lựa chọn',
      align: 'center',
      fixed: 'right',
      dataIndex: '',
      width: 150,
      render: (dish: DishModel) => <Space>
        <Button
          type='link'
          icon={<MdEditSquare size={20} color='#3b82f6' />}
          onClick={() => {
            navigate(`/menu/add-new-dish?id=${dish._id}`)
          }}
        />
        <Button
          type='link'
          icon={<MdDeleteForever size={20} color='#ef4444 ' />}
          onClick={() => {
            confirm({
              title: 'Xác nhận',
              content: 'Bạn có chắc muốn xóa sản phẩm này không ?',
              onOk: () => {
                deleteProduct(dish._id)
              }
            })
          }}
        />
      </Space>
    }
  ]

  useEffect(() => {
    if (!searchKey) {
      getProducts()
    }
  }, [searchKey])

  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = async () => {
    setIsLoading(true)
    try {
      const api = `/dish?page=${page}&pageSize=${pageSize}`
      const res = await handleAPI(api)
      if (res.data) {
        setProducts(res.data.products.map((item: DishModel) => ({ ...item, key: item._id })))
        setTotal(res.data.total)
      }
    } catch (error: any) {
      message.error(error.message)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      setIsLoading(true)
      const api = `/dish/delete-dish?id=${id}`
      await handleAPI(api, undefined, 'delete')
      message.success('Xóa sản phẩm thành công')
      setProducts(products.filter(item => item._id !== id))
    } catch (error: any) {
      message.error(error.message)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const hanleSearchProduct = async () => {
    const title = replaceName(searchKey)
    try {
      setIsLoading(true)
      const api = `/dish?title=${title}&page=${page}&pageSize=${pageSize}`
      const res = await handleAPI(api)
      if (res.data) {
        setProducts(res.data.products.map((item: DishModel) => ({ ...item, key: item._id })))
        setTotal(res.data.title)
      }
    } catch (error: any) {
      message.error(error.message)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterProduct = async (values: any) => {
    console.log(values)
    try {
      setIsLoading(true)
      const api = '/dish/filter-dish'
      const res: any = await handleAPI(api, values, 'post')
      message.success(res.message)
      setProductsFilter(res.data.items)
      setTotal(res.data.total)
    } catch (error: any) {
      console.log(error)
      message.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Table
      rowSelection={rowSelection}
      loading={isLoading}
      dataSource={productsFilter.length > 0 ? productsFilter : products}
      bordered
      columns={columns}
      pagination={{
        showSizeChanger: true,
        onChange(page, pageSize) {
          setPage(page)
        },
        onShowSizeChange(current, size) {
          setPageSize(size)
        },
        total,
      }}
      scroll={{
        x: '100%'
      }}
      title={() => (
        <div className='flex justify-between'>
          <div>
            <Title level={4}>Bảng sản phẩm</Title>
          </div>
          <div className='text-right'>
            <Space>
              {
                selectedRowKeys.length > 0 ? (
                  <div>
                    <span className='text-red-500 font-bold mr-3'>{selectedRowKeys.length} món ăn được chọn</span>
                    <Button
                      type='primary'
                      danger
                      onClick={() => {
                        confirm({
                          title: 'Xác nhận',
                          content: 'Bạn có chắc muốn xóa những món ăn được chọn không ?',
                          onOk: () => {
                            selectedRowKeys.forEach((id: string) => deleteProduct(id))
                          }
                        })
                      }}
                    >
                      Xóa
                    </Button>
                  </div>
                ) : ''
              }
              <Input.Search
                value={searchKey}
                onChange={(val) => setSearchKey(val.target.value)}
                onSearch={hanleSearchProduct}
                placeholder='Nhập tên sản phẩm'
                allowClear
              />
              <Dropdown dropdownRender={(menu) => <FilterProduct value={{}} onFilter={(val) => handleFilterProduct(val)} />}>
                <Button icon={<FiFilter />}>Lọc</Button>
              </Dropdown>
              {productsFilter.length > 0 ? <Button danger onClick={() => setProductsFilter([])}>
                Hủy lọc
              </Button> : ''}
              <Button type='primary'>
                <Link to='/menu/add-new-dish'>Thêm mới</Link>
              </Button>
            </Space>
          </div>
        </div>
      )}
    />
  )
}

export default MenuManagement
