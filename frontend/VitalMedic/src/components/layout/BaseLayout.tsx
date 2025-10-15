import { Outlet } from "react-router";
import { useAppSelector } from "../../hooks/reduxHooks";
import AddAppointmentModal from "../ui/Modal/AddAppointmentModal";
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
      {showNewAppointment && <AddAppointmentModal />}
    </>
  );
};

export default BaseLayout;
