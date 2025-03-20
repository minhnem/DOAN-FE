import React, { useEffect, useState } from 'react'
import { CategoryModel } from '../models/CategoryModel'
import { message, Space, Tag } from 'antd'
import { listColors } from '../constants/colors'
import handleAPI from '../api/handleAPI'

interface Props {
    id: string,
    options: 'menu' | 'materials'
}

const CategoryComponent = (props: Props) => {
    const [category, setCategory] = useState<CategoryModel>()

    useEffect(() => {
        getCategory()
    },[])

    const getCategory = async () => {
        const {id, options} = props
        try {
            const api = options === 'menu' ? `/dish/category/detail?id=${id}` : `/materials/category/detail?id=${id}`
            const res = await handleAPI(api)
            res.data && setCategory(res.data)
        } catch (error: any) {
            message.error(error.message)
            console.log(error)
        }
    }

    return (
        <Space>
            <Tag color={listColors[Math.floor(Math.random() * listColors.length)]}>
                {category?.title}
            </Tag>
        </Space>
    )
}

export default CategoryComponent
