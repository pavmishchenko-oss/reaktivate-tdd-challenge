import React from 'react';

interface ErrorStateProps {
  message: string;
  className?: string;
}

const ErrorState = ({ message, className = 'error' }: ErrorStateProps) => (
  <div className={className}>
    <div className="error-message">{message}</div>
  </div>
);

export default ErrorState;
