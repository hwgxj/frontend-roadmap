'use client';

import { KnowledgeItem } from '@/types/roadmap';
import { Check } from 'lucide-react';

interface KnowledgeCardProps {
  item: KnowledgeItem;
  onClick: () => void;
}

const statusStyles = {
  pending: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-300',
    text: 'text-gray-900',
  },
  'in-progress': {
    bg: 'bg-purple-200',
    border: 'border-purple-400',
    text: 'text-gray-900',
  },
  completed: {
    bg: 'bg-gray-300',
    border: 'border-gray-400',
    text: 'text-gray-600 line-through',
  },
  skipped: {
    bg: 'bg-teal-700',
    border: 'border-teal-800',
    text: 'text-white',
  },
};

export default function KnowledgeCard({ item, onClick }: KnowledgeCardProps) {
  const style = statusStyles[item.status];

  return (
    <button
      onClick={onClick}
      className={`${style.bg} ${style.border} border-2 rounded-2xl px-6 py-4 min-w-[280px] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer relative`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`${style.text} font-medium text-left flex-1`}>
          {item.title}
        </span>
        {item.status === 'completed' && (
          <Check className="w-6 h-6 text-purple-600 flex-shrink-0" strokeWidth={3} />
        )}
        {item.status === 'skipped' && (
          <Check className="w-6 h-6 text-white flex-shrink-0" strokeWidth={3} />
        )}
      </div>
    </button>
  );
}

