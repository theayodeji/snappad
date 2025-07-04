import React from 'react';

export interface TextInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ label, name, value, onChange, type = 'text', required = false }) => (
  <div>
    <label className="block text-sm font-medium text-primary-dark dark:text-primary-light">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full p-3 border border-neutral-dark dark:border-white rounded-md shadow-sm sm:text-sm bg-white dark:bg-transparent"
    />
  </div>
);

export default TextInput;
