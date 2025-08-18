'use client';
import React, { useMemo, memo } from 'react';
import { FaThLarge, FaList } from 'react-icons/fa';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewChange: (mode: 'grid' | 'list') => void;
}

const ViewToggle = memo(function ViewToggle({ viewMode, onViewChange }: ViewToggleProps) {
  // Memoize tabs configuration
  const tabs = useMemo(() => [
    {
      id: 'grid' as const,
      label: 'Grid View',
      icon: <FaThLarge className="text-sm" />
    },
    {
      id: 'list' as const,
      label: 'List View',
      icon: <FaList className="text-sm" />
    }
  ], []);

  return (
    <div className="flex items-center bg-gray-100 p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onViewChange(tab.id)}
          className={`p-2 rounded-md transition-colors ${viewMode === tab.id
              ? 'bg-white text-[#8ba63a] shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
            }`}
          title={tab.label}
        >
          {tab.icon}
        </button>
      ))}
    </div>
  );
});

export default ViewToggle;
