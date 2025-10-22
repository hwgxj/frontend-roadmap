import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * 获取进度历史记录
 * GET /api/progress/history?userId=xxx&limit=10
 */
export async function GET(request: Request) {
  try {
    console.log('📜 [进度API] 收到历史记录请求');
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default';
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const historyDir = path.join(process.cwd(), 'server-data', 'history', userId);
    
    // 检查目录是否存在
    if (!fs.existsSync(historyDir)) {
      return NextResponse.json({
        success: true,
        history: [],
        message: '暂无历史记录',
      });
    }
    
    // 读取所有历史文件
    const files = fs.readdirSync(historyDir)
      .filter(file => file.endsWith('.json'))
      .sort()
      .reverse() // 最新的在前
      .slice(0, limit);
    
    const history = files.map(file => {
      const content = fs.readFileSync(path.join(historyDir, file), 'utf-8');
      return JSON.parse(content);
    });
    
    console.log(`✅ [进度API] 返回 ${history.length} 条历史记录`);
    
    return NextResponse.json({
      success: true,
      history,
      count: history.length,
    });
    
  } catch (error) {
    console.error('❌ [进度API] 获取历史失败:', error);
    return NextResponse.json(
      { success: false, error: '获取历史失败' },
      { status: 500 }
    );
  }
}

/**
 * 保存历史快照
 * POST /api/progress/history
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId = 'default', data } = body;
    
    const historyDir = path.join(process.cwd(), 'server-data', 'history', userId);
    
    // 确保目录存在
    if (!fs.existsSync(historyDir)) {
      fs.mkdirSync(historyDir, { recursive: true });
    }
    
    // 创建历史快照
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `snapshot-${timestamp}.json`;
    const filePath = path.join(historyDir, fileName);
    
    const snapshot = {
      userId,
      data,
      timestamp: new Date().toISOString(),
    };
    
    fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2), 'utf-8');
    
    console.log('✅ [进度API] 历史快照已保存');
    
    return NextResponse.json({
      success: true,
      message: '历史快照已保存',
      fileName,
    });
    
  } catch (error) {
    console.error('❌ [进度API] 保存历史失败:', error);
    return NextResponse.json(
      { success: false, error: '保存历史失败' },
      { status: 500 }
    );
  }
}




