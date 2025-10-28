import { Outlet } from "react-router";
import { useAppSelector } from "../../hooks/reduxHooks";
import ModalParaAgregarCita from "../ui/Modal/ModalParaAgregarCita";
import RowOptionsModal from "../ui/Modal/RowOptionsModal";
import Header from "./Header";

const BaseLayout = () => {
  const showRowOptionsModal = useAppSelector(
    (state) => state.modal.rowOptionsModal.show,
  );
  const showNewAppointment = useAppSelector(
    (state) => state.modal.newAppointment.show,
  );

  return (
    <>
      <Header />
      <Outlet />
      {showRowOptionsModal && <RowOptionsModal />}
      {showNewAppointment && <ModalParaAgregarCita />}
    </>
  );
};

export default BaseLayout;
