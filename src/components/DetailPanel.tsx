'use client';

import { useState, useEffect, useRef } from 'react';
import { KnowledgeItem, KnowledgeCategory, KnowledgeStatus } from '@/types/roadmap';
import { X, FileText, ExternalLink, ChevronDown } from 'lucide-react';

interface DetailPanelProps {
  item: KnowledgeItem | KnowledgeCategory;
  type: 'item' | 'category';
  onClose: () => void;
  onStatusChange: (status: KnowledgeStatus) => void;
}

const statusConfig = {
  'completed': { 
    label: '完毕', 
    color: 'bg-green-500',
    dotColor: 'bg-green-500',
    shortcut: 'D'
  },
  'pending': { 
    label: '重置', 
    color: 'bg-gray-400',
    dotColor: 'bg-gray-400',
    shortcut: 'R'
  },
  'skipped': { 
    label: '跳过', 
    color: 'bg-black',
    dotColor: 'bg-black',
    shortcut: '秒'
  },
  'in-progress': { 
    label: '进行中', 
    color: 'bg-yellow-500',
    dotColor: 'bg-yellow-500',
    shortcut: '+'
  },
};

export default function DetailPanel({ item, type, onClose, onStatusChange }: DetailPanelProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleStatusClick = (status: KnowledgeStatus) => {
    onStatusChange(status);
    setIsDropdownOpen(false);
  };

  const isKnowledgeItem = (obj: any): obj is KnowledgeItem => {
    return type === 'item';
  };

  const resources = isKnowledgeItem(item) ? item.resources : undefined;
  const currentStatus = statusConfig[item.status];
  
  // 获取其他三个状态选项
  const otherStatuses = (Object.keys(statusConfig) as KnowledgeStatus[]).filter(
    status => status !== item.status
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 侧边栏面板 */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto animate-slide-in">
        <div className="p-8">
          {/* 头部 */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              {/* 状态下拉选择器 */}
              <div ref={dropdownRef} className="relative inline-block mb-4">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-w-[200px]"
                >
                  <div className={`w-3 h-3 rounded-full ${currentStatus.dotColor}`} />
                  <span className="flex-1 text-left font-medium text-gray-900 dark:text-gray-100">
                    {currentStatus.label}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* 下拉菜单 */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl z-10 overflow-hidden">
                    {otherStatuses.map((status) => {
                      const config = statusConfig[status];
                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusClick(status)}
                          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className={`w-3 h-3 rounded-full ${config.dotColor}`} />
                          <span className="flex-1 text-left font-medium text-gray-900 dark:text-gray-100">
                            {config.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                {item.title}
              </h2>
            </div>
            
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* 描述 */}
          {item.description && (
            <div className="mb-8">
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                {item.description}
              </p>
            </div>
          )}

          {/* 学习资源 */}
          {resources && resources.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  免费资源
                </h3>
              </div>
              
              <div className="space-y-3">
                {resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 rounded">
                          {resource.type === 'article' && '文章'}
                          {resource.type === 'video' && '视频'}
                          {resource.type === 'documentation' && '文档'}
                          {resource.type === 'course' && '课程'}
                        </span>
                        <span className="text-gray-900 dark:text-gray-100 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {resource.title}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 如果没有描述和资源，显示提示 */}
          {!item.description && (!resources || resources.length === 0) && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>暂无详细信息</p>
              <p className="text-sm mt-2">你可以在数据文件中添加描述和学习资源</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

