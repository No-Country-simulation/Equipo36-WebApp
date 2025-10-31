import React from "react";

interface DoctorHeaderProps {
  name: string;
  specialty: string;
}

const DoctorHeader: React.FC<DoctorHeaderProps> = ({ name, specialty }) => (
  <div className="doctor-header">
    <div className="doctor-avatar">DG</div>
    <div>
      <div className="doctor-name">{name}</div>
      <div className="doctor-specialty">{specialty}</div>
    </div>
  </div>
);

export default DoctorHeader;
