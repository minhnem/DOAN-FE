import { Button, Typography } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { colors } from '../constants/colors'
import { DishModel } from '../models/DishModel'

interface Props {
    menuItem?: DishModel
}

const MenuItemComponent = (props: Props) => {
    const [elementWidth, setElementWidth] = useState()
    const ref = useRef<any>(null)

    useEffect(() => {
        const width = ref.current.offsetWidth
        console.log(width)
        setElementWidth(width)
    }, [elementWidth]);
    return (
        <div className='p-2 border-[1px] border-solid border-[#ccc] rounded-xl'>
            <div ref={ref}>
                <img
                    src='https://res.cloudinary.com/dncscl67q/image/upload/v1733130615/cld-sample-4.jpg'
                    alt='image'
                    style={{
                        width: '100%',
                        height: elementWidth && elementWidth * 0.6,
                        border: '1px solid #ccc',
                        borderRadius: '12px'
                    }} />
            </div>
            <div>
                <Typography.Title level={4} style={{ margin: '4px 0 0 0' }}>Món 1</Typography.Title>
                <Typography.Paragraph ellipsis={{ rows: 2, expandable: false }}>Món ăn này được làm từ rất nhiều nguyên liệu trong của hàng của chúng tôi cùng thử nhé</Typography.Paragraph>
                <div className='flex justify-between items-center'>
                    <p>5 sao</p>
                    <Typography.Title level={5} style={{ margin: '0', color: colors.primary }}>50.000đ</Typography.Title>
                </div>
                <Button className='w-full mt-3' type='primary' size='large'>Đặt món</Button>
            </div>
        </div>
    )
}

export default MenuItemComponent
