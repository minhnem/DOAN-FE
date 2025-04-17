import { ReservationsModel } from "./ReservationsModel"

export interface TableModel {
    _id: string
    name: string
    slug: string
    status: string
    reservations_id: string
    order_id: string
    createdAt: string
    updatedAt: string
    __v: number
    reservations: ReservationsModel[]
}

export interface TableModelDetail {
    _id: string
    name: string
    slug: string
    status: string
    reservations_id: string
    order_id: string
    createdAt: string
    updatedAt: string
    __v: number
    reservations: ReservationsModel
}

export interface TableOptions {
    value: string
    label: string
}