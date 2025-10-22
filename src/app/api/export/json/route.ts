import { NextResponse } from 'next/server';
import { KnowledgeCategory } from '@/types/roadmap';

/**
 * 导出为 JSON（带格式化）
 * POST /api/export/json
 */
export async function POST(request: Request) {
  try {
    console.log('💾 [导出API] 生成 JSON');
    
    const { data, pretty = true } = await request.json();
    
    if (!data) {
      return NextResponse.json(
        { success: false, error: '缺少数据' },
        { status: 400 }
      );
    }
    
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data,
    };
    
    const json = pretty 
      ? JSON.stringify(exportData, null, 2)
      : JSON.stringify(exportData);
    
    console.log('✅ [导出API] JSON 生成完成');
    
    return NextResponse.json({
      success: true,
      content: json,
      fileName: `frontend-roadmap-${getDateString()}.json`,
    });
    
  } catch (error) {
    console.error('❌ [导出API] JSON 生成失败:', error);
    return NextResponse.json(
      { success: false, error: 'JSON 生成失败' },
      { status: 500 }
    );
  }
}

function getDateString(): string {
  return new Date().toISOString().split('T')[0];
}




