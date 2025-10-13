'use client';

import { KnowledgeStatus } from '@/types/roadmap';

interface CategoryCardProps {
  title: string;
  status: KnowledgeStatus;
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

export default function CategoryCard({ title, status, onClick }: CategoryCardProps) {
  const style = statusStyles[status];

  return (
    <button
      onClick={onClick}
      className={`${style.bg} ${style.border} border-2 rounded-xl px-8 py-4 min-w-[200px] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer`}
    >
      <span className={`${style.text} font-semibold text-lg text-center block`}>
        {title}
      </span>
    </button>
  );
}

