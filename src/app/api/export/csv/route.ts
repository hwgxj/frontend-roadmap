import { NextResponse } from 'next/server';
import { KnowledgeCategory } from '@/types/roadmap';

/**
 * 导出为 CSV
 * POST /api/export/csv
 */
export async function POST(request: Request) {
  try {
    console.log('📊 [导出API] 生成 CSV');
    
    const { data } = await request.json();
    
    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { success: false, error: '无效的数据格式' },
        { status: 400 }
      );
    }
    
    const csv = generateCSV(data);
    
    console.log('✅ [导出API] CSV 生成完成');
    
    return NextResponse.json({
      success: true,
      content: csv,
      fileName: `frontend-roadmap-${getDateString()}.csv`,
    });
    
  } catch (error) {
    console.error('❌ [导出API] CSV 生成失败:', error);
    return NextResponse.json(
      { success: false, error: 'CSV 生成失败' },
      { status: 500 }
    );
  }
}

function generateCSV(data: KnowledgeCategory[]): string {
  // CSV 头部
  let csv = '\ufeff'; // BOM for Excel
  csv += '分类ID,分类名称,知识点ID,知识点名称,状态,描述,资源数量\n';
  
  data.forEach((category) => {
    category.items.forEach((item) => {
      const status = getStatusLabel(item.status);
      const description = (item.description || '').replace(/,/g, '，').replace(/\n/g, ' ');
      const resourceCount = item.resources?.length || 0;
      
      csv += `"${category.id}","${category.title}","${item.id}","${item.title}","${status}","${description}","${resourceCount}"\n`;
    });
  });
  
  return csv;
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'completed': return '已完成';
    case 'in-progress': return '学习中';
    case 'skipped': return '已跳过';
    default: return '待学习';
  }
}

function getDateString(): string {
  return new Date().toISOString().split('T')[0];
}




