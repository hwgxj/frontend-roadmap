/**
 * 进度同步 Hook
 * 自动同步本地和服务器数据
 */

import { useState, useEffect, useCallback } from 'react';
import { KnowledgeCategory } from '@/types/roadmap';
import { useLocalStorage } from './useLocalStorage';
import * as apiClient from '@/lib/api-client';

interface SyncConfig {
  userId?: string;
  autoSync?: boolean;
  syncInterval?: number; // 自动同步间隔（毫秒）
}

export function useProgressSync(
  initialData: KnowledgeCategory[],
  config: SyncConfig = {}
) {
  const {
    userId = 'default',
    autoSync = true,
    syncInterval = 30000, // 默认30秒
  } = config;

  // 本地存储
  const [data, setData] = useLocalStorage<KnowledgeCategory[]>(
    'roadmap-data',
    initialData
  );

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  /**
   * 推送数据到服务器
   */
  const pushToServer = useCallback(async () => {
    try {
      setIsSyncing(true);
      setSyncStatus('syncing');

      const result = await apiClient.pushToServer(data, userId);

      if (result?.success) {
        setLastSyncTime(new Date().toISOString());
        setSyncStatus('success');
        console.log('✅ 数据已同步到服务器');
        return true;
      } else {
        setSyncStatus('error');
        console.error('❌ 同步失败:', result?.error);
        return false;
      }
    } catch (error) {
      setSyncStatus('error');
      console.error('❌ 同步失败:', error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [data, userId]);

  /**
   * 从服务器拉取数据
   */
  const pullFromServer = useCallback(async () => {
    try {
      setIsSyncing(true);
      setSyncStatus('syncing');

      const result = await apiClient.pullFromServer(userId, lastSyncTime || undefined);

      if (result?.success && result.data) {
        setData(result.data);
        setLastSyncTime(new Date().toISOString());
        setSyncStatus('success');
        console.log('✅ 已从服务器加载数据');
        return true;
      } else {
        setSyncStatus('idle');
        return false;
      }
    } catch (error) {
      setSyncStatus('error');
      console.error('❌ 拉取失败:', error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [userId, lastSyncTime, setData]);

  /**
   * 检查同步状态
   */
  const checkSync = useCallback(async () => {
    try {
      const result = await apiClient.checkSyncStatus(userId);

      if (result?.success) {
        if (result.needPull) {
          console.log('🔄 服务器有更新的数据');
          await pullFromServer();
        } else if (result.needPush) {
          console.log('🔄 本地有更新的数据');
          await pushToServer();
        }
      }
    } catch (error) {
      console.error('❌ 检查同步状态失败:', error);
    }
  }, [userId, pullFromServer, pushToServer]);

  /**
   * 手动同步
   */
  const manualSync = useCallback(async () => {
    await checkSync();
  }, [checkSync]);

  // 初始化：从服务器加载数据
  useEffect(() => {
    if (autoSync) {
      pullFromServer();
    }
  }, [autoSync]); // 只在组件挂载时执行

  // 自动同步
  useEffect(() => {
    if (!autoSync) return;

    const timer = setInterval(() => {
      pushToServer();
    }, syncInterval);

    return () => clearInterval(timer);
  }, [autoSync, syncInterval, pushToServer]);

  return {
    data,
    setData,
    isSyncing,
    lastSyncTime,
    syncStatus,
    pushToServer,
    pullFromServer,
    manualSync,
  };
}




