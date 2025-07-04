import React from 'react';

const ButtonLoader = () => {
  return (
    <div className="flex space-x-2 items-center justify-center py-1.5">
      <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
    </div>
  );
};

export default ButtonLoader;
