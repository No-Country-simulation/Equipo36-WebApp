import { Provider } from "react-redux";
import { createBrowserRouter, type RouteObject } from "react-router";
import { RouterProvider } from "react-router/dom";
import BaseLayout from "./components/layout/BaseLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import StartKeycloak from "./components/ui/StartKeycloak";
import Appointment from "./pages/patient/Appointment";
import Inicio from "./pages/patient/Inicio";
import { store } from "./store";

const patientRouter: RouteObject[] = [
  { index: true, Component: Inicio },
  { path: "mis-citas", Component: Appointment },
  { path: "medicos", element: <p>médico</p> },
  { path: "historial", element: <p>historial</p> },
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
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
