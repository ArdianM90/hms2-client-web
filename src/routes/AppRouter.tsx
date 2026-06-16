import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import CallbackPage from "../pages/CallbackPage.tsx";
import PublicOnlyRoute from "./PublicOnlyRoute.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import Layout from "../layouts/Layout.tsx";
import ManageRoomsPage from "../pages/admin/rooms/ManageRoomsPage.tsx";
import AdminLayout from "../layouts/AdminLayout.tsx";
import ManageHotelPage from "../pages/admin/hotel/ManageHotelPage.tsx";
import LogoutPage from "../pages/LogoutPage.tsx";
import RoomAddPage from "../pages/admin/rooms/RoomAddPage.tsx";
import RoomEditPage from "../pages/admin/rooms/RoomEditPage.tsx";
import RoomDetailsPage from "../pages/admin/rooms/RoomDetailsPage.tsx";
import BookReservationPage from "../pages/reservation/BookReservationPage.tsx";
import ConfirmReservationPage from "../pages/reservation/ConfirmReservationPage.tsx";
import ReservationLayout from "../layouts/ReservationLayout.tsx";
import MyReservationsPage from "../pages/reservation/MyReservationsPage.tsx";
import ReservationDetailsPage from "../pages/reservation/ReservationDetailsPage.tsx";
import ManageReservationsPage from "../pages/admin/reservations/ManageReservationsPage.tsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
        <Route path="/callback" element={<CallbackPage />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/logout" element={<LogoutPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="rooms" replace />} />
              <Route path="rooms" element={<ManageRoomsPage />} />
              <Route path="rooms/add" element={<RoomAddPage />} />
              <Route path="rooms/:id" element={<RoomDetailsPage />} />
              <Route path="rooms/:id/edit" element={<RoomEditPage />} />
              <Route path="hotel" element={<ManageHotelPage />} />
              <Route path="reservations" element={<ManageReservationsPage />} />
            </Route>
            <Route path="reservation" element={<ReservationLayout />}>
              <Route index element={<Navigate to="book" replace />} />
              <Route path="book" element={<BookReservationPage />} />
              <Route path="my" element={<MyReservationsPage />} />
              <Route
                path=":reservationId"
                element={<ReservationDetailsPage />}
              />
              <Route path="confirmation" element={<ConfirmReservationPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
