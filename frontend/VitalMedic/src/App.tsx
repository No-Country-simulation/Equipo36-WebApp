import { Provider } from "react-redux";
import { createBrowserRouter, type RouteObject } from "react-router";
import { RouterProvider } from "react-router/dom";
import BaseLayout from "./components/layout/BaseLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import StartKeycloak from "./components/ui/StartKeycloak";
import Appointment from "./pages/patient/Appointment";
import Inicio from "./pages/patient/Inicio";
import AgendarCita from "./pages/patient/AgendarCita";
import HistorialMedico from "./pages/patient/HistorialMedico";
import Configuracion from "./pages/patient/Configuracion";
import SalaEspera from "./pages/patient/SalaEspera";
import Onboarding from "./pages/onboarding/Onboarding";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import RoleSelector from "./components/common/RoleSelector";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AccessDenied from "./components/auth/AccessDenied";
import { store } from "./store";

const patientRouter: RouteObject[] = [
  { 
    index: true, 
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PATIENT']}>
        <Inicio />
      </ProtectedRoute>
    )
  },
  { 
    path: "mis-citas", 
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PATIENT']}>
        <Appointment />
      </ProtectedRoute>
    )
  },
  { 
    path: "medicos", 
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PATIENT']}>
        <p>médico</p>
      </ProtectedRoute>
    )
  },
  { 
    path: "historial", 
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PATIENT']}>
        <HistorialMedico />
      </ProtectedRoute>
    )
  },
  { 
    path: "configuracion", 
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PATIENT']}>
        <Configuracion />
      </ProtectedRoute>
    )
  },
  { 
    path: "agendar-cita", 
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PATIENT']}>
        <AgendarCita />
      </ProtectedRoute>
    )
  },
  { 
    path: "sala-espera/:appointmentId", 
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PATIENT']}>
        <SalaEspera />
      </ProtectedRoute>
    )
  },
  {
    path: 'access-denied',
    element: <AccessDenied requiredRoles={['ADMIN', 'DOCTOR', 'PATIENT']} />
  }
];

const adminRouter: RouteObject[] = [
  { 
    index: true, 
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AdminDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: 'access-denied',
    element: <AccessDenied requiredRoles={['ADMIN']} />
  }
];

const doctorRouter: RouteObject[] = [
  { 
    index: true, 
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR']}>
        <DoctorDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: 'access-denied',
    element: <AccessDenied requiredRoles={['ADMIN', 'DOCTOR']} />
  }
];

const router = createBrowserRouter([
  {
    path: "/",
    Component: StartKeycloak,
    children: [
      {
        index: true,
        element: <p>Cargando</p>,
      },
      {
        path: "onboarding",
        Component: Onboarding,
      },
      {
        Component: BaseLayout,
        children: [
          {
            path: "dashboard",
            children: [
              { index: true, Component: RoleSelector },
              { 
                Component: DashboardLayout,
                children: [
                  { path: "patient", children: patientRouter },
                  { path: "admin", children: adminRouter },
                  { path: "doctor", children: doctorRouter },
                ],
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
