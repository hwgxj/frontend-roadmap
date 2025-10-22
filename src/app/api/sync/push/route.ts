import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * 推送本地数据到服务器（同步上传）
 * POST /api/sync/push
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId = 'default', data, timestamp, forceUpdate = false } = body;
    
    if (!data) {
      return NextResponse.json(
        { success: false, error: '缺少数据' },
        { status: 400 }
      );
    }
    
    const dataDir = path.join(process.cwd(), 'server-data', 'progress');
    const filePath = path.join(dataDir, `${userId}.json`);
    
    // 确保目录存在
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    let shouldUpdate = true;
    let conflictData = null;
    
    // 如果不是强制更新，检查冲突
    if (!forceUpdate && fs.existsSync(filePath)) {
      const existingContent = fs.readFileSync(filePath, 'utf-8');
      const existingData = JSON.parse(existingContent);
      
      // 比较时间戳
      if (existingData.timestamp && timestamp) {
        const existingTime = new Date(existingData.timestamp).getTime();
        const newTime = new Date(timestamp).getTime();
        
        if (existingTime > newTime) {
          // 服务器数据更新
          shouldUpdate = false;
          conflictData = existingData;
        }
      }
    }
    
    if (shouldUpdate) {
      // 保存数据
      const saveData = {
        userId,
        data,
        timestamp: timestamp || new Date().toISOString(),
        syncedAt: new Date().toISOString(),
      };
      
      fs.writeFileSync(filePath, JSON.stringify(saveData, null, 2), 'utf-8');
      
      return NextResponse.json({
        success: true,
        message: '数据推送成功',
        syncedAt: saveData.syncedAt,
      });
    } else {
      // 返回冲突信息
      return NextResponse.json({
        success: false,
        conflict: true,
        message: '服务器有更新的数据',
        serverData: conflictData,
      }, { status: 409 }); // 409 Conflict
    }
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '推送失败' },
      { status: 500 }
    );
  }
}



