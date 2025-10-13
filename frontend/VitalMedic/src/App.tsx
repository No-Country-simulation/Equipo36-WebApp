import { createBrowserRouter, type RouteObject } from "react-router";
import { RouterProvider } from "react-router/dom";
import BaseLayout from "./components/layout/BaseLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import AuthProvider from "./contexts/AuthProvider";
import Inicio from "./pages/patient/Inicio";
import AgendarCita from "./pages/patient/AgendarCita";
import HistorialMedico from "./pages/patient/HistorialMedico";
import Configuracion from "./pages/patient/Configuracion";
import SalaEspera from "./pages/patient/SalaEspera";

const patientRouter: RouteObject[] = [
  {
    index: true,
    Component: Inicio,
  },
  { path: "mis-citas", element: <p>Mis citas</p> },
  { path: "medicos", element: <p>médico</p> },
  { path: "historial", Component: HistorialMedico },
  { path: "configuracion", Component: Configuracion },
  { path: "agendar-cita", Component: AgendarCita },
  { path: "sala-espera/:appointmentId", Component: SalaEspera },
];

const router = createBrowserRouter([
  {
    path: "/",
    Component: AuthProvider,
    children: [
      { index: true, element: <p>Debe iniciar sesión</p> },
      {
        Component: BaseLayout,
        children: [
          {
            path: "dashboard",
            Component: DashboardLayout,
            children: [{ path: "patient", children: patientRouter }],
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
