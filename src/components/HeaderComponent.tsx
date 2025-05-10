import { Avatar, Badge, Button, Divider, Dropdown, Input, Menu, MenuProps, Space, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { FiSearch } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { MdNotificationsNone } from "react-icons/md"
import { colors } from '../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authSelector, removeAuth } from '../redux/reducers/authReducer';
import socket from '../utils/socket';
import { ReservationsModel } from '../models/ReservationsModel';
import handleAPI from '../api/handleAPI';
import { AiFillNotification } from 'react-icons/ai';

const HeaderComponent = () => {

    const [reservations, setReservations] = useState<ReservationsModel[]>([]);

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(authSelector)
    const items: MenuProps['items'] = [
        {
            key: 'logout',
            label: 'Đăng xuất',
            onClick: () => {
                dispatch(removeAuth({}))
                navigate('/')
            }
        }
    ]

    const menu = (
        <Menu>
          {reservations.length > 0 ? (
              <Menu.Item onClick={() => navigate('/reservation-management')}>
                <div className='flex items-center gap-3'>
                    <AiFillNotification color='red' size={20} />
                    <div>
                        <h5>Bạn có đơn đặt bàn đang chờ xử lý</h5> 
                        <span>số lượng: {reservations.length}</span>
                    </div>
                </div>
                <Divider className='my-3'/>
              </Menu.Item>
          ) : (
            <Menu.Item disabled>Không có thông báo nào !!</Menu.Item>
          )}
        </Menu>
      );

    useEffect(() => {
        getReservations()

        socket.on('new-reservation', (newItem) => {
            if(newItem) {
                setReservations((prev) => [newItem, ...prev]);
            } else {
                getReservations()
            }
        })

        return () => {
            socket.off('new-reservation')
        }
    }, [])

    const getReservations = async () => {
        try {
        const api = `/reservations/get-reservations-status?status=${'Chờ xử lý'}`
        const res = await handleAPI(api)
        setReservations(res.data)
        } catch (error) {
        console.log(error)
        }
    }

    return (
        <div className='p-5 grid grid-cols-2 bg-white'>
            <div >
                <Input placeholder='Search product, supplier, order'
                    prefix={<FiSearch />}
                    size='large'
                    style={{
                        borderRadius: 100,
                        width: '70%'
                    }} />
            </div>
            <div className='text-end'>
                <Space>
                    <Dropdown overlay={menu} trigger={['hover']} placement="bottomLeft">
                        <Badge count={reservations.length} showZero>
                            <Button type='text' icon={<MdNotificationsNone size={30} color={colors.grey600} />} />
                        </Badge>
                    </Dropdown>
                    <Dropdown menu={{ items }} className='ml-5'>
                        {user.photoUrl ? <Avatar src={user.photoUrl} size={40} /> : <Avatar size={40}> <FaRegUser color='black' /> </Avatar>}
                    </Dropdown>
                </Space>
            </div>
        </div>
    )
}

export default HeaderComponent

