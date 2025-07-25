import React from 'react';

const Tabs = ({ children, className = '', ...props }) => {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

const TabsList = ({ children, className = '', ...props }) => {
  return (
    <div className={`flex space-x-1 rounded-lg bg-gray-100 p-1 ${className}`} {...props}>
      {children}
    </div>
  );
};

const TabsTrigger = ({ 
  children, 
  value, 
  active = false, 
  onClick,
  className = '', 
  ...props 
}) => {
  return (
    <button
      className={`px-3 py-1.5 text-sm font-medium transition-all rounded-md ${
        active 
          ? 'bg-white text-gray-900 shadow-sm' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
      } ${className}`}
      onClick={() => onClick && onClick(value)}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ 
  children, 
  value, 
  activeValue,
  className = '', 
  ...props 
}) => {
  if (value !== activeValue) return null;
  
  return (
    <div className={`mt-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };