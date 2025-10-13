'use client';

import { Search, Filter } from 'lucide-react';
import { KnowledgeStatus } from '@/types/roadmap';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterStatus: KnowledgeStatus | 'all';
  onFilterChange: (status: KnowledgeStatus | 'all') => void;
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
}: SearchBarProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 搜索框 */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索知识点..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* 状态筛选 */}
        <div className="relative sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value as KnowledgeStatus | 'all')}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            <option value="all">全部状态</option>
            <option value="pending">⚪ 待学习</option>
            <option value="in-progress">🟡 学习中</option>
            <option value="completed">🟢 已完成</option>
            <option value="skipped">🔵 已跳过</option>
          </select>
        </div>
      </div>

      {/* 搜索结果提示 */}
      {searchTerm && (
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          搜索关键词：<span className="font-medium text-blue-600">"{searchTerm}"</span>
        </div>
      )}
    </div>
  );
}

