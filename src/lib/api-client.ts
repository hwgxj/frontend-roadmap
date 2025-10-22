/**
 * API 客户端工具函数
 * 统一管理所有 API 调用
 */

import { KnowledgeCategory } from '@/types/roadmap';

// API 基础配置
const API_BASE = '/api';

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ==================== 进度管理 API ====================

/**
 * 保存学习进度
 */
export async function saveProgress(data: KnowledgeCategory[], userId = 'default') {
  const response = await fetch(`${API_BASE}/progress/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      data,
      timestamp: new Date().toISOString(),
    }),
  });
  
  return response.json() as Promise<ApiResponse>;
}

/**
 * 加载学习进度
 */
export async function loadProgress(userId = 'default') {
  const response = await fetch(`${API_BASE}/progress/load?userId=${userId}`);
  return response.json() as Promise<ApiResponse<KnowledgeCategory[]>>;
}

/**
 * 获取进度历史
 */
export async function getProgressHistory(userId = 'default', limit = 10) {
  const response = await fetch(`${API_BASE}/progress/history?userId=${userId}&limit=${limit}`);
  return response.json() as Promise<ApiResponse<any[]>>;
}

/**
 * 保存进度快照
 */
export async function saveProgressSnapshot(data: KnowledgeCategory[], userId = 'default') {
  const response = await fetch(`${API_BASE}/progress/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, data }),
  });
  
  return response.json() as Promise<ApiResponse>;
}

// ==================== 统计分析 API ====================

/**
 * 计算统计数据
 */
export async function calculateStats(data: KnowledgeCategory[]) {
  const response = await fetch(`${API_BASE}/stats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });
  
  return response.json() as Promise<ApiResponse>;
}

/**
 * 计算并保存详细统计
 */
export async function calculateDetailedStats(userId = 'default') {
  const response = await fetch(`${API_BASE}/stats/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  
  return response.json() as Promise<ApiResponse>;
}

/**
 * 获取已保存的统计数据
 */
export async function getSavedStats(userId = 'default') {
  const response = await fetch(`${API_BASE}/stats/calculate?userId=${userId}`);
  return response.json() as Promise<ApiResponse>;
}

// ==================== 笔记管理 API ====================

/**
 * 获取所有笔记
 */
export async function getAllNotes(userId = 'default') {
  const response = await fetch(`${API_BASE}/notes?userId=${userId}`);
  return response.json() as Promise<ApiResponse>;
}

/**
 * 获取单个笔记
 */
export async function getNote(itemId: string, userId = 'default') {
  const response = await fetch(`${API_BASE}/notes?userId=${userId}&itemId=${itemId}`);
  return response.json() as Promise<ApiResponse>;
}

/**
 * 保存笔记
 */
export async function saveNote(
  itemId: string,
  content: string,
  categoryId?: string,
  itemTitle?: string,
  userId = 'default'
) {
  const response = await fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      itemId,
      content,
      categoryId,
      itemTitle,
    }),
  });
  
  return response.json() as Promise<ApiResponse>;
}

/**
 * 更新笔记
 */
export async function updateNote(itemId: string, content: string, userId = 'default') {
  const response = await fetch(`${API_BASE}/notes/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, content }),
  });
  
  return response.json() as Promise<ApiResponse>;
}

/**
 * 删除笔记
 */
export async function deleteNote(itemId: string, userId = 'default') {
  const response = await fetch(`${API_BASE}/notes?userId=${userId}&itemId=${itemId}`, {
    method: 'DELETE',
  });
  
  return response.json() as Promise<ApiResponse>;
}

// ==================== 数据同步 API ====================

/**
 * 推送数据到服务器
 */
export async function pushToServer(
  data: KnowledgeCategory[],
  userId = 'default',
  forceUpdate = false
) {
  const response = await fetch(`${API_BASE}/sync/push`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      data,
      timestamp: new Date().toISOString(),
      forceUpdate,
    }),
  });
  
  return response.json() as Promise<ApiResponse>;
}

/**
 * 从服务器拉取数据
 */
export async function pullFromServer(userId = 'default', lastSync?: string) {
  const url = lastSync 
    ? `${API_BASE}/sync/pull?userId=${userId}&lastSync=${lastSync}`
    : `${API_BASE}/sync/pull?userId=${userId}`;
  
  const response = await fetch(url);
  return response.json() as Promise<ApiResponse<KnowledgeCategory[]>>;
}

/**
 * 检查同步状态
 */
export async function checkSyncStatus(userId = 'default', localTimestamp?: string) {
  const url = localTimestamp
    ? `${API_BASE}/sync/status?userId=${userId}&localTimestamp=${localTimestamp}`
    : `${API_BASE}/sync/status?userId=${userId}`;
  
  const response = await fetch(url);
  return response.json() as Promise<ApiResponse>;
}

// ==================== 导出 API ====================

/**
 * 导出为 Markdown
 */
export async function exportToMarkdown(data: KnowledgeCategory[], includeStats = true) {
  const response = await fetch(`${API_BASE}/export/markdown`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data, includeStats }),
  });
  
  return response.json() as Promise<ApiResponse<{ content: string; fileName: string }>>;
}

/**
 * 导出为 CSV
 */
export async function exportToCSV(data: KnowledgeCategory[]) {
  const response = await fetch(`${API_BASE}/export/csv`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });
  
  return response.json() as Promise<ApiResponse<{ content: string; fileName: string }>>;
}

/**
 * 导出为 JSON
 */
export async function exportToJSON(data: KnowledgeCategory[], pretty = true) {
  const response = await fetch(`${API_BASE}/export/json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data, pretty }),
  });
  
  return response.json() as Promise<ApiResponse<{ content: string; fileName: string }>>;
}

// ==================== AI 摘要 API ====================

/**
 * 获取AI友好的进度摘要
 */
export async function getAISummary(userId = 'default') {
  const response = await fetch(`${API_BASE}/summary?userId=${userId}`);
  return response.json() as Promise<ApiResponse<{ summary: string }>>;
}

// ==================== 辅助函数 ====================

/**
 * 下载文件
 */
export function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 错误处理包装器
 */
export async function apiCall<T>(
  apiFunction: () => Promise<T>,
  errorMessage = '操作失败'
): Promise<T | null> {
  try {
    return await apiFunction();
  } catch (error) {
    console.error(errorMessage, error);
    return null;
  }
}

