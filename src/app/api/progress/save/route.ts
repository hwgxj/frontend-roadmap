import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * 保存用户学习进度
 * POST /api/progress/save
 */
export async function POST(request: Request) {
  try {
    console.log('📥 [进度API] 收到保存进度请求');
    
    const body = await request.json();
    const { userId = 'default', data, timestamp } = body;
    
    // 验证数据
    if (!data) {
      return NextResponse.json(
        { success: false, error: '缺少数据' },
        { status: 400 }
      );
    }
    
    // 准备保存路径
    const dataDir = path.join(process.cwd(), 'server-data', 'progress');
    const filePath = path.join(dataDir, `${userId}.json`);
    
    // 确保目录存在
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // 保存数据
    const saveData = {
      userId,
      data,
      timestamp: timestamp || new Date().toISOString(),
      savedAt: new Date().toISOString(),
    };
    
    fs.writeFileSync(filePath, JSON.stringify(saveData, null, 2), 'utf-8');
    
    console.log('✅ [进度API] 进度已保存');
    
    return NextResponse.json({
      success: true,
      message: '进度保存成功',
      savedAt: saveData.savedAt,
    });
    
  } catch (error) {
    console.error('❌ [进度API] 保存失败:', error);
    return NextResponse.json(
      { success: false, error: '保存失败' },
      { status: 500 }
    );
  }
}

