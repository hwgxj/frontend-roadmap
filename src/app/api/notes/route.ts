import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * 获取所有笔记或指定笔记
 * GET /api/notes?userId=xxx&itemId=xxx
 */
export async function GET(request: Request) {
  try {
    console.log('📝 [笔记API] 收到获取笔记请求');
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default';
    const itemId = searchParams.get('itemId');
    
    const notesPath = path.join(process.cwd(), 'server-data', 'notes', `${userId}.json`);
    
    // 检查文件是否存在
    if (!fs.existsSync(notesPath)) {
      return NextResponse.json({
        success: true,
        data: itemId ? null : {},
        message: '暂无笔记',
      });
    }
    
    // 读取笔记数据
    const content = fs.readFileSync(notesPath, 'utf-8');
    const allNotes = JSON.parse(content);
    
    // 如果指定了 itemId，返回单个笔记
    if (itemId) {
      const note = allNotes[itemId];
      return NextResponse.json({
        success: true,
        data: note || null,
      });
    }
    
    // 返回所有笔记
    return NextResponse.json({
      success: true,
      data: allNotes,
      count: Object.keys(allNotes).length,
    });
    
  } catch (error) {
    console.error('❌ [笔记API] 获取笔记失败:', error);
    return NextResponse.json(
      { success: false, error: '获取笔记失败' },
      { status: 500 }
    );
  }
}

/**
 * 创建或更新笔记
 * POST /api/notes
 */
export async function POST(request: Request) {
  try {
    console.log('✏️ [笔记API] 收到保存笔记请求');
    
    const body = await request.json();
    const { userId = 'default', itemId, content, categoryId, itemTitle } = body;
    
    // 验证必填字段（允许空内容，用于删除笔记）
    if (!itemId || content === undefined || content === null) {
      return NextResponse.json(
        { success: false, error: '缺少必填字段' },
        { status: 400 }
      );
    }
    
    const notesDir = path.join(process.cwd(), 'server-data', 'notes');
    const notesPath = path.join(notesDir, `${userId}.json`);
    
    // 确保目录存在
    if (!fs.existsSync(notesDir)) {
      fs.mkdirSync(notesDir, { recursive: true });
    }
    
    // 读取现有笔记
    let allNotes: Record<string, any> = {};
    if (fs.existsSync(notesPath)) {
      const existingContent = fs.readFileSync(notesPath, 'utf-8');
      allNotes = JSON.parse(existingContent);
    }
    
    // 保存笔记
    allNotes[itemId] = {
      itemId,
      categoryId,
      itemTitle,
      content,
      createdAt: allNotes[itemId]?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // 写入文件
    fs.writeFileSync(notesPath, JSON.stringify(allNotes, null, 2), 'utf-8');
    
    console.log('✅ [笔记API] 笔记保存成功');
    
    return NextResponse.json({
      success: true,
      message: '笔记保存成功',
      data: allNotes[itemId],
    });
    
  } catch (error) {
    console.error('❌ [笔记API] 保存笔记失败:', error);
    return NextResponse.json(
      { success: false, error: '保存笔记失败' },
      { status: 500 }
    );
  }
}

/**
 * 删除笔记
 * DELETE /api/notes?userId=xxx&itemId=xxx
 */
export async function DELETE(request: Request) {
  try {
    console.log('🗑️ [笔记API] 收到删除笔记请求');
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default';
    const itemId = searchParams.get('itemId');
    
    if (!itemId) {
      return NextResponse.json(
        { success: false, error: '缺少 itemId' },
        { status: 400 }
      );
    }
    
    const notesPath = path.join(process.cwd(), 'server-data', 'notes', `${userId}.json`);
    
    if (!fs.existsSync(notesPath)) {
      return NextResponse.json({
        success: true,
        message: '笔记不存在',
      });
    }
    
    // 读取现有笔记
    const content = fs.readFileSync(notesPath, 'utf-8');
    const allNotes = JSON.parse(content);
    
    // 删除指定笔记
    if (allNotes[itemId]) {
      delete allNotes[itemId];
      fs.writeFileSync(notesPath, JSON.stringify(allNotes, null, 2), 'utf-8');
      
      console.log('✅ [笔记API] 笔记删除成功');
      
      return NextResponse.json({
        success: true,
        message: '笔记删除成功',
      });
    }
    
    return NextResponse.json({
      success: true,
      message: '笔记不存在',
    });
    
  } catch (error) {
    console.error('❌ [笔记API] 删除笔记失败:', error);
    return NextResponse.json(
      { success: false, error: '删除笔记失败' },
      { status: 500 }
    );
  }
}

