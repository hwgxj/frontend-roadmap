import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * 获取单个笔记
 * GET /api/notes/[id]?userId=xxx
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default';
    const itemId = params.id;
    
    const notesPath = path.join(process.cwd(), 'server-data', 'notes', `${userId}.json`);
    
    if (!fs.existsSync(notesPath)) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }
    
    const content = fs.readFileSync(notesPath, 'utf-8');
    const allNotes = JSON.parse(content);
    
    return NextResponse.json({
      success: true,
      data: allNotes[itemId] || null,
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
 * 更新笔记
 * PUT /api/notes/[id]
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userId = 'default', content } = body;
    const itemId = params.id;
    
    if (!content) {
      return NextResponse.json(
        { success: false, error: '缺少内容' },
        { status: 400 }
      );
    }
    
    const notesPath = path.join(process.cwd(), 'server-data', 'notes', `${userId}.json`);
    
    if (!fs.existsSync(notesPath)) {
      return NextResponse.json(
        { success: false, error: '笔记不存在' },
        { status: 404 }
      );
    }
    
    const fileContent = fs.readFileSync(notesPath, 'utf-8');
    const allNotes = JSON.parse(fileContent);
    
    if (!allNotes[itemId]) {
      return NextResponse.json(
        { success: false, error: '笔记不存在' },
        { status: 404 }
      );
    }
    
    // 更新笔记
    allNotes[itemId] = {
      ...allNotes[itemId],
      content,
      updatedAt: new Date().toISOString(),
    };
    
    fs.writeFileSync(notesPath, JSON.stringify(allNotes, null, 2), 'utf-8');
    
    return NextResponse.json({
      success: true,
      message: '笔记更新成功',
      data: allNotes[itemId],
    });
    
  } catch (error) {
    console.error('❌ [笔记API] 更新笔记失败:', error);
    return NextResponse.json(
      { success: false, error: '更新笔记失败' },
      { status: 500 }
    );
  }
}

/**
 * 删除笔记
 * DELETE /api/notes/[id]?userId=xxx
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default';
    const itemId = params.id;
    
    const notesPath = path.join(process.cwd(), 'server-data', 'notes', `${userId}.json`);
    
    if (!fs.existsSync(notesPath)) {
      return NextResponse.json({
        success: true,
        message: '笔记不存在',
      });
    }
    
    const content = fs.readFileSync(notesPath, 'utf-8');
    const allNotes = JSON.parse(content);
    
    if (allNotes[itemId]) {
      delete allNotes[itemId];
      fs.writeFileSync(notesPath, JSON.stringify(allNotes, null, 2), 'utf-8');
      
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

