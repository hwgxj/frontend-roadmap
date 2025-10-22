import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * 加载用户学习进度
 * GET /api/progress/load?userId=xxx
 */
export async function GET(request: Request) {
  try {
    console.log('📤 [进度API] 收到加载进度请求');
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default';
    
    const filePath = path.join(process.cwd(), 'server-data', 'progress', `${userId}.json`);
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      console.log('ℹ️ [进度API] 用户暂无保存的进度');
      return NextResponse.json({
        success: true,
        data: null,
        message: '暂无保存的进度',
      });
    }
    
    // 读取文件
    const content = fs.readFileSync(filePath, 'utf-8');
    const savedData = JSON.parse(content);
    
    console.log('✅ [进度API] 进度加载成功');
    
    return NextResponse.json({
      success: true,
      data: savedData.data,
      timestamp: savedData.timestamp,
      savedAt: savedData.savedAt,
      loadedAt: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('❌ [进度API] 加载失败:', error);
    return NextResponse.json(
      { success: false, error: '加载失败' },
      { status: 500 }
    );
  }
}



