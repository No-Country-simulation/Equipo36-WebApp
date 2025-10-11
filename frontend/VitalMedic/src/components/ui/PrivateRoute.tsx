import { type ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

interface Props {
  children: ReactNode;
}
const PrivateRoute = ({ children }: Props) => {
  const { initialized, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated || !initialized) {
      navigate("/");
    }
  }, [navigate, isAuthenticated, initialized]);

  return <>{children}</>;
};

export default PrivateRoute;
