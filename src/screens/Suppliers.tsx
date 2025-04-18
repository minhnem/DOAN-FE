import { Button, message, Modal, Space, Typography } from 'antd'
import Table, { ColumnProps } from 'antd/es/table'
import React, { useEffect, useState } from 'react'
import { FiFilter } from "react-icons/fi";
import { SupplierModel } from '../models/SupplierModel';
import handleAPI from '../api/handleAPI';
import { MdEditSquare } from "react-icons/md";
import { RiUserForbidFill } from "react-icons/ri";
import ModalExportExcel from '../modals/ModalExportExcel';
import ToogleSupplier from '../modals/ToogleSupplier';

const { Title } = Typography
const { confirm } = Modal

const Suppliers = () => {

  const [isVisibleModalAddNew, setIsVisibleModalAddNew] = useState(false)
  const [isVisibleModalExport, setIsVisibleModalExport] = useState(false)
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([])
  const [supplierSelected, setSupplierSelected] = useState<SupplierModel>()
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(10)

  useEffect(() => {
    getSuppliers()
  }, [page, pageSize])

  const columns: ColumnProps<SupplierModel>[] = [
    {
      key: 'index',
      dataIndex: 'index',
      title: '#',
      align: 'center',
      width: 50
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Tên nhà cung cấp',
      width: 250
    },
    {
      key: 'product',
      dataIndex: 'product',
      title: 'Sản phẩm',
      width: 250
    },
    {
      key: 'email',
      dataIndex: 'email',
      title: 'Email',
      width: 250
    },
    {
      key: 'contact',
      dataIndex: 'contact',
      title: 'Số điện thoại',
      width: 150
    },
    {
      key: 'buttonAction',
      dataIndex: '',
      title: 'Tùy chọn',
      fixed: 'right',
      align: 'center',
      width: 100,
      render: (supplier: SupplierModel) => <Space>
        <Button
          color='default'
          type='link'
          icon={<MdEditSquare size={20}
            color='#3b82f6'/>}
          onClick={() => {
            setSupplierSelected(supplier)
            setIsVisibleModalAddNew(true)
          }}
        />
        <Button
          color='danger'
          type='link'
          icon={<RiUserForbidFill
            size={20}
            color='#ef4444 ' />}
          onClick={() =>
            confirm({
              title: 'Xác nhận',
              content: 'Bạn có chắc muốn xóa nhà cung cấp này ?',
              onOk: () => {
                deleteSupplier(supplier._id)
                getSuppliers()
              }
            })
          } />
      </Space>
    }
  ]

  const getSuppliers = async () => {
    const api = `/supplier?page=${page}&pageSize=${pageSize}`
    setIsLoading(true)
    try {
      const res = await handleAPI(api)
      const items: SupplierModel[] = []
      res.data.suppliers.forEach((item: any, index: number) => {
        items.push({
          index: ((page - 1) * pageSize) + (index + 1),
          ...item,
        })
      })
      setSuppliers(items)
      setTotal(res.data.total)
    } catch (error: any) {
      message.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteSupplier = async (id: string) => {
    const api = `supplier/delete?id=${id}`
    setIsLoading(true)
    try {
      const res: any = await handleAPI(api, undefined, 'delete')
      message.success(res.message)
    } catch (error: any) {
      message.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Table
        loading={isLoading}
        dataSource={suppliers}
        rowKey={'_id'}
        columns={columns}
        pagination={{
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            setPageSize(size)
          },
          total,
          onChange: (page, pageSize) => {
            setPage(page)
          },
        }}
        scroll={{
          y: 'calc(100vh - 300px)'
        }}
        bordered
        title={() => (
          <div className='grid grid-rows-1 grid-cols-2'>
            <div>
              <Title level={5}>Bảng nhà cung cấp</Title>
            </div>
            <div className='text-end'>
              <Space>
                <Button
                  type='primary'
                  onClick={() => {
                    setIsVisibleModalAddNew(true)
                  }}>
                  Thêm Mới
                </Button>
                <Button icon={<FiFilter />}>Lọc</Button>
                <Button onClick={() => setIsVisibleModalExport(true)}>Xuất File Excel</Button>
              </Space>
            </div>
          </div>
        )}
      />

      <ToogleSupplier
        visible={isVisibleModalAddNew}
        onClose={() => {
          supplierSelected && getSuppliers()
          setSupplierSelected(undefined)
          setIsVisibleModalAddNew(false)
        }}
        onAddNew={val => setSuppliers([...suppliers, val])}
        supplier={supplierSelected} />

      <ModalExportExcel 
        visible={isVisibleModalExport}  
        onClose={() => setIsVisibleModalExport(false)}
        api='supplier'
        name='supplier'
      />

    </div>
  )
}

export default Suppliers
