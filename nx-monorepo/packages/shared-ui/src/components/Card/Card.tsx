import React from 'react';
import './Card.css';

export interface CardProps {
  /**
   * Card content
   */
  children: React.ReactNode;
  /**
   * Card title (optional)
   */
  title?: string;
  /**
   * Card variant
   */
  variant?: 'default' | 'elevated' | 'outlined';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  variant = 'default',
  className = '',
  onClick,
}) => {
  const baseClasses = 'ui-card';
  const variantClass = `ui-card--${variant}`;
  const clickableClass = onClick ? 'ui-card--clickable' : '';

  const classes = [baseClasses, variantClass, clickableClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {title && <div className="ui-card__title">{title}</div>}
      <div className="ui-card__content">{children}</div>
    </div>
  );
};
