import React from 'react';
import './Button.css';

export interface ButtonProps {
  /**
   * Button variant
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Button content
   */
  children: React.ReactNode;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = '',
}) => {
  const baseClasses = 'ui-button';
  const variantClass = `ui-button--${variant}`;
  const sizeClass = `ui-button--${size}`;
  const disabledClass = disabled ? 'ui-button--disabled' : '';

  const classes = [
    baseClasses,
    variantClass,
    sizeClass,
    disabledClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children} hello
    </button>
  );
};
