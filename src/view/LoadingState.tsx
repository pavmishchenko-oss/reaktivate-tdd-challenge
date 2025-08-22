import React from 'react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = 'Loading...' }: LoadingStateProps) => (
  <div className="loading">{message}</div>
);

export default LoadingState;
