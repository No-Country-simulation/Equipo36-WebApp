import React, { useState, useEffect } from 'react';

interface AdminMetricsProps {
  totalDoctors: number;
  activeCount: number;
  inactiveCount: number;
  uniqueSpecialtyCount: number;
}

const AdminMetrics: React.FC<AdminMetricsProps> = ({
  totalDoctors,
  activeCount,
  inactiveCount,
  uniqueSpecialtyCount,
}) => {
  const [animatedValues, setAnimatedValues] = useState({
    totalDoctors: 0,
    activeCount: 0,
    inactiveCount: 0,
    uniqueSpecialtyCount: 0,
  });

  useEffect(() => {
    const duration = 1000; // 1 second animation
    const steps = 60;
    const increment = duration / steps;

    const animateValue = (start: number, end: number, key: keyof typeof animatedValues) => {
      const step = (end - start) / steps;
      let current = start;
      let stepCount = 0;

      const timer = setInterval(() => {
        current += step;
        stepCount++;

        if (stepCount >= steps) {
          current = end;
          clearInterval(timer);
        }

        setAnimatedValues(prev => ({
          ...prev,
          [key]: Math.round(current)
        }));
      }, increment);
    };

    animateValue(0, totalDoctors, 'totalDoctors');
    animateValue(0, activeCount, 'activeCount');
    animateValue(0, inactiveCount, 'inactiveCount');
    animateValue(0, uniqueSpecialtyCount, 'uniqueSpecialtyCount');
  }, [totalDoctors, activeCount, inactiveCount, uniqueSpecialtyCount]);

  const metrics = [
    {
      label: 'Total Médicos',
      value: animatedValues.totalDoctors,
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      label: 'Activos',
      value: animatedValues.activeCount,
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-500',
      textColor: 'text-green-600',
    },
    {
      label: 'Inactivos',
      value: animatedValues.inactiveCount,
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-500',
      textColor: 'text-red-600',
    },
    {
      label: 'Especialidades',
      value: animatedValues.uniqueSpecialtyCount,
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-500',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`${metric.bgColor} ${metric.borderColor} border rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-700 mb-1">{metric.label}</p>
              <p className={`text-3xl font-bold ${metric.textColor} transition-all duration-500`}>
                {metric.value}
              </p>
            </div>
            <div className={`w-14 h-14 ${metric.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}>
              {metric.icon}
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ease-out ${metric.iconBg}`}
                style={{ width: `${Math.min(100, (metric.value / Math.max(totalDoctors, 1)) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminMetrics;