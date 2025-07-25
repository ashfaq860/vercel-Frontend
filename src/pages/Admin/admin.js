
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';


export default function AdminRoute() {
	const auth = useSelector(state => state.user.auth);
	const role = useSelector(state => state.user.role)

	return auth&&role? <Outlet /> : <Navigate to="/login" />;
}