import { useLocation, useNavigate } from "react-router";

export const useMobileNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return {
    handleNavigation,
    isActive,
    currentPath: location.pathname,
  };
};