import React from "react";

interface DoctorNextSlotsProps {
  slots: string[];
  selectedSlot: string;
  onSelect: (slot: string) => void;
}

const DoctorNextSlots: React.FC<DoctorNextSlotsProps> = ({ slots, selectedSlot, onSelect }) => (
  <div className="doctor-next-slots">
    <h3>Próximos Disponibles</h3>
    <div className="doctor-slots-list">
      {slots.map((slot) => (
        <button
          key={slot}
          className={`doctor-slot-btn${selectedSlot === slot ? " selected" : ""}`}
          onClick={() => onSelect(slot)}
        >
          {slot}
        </button>
      ))}
    </div>
  </div>
);

export default DoctorNextSlots;
