import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * 计算并保存统计数据
 * POST /api/stats/calculate
 */
export async function POST(request: Request) {
  try {
    console.log('🔄 [统计API] 开始计算统计数据');
    
    const { userId = 'default' } = await request.json();
    
    // 读取用户进度数据
    const progressPath = path.join(process.cwd(), 'server-data', 'progress', `${userId}.json`);
    
    if (!fs.existsSync(progressPath)) {
      return NextResponse.json({
        success: false,
        error: '未找到用户数据',
      }, { status: 404 });
    }
    
    const progressContent = fs.readFileSync(progressPath, 'utf-8');
    const progressData = JSON.parse(progressContent);
    
    // 计算详细统计
    const stats = calculateDetailedStats(progressData.data);
    
    // 保存统计结果
    const statsDir = path.join(process.cwd(), 'server-data', 'stats');
    if (!fs.existsSync(statsDir)) {
      fs.mkdirSync(statsDir, { recursive: true });
    }
    
    const statsPath = path.join(statsDir, `${userId}-stats.json`);
    const statsData = {
      userId,
      stats,
      calculatedAt: new Date().toISOString(),
    };
    
    fs.writeFileSync(statsPath, JSON.stringify(statsData, null, 2), 'utf-8');
    
    console.log('✅ [统计API] 统计计算完成并保存');
    
    return NextResponse.json({
      success: true,
      stats,
      message: '统计计算完成',
    });
    
  } catch (error) {
    console.error('❌ [统计API] 计算失败:', error);
    return NextResponse.json(
      { success: false, error: '计算失败' },
      { status: 500 }
    );
  }
}

/**
 * 获取已保存的统计数据
 * GET /api/stats/calculate?userId=xxx
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default';
    
    const statsPath = path.join(process.cwd(), 'server-data', 'stats', `${userId}-stats.json`);
    
    if (!fs.existsSync(statsPath)) {
      return NextResponse.json({
        success: true,
        stats: null,
        message: '暂无统计数据',
      });
    }
    
    const content = fs.readFileSync(statsPath, 'utf-8');
    const statsData = JSON.parse(content);
    
    return NextResponse.json({
      success: true,
      stats: statsData.stats,
      calculatedAt: statsData.calculatedAt,
    });
    
  } catch (error) {
    console.error('❌ [统计API] 获取统计失败:', error);
    return NextResponse.json(
      { success: false, error: '获取统计失败' },
      { status: 500 }
    );
  }
}

// 计算详细统计
function calculateDetailedStats(data: any[]) {
  const stats: any = {
    overview: {
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
      skipped: 0,
      completionRate: 0,
    },
    categories: [],
    timeline: {
      startDate: null,
      lastUpdateDate: new Date().toISOString(),
      daysActive: 0,
    },
    achievements: [],
  };
  
  data.forEach((category: any) => {
    const categoryStats = {
      id: category.id,
      title: category.title,
      total: category.items.length,
      completed: 0,
      inProgress: 0,
      pending: 0,
      skipped: 0,
      completionRate: 0,
    };
    
    category.items.forEach((item: any) => {
      stats.overview.total++;
      
      switch (item.status) {
        case 'completed':
          stats.overview.completed++;
          categoryStats.completed++;
          break;
        case 'in-progress':
          stats.overview.inProgress++;
          categoryStats.inProgress++;
          break;
        case 'pending':
          stats.overview.pending++;
          categoryStats.pending++;
          break;
        case 'skipped':
          stats.overview.skipped++;
          categoryStats.skipped++;
          break;
      }
    });
    
    categoryStats.completionRate = categoryStats.total > 0
      ? Math.round((categoryStats.completed / categoryStats.total) * 100)
      : 0;
    
    stats.categories.push(categoryStats);
  });
  
  stats.overview.completionRate = stats.overview.total > 0
    ? Math.round((stats.overview.completed / stats.overview.total) * 100)
    : 0;
  
  // 检测成就
  if (stats.overview.completed >= 10) {
    stats.achievements.push({ title: '入门者', description: '完成10个知识点' });
  }
  if (stats.overview.completed >= 50) {
    stats.achievements.push({ title: '学习达人', description: '完成50个知识点' });
  }
  if (stats.overview.completionRate >= 50) {
    stats.achievements.push({ title: '半程英雄', description: '完成率超过50%' });
  }
  
  return stats;
}




