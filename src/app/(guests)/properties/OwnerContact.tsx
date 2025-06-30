import React from 'react';

export interface OwnerContactProps {
  email: string;
  phone?: string;
}

const OwnerContact: React.FC<OwnerContactProps> = ({ email, phone }) => (
  <div className="hidden md:flex items-center gap-3 mt-2 ">
    <div className="lg:w-10 lg:h-10 w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-lg font-bold text-white">
      <span role="img" aria-label="avatar">👤</span>
    </div>
    <div className="flex flex-col text-xs">
      <span className="font-semibold text-black">{email}</span>
      {phone && <span className="text-gray-300 text-xs">{phone}</span>}
    </div>
  </div>
);

export default OwnerContact;
