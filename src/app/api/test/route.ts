import { NextResponse } from 'next/server';

// 这就是后端代码！
export async function GET() {
  // 这段代码运行在服务器上，不是浏览器！
  console.log('🚀 后端 API 被调用了！这行日志会出现在终端，不是浏览器控制台');
  
  return NextResponse.json({
    message: '恭喜！你的后端正在运行！',
    serverTime: new Date().toLocaleString('zh-CN'),
    serverInfo: {
      platform: process.platform,
      nodeVersion: process.version,
      memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
    }
  });
}

// POST 请求示例
export async function POST(request: Request) {
  const body = await request.json();
  
  console.log('📥 收到POST请求，数据：', body);
  
  return NextResponse.json({
    message: '后端成功接收了你的数据',
    receivedData: body,
    processedAt: new Date().toISOString()
  });
}



