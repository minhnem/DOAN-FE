export interface Bill {
    tableId: string
    tableName: string 
    discount?: number
    dishItem: DishItem[]
}

export interface DishItem {
    title: string
    count: number
    price: number
}
