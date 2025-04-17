import { Layout, Menu, MenuProps, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import logo from '../assets/image/logo-doan.png'
import { Link, useLocation } from 'react-router-dom'
import { TiHomeOutline } from "react-icons/ti";
import { MdOutlineInventory2, MdOutlineRestaurantMenu } from "react-icons/md";
import { BsBarChart } from "react-icons/bs";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdOutlineEventNote } from "react-icons/md";
import { BsBarChartSteps } from "react-icons/bs";
import { BsBoxSeam } from "react-icons/bs";
import { appInfo } from '../constants/appInfos';
import { colors } from '../constants/colors';
import { RiDiscountPercentLine } from "react-icons/ri";
import { MdOutlineTableBar } from "react-icons/md";
import { IoFastFoodOutline } from "react-icons/io5";

type MenuItem = Required<MenuProps>['items'][number]
const { Sider } = Layout
const { Text } = Typography

const SiderComponent = () => {
    const location = useLocation();
    const [selectedKeys, setSelectedKeys] = useState(['']);
    const [openKeys, setOpenKeys] = useState(['']);

    useEffect(() => {
        window.scrollTo(0, 0);
        const pathname = location.pathname;
    
        if (pathname === '/' || pathname === '/dashboard') {
            setSelectedKeys(['dashboard']);
            setOpenKeys([]);
        } else if (pathname === '/menu') {
            setSelectedKeys(['management menu']);
            setOpenKeys(['menu']);
        } else if (pathname === '/menu/add-new-dish') {
            setSelectedKeys(['add new dish']);
            setOpenKeys(['menu']);
        } else if (pathname === '/category') {
            setSelectedKeys(['category']);
            setOpenKeys([]);
        } else if (pathname === '/supplier') {
            setSelectedKeys(['suppliers']);
            setOpenKeys([]);
        } else if (pathname === '/reports') {
            setSelectedKeys(['reports']);
            setOpenKeys([]);
        } else if (pathname === '/oders') {
            setSelectedKeys(['oders']);
            setOpenKeys([]);
        } else if (pathname === '/manage-store') {
            setSelectedKeys(['manage Store']);
            setOpenKeys([]);
        } else if (pathname === '/promotion') {
            setSelectedKeys(['promotion']);
            setOpenKeys([]);
        } else if (pathname === '/inventory') {
            setSelectedKeys(['inventory management']);
            setOpenKeys(['inventory']);
        } else if (pathname === '/inventory/add-new-materials') {
            setSelectedKeys(['add new menterials']);
            setOpenKeys(['inventory']);
        } else if (pathname === '/inventory/category-materials') {
            setSelectedKeys(['category menterials']);
            setOpenKeys(['inventory']);
        } else if (pathname === '/order') {
            setSelectedKeys(['table order']);
            setOpenKeys(['oder']);
        } else if (pathname === '/table-management') {
            setSelectedKeys(['table']);
            setOpenKeys([]);
        }
    }, [location]);
    

    const items: MenuItem[] = [
        {
            key: 'dashboard',
            label: <Link to={'/dashboard'}>Trang chủ</Link>,
            icon: <TiHomeOutline size={18} />
        },
        {
            key: 'menu',
            label: <Link to={'/menu'}>Quản lý Menu</Link>,
            icon: <MdOutlineRestaurantMenu size={18}/>,
            children: [
                {
                    key: 'management menu',
                    label: <Link to={'/menu'}>Danh sách Menu</Link>
                },
                {
                    key: 'add new dish',
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
        },
        {
            key: 'inventory',
            label: <Link to={'/inventory'}>Quản lý kho</Link>,
            icon: <MdOutlineInventory2 size={18} />,
            children: [
                {
                    key: 'inventory management',
                    label: <Link to={'/inventory'}>Danh sách nguyên liệu</Link>
                },
                {
                    key: 'add new menterials',
                    label: <Link to={'/inventory/add-new-materials'}>Thêm mới nguyên liệu</Link>
                },
                {
                    key: 'category menterials',
                    label: <Link to={'/inventory/category-materials'}>Danh mục nguyên liệu</Link>
                },
            ]
        },
        {
            key: 'oder', 
            label:  <Link to={'/order'}>Order</Link>,
            icon: <IoFastFoodOutline size={18}/>,
        },
        {
            key: 'table',
            label: <Link to={'/table-management'}>Quản lý bàn ăn</Link>,
            icon: <MdOutlineTableBar size={18}/>
        }
    ]

    const onOpenChange = (keys: string[]) => {
        setOpenKeys(keys);
    }

    return (
        <Sider theme='light' width={300} className='h-[100vh] p-2'>
            <div className='flex items-center pl-5'>
                <img src={logo} alt="Logo" width={28} />
                <Text style={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '1.5rem', color: colors.primary }}>{appInfo.title}</Text>
            </div>
            <Menu 
                mode='inline' 
                items={items} 
                theme='light' 
                selectedKeys={selectedKeys}
                openKeys={openKeys}
                onOpenChange={onOpenChange}
            />
        </Sider>
    )
}

export default SiderComponent
