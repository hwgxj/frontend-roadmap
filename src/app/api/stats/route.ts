import { NextResponse } from 'next/server';
import { KnowledgeCategory } from '@/types/roadmap';

/**
 * 计算统计数据
 * POST /api/stats
 */
export async function POST(request: Request) {
  try {
    console.log('📊 [统计API] 收到统计请求');
    
    const { data } = await request.json();
    
    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { success: false, error: '无效的数据格式' },
        { status: 400 }
      );
    }
    
    // 计算统计数据
    const stats = calculateStats(data);
    
    console.log('✅ [统计API] 统计计算完成');
    
    return NextResponse.json({
      success: true,
      stats,
      calculatedAt: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('❌ [统计API] 统计失败:', error);
    return NextResponse.json(
      { success: false, error: '统计失败' },
      { status: 500 }
    );
  }
}

/**
 * 获取全局统计（所有用户）
 * GET /api/stats/global
 */
export async function GET() {
  try {
    // 这里可以统计所有用户的数据
    // 暂时返回模拟数据
    return NextResponse.json({
      success: true,
      globalStats: {
        totalUsers: 1,
        averageCompletion: 0,
        mostStudiedTopics: [],
      },
      message: '全局统计功能待实现',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取全局统计失败' },
      { status: 500 }
    );
  }
}

// 统计计算函数
function calculateStats(data: KnowledgeCategory[]) {
  let total = 0;
  let completed = 0;
  let inProgress = 0;
  let pending = 0;
  let skipped = 0;
  
  const categoryStats: Record<string, any> = {};
  
  data.forEach((category) => {
    const catStats = {
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
      skipped: 0,
    };
    
    category.items.forEach((item) => {
      total++;
      catStats.total++;
      
      switch (item.status) {
        case 'completed':
          completed++;
          catStats.completed++;
          break;
        case 'in-progress':
          inProgress++;
          catStats.inProgress++;
          break;
        case 'pending':
          pending++;
          catStats.pending++;
          break;
        case 'skipped':
          skipped++;
          catStats.skipped++;
          break;
      }
    });
    
    catStats.completionRate = catStats.total > 0 
      ? Math.round((catStats.completed / catStats.total) * 100)
      : 0;
    
    categoryStats[category.id] = {
      ...catStats,
      title: category.title,
    };
  });
  
  const completionRate = total > 0 
    ? Math.round((completed / total) * 100) 
    : 0;
  
  return {
    total,
    completed,
    inProgress,
    pending,
    skipped,
    completionRate,
    categoryStats,
    summary: {
      totalCategories: data.length,
      activeCategories: data.filter(c => c.items.some(i => i.status === 'in-progress')).length,
      completedCategories: data.filter(c => c.items.every(i => i.status === 'completed')).length,
    },
  };
}




