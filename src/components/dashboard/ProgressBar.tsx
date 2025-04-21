import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '' }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 ${className}`}>
      <div 
        className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;