import { Routes, Route, BrowserRouter } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import "./App.css";
import LoaderWrapper from './components/LoaderWrapper';
import NProgressHandler from './components/common/NProgressHandler';

// Lazy load all your pages
const AddCat = lazy(() => import('./pages/Admin/addCat'));
const AddMorePhotos = lazy(() => import('./pages/Admin/addMorePhotos'));
const AddProduct = lazy(() => import('./pages/Admin/addProduct'));
const AdminRoute = lazy(() => import('./pages/Admin/admin'));
const AllCat = lazy(() => import('./pages/Admin/allCat'));
const AllProducts = lazy(() => import('./pages/Admin/allProducts'));
const AuthUserRoute = lazy(() => import('./pages/Admin/authUser'));
const DashBoard = lazy(() => import('./pages/Admin/dashboard'));
const AccountSetting = lazy(() => import('./pages/Admin/myaccount/accountsetting'));
const ChangePassword = lazy(() => import('./pages/Admin/myaccount/changePassword'));
const MyAccount = lazy(() => import('./pages/Admin/myaccount/myAccount'));
const ProductReviews = lazy(() => import('./pages/Admin/reviews'));
const UpdateCategory = lazy(() => import('./pages/Admin/updateCategory'));
const UpdateProduct = lazy(() => import('./pages/Admin/updateProduct'));
const Login = lazy(() => import('./pages/auth/login'));
const Register = lazy(() => import('./pages/auth/register'));
const CategoryWiseProducts = lazy(() => import('./pages/category'));
const Search = lazy(() => import('./pages/search'));
const Error = lazy(() => import('./pages/error'));
const HomePage = lazy(() => import('./pages/homePage'));
const Single = lazy(() => import('./pages/single'));
const CreatePage = lazy(() => import('./pages/Admin/createPage'));
const AllPages = lazy(() => import('./pages/Admin/AllPage'));
const EditPage = lazy(() => import('./pages/Admin/editPage'));
const Page = lazy(() => import('./pages/page'));
const Cart = lazy(() => import('./pages/cart'));
const CheckOut = lazy(() => import('./pages/checkout'));
const OrderReceived = lazy(() => import('./pages/orderReceived'));
const OrderList = lazy(() => import('./pages/Admin/order'));
const OrderDetails = lazy(() => import('./pages/Admin/orderDetails'));
const AllOrders = lazy(() => import('./pages/Admin/allOrders'));
const ForgotPassword = lazy(() => import('./pages/auth/forgotPass'));
const ResetPassword = lazy(() => import('./pages/auth/resetPassword'));
const VerifyOTP = lazy(() => import('./pages/auth/verifyOtp'));
const Users = lazy(() => import('./pages/Admin/users'));
const UserDetails = lazy(() => import('./pages/Admin/userDetails'));
const GeneralSetting = lazy(() => import('./pages/Admin/generalSetting'));
const SliderUpload = lazy(() => import('./pages/Admin/sliderUploads'));

function App() {
    return (
        <>
            <NProgressHandler />
            <Suspense fallback={<LoaderWrapper />}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/parts/:id" element={<Single />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgotpassword" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/verify" element={<VerifyOTP />} />
                    <Route path="/page/:slug" element={<Page />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkOut" element={<CheckOut />} />
                    <Route path="/Order-Received/:OId" element={<OrderReceived />} />
                    <Route path="*" element={<Error />} />
                    <Route path="/category/:name/:cId" element={<CategoryWiseProducts />} />
                    <Route path="/search/:term/:cId" element={<Search />} />
                    <Route path="/admin" element={<AdminRoute />}>
                        <Route path="dashboard" element={<DashBoard />} />
                        <Route path="add-category" element={<AddCat />} />
                        <Route path="catList" element={<AllCat />} />
                        <Route path="update-category/:id" element={<UpdateCategory />} />
                        <Route path="add-product" element={<AddProduct />} />
                        <Route path="productList" element={<AllProducts />} />
                        <Route path="update-product/:pId" element={<UpdateProduct />} />
                        <Route path="product/addMorePhotes/:pId" element={<AddMorePhotos />} />
                        <Route path="productReviews" element={<ProductReviews />} />
                        <Route path="create-page" element={<CreatePage />} />
                        <Route path="all-pages" element={<AllPages />} />
                        <Route path="page/edit/:pSlug" element={<EditPage />} />
                        <Route path="orders/all" element={<AllOrders />} />
                        <Route path="users" element={<Users />} />
                        <Route path="userDetails/:id" element={<UserDetails />} />
                        <Route path="generalSetting" element={<GeneralSetting />} />
                        <Route path="slider" element={<SliderUpload />} />
                    </Route>
                    <Route path="/admin" element={<AuthUserRoute />}>
                        <Route path="my-account" element={<MyAccount />} />
                        <Route path="account-setting" element={<AccountSetting />} />
                        <Route path="changePassword" element={<ChangePassword />} />
                        <Route path="orders" element={<OrderList />} />
                        <Route path="order/viewDetails/:id" element={<OrderDetails />} />
                    </Route>
                </Routes>
            </Suspense>
        </>
    );
}

export default App;
