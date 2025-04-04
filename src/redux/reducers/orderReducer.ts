import { createSlice } from "@reduxjs/toolkit";
import { DishModel } from "../../models/DishModel";

const initState: DishModel[] = []

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        data: initState
    },
    reducers: {
        addDish: (state, action) => {
            const dishes: DishModel[] = [...state.data]
            const item = action.payload
            const index = dishes.findIndex((element) => element.dishId ? item.dishId ? element.dishId === item.dishId : element.dishId === item._id : element._id === item._id)
            if(index !== -1) {
                dishes[index].count += item.count
            } else {
                dishes.push(item)
            }
            state.data = dishes
        },
        removeDish: (state, action) => {
            const items: DishModel[] = [...state.data]
            const item = action.payload
            const index = items.findIndex((element) => element._id === item._id)
            if(index !== -1){
                items.splice(index, 1)
            }
            state.data = items
        },
        minusCount: (state, action) => {
            const item = action.payload
            const index = state.data.findIndex((element) => element.dishId ? item.dishId ? element.dishId === item.dishId : element.dishId === item._id : element._id === item._id)
            if(index !== -1 && state.data[index].count > 1) {
                state.data[index].count -= 1
            }
        },
        syncOrder: (state, action) => {
            state.data = action.payload
        }
    }
})

export const orderReducer = orderSlice.reducer
export const {addDish, removeDish, syncOrder, minusCount} = orderSlice.actions
export const orderSelector = (state: any) => state.orderReducer.data