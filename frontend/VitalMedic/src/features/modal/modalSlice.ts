import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface DataRowOptionModal {
  especialidad: string;
  fechaHora: string;
  tipoDeCita: string;
  motivoAsunto: string;
  estado: string;
}

interface ModalState {
  rowOptionsModal: {
    show: boolean;
    data: DataRowOptionModal;
  };
  newAppointment: {
    show: boolean;
  };
}
const initialState: ModalState = {
  rowOptionsModal: {
    show: false,
    data: {
      especialidad: "Sin especificar",
      fechaHora: "01/01/1999 01:01",
      motivoAsunto: "Sin especificar",
      estado: "Sin especificar",
      tipoDeCita: "Sin especificar",
    },
  },
  newAppointment: {
    show: false,
  },
};
export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggleRowOptionsModal: (state) => {
      state.rowOptionsModal.show = !state.rowOptionsModal.show;
    },
    updateDataRowOptionsModal: (
      state,
      action: PayloadAction<DataRowOptionModal>,
    ) => {
      state.rowOptionsModal.data = action.payload;
    },
    toggleNewAppointment: (state) => {
      state.newAppointment.show = !state.newAppointment.show;
    },
  },
});

export const {
  toggleRowOptionsModal,
  updateDataRowOptionsModal,
  toggleNewAppointment,
} = modalSlice.actions;
export default modalSlice.reducer;
