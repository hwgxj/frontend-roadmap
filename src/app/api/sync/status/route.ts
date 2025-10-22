import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * 检查同步状态
 * GET /api/sync/status?userId=xxx&localTimestamp=xxx
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default';
    const localTimestamp = searchParams.get('localTimestamp');
    
    const filePath = path.join(process.cwd(), 'server-data', 'progress', `${userId}.json`);
    
    // 服务器是否有数据
    const hasServerData = fs.existsSync(filePath);
    
    if (!hasServerData) {
      return NextResponse.json({
        success: true,
        status: 'no_server_data',
        message: '服务器暂无数据，可以推送',
        needPush: true,
        needPull: false,
      });
    }
    
    // 读取服务器数据
    const content = fs.readFileSync(filePath, 'utf-8');
    const serverData = JSON.parse(content);
    
    let status = 'synced'; // 'synced' | 'need_push' | 'need_pull' | 'conflict'
    let needPush = false;
    let needPull = false;
    
    if (!localTimestamp) {
      // 本地没有数据，需要拉取
      status = 'need_pull';
      needPull = true;
    } else {
      const localTime = new Date(localTimestamp).getTime();
      const serverTime = new Date(serverData.timestamp).getTime();
      
      if (localTime > serverTime) {
        // 本地数据更新，需要推送
        status = 'need_push';
        needPush = true;
      } else if (localTime < serverTime) {
        // 服务器数据更新，需要拉取
        status = 'need_pull';
        needPull = true;
      } else {
        // 已同步
        status = 'synced';
      }
    }
    
    return NextResponse.json({
      success: true,
      status,
      needPush,
      needPull,
      serverTimestamp: serverData.timestamp,
      localTimestamp: localTimestamp || null,
      lastSyncAt: serverData.syncedAt,
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '检查状态失败' },
      { status: 500 }
    );
  }
}



