import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./reducers/authReducer";
import { orderReducer } from "./reducers/orderReducer";

const store = configureStore({
    reducer: {
        authReducer,
        orderReducer
    }
})

export default store