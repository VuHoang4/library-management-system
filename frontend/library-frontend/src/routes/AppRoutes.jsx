import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// 1. IMPORT BỘ KHUNG (Layout) & BẢO VỆ (Guard)
// Layouts nên import tĩnh vì trang nào cũng cần dùng khung
import UserLayout from "../layouts/ReaderLayout";
import AdminLayout from "../layouts/AdminLayout";
import LibrarianLayout from "../layouts/LibrarianLayout";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute"; // Component mới tạo

import { Loading } from "../components/common";

// 2. LAZY LOAD CÁC TRANG (PAGES)
// Trình duyệt chỉ tải các file này khi user thực sự truy cập vào đường dẫn
const UserDashboard = lazy(() => import("../features/dashboard/pages/reader/UserDashboard"));
const BookListPage = lazy(() => import("../features/books/pages/reader/BookListPage"));
const BookDetailPage = lazy(() => import("../features/books/pages/reader/BookDetailPage"));
const MyBooksPage = lazy(() => import("../features/borrow/pages/reader/MyBooksPage"));
const PaymentPage = lazy(() => import("../features/payment/pages/reader/PaymentPage"));
const PaymentResult = lazy(() => import("../features/payment/pages/reader/PaymentResult"));
const UserProfilePage = lazy(() => import("../features/users/pages/UserProfilePage"));

// Cụm import của Thủ thư
const LibrarianDashboard = lazy(() => import("../features/dashboard/pages/librarian/LibrarianDashboard"));
const ManageBooksPage = lazy(() => import("../features/books/pages/librarian/ManageBooksPage"));
const ManageCirculationPage = lazy(() => import("../features/borrow/pages/librarian/ManageCirculationPage"));
const PosCirculationPage = lazy(() => import("../features/borrow/pages/librarian/PosCirculationPage"));
const ManageUsersPage = lazy(() => import("../features/users/pages/librarian/ManageUsersPage"));
const ManagePaymentsPage = lazy(() => import("../features/payment/pages/librarian/ManagePaymentsPage"));
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage"));

// Trang lỗi 404
const NotFoundPage = lazy(() => import("../features/errors/NotFoundPage"));

function AppRoutes() {
  return (
    // Suspense là bắt buộc khi dùng lazy loading. Nó sẽ hiện fallback lúc đang tải code.
    <Suspense 
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-slate-50">
          <Loading text="Đang tải trang..." />
        </div>
      }
    >
      <Routes>

        {/* =======================
            AUTH (Khách / Chưa đăng nhập) 
        ======================== */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>


        {/* =======================
            THẾ GIỚI CỦA ĐỘC GIẢ (READER) 
        ======================== */}
        <Route
          element={
            <PrivateRoute roles={["READER"]}>
              <UserLayout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<UserDashboard />} />
          <Route path="/books" element={<BookListPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/my-books" element={<MyBooksPage />} />
          <Route path="/payments" element={<PaymentPage />} />
          <Route path="/payment-result" element={<PaymentResult />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>


        {/* =======================
            THẾ GIỚI CỦA ADMIN 
        ======================== */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={["ADMIN"]}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="/admin" element={<div>Admin Dashboard (Đang phát triển)</div>} />
        </Route>


        {/* =======================
            THẾ GIỚI CỦA THỦ THƯ (LIBRARIAN) 
        ======================== */}
        <Route
          path="/librarian"
          element={
            <PrivateRoute roles={["LIBRARIAN"]}>
              <LibrarianLayout />
            </PrivateRoute>
          }
        >
         {/* Default route khi vào /librarian sẽ load Dashboard */}
          <Route index element={<LibrarianDashboard />} />
          <Route path="pos" element={<PosCirculationPage />} />
          <Route path="books" element={<ManageBooksPage />} />
          <Route path="borrows" element={<ManageCirculationPage />} />
          <Route path="users" element={<ManageUsersPage />} />
          <Route path="payments" element={<ManagePaymentsPage />} />
        </Route>


        {/* =======================
            404 NOT FOUND (Bắt lỗi gõ sai link) 
        ======================== */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </Suspense>
  );
}

export default AppRoutes;