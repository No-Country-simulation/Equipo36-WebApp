import { Provider } from "react-redux";
import { createBrowserRouter, type RouteObject } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Outlet } from "react-router";
import BaseLayout from "./components/layout/BaseLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import OnboardingGuard from "./components/auth/OnboardingGuard";
import CargandoPagina from "./components/ui/CargandoPagina";
import StartKeycloak from "./components/ui/StartKeycloak";
import AgendarCita from "./pages/patient/AgendarCita";
import Appointment from "./pages/patient/Appointment";
import Configuracion from "./pages/patient/Configuracion";
import HistorialMedico from "./pages/patient/HistorialMedico";
import Inicio from "./pages/patient/Inicio";
import SalaEspera from "./pages/patient/SalaEspera";
import CompleteOnboarding from "./pages/onboarding/CompleteOnboarding";
import { store } from "./store";

const patientRouter: RouteObject[] = [
  { index: true, Component: Inicio },
  { path: "mis-citas", Component: Appointment },
  { path: "medicos", element: <p>médico</p> },
  { path: "historial", Component: HistorialMedico },
  { path: "configuracion", Component: Configuracion },
  { path: "agendar-cita", Component: AgendarCita },
  { path: "sala-espera/:appointmentId", Component: SalaEspera },
];

const router = createBrowserRouter([
  {
    path: "/",
    Component: StartKeycloak,
    children: [
      {
        index: true,
        Component: CargandoPagina,
      },
      {
        path: "onboarding",
        Component: CompleteOnboarding,
      },
      {
        Component: BaseLayout,
        children: [
          {
            path: "dashboard",
            Component: DashboardLayout,
            children: [
              { 
                path: "patient", 
                element: (
                  <OnboardingGuard>
                    <Outlet />
                  </OnboardingGuard>
                ),
                children: patientRouter
              },
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
