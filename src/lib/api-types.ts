/**
 * API 相关类型定义
 */

import { KnowledgeCategory, KnowledgeStatus } from '@/types/roadmap';

// ==================== 通用类型 ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ==================== 进度管理类型 ====================

export interface ProgressData {
  userId: string;
  data: KnowledgeCategory[];
  timestamp: string;
  savedAt?: string;
  syncedAt?: string;
}

export interface ProgressSnapshot {
  userId: string;
  data: KnowledgeCategory[];
  timestamp: string;
}

// ==================== 统计类型 ====================

export interface Stats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  skipped: number;
  completionRate: number;
}

export interface CategoryStats extends Stats {
  id: string;
  title: string;
}

export interface DetailedStats {
  overview: Stats;
  categories: CategoryStats[];
  timeline: {
    startDate: string | null;
    lastUpdateDate: string;
    daysActive: number;
  };
  achievements: Achievement[];
}

export interface Achievement {
  title: string;
  description: string;
  unlockedAt?: string;
}

// ==================== 笔记类型 ====================

export interface Note {
  itemId: string;
  categoryId?: string;
  itemTitle?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotesCollection {
  [itemId: string]: Note;
}

// ==================== 同步类型 ====================

export type SyncStatus = 'synced' | 'need_push' | 'need_pull' | 'conflict' | 'no_server_data';

export interface SyncStatusResponse {
  success: boolean;
  status: SyncStatus;
  needPush: boolean;
  needPull: boolean;
  serverTimestamp?: string;
  localTimestamp?: string | null;
  lastSyncAt?: string;
}

export interface SyncConflict {
  conflict: true;
  message: string;
  serverData: ProgressData;
}

// ==================== 导出类型 ====================

export type ExportFormat = 'markdown' | 'csv' | 'json' | 'text';

export interface ExportOptions {
  format: ExportFormat;
  includeStats?: boolean;
  pretty?: boolean;
}

export interface ExportResult {
  success: boolean;
  content: string;
  fileName: string;
}

// ==================== 请求类型 ====================

export interface SaveProgressRequest {
  userId?: string;
  data: KnowledgeCategory[];
  timestamp?: string;
}

export interface LoadProgressRequest {
  userId?: string;
}

export interface SaveNoteRequest {
  userId?: string;
  itemId: string;
  content: string;
  categoryId?: string;
  itemTitle?: string;
}

export interface SyncPushRequest {
  userId?: string;
  data: KnowledgeCategory[];
  timestamp?: string;
  forceUpdate?: boolean;
}

export interface SyncPullRequest {
  userId?: string;
  lastSync?: string;
}




