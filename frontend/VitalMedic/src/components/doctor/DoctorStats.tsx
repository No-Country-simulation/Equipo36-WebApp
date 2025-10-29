import React from "react";

interface DoctorStatsProps {
  stats: { label: string; value: string | number }[];
}

const DoctorStats: React.FC<DoctorStatsProps> = ({ stats }) => (
  <div className="doctor-stats">
    {stats.map((stat, idx) => (
      <div key={idx} className="doctor-stat">
        <div className="doctor-stat-value">{stat.value}</div>
        <div className="doctor-stat-label">{stat.label}</div>
      </div>
    ))}
  </div>
);

export default DoctorStats;
