/**
 * 笔记管理 Hook
 */

import { useState, useCallback, useEffect } from 'react';
import * as apiClient from '@/lib/api-client';

interface Note {
  itemId: string;
  content: string;
  categoryId?: string;
  itemTitle?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function useNotes(userId = 'default') {
  const [notes, setNotes] = useState<Record<string, Note>>({});
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 加载所有笔记
   */
  const loadAllNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await apiClient.getAllNotes(userId);

      if (result?.success && result.data) {
        setNotes(result.data);
      }
    } catch (error) {
      console.error('❌ 加载笔记失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  /**
   * 获取单个笔记
   */
  const getNote = useCallback(
    async (itemId: string) => {
      try {
        const result = await apiClient.getNote(itemId, userId);

        if (result?.success && result.data) {
          setNotes((prev) => ({
            ...prev,
            [itemId]: result.data,
          }));
          return result.data;
        }

        return null;
      } catch (error) {
        console.error('❌ 获取笔记失败:', error);
        return null;
      }
    },
    [userId]
  );

  /**
   * 保存笔记
   */
  const saveNote = useCallback(
    async (
      itemId: string,
      content: string,
      categoryId?: string,
      itemTitle?: string
    ) => {
      try {
        const result = await apiClient.saveNote(
          itemId,
          content,
          categoryId,
          itemTitle,
          userId
        );

        if (result?.success && result.data) {
          setNotes((prev) => ({
            ...prev,
            [itemId]: result.data,
          }));
          return true;
        }

        return false;
      } catch (error) {
        console.error('❌ 保存笔记失败:', error);
        return false;
      }
    },
    [userId]
  );

  /**
   * 删除笔记
   */
  const deleteNote = useCallback(
    async (itemId: string) => {
      try {
        const result = await apiClient.deleteNote(itemId, userId);

        if (result?.success) {
          setNotes((prev) => {
            const newNotes = { ...prev };
            delete newNotes[itemId];
            return newNotes;
          });
          return true;
        }

        return false;
      } catch (error) {
        console.error('❌ 删除笔记失败:', error);
        return false;
      }
    },
    [userId]
  );

  // 初始化加载
  useEffect(() => {
    loadAllNotes();
  }, [loadAllNotes]);

  return {
    notes,
    isLoading,
    getNote,
    saveNote,
    deleteNote,
    refresh: loadAllNotes,
  };
}




