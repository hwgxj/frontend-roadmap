// 知识点状态类型
export type KnowledgeStatus = 'pending' | 'in-progress' | 'completed' | 'skipped';

// 知识点项目接口
export interface KnowledgeItem {
  id: string;
  title: string;
  status: KnowledgeStatus;
  description?: string; // 详细描述
  resources?: Resource[]; // 学习资源
}

// 学习资源接口
export interface Resource {
  title: string;
  url: string;
  type: 'article' | 'video' | 'documentation' | 'course';
}

// 知识点分类接口
export interface KnowledgeCategory {
  id: string;
  title: string;
  status: KnowledgeStatus;
  description?: string; // 分类描述
  items: KnowledgeItem[];
}

