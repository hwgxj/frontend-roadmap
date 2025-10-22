import { NextResponse } from 'next/server';
import { KnowledgeCategory } from '@/types/roadmap';

/**
 * 导出为 Markdown
 * POST /api/export/markdown
 */
export async function POST(request: Request) {
  try {
    console.log('📝 [导出API] 生成 Markdown');
    
    const { data, includeStats = true } = await request.json();
    
    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { success: false, error: '无效的数据格式' },
        { status: 400 }
      );
    }
    
    const markdown = generateMarkdown(data, includeStats);
    
    console.log('✅ [导出API] Markdown 生成完成');
    
    return NextResponse.json({
      success: true,
      content: markdown,
      fileName: `frontend-roadmap-${getDateString()}.md`,
    });
    
  } catch (error) {
    console.error('❌ [导出API] Markdown 生成失败:', error);
    return NextResponse.json(
      { success: false, error: 'Markdown 生成失败' },
      { status: 500 }
    );
  }
}

function generateMarkdown(data: KnowledgeCategory[], includeStats: boolean): string {
  let markdown = '# 前端知识路线图 - 学习进度\n\n';
  markdown += `导出时间：${new Date().toLocaleString('zh-CN')}\n\n`;
  
  if (includeStats) {
    const stats = calculateStats(data);
    markdown += '## 📊 学习统计\n\n';
    markdown += `- 总知识点：${stats.total}\n`;
    markdown += `- 已完成：${stats.completed} (${stats.completionRate}%)\n`;
    markdown += `- 学习中：${stats.inProgress}\n`;
    markdown += `- 待学习：${stats.pending}\n`;
    markdown += `- 已跳过：${stats.skipped}\n\n`;
    markdown += '---\n\n';
  }
  
  data.forEach((category) => {
    const statusEmoji = getStatusEmoji(category.status);
    markdown += `## ${statusEmoji} ${category.title}\n\n`;
    
    if (category.description) {
      markdown += `> ${category.description}\n\n`;
    }
    
    if (category.items.length > 0) {
      category.items.forEach((item) => {
        const itemEmoji = getStatusEmoji(item.status);
        const checkbox = item.status === 'completed' ? '[x]' : '[ ]';
        markdown += `- ${checkbox} ${itemEmoji} **${item.title}**\n`;
        
        if (item.description) {
          markdown += `  - ${item.description}\n`;
        }
        
        if (item.resources && item.resources.length > 0) {
          markdown += '  - 学习资源：\n';
          item.resources.forEach((resource) => {
            markdown += `    - [${resource.title}](${resource.url}) - ${resource.type}\n`;
          });
        }
      });
      markdown += '\n';
    }
  });
  
  markdown += '---\n\n';
  markdown += '*由前端知识路线图自动生成*';
  
  return markdown;
}

function calculateStats(data: KnowledgeCategory[]) {
  let total = 0, completed = 0, inProgress = 0, pending = 0, skipped = 0;
  
  data.forEach((cat) => {
    cat.items.forEach((item) => {
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

function getStatusEmoji(status: string): string {
  switch (status) {
    case 'completed': return '✅';
    case 'in-progress': return '🔄';
    case 'skipped': return '⏭️';
    default: return '⏸️';
  }
}

function getDateString(): string {
  return new Date().toISOString().split('T')[0];
}




