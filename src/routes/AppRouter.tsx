import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import CallbackPage from "../pages/CallbackPage.tsx";
import PublicOnlyRoute from "./PublicOnlyRoute.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import Layout from "../layouts/Layout.tsx";
import ManageRoomsPage from "../pages/ManageRoomsPage.tsx";
import AdminLayout from "../layouts/AdminLayout.tsx";
import ManageHotelPage from "../pages/ManageHotelPage.tsx";
import LogoutPage from "../pages/LogoutPage.tsx";
import AddRoomPage from "../pages/RoomFormPage.tsx";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
                <Route path="/callback" element={<CallbackPage />} />
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/logout" element={<LogoutPage />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route path="admin" element={<AdminLayout />}>
                                <Route index element={<Navigate to="rooms" replace />}/>
                                <Route path="rooms" element={<ManageRoomsPage />}/>
                                <Route path="rooms/add" element={<AddRoomPage />}/>
                                <Route path="hotel" element={<ManageHotelPage />}/>
                            </Route>
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}