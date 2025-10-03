import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LogIn from "./pages/LogIn";
import SignIn from "./pages/SignIn";

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
