export interface DishModel {
    title: string
    slug: string
    description: string
    content: string
    categories: string[]
    price: number,
    status: string,
    images: string[]
    createdAt: string
    updatedAt: string
    isDeleted: boolean
    _id: string
    __v: number
}

export interface SelectModel {
  label: string
  value: string
}