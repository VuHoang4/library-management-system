import MainLayout from "./MainLayout";
import { Outlet } from "react-router-dom";

function ReaderLayout() {
  return (
    <MainLayout role="reader">
      <Outlet />
    </MainLayout>
  );
}

export default ReaderLayout;