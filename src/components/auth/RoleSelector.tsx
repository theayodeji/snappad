import React from "react";
import { User, Home } from "lucide-react";

type Role = "guest" | "host";

interface RoleSelectorProps {
  selectedRole: Role | null;
  setSelectedRole: (role: Role) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, setSelectedRole }) => {
  const roles: { label: string; value: Role; icon: React.ReactNode; description: string }[] = [
    {
      label: "Guest",
      value: "guest",
      icon: <User className="w-5 h-5 mr-2" />,
      description: "Book spaces, plan trips, and explore stays.",
    },
    {
      label: "Host",
      value: "host",
      icon: <Home className="w-5 h-5 mr-2" />,
      description: "List properties and manage bookings.",
    },
  ];

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        Select your role
      </legend>
      <div className="flex flex-col sm:flex-row gap-4">
        {roles.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => setSelectedRole(role.value)}
            className={`flex items-center p-4 border rounded-lg transition-all w-full
              ${
                selectedRole === role.value
                  ? "border-tertiary bg-tertiary/10 text-tertiary font-semibold"
                  : "border-gray-300 hover:border-tertiary dark:border-gray-600"
              }`}
            aria-pressed={selectedRole === role.value}
            title={role.description}
          >
            <div className="flex items-center text-base">
              {role.icon}
              {role.label}
            </div>
          </button>
        ))}
      </div>
    </fieldset>
  );
};

export default RoleSelector;
