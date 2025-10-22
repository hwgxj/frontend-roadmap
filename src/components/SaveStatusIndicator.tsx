'use client';

import { useEffect, useState } from 'react';

interface SaveStatusIndicatorProps {
  isSyncing: boolean;
  lastSyncTime: string | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
}

export default function SaveStatusIndicator({
  isSyncing,
  lastSyncTime,
  syncStatus,
}: SaveStatusIndicatorProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // 成功保存后显示提示3秒
  useEffect(() => {
    if (syncStatus === 'success' && !isSyncing) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [syncStatus, isSyncing]);

  const getStatusConfig = () => {
    if (isSyncing) {
      return {
        icon: '🔄',
        text: '正在保存到服务器...',
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        pulse: true,
      };
    }

    if (syncStatus === 'success' && showSuccessMessage) {
      return {
        icon: '✅',
        text: '已保存到服务器',
        color: 'bg-green-100 text-green-800 border-green-300',
        pulse: false,
      };
    }

    if (syncStatus === 'error') {
      return {
        icon: '❌',
        text: '保存失败',
        color: 'bg-red-100 text-red-800 border-red-300',
        pulse: false,
      };
    }

    // 空闲状态
    if (lastSyncTime) {
      return {
        icon: '💾',
        text: `已同步 - ${formatTime(lastSyncTime)}`,
        color: 'bg-gray-100 text-gray-600 border-gray-300',
        pulse: false,
      };
    }

    return {
      icon: '⏸️',
      text: '未同步',
      color: 'bg-gray-100 text-gray-600 border-gray-300',
      pulse: false,
    };
  };

  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const config = getStatusConfig();

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50
        px-4 py-3 rounded-lg border-2
        ${config.color}
        shadow-lg
        flex items-center gap-3
        transition-all duration-300
        ${config.pulse ? 'animate-pulse' : ''}
      `}
    >
      <span className="text-2xl">{config.icon}</span>
      <div>
        <p className="font-medium">{config.text}</p>
        {lastSyncTime && !isSyncing && (
          <p className="text-xs opacity-75">
            最后保存: {formatTime(lastSyncTime)}
          </p>
        )}
      </div>
    </div>
  );
}

