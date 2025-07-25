import { createSlice } from "@reduxjs/toolkit";

const defaultUser = {
    _id: '',
    email: '',
    username: '',
    phone: '',
    address: '',
    auth: false,
    role: '',
    province: '',
    city: '',
    photo: ''
};

const savedUser = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth"))
    : defaultUser;

const userSlice = createSlice({
    name: 'user',
    initialState: savedUser,
    reducers: {
        setUser: (state, action) => {
            const newUser = { ...defaultUser, ...action.payload };

            // Save to localStorage
            localStorage.setItem("auth", JSON.stringify(newUser));

            // Replace the entire state (safe for Immer)
            return newUser;
        },
        resetUser: () => {
            localStorage.removeItem("auth");
            return { ...defaultUser };
        }
    }
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
