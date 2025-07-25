import { configureStore } from '@reduxjs/toolkit';
import user from './userSlice';
import cart from './cartSlice';
const store = configureStore({
    reducer: {
        cart,
        user
    }
});
export default store;