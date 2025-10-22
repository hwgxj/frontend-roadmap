import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { KnowledgeCategory } from '@/types/roadmap';

/**
 * 生成AI友好的学习进度摘要
 * GET /api/summary?userId=xxx
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default';
    
    // 读取进度数据
    const progressPath = path.join(process.cwd(), 'server-data', 'progress', `${userId}.json`);
    
    if (!fs.existsSync(progressPath)) {
      return NextResponse.json({
        success: true,
        summary: '暂无学习进度数据',
      });
    }
    
    const content = fs.readFileSync(progressPath, 'utf-8');
    const progressData = JSON.parse(content);
    const data: KnowledgeCategory[] = progressData.data;
    
    // 生成详细摘要
    const summary = generateAIFriendlySummary(data);
    
    return NextResponse.json({
      success: true,
      summary,
      generatedAt: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('❌ [摘要API] 生成摘要失败:', error);
    return NextResponse.json(
      { success: false, error: '生成摘要失败' },
      { status: 500 }
    );
  }
}

/**
 * 生成AI可以理解的文本摘要
 */
function generateAIFriendlySummary(data: KnowledgeCategory[]): string {
  let summary = '# 前端学习路线图 - 详细进度\n\n';
  
  // 总体统计
  const stats = calculateStats(data);
  summary += `## 📊 总体进度\n\n`;
  summary += `- 总知识点: ${stats.total}\n`;
  summary += `- ✅ 已完成: ${stats.completed} (${stats.completionRate}%)\n`;
  summary += `- 🔄 进行中: ${stats.inProgress}\n`;
  summary += `- ⏸️ 待学习: ${stats.pending}\n`;
  summary += `- ⏭️ 已跳过: ${stats.skipped}\n\n`;
  
  summary += `---\n\n`;
  
  // 按状态分组的详细列表
  summary += `## ✅ 已完成的知识点 (${stats.completed}个)\n\n`;
  const completed = getItemsByStatus(data, 'completed');
  if (completed.length > 0) {
    completed.forEach(item => {
      summary += `- **${item.category}** → ${item.title}\n`;
    });
  } else {
    summary += `暂无已完成的知识点\n`;
  }
  summary += `\n`;
  
  summary += `## 🔄 正在学习的知识点 (${stats.inProgress}个)\n\n`;
  const inProgress = getItemsByStatus(data, 'in-progress');
  if (inProgress.length > 0) {
    inProgress.forEach(item => {
      summary += `- **${item.category}** → ${item.title}\n`;
    });
  } else {
    summary += `暂无正在学习的知识点\n`;
  }
  summary += `\n`;
  
  summary += `## ⏭️ 已跳过的知识点 (${stats.skipped}个)\n\n`;
  const skipped = getItemsByStatus(data, 'skipped');
  if (skipped.length > 0) {
    skipped.forEach(item => {
      summary += `- **${item.category}** → ${item.title}\n`;
    });
  } else {
    summary += `暂无跳过的知识点\n`;
  }
  summary += `\n`;
  
  summary += `## ⏸️ 待学习的知识点 (${stats.pending}个)\n\n`;
  const pending = getItemsByStatus(data, 'pending');
  if (pending.length > 0) {
    // 只列出前10个，避免太长
    const toShow = pending.slice(0, 10);
    toShow.forEach(item => {
      summary += `- **${item.category}** → ${item.title}\n`;
    });
    if (pending.length > 10) {
      summary += `... 还有 ${pending.length - 10} 个待学习知识点\n`;
    }
  } else {
    summary += `暂无待学习的知识点\n`;
  }
  summary += `\n`;
  
  // 分类进度详情
  summary += `---\n\n`;
  summary += `## 📚 各分类学习进度\n\n`;
  data.forEach(category => {
    const catStats = calculateCategoryStats(category);
    summary += `### ${category.title}\n`;
    summary += `- 进度: ${catStats.completed}/${catStats.total} (${catStats.completionRate}%)\n`;
    summary += `- 已完成: ${catStats.completedItems.join(', ') || '无'}\n`;
    summary += `- 进行中: ${catStats.inProgressItems.join(', ') || '无'}\n`;
    summary += `- 已跳过: ${catStats.skippedItems.join(', ') || '无'}\n\n`;
  });
  
  return summary;
}

/**
 * 计算统计数据
 */
function calculateStats(data: KnowledgeCategory[]) {
  let total = 0, completed = 0, inProgress = 0, pending = 0, skipped = 0;
  
  data.forEach(cat => {
    cat.items.forEach(item => {
      total++;
      switch (item.status) {
        case 'completed': completed++; break;
        case 'in-progress': inProgress++; break;
        case 'pending': pending++; break;
        case 'skipped': skipped++; break;
      }
    });
  });
  
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { total, completed, inProgress, pending, skipped, completionRate };
}

/**
 * 按状态获取知识点列表
 */
function getItemsByStatus(data: KnowledgeCategory[], status: string) {
  const items: Array<{ category: string; title: string; id: string }> = [];
  
  data.forEach(category => {
    category.items.forEach(item => {
      if (item.status === status) {
        items.push({
          category: category.title,
          title: item.title,
          id: item.id,
        });
      }
    });
  });
  
  return items;
}

/**
 * 计算单个分类的统计
 */
function calculateCategoryStats(category: KnowledgeCategory) {
  const total = category.items.length;
  const completed = category.items.filter(i => i.status === 'completed').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return {
    total,
    completed,
    completionRate,
    completedItems: category.items.filter(i => i.status === 'completed').map(i => i.title),
    inProgressItems: category.items.filter(i => i.status === 'in-progress').map(i => i.title),
    skippedItems: category.items.filter(i => i.status === 'skipped').map(i => i.title),
    pendingItems: category.items.filter(i => i.status === 'pending').map(i => i.title),
  };
}


