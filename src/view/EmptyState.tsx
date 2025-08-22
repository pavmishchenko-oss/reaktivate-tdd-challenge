import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title?: string;
  subtitle?: string;
}

const EmptyState = ({
  icon = '📚',
  title = 'No items found',
  subtitle = 'Start by adding your first item',
}: EmptyStateProps) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <div className="empty-state-title">{title}</div>
    <div className="empty-state-subtitle">{subtitle}</div>
  </div>
);

export default EmptyState;
