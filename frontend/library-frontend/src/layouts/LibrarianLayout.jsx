import MainLayout from "./MainLayout";
import { Outlet } from "react-router-dom";

function LibrarianLayout() {
  return (
    <MainLayout role="librarian">
      <Outlet />
    </MainLayout>
  );
}

export default LibrarianLayout;