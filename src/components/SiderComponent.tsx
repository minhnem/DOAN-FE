import { Layout, Menu, MenuProps, Typography } from 'antd'
import React from 'react'
import logo from '../assets/image/logo-doan.png'
import { Link } from 'react-router-dom'
import { TiHomeOutline } from "react-icons/ti";
import { MdOutlineInventory2 } from "react-icons/md";
import { BsBarChart } from "react-icons/bs";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdOutlineEventNote } from "react-icons/md";
import { BsBarChartSteps } from "react-icons/bs";
import { BsBoxSeam } from "react-icons/bs";
import { appInfo } from '../constants/appInfos';
import { colors } from '../constants/colors';
import { RiDiscountPercentLine } from "react-icons/ri";

type MenuItem = Required<MenuProps>['items'][number]
const { Sider } = Layout
const { Text } = Typography

const SiderComponent = () => {
    const items: MenuItem[] = [
        {
            key: 'dashboard',
            label: <Link to={'/dashboard'}>Trang chủ</Link>,
            icon: <TiHomeOutline size={18} />
        },
        {
            key: 'menu',
            label: <Link to={'/menu'}>Quản lý Menu</Link>,
            icon: <MdOutlineInventory2 size={18} />,
            children: [
                {
                    key: 'addNew',
                    label: <Link to={'/menu'}>Danh sách Menu</Link>
                },
                {
                    key: 'inventory',
                    label: <Link to={'/menu/add-new-dish'}>Thêm món ăn</Link>
                }
            ]
        },
        {
            key: 'category',
            label: <Link to={'/category'}>Danh mục</Link>,
            icon: <BsBarChartSteps size={18}/>
        },
        {
            key: 'suppliers',
            label: <Link to={'/supplier'}>Nhà cung cấp</Link>,
            icon: <FaRegCircleUser size={18} />
        },
        {
            key: 'reports',
            label: <Link to={'/reports'}>Báo cáo</Link>,
            icon: <BsBarChart size={18} />
        },
        {
            key: 'oders',
            label: <Link to={'/oders'}>Đơn hàng</Link>,
            icon: <BsBoxSeam size={18} />
        },
        {
            key: 'manage Store',
            label: <Link to={'/manage-store'}>Quản lý cửa hàng</Link>,
            icon: <MdOutlineEventNote size={18} />
        },
        {
            key: 'promotion',
            label: <Link to={'/promotion'}>Quản lý giảm giá/khuyến mại</Link>,
            icon: <RiDiscountPercentLine size={18} />
        }
    ]
    return (
        <Sider theme='light' width={300} className='h-[100vh] p-2'>
            <div className='flex items-center pl-5'>
                <img src={logo} alt="Logo" width={28} />
                <Text style={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '1.5rem', color: colors.primary }}>{appInfo.title}</Text>
            </div>
            <Menu mode='inline' items={items} theme='light' />
        </Sider>
    )
}

export default SiderComponent
