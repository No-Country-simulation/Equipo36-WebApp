import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LogIn from "./pages/auth/LogIn";
import SignIn from "./pages/auth/SignIn";

const router = createBrowserRouter([
  {
    path: "/",
    Component: SignIn,
  },
  {
    path: "/login",
    Component: LogIn,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
