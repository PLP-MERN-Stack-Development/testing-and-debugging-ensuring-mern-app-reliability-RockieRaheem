// Button Component - Reusable button with variants and sizes

import React from 'react';
import './Button.css';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) => {
  const buttonClasses = `
    btn
    btn-${variant}
    btn-${size}
    ${disabled ? 'btn-disabled' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
