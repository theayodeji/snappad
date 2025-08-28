import React from "react";

interface DetailCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}

function DetailCard({ title, value, icon }: DetailCardProps) {
  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex items-center gap-4">
      <div>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="font-semibold text-black dark:text-white">{value}</p>
      </div>
    </div>
  );
}

interface TripDetailsSummaryProps {
  details: Array<{
    title: string;
    value: React.ReactNode;
    icon: React.ReactNode;
  }>;
}

function TripDetailsSummary({ details }: TripDetailsSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
      {details.map((detail, idx) => (
        <DetailCard key={detail.title + idx} {...detail} />
      ))}
    </div>
  );
}

export default TripDetailsSummary;
