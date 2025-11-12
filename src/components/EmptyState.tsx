'use client';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = ({ icon = '📝', title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4 fade-in">
      <div className="text-6xl mb-4 pulse">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center mb-6 max-w-md">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary text-white px-6 py-3 rounded-lg font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
