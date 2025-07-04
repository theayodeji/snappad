interface OwnerContactCardProps {
  phone?: string;
  email?: string;
}

export default function OwnerContactCard({ phone, email }: OwnerContactCardProps) {
  return (
    <div className="mt-10 p-6 bg-gray-100 dark:bg-black rounded-xl shadow-md border border-gray-200 dark:border-neutral-dark w-full">
      <h2 className="text-lg md:text-xl font-semibold text-black dark:text-white mb-2">
        Contact the Owner
      </h2>
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div>
          <span className="block text-sm font-medium text-black dark:text-gray-200">Phone:</span>
          <span className="text-base text-black dark:text-white">{phone || "N/A"}</span>
        </div>
        <div>
          <span className="block text-sm font-medium text-black dark:text-gray-200">Email:</span>
          <span className="text-base text-black dark:text-white">{email || "N/A"}</span>
        </div>
      </div>
    </div>
  );
}
