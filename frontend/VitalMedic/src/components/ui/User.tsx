import { cn } from "clsx-for-tailwind";
import { useState } from "react";
import { useNavigate } from "react-router";
import perfil from "../../assets/images/perfil.jpg";
import { useAppSelector } from "../../hooks/reduxHooks";
import SingleButton from "./Buttons/SingleButton";

interface Props {
  firstName?: string;
  lastName?: string;
  email?: string;
  profilePhoto?: string;
}
const User = ({ firstName, lastName, profilePhoto = perfil, email }: Props) => {
  const [showPanel, setShowPanel] = useState(false);

  const navigate = useNavigate();
  const keycloak = useAppSelector((state) => state.auth.keycloak);

  const handleButtonShowPanel = () => {
    setShowPanel(!showPanel);
  };

  const handleButtonLogout = async () => {
    try {
      await keycloak?.logout();
      navigate("/");
    } catch {
      console.error("Algo va mal");
    }
  };

  const componentPanel = (
    <div
      className={cn(
        "absolute top-14 right-0",
        "w-72 min-h-20 px-2.5 py-3.5 z-20",
        "bg-white rounded-sm",
        "inset-shadow-black/40 shadow-sm",
        "flex flex-col items-center gap-4",
      )}
    >
      <p className={cn("text-[#A1A198]")}>{email}</p>

      <img
        className={cn("w-12 h-12", "border border-s-stone-700 rounded-4xl")}
        src={profilePhoto}
        alt="Perfil del usuario"
      />

      <b className={cn("text-xl text-center")}>
        {firstName} {lastName}
      </b>

      <SingleButton variant="primary" onClick={handleButtonLogout}>
        Cerrar cuenta
      </SingleButton>
    </div>
  );

  return (
    <div className={cn("relative")}>
      <button
        className={cn(
          "py-1.5 px-2.5",
          "rounded-2xl",
          "flex items-center gap-2",
          "hover:shadow-2xs hover:inset-shadow-sm",
          "active:scale-95",
        )}
        type="button"
        onClick={handleButtonShowPanel}
      >
        <img
          className={cn("w-8 h-8", "border border-s-stone-700 rounded-4xl")}
          src={profilePhoto}
          alt="Perfil del usuario"
        />
      </button>
      {showPanel && componentPanel}
    </div>
  );
};

export default User;
