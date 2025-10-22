import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * 从服务器拉取数据（同步下载）
 * GET /api/sync/pull?userId=xxx&lastSync=xxx
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default';
    const lastSync = searchParams.get('lastSync');
    
    const filePath = path.join(process.cwd(), 'server-data', 'progress', `${userId}.json`);
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: true,
        hasUpdate: false,
        data: null,
        message: '服务器暂无数据',
      });
    }
    
    // 读取服务器数据
    const content = fs.readFileSync(filePath, 'utf-8');
    const serverData = JSON.parse(content);
    
    // 检查是否有更新
    let hasUpdate = true;
    if (lastSync && serverData.syncedAt) {
      const lastSyncTime = new Date(lastSync).getTime();
      const serverSyncTime = new Date(serverData.syncedAt).getTime();
      hasUpdate = serverSyncTime > lastSyncTime;
    }
    
    return NextResponse.json({
      success: true,
      hasUpdate,
      data: hasUpdate ? serverData.data : null,
      timestamp: serverData.timestamp,
      syncedAt: serverData.syncedAt,
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '拉取失败' },
      { status: 500 }
    );
  }
}



