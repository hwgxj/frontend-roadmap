import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * 保存路线图数据到服务器
 * POST /api/roadmap/save
 */
export async function POST(request: Request) {
  try {
    console.log('📥 [保存API] 收到保存请求');
    
    // 1. 获取请求数据
    const body = await request.json();
    console.log('📦 [保存API] 数据大小:', JSON.stringify(body).length, 'bytes');
    
    // 2. 验证数据
    if (!body.data) {
      console.log('❌ [保存API] 数据验证失败：缺少 data 字段');
      return NextResponse.json(
        { 
          success: false, 
          error: '缺少 data 字段' 
        },
        { status: 400 }
      );
    }
    
    // 3. 准备保存路径
    const dataDir = path.join(process.cwd(), 'server-data');
    const filePath = path.join(dataDir, 'roadmap.json');
    
    // 4. 确保目录存在
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('📁 [保存API] 创建数据目录:', dataDir);
    }
    
    // 5. 保存到文件
    fs.writeFileSync(
      filePath, 
      JSON.stringify(body.data, null, 2),
      'utf-8'
    );
    
    console.log('✅ [保存API] 数据已保存到:', filePath);
    console.log('⏰ [保存API] 保存时间:', new Date().toLocaleString('zh-CN'));
    
    // 6. 返回成功响应
    return NextResponse.json({
      success: true,
      message: '数据已保存到服务器',
      savedAt: new Date().toISOString(),
      filePath: filePath
    });
    
  } catch (error) {
    console.error('❌ [保存API] 保存失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '保存失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

/**
 * 从服务器加载路线图数据
 * GET /api/roadmap/save
 */
export async function GET() {
  try {
    console.log('📤 [保存API] 收到读取请求');
    
    const filePath = path.join(process.cwd(), 'server-data', 'roadmap.json');
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      console.log('ℹ️ [保存API] 文件不存在，返回空数据');
      return NextResponse.json({
        success: true,
        data: null,
        message: '服务器暂无保存的数据'
      });
    }
    
    // 读取文件
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    console.log('✅ [保存API] 数据读取成功');
    console.log('📦 [保存API] 数据大小:', content.length, 'bytes');
    
    return NextResponse.json({
      success: true,
      data,
      loadedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ [保存API] 读取失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '读取失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}



