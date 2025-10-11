import { Outlet } from "react-router";
import Header from "./Header";

const BaseLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default BaseLayout;
