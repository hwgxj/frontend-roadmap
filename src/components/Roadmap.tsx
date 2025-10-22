'use client';

import { useState, useMemo } from 'react';
import { KnowledgeCategory, KnowledgeItem, KnowledgeStatus } from '@/types/roadmap';
import CategoryCard from './CategoryCard';
import KnowledgeCard from './KnowledgeCard';
import DetailPanel from './DetailPanel';
import StatisticsPanel from './StatisticsPanel';
import SearchBar from './SearchBar';
import ActionBar from './ActionBar';
import SaveStatusIndicator from './SaveStatusIndicator';
import AIAssistant from './AIAssistant';
import { useProgressSync } from '@/hooks/useProgressSync';

interface RoadmapProps {
  data: KnowledgeCategory[];
}

type SelectedItem = {
  type: 'category';
  data: KnowledgeCategory;
  categoryId: string;
} | {
  type: 'item';
  data: KnowledgeItem;
  categoryId: string;
  itemId: string;
};

export default function Roadmap({ data: initialData }: RoadmapProps) {
  // 🆕 使用自动同步到服务器的 Hook
  const {
    data,
    setData,
    isSyncing,
    lastSyncTime,
    syncStatus,
    manualSync,
  } = useProgressSync(initialData, {
    autoSync: true,        // 启用自动同步
    syncInterval: 30000,   // 每30秒同步一次
  });
  
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  
  // 搜索和筛选状态
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<KnowledgeStatus | 'all'>('all');

  // 过滤数据
  const filteredData = useMemo(() => {
    return data
      .map(category => ({
        ...category,
        items: category.items.filter(item => {
          // 搜索匹配
          const matchesSearch = 
            searchTerm === '' ||
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase());
          
          // 状态筛选
          const matchesFilter = 
            filterStatus === 'all' || 
            item.status === filterStatus;
          
          return matchesSearch && matchesFilter;
        }),
      }))
      .filter(category => category.items.length > 0); // 只显示有匹配项的分类
  }, [data, searchTerm, filterStatus]);

  const handleItemStatusChange = (categoryId: string, itemId: string, newStatus: KnowledgeStatus) => {
    setData(prevData =>
      prevData.map(category =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map(item =>
                item.id === itemId ? { ...item, status: newStatus } : item
              ),
            }
          : category
      )
    );
  };

  const handleCategoryStatusChange = (categoryId: string, newStatus: KnowledgeStatus) => {
    setData(prevData =>
      prevData.map(category =>
        category.id === categoryId ? { ...category, status: newStatus } : category
      )
    );
  };

  const handleCategoryClick = (category: KnowledgeCategory) => {
    setSelectedItem({
      type: 'category',
      data: category,
      categoryId: category.id,
    });
  };

  const handleItemClick = (categoryId: string, item: KnowledgeItem) => {
    setSelectedItem({
      type: 'item',
      data: item,
      categoryId,
      itemId: item.id,
    });
  };

  const handleDetailStatusChange = (status: KnowledgeStatus) => {
    if (!selectedItem) return;

    if (selectedItem.type === 'category') {
      handleCategoryStatusChange(selectedItem.categoryId, status);
      // 更新selectedItem中的数据
      setSelectedItem({
        ...selectedItem,
        data: { ...selectedItem.data, status },
      });
    } else {
      handleItemStatusChange(selectedItem.categoryId, selectedItem.itemId, status);
      // 更新selectedItem中的数据
      setSelectedItem({
        ...selectedItem,
        data: { ...selectedItem.data, status },
      });
    }
  };

  // 导入数据
  const handleImport = (importedData: KnowledgeCategory[]) => {
    setData(importedData);
    setSearchTerm('');
    setFilterStatus('all');
  };

  // 重置数据
  const handleReset = () => {
    setData(initialData);
    setSearchTerm('');
    setFilterStatus('all');
  };

  return (
    <div className="w-full min-h-screen p-8 md:p-16">
      {/* 标题 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Front-end</h1>
        <p className="text-gray-600 dark:text-gray-400">前端开发知识路线图</p>
        
        {/* 🆕 同步状态显示 */}
        <div className="mt-3 flex items-center gap-3 text-sm">
          <span className={`flex items-center gap-2 ${
            syncStatus === 'syncing' ? 'text-blue-600' : 
            syncStatus === 'success' ? 'text-green-600' : 
            syncStatus === 'error' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {isSyncing ? '🔄 同步中...' : 
             syncStatus === 'success' ? '✅ 已同步到服务器' : 
             syncStatus === 'error' ? '❌ 同步失败' : '💾 本地存储'}
          </span>
          {lastSyncTime && (
            <span className="text-gray-400 text-xs">
              最后同步: {new Date(lastSyncTime).toLocaleTimeString('zh-CN')}
            </span>
          )}
          <button
            onClick={manualSync}
            disabled={isSyncing}
            className="text-xs px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50 transition-colors"
          >
            立即同步
          </button>
        </div>
      </div>

      {/* 统计面板 */}
      <StatisticsPanel data={data} />

      {/* 操作栏 */}
      <ActionBar
        data={data}
        onImport={handleImport}
        onReset={handleReset}
        onManualSync={manualSync}
        isSyncing={isSyncing}
      />

      {/* 搜索和筛选 */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      {/* 路线图主体 */}
      <div className="relative">
        {/* 左侧垂直主线 */}
        <div className="absolute left-[100px] top-0 bottom-0 w-1 bg-blue-500" />

        {/* 分类和知识点 */}
        <div className="space-y-16">
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                😔 没有找到匹配的知识点
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                试试其他关键词或清除筛选条件
              </p>
            </div>
          ) : (
            filteredData.map((category) => (
            <div key={category.id} className="relative">
              {/* 分类卡片 */}
              <div className="flex items-start">
                <div className="relative z-10">
                  <CategoryCard
                    title={category.title}
                    status={category.status}
                    onClick={() => handleCategoryClick(category)}
                  />
                </div>

                {/* 右侧知识点列表 */}
                {category.items.length > 0 && (
                  <div className="ml-32 flex-1 space-y-4">
                    {category.items.map((item) => (
                      <div key={item.id} className="relative flex items-center">
                        {/* 连接线 */}
                        <svg
                          className="absolute left-[-170px] top-1/2 -translate-y-1/2"
                          width="170"
                          height="2"
                          style={{ overflow: 'visible' }}
                        >
                          <line
                            x1="0"
                            y1="1"
                            x2="170"
                            y2="1"
                            stroke="#93c5fd"
                            strokeWidth="2"
                            strokeDasharray="8,8"
                          />
                        </svg>

                        {/* 知识点卡片 */}
                        <KnowledgeCard
                          item={item}
                          onClick={() => handleItemClick(category.id, item)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            ))
          )}
        </div>
      </div>

      {/* 详情面板 */}
      {selectedItem && (
        <DetailPanel
          item={selectedItem.data}
          type={selectedItem.type}
          categoryId={selectedItem.categoryId}
          onClose={() => setSelectedItem(null)}
          onStatusChange={handleDetailStatusChange}
        />
      )}

      {/* 🆕 保存状态指示器 */}
      <SaveStatusIndicator
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
        syncStatus={syncStatus}
      />

      {/* 🤖 AI学习助手 - 传入路线图数据让AI了解用户进度 */}
      <AIAssistant roadmapData={data} />
    </div>
  );
}

