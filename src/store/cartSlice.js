import { createSlice } from "@reduxjs/toolkit";
import Product from "../components/products/item/product";
const initialState = {
    cart: []
    
};

//const initialData = localStorage.getItem("cart") !== null ? JSON.parse(localStorage.getItem("cart")) : setProduct;
//const initialState = initialData;
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingProduct = state.cart.find((product) => product.id === action.payload.id);
            if (existingProduct) {
                return {
                    ...state,
                    cart: state.cart.map((product) =>
                        product.id === action.payload.id ? { ...product, qty: product.qty + 1 } : product
                    ),
                };
            } else {
                return {
                    ...state,
                    cart: [...state.cart, { ...action.payload, qty: 1 }],
                };

            }

        },
        addToCartQty: (state, action) => {
            const existingProduct = state.cart.find((product) => product.id === action.payload.id);
            if (existingProduct) {
                return {
                    ...state,
                    cart: state.cart.map((product) =>
                        product.id === action.payload.id ? { ...product, qty: action.payload.quantity } : product
                    ),
                };
            } else {
                return {
                    ...state,
                    cart: [...state.cart, { ...action.payload, qty: action.payload.quantity }],
                };

            }

        },

        removeItem: (state, action) => {

            return {
                ...state,
                cart: state.cart.filter((product) => product.id !== action.payload)

            };
        },
        updateQuantity: (state, action) => {
            return {
                ...state,
                cart: state.cart.map((product) =>
                    product.id === action.payload.id ? { ...product, qty: action.payload.qty } : product
                ),
            };
        },
        emptyCart: (state, action) => {
            return initialState;
        }
    }

    });
export const { addToCart, removeItem, updateQuantity, addToCartQty, emptyCart } = cartSlice.actions;
export default cartSlice.reducer;