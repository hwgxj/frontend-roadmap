'use client';

import { Download, Upload, RefreshCw, ChevronDown } from 'lucide-react';
import { KnowledgeCategory } from '@/types/roadmap';
import { useRef, useState, useEffect } from 'react';

interface ActionBarProps {
  data: KnowledgeCategory[];
  onImport: (data: KnowledgeCategory[]) => void;
  onReset: () => void;
  onManualSync?: () => void;
  isSyncing?: boolean;
}

export default function ActionBar({ data, onImport, onReset, onManualSync, isSyncing }: ActionBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  // 🆕 使用 API 导出为 JSON
  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export/json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, pretty: true }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        const blob = new Blob([result.content], { type: 'application/json' });
        downloadFile(blob, result.fileName);
      } else {
        alert('❌ 导出失败');
      }
    } catch (error) {
      console.error('导出失败:', error);
      alert('❌ 导出失败');
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  // 🆕 使用 API 导出为 Markdown
  const handleExportMarkdown = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export/markdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, includeStats: true }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        const blob = new Blob([result.content], { type: 'text/markdown;charset=utf-8' });
        downloadFile(blob, result.fileName);
      } else {
        alert('❌ 导出失败');
      }
    } catch (error) {
      console.error('导出失败:', error);
      alert('❌ 导出失败');
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  // 🆕 使用 API 导出为 CSV
  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export/csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        const blob = new Blob([result.content], { type: 'text/csv;charset=utf-8' });
        downloadFile(blob, result.fileName);
      } else {
        alert('❌ 导出失败');
      }
    } catch (error) {
      console.error('导出失败:', error);
      alert('❌ 导出失败');
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  // 导出为纯文本（保留本地版本作为备用）
  const handleExportText = () => {
    let text = '前端知识路线图 - 学习进度\n';
    text += '='.repeat(50) + '\n\n';
    text += `导出时间：${new Date().toLocaleString('zh-CN')}\n\n`;
    
    const stats = calculateStats(data);
    text += '📊 学习统计\n';
    text += '-'.repeat(50) + '\n';
    text += `总知识点：${stats.total}\n`;
    text += `已完成：${stats.completed}\n`;
    text += `学习中：${stats.inProgress}\n`;
    text += `已跳过：${stats.skipped}\n`;
    text += `完成率：${stats.completionRate}%\n\n`;
    
    data.forEach(category => {
      text += '='.repeat(50) + '\n';
      text += `${category.title} (${getStatusLabel(category.status)})\n`;
      text += '='.repeat(50) + '\n\n';
      
      if (category.items.length > 0) {
        category.items.forEach((item, index) => {
          const status = getStatusLabel(item.status);
          const checkbox = item.status === 'completed' ? '☑' : '☐';
          text += `${index + 1}. ${checkbox} ${item.title} [${status}]\n`;
        });
        text += '\n';
      }
    });
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    downloadFile(blob, `frontend-roadmap-${getDateString()}.txt`);
    setShowExportMenu(false);
  };

  // 辅助函数
  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      case 'skipped': return '⏭️';
      default: return '⏸️';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'in-progress': return '学习中';
      case 'skipped': return '已跳过';
      default: return '待学习';
    }
  };

  const calculateStats = (data: KnowledgeCategory[]) => {
    let total = 0, completed = 0, inProgress = 0, skipped = 0;
    data.forEach(cat => {
      cat.items.forEach(item => {
        total++;
        if (item.status === 'completed') completed++;
        else if (item.status === 'in-progress') inProgress++;
        else if (item.status === 'skipped') skipped++;
      });
    });
    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : '0.0';
    return { total, completed, inProgress, skipped, completionRate };
  };

  // 导入数据
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        // 验证数据结构
        if (Array.isArray(importedData) && importedData.length > 0) {
          onImport(importedData);
          alert('✅ 数据导入成功！');
        } else {
          alert('❌ 无效的数据格式');
        }
      } catch (error) {
        alert('❌ 文件解析失败，请确保是有效的 JSON 文件');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
    
    // 重置 input，允许导入相同文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 重置数据
  const handleReset = () => {
    if (confirm('⚠️ 确定要重置所有数据吗？这将清除所有学习进度！')) {
      onReset();
      alert('✅ 数据已重置');
    }
  };

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          💡 提示：数据自动保存，每30秒同步到服务器
        </p>
      </div>
      
      <div className="flex gap-2">
        {/* 🆕 手动同步按钮 */}
        {onManualSync && (
          <button
            onClick={onManualSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md disabled:opacity-50"
            title="立即同步到服务器"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? '同步中...' : '同步'}</span>
          </button>
        )}
        {/* 导出按钮（下拉菜单） */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md disabled:opacity-50"
            title="选择导出格式"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{isExporting ? '导出中...' : '导出'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* 导出格式菜单 */}
          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10">
              <button
                onClick={handleExportMarkdown}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">📝 Markdown</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">可读性强，适合查看</div>
              </button>
              
              <button
                onClick={handleExportText}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">📄 纯文本</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">通用格式，记事本打开</div>
              </button>

              <button
                onClick={handleExportCSV}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700"
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">📊 Excel (CSV)</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">用 Excel 打开</div>
              </button>

              <button
                onClick={handleExportJSON}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">💾 JSON</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">数据备份，可导入</div>
              </button>
            </div>
          )}
        </div>

        {/* 导入按钮 */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
          title="从 JSON 文件导入数据"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">导入</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        {/* 重置按钮 */}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
          title="重置所有数据"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">重置</span>
        </button>
      </div>
    </div>
  );
}

