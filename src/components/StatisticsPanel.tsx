'use client';

import { useMemo } from 'react';
import { KnowledgeCategory } from '@/types/roadmap';
import { TrendingUp, CheckCircle, Clock, SkipForward } from 'lucide-react';

interface StatisticsPanelProps {
  data: KnowledgeCategory[];
}

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

export default function StatisticsPanel({ data }: StatisticsPanelProps) {
  // 计算统计数据
  const stats = useMemo(() => {
    let totalItems = 0;
    let completedItems = 0;
    let inProgressItems = 0;
    let skippedItems = 0;
    let pendingItems = 0;

    data.forEach(category => {
      category.items.forEach(item => {
        totalItems++;
        switch (item.status) {
          case 'completed':
            completedItems++;
            break;
          case 'in-progress':
            inProgressItems++;
            break;
          case 'skipped':
            skippedItems++;
            break;
          case 'pending':
            pendingItems++;
            break;
        }
      });
    });

    const completionRate = totalItems > 0 
      ? ((completedItems / totalItems) * 100).toFixed(1) 
      : '0.0';

    return {
      total: totalItems,
      completed: completedItems,
      inProgress: inProgressItems,
      skipped: skippedItems,
      pending: pendingItems,
      completionRate,
    };
  }, [data]);

  const statCards: StatCard[] = [
    {
      title: '总知识点',
      value: stats.total,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: '已完成',
      value: stats.completed,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: '学习中',
      value: stats.inProgress,
      icon: <Clock className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: '已跳过',
      value: stats.skipped,
      icon: <SkipForward className="w-6 h-6" />,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
    },
  ];

  return (
    <div className="mb-8">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </span>
              <div className={card.color}>{card.icon}</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* 完成率进度条 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            整体完成进度
          </h3>
          <span className="text-2xl font-bold text-green-600">
            {stats.completionRate}%
          </span>
        </div>
        
        {/* 进度条 */}
        <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>

        {/* 状态分布 */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">
              {stats.pending}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              待学习
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.inProgress}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              学习中
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              已完成
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">
              {stats.skipped}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              已跳过
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

