import React, { useEffect, useState } from 'react'
import { ReservationsModel } from '../models/ReservationsModel'
import { Button, message, Radio, Space, Tooltip } from 'antd'
import { RiUserForbidFill } from 'react-icons/ri'
import Table, { ColumnProps } from 'antd/es/table'
import Title from 'antd/es/typography/Title'
import { FiFilter } from 'react-icons/fi'
import handleAPI from '../api/handleAPI'
import { formatDate } from '../utils/formatDate'
import ModalReservation from '../modals/ModalReservation'
import { Link } from 'react-router-dom'

const ReservationManagement = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [isVisibleModalReservation, setIsVisibleModalReservation] = useState(false);
  const [status, setStatus] = useState('Chờ xử lý')
  const [reservations, setReservations] = useState<ReservationsModel[]>([]);
  const [reservationSelected, setReservationSelected] = useState<ReservationsModel>();

  const columns: ColumnProps<ReservationsModel>[] = [
    {
      key: 'table',
      dataIndex: 'table_id',
      title: 'Mã bàn',
      width: 280
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Tên khách hàng',
      width: 250
    },
    {
      key: 'email',
      dataIndex: 'email',
      title: 'Email',
      width: 250
    },
    {
      key: 'phone',
      dataIndex: 'phone',
      title: 'Số điện thoại',
      width: 150,
      render: (phone) => `0${phone}`
    },
    {
      key: 'reservation_time',
      dataIndex: 'reservation_time',
      title: 'Thời gian',
      width: 150
    },
    {
      key: 'reservation_date',
      dataIndex: 'reservation_date',
      title: 'Ngày đặt',
      width: 150,
      render: (date: string) => formatDate(date).split(' ')[1]
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
      width: 250,
      render: (reservation: ReservationsModel) => <>
        <Space>
          <Tooltip title='Chọn bàn ăn cho khách hàng để xác nhận đơn' style={{ width: '150px' }}>
            <Button
              type='primary'
              onClick={() => {
                setReservationSelected(reservation)
                setIsVisibleModalReservation(true)
              }}
            >
              Chọn bàn
            </Button>
          </Tooltip>
          <Button onClick={() => handeleReject(reservation._id)}>Từ chối</Button>
        </Space>
      </>
    }
  ]

  useEffect(() => {
    if (status) {
      getReservationsStatus(status)
    }
  }, [status]);

  const getReservationsStatus = async (status: string) => {
    setIsLoading(true)
    try {
      const api = `/reservations/get-reservations-status?status=${status}`
      const res = await handleAPI(api)
      setReservations(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handeleReject = async (id: string) => {
    try {
      setIsLoading(true)
      const api = `/reservations/update-reservations?id=${id}`
      const res: any = await handleAPI(api, { status: 'Từ chối' }, 'put')
      res.data && message.success('Bạn đã từ chối 1 đơn đặt bàn')
      getReservationsStatus(status)
    } catch (error: any) {
      console.log(error)
      message.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Table
        loading={isLoading}
        dataSource={reservations}
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
                  <Link to={'/table-management'}>
                    <Button
                      type='primary'>
                      Kiểm tra bàn
                    </Button>
                  </Link>
                  <Button icon={<FiFilter />}>Lọc</Button>
                </Space>
              </div>
            </div>
            <div className='w-1/3 mt-4'>
              <Radio.Group
                block
                options={[
                  { label: 'Chờ xử lý', value: 'Chờ xử lý' },
                  { label: 'Đã xác nhận', value: 'Đã xác nhận' },
                  { label: 'Từ chối', value: 'Từ chối' },
                ]}
                defaultValue="Chờ xử lý"
                optionType="button"
                buttonStyle="solid"
                onChange={(val) => setStatus(val.target.value)}
              />
            </div>
          </div>
        )}
      />
      <ModalReservation
        visible={isVisibleModalReservation}
        onClose={() => {
          setIsVisibleModalReservation(false)
          setReservationSelected(undefined)
        }}
        onAddNew={() => getReservationsStatus(status)}
        reservation={reservationSelected}
      />
    </div>
  )
}

export default ReservationManagement
