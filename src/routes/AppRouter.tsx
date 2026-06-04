import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import CallbackPage from "../pages/CallbackPage.tsx";
import PublicOnlyRoute from "./PublicOnlyRoute.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import Layout from "../layouts/Layout.tsx";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
                <Route path="/callback" element={<CallbackPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}