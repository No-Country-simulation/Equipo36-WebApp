import React from "react";

interface Appointment {
  name: string;
  time: string;
  type: string;
  status: "CONFIRMADO" | "PENDIENTE";
  initials: string;
}

interface DoctorAppointmentsProps {
  appointments: Appointment[];
}

const DoctorAppointments: React.FC<DoctorAppointmentsProps> = ({ appointments }) => (
  <div className="doctor-appointments">
    <h3>Citas de Hoy</h3>
    {appointments.map((a, idx) => (
      <div key={idx} className={`doctor-appointment ${a.status.toLowerCase()}`}>
        <div className="doctor-appointment-initials">{a.initials}</div>
        <div>
          <div className="doctor-appointment-name">{a.name}</div>
          <div className="doctor-appointment-time">{a.time} - {a.type}</div>
        </div>
        <div className={`doctor-appointment-status ${a.status.toLowerCase()}`}>{a.status}</div>
      </div>
    ))}
  </div>
);

export default DoctorAppointments;
