import { Button, Typography } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { colors } from '../constants/colors'
import { DishModel } from '../models/DishModel'
import { VND } from '../utils/handleCurrency'

interface Props {
    menuItem?: DishModel
    onClick: (val: DishModel) => void
}

const MenuItemComponent = (props: Props) => {
    const { menuItem, onClick } = props
    const [elementWidth, setElementWidth] = useState()
    const ref = useRef<any>(null)

    useEffect(() => {
        const width = ref.current.offsetWidth
        setElementWidth(width)
    }, [elementWidth]);

    
    return (
        <div className='p-2 border-[1px] border-solid border-[#ccc] rounded-xl'>
            <div ref={ref}>
                <img
                    src={menuItem?.images[0]}
                    alt='image'
                    style={{
                        width: '100%',
                        height: elementWidth && elementWidth * 0.7,
                        border: '1px solid #ccc',
                        objectFit: 'cover',
                        borderRadius: '12px'
                    }} />
            </div>
            <div>
                <Typography.Paragraph
                    ellipsis={{ rows: 1, expandable: false }}
                    style={{
                        margin: '5px 0 0 0',
                        fontSize: '1.5rem',
                        fontWeight: '700'
                    }}
                >
                    {menuItem?.title}
                </Typography.Paragraph>
                <div className='h-[48px]'>
                    <Typography.Paragraph ellipsis={{ rows: 2, expandable: false }}>{menuItem?.description}</Typography.Paragraph>
                </div>
                <div className='flex justify-between items-center'>
                    <p>5 sao</p>
                    <Typography.Title level={5} style={{ margin: '0', color: colors.primary }}>{menuItem?.price && VND.format(menuItem?.price)}</Typography.Title>
                </div>
                <Button className='w-full mt-3' type='primary' size='large' disabled={menuItem?.dishId ? true : false} onClick={() => menuItem && onClick(menuItem)}>Đặt món</Button>
            </div>
        </div>
    )
}

export default MenuItemComponent
