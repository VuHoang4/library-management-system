import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import UserLayout from "../layouts/ReaderLayout";
import AdminLayout from "../layouts/AdminLayout";
import LibrarianLayout from "../layouts/LibrarianLayout";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute"; 

import { Loading } from "../components/common";

const UserDashboard = lazy(() => import("../features/dashboard/pages/reader/UserDashboard"));
const BookListPage = lazy(() => import("../features/books/pages/reader/BookListPage"));
const BookDetailPage = lazy(() => import("../features/books/pages/reader/BookDetailPage"));
const MyBooksPage = lazy(() => import("../features/borrow/pages/reader/MyBooksPage"));
const PaymentPage = lazy(() => import("../features/payment/pages/reader/PaymentPage"));
const PaymentResult = lazy(() => import("../features/payment/pages/reader/PaymentResult"));
const UserProfilePage = lazy(() => import("../features/users/pages/UserProfilePage"));

const LibrarianDashboard = lazy(() => import("../features/dashboard/pages/librarian/LibrarianDashboard"));
const ManageBooksPage = lazy(() => import("../features/books/pages/librarian/ManageBooksPage"));
const ManageCirculationPage = lazy(() => import("../features/borrow/pages/librarian/ManageCirculationPage"));
const PosCirculationPage = lazy(() => import("../features/borrow/pages/librarian/PosCirculationPage"));
const ManageUsersPage = lazy(() => import("../features/users/pages/librarian/ManageUsersPage"));
const ManagePaymentsPage = lazy(() => import("../features/payment/pages/librarian/ManagePaymentsPage"));
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage"));

const AdminDashboardPage = lazy(() => import("../features/dashboard/pages/admin/AdminDashboardPage"));
const ManageUsersPage_Admin = lazy(() => import("../features/users/pages/admin/ManageUsersPage_Admin"));
const SystemSettingsPage = lazy(() => import("../features/setting/page/admin/SystemSettingsPage"));
const CategoryPage = lazy(() => import("../features/categories/page/admin/CategoryPage"));
const PublisherPage = lazy(() => import("../features/dashboard/pages/admin/PublisherPage"));
const AuthorPage = lazy(() => import("../features/dashboard/pages/admin/AuthorPage"));
const NotificationAdminPage = lazy(() => import("../features/dashboard/pages/admin/NotificationAdminPage"));

const NotFoundPage = lazy(() => import("../features/errors/NotFoundPage"));

function AppRoutes() {
  return (
    <Suspense 
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-slate-50">
          <Loading text="Đang tải trang..." />
        </div>
      }
    >
      <Routes>

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<PrivateRoute roles={["READER"]}><UserLayout /></PrivateRoute>}>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/books" element={<BookListPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/my-books" element={<MyBooksPage />} />
          <Route path="/payments" element={<PaymentPage />} />
          <Route path="/payment-result" element={<PaymentResult />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>

        <Route path="/admin" element={<PrivateRoute roles={["ADMIN"]}><AdminLayout /></PrivateRoute>}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<ManageUsersPage_Admin />} /> 
          <Route path="categories" element={<CategoryPage />} />
          <Route path="publishers" element={<PublisherPage />} />
          <Route path="authors" element={<AuthorPage />} />
          <Route path="notifications" element={<NotificationAdminPage />} />
          <Route path="settings" element={<SystemSettingsPage />} />
          <Route path="profile" element={<UserProfilePage />} />
        </Route>

        <Route path="/librarian" element={<PrivateRoute roles={["LIBRARIAN"]}><LibrarianLayout /></PrivateRoute>}>
          <Route index element={<LibrarianDashboard />} />
          <Route path="pos" element={<PosCirculationPage />} />
          <Route path="books" element={<ManageBooksPage />} />
          <Route path="borrows" element={<ManageCirculationPage />} />
          <Route path="users" element={<ManageUsersPage />} />
          <Route path="payments" element={<ManagePaymentsPage />} />
          <Route path="profile" element={<UserProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </Suspense>
  );
}

export default AppRoutes;