import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  withHover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  interactive = false,
  withHover = false,
  onClick,
}) => {
  const baseClasses = "bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 overflow-hidden";
  const hoverClasses = withHover ? "hover:shadow-lg transition-shadow duration-200" : "";
  
  const interactiveProps = interactive
    ? {
        whileHover: { y: -4, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)' },
        whileTap: { y: -2 },
        transition: { type: 'spring', stiffness: 400, damping: 17 },
      }
    : {};

  const Component = interactive ? motion.div : 'div';

  return (
    <Component
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
      {...interactiveProps}
    >
      {children}
    </Component>
  );
};

export default Card;