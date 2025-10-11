import { cn } from "clsx-for-tailwind";
import { Outlet } from "react-router";
import PrivateRoute from "../ui/PrivateRoute";
import SidebarLayout from "./SidebarLayout";

const patientTab = [
  {
    title: "Inicio",
    path: "/dashboard/patient/",
  },
  {
    title: "Mis Citas",
    path: "/dashboard/patient/mis-citas",
  },
  {
    title: "Médicos",
    path: "/dashboard/patient/medicos",
  },
  {
    title: "Historial",
    path: "/dashboard/patient/historial",
  },
];

const DashboardLayout = () => {
  return (
    <div className={cn("pt-2.5 px-10", "flex", "h-[calc(100svh_-_64px)]")}>
      <SidebarLayout tabs={patientTab} />
      <main className={cn("w-[calc(100%_-_240px)] h-full px-8")}>
        <PrivateRoute>
          <Outlet />
        </PrivateRoute>
      </main>
    </div>
  );
};

export default DashboardLayout;
