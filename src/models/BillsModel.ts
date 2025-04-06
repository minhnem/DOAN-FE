export interface BillKetchen {
    tableId: string
    tableName: string 
    reservationId: string
    dishItem: DishItem[]
}

export interface DishItem {
    title: string
    count: number
    price: number
}
