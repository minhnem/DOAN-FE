import { Avatar, Button, Dropdown, Input, message, Modal, Space, TableProps, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Table, { ColumnProps } from 'antd/es/table';
import { MdDeleteForever, MdEditSquare } from 'react-icons/md';
import handleAPI from '../../api/handleAPI';
import { replaceName } from '../../utils/repalceName';
import FilterProduct from '../../components/FilterProduct';
import { FiFilter } from 'react-icons/fi';
import { VND } from '../../utils/handleCurrency';
import { formatDate } from '../../utils/formatDate';
import { MaterialsModel } from '../../models/Materials';
import CategoryComponent from '../../components/CategoryComponent';
import SupplierComponent from '../../components/SupplierComponent';

const { Title } = Typography
const { confirm } = Modal

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

const MenuManagement = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [materials, setMaterials] = useState<MaterialsModel[]>([])
  const [materialsFilter, setMaterialsFilter] = useState<MaterialsModel[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  const [searchKey, setSearchKey] = useState<string>('')

  const navigate = useNavigate()

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const columns: ColumnProps<MaterialsModel>[] = [
    {
      key: 'title',
      dataIndex: 'title',
      title: 'Tên',
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
      render: (ids: string[]) => <Space>{
         ids.map((id, index) => <CategoryComponent id={id} options='materials' key={index}/>)
      }</Space>
    },
    {
      key: 'supplier',
      dataIndex: 'supplier',
      title: 'Nhà cung cấp',
      width: 250,
      render: (id: string) => <SupplierComponent id={id}/>
    },
    {
      key: 'cost',
      dataIndex: 'cost',
      title: 'Giá nhập vào',
      width: 150,
      render: (price: number) => VND.format(price)
    },
    {
      key: 'importDate',
      dataIndex: 'importDate',
      title: 'Ngày nhập',
      width: 150,
      render: (date: any) => formatDate(date).split(' ')[1]
    },
    {
      key: 'expiryDate',
      dataIndex: 'expiryDate',
      title: 'Hạn sử dụng',
      width: 150,
      render: (date: any) => date ? formatDate(date).split(' ')[1] : ''
    },
    {
      key: 'action',
      title: 'Lựa chọn',
      align: 'center',
      fixed: 'right',
      dataIndex: '',
      width: 150,
      render: (materials: MaterialsModel) => <Space>
        <Button
          type='link'
          icon={<MdEditSquare size={20} color='#3b82f6' />}
          onClick={() => {
            navigate(`/inventory/add-new-materials?id=${materials._id}`)
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
                deleteMaterials(materials._id)
              }
            })
          }}
        />
      </Space>
    }
  ]

  useEffect(() => {
    if (!searchKey) {
      getMaterials()
    }
  }, [searchKey])

  useEffect(() => {
    getMaterials()
  }, [])

  const getMaterials = async () => {
    setIsLoading(true)
    try {
      const api = `/materials?page=${page}&pageSize=${pageSize}`
      const res = await handleAPI(api)
      if (res.data) {
        setMaterials(res.data.products.map((item: any) => ({ ...item, key: item._id })))
        setTotal(res.data.total)
      }
    } catch (error: any) {
      message.error(error.message)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteMaterials = async (id: string) => {
    try {
      setIsLoading(true)
      const api = `/materials/delete-materials?id=${id}`
      await handleAPI(api, undefined, 'delete')
      message.success('Xóa sản phẩm thành công')
      setMaterials(materials.filter(item => item._id !== id))
    } catch (error: any) {
      message.error(error.message)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const hanleSearchMaterials = async () => {
    const title = replaceName(searchKey)
    try {
      setIsLoading(true)
      const api = `/materials?title=${title}&page=${page}&pageSize=${pageSize}`
      const res = await handleAPI(api)
      if (res.data) {
        setMaterials(res.data.products.map((item: any) => ({ ...item, key: item._id })))
        setTotal(res.data.title)
      }
    } catch (error: any) {
      message.error(error.message)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterMaterials = async (values: any) => {
    console.log(values)
  }

  return (
    <Table
      rowSelection={rowSelection}
      loading={isLoading}
      dataSource={materialsFilter.length > 0 ? materialsFilter : materials}
      rowKey={'_id'}
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
                            selectedRowKeys.forEach((id: string) => deleteMaterials(id))
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
                onSearch={hanleSearchMaterials}
                placeholder='Nhập tên sản phẩm'
                allowClear
              />
              <Dropdown dropdownRender={(menu) => <FilterProduct value={{}} onFilter={(val) => handleFilterMaterials(val)} />}>
                <Button icon={<FiFilter />}>Lọc</Button>
              </Dropdown>
              {materialsFilter.length > 0 ? <Button danger onClick={() => setMaterialsFilter([])}>
                Hủy lọc
              </Button> : ''}
              <Button type='primary'>
                <Link to='/inventory/add-new-materials'>Thêm mới</Link>
              </Button>
            </Space>
          </div>
        </div>
      )}
    />
  )
}

export default MenuManagement
