import { type ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "../../hooks/reduxHooks";

interface Props {
  children: ReactNode;
}
const PrivateRoute = ({ children }: Props) => {
  const initialized = useAppSelector((state) => state.auth.initialized);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated || !initialized) {
      navigate("/");
    }
  }, [navigate, isAuthenticated, initialized]);

  return <>{children}</>;
};

export default PrivateRoute;
