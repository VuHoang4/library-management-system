import MainLayout from "./MainLayout";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <MainLayout role="admin">
      <Outlet />
    </MainLayout>
  );
}

export default AdminLayout;