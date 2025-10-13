# Next.js API 快速开始指南

## 🚀 5分钟添加你的第一个 API

### 步骤1：创建 API 文件（30秒）

在项目中创建：`src/app/api/test/route.ts`

```typescript

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: '恭喜！你的第一个 API 成功了！',
    timestamp: new Date().toISOString(),
  });
}
```

### 步骤2：启动服务器（10秒）

```bash
npm run dev
```

### 步骤3：测试 API（30秒）

**方法1：浏览器访问**
```
http://localhost:3000/api/test
```

**方法2：使用 curl**
```bash
curl http://localhost:3000/api/test
```

**方法3：在代码中调用**
```typescript
const response = await fetch('/api/test');
const data = await response.json();
console.log(data);
```

---

## 🎯 实战练习：为你的项目添加 API

### 练习1：保存学习进度 API（10分钟）

**创建文件**：`src/app/api/progress/route.ts`

```typescript
import { NextResponse } from 'next/server';

// 临时存储（实际项目会用数据库）
let progressData: any = {};

// GET /api/progress - 获取进度
export async function GET() {
  return NextResponse.json({
    success: true,
    data: progressData,
  });
}

// POST /api/progress - 保存进度
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 保存数据
    progressData = body;
    
    return NextResponse.json({
      success: true,
      message: '保存成功',
      savedAt: new Date().toISOString(),
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: '保存失败' },
      { status: 500 }
    );
  }
}
```

**测试保存**：

```typescript
// 在你的组件中
const saveToServer = async () => {
  const response = await fetch('/api/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data), // data 是你的路线图数据
  });
  
  const result = await response.json();
  console.log(result); // { success: true, message: '保存成功' }
};
```

**测试获取**：

```typescript
const loadFromServer = async () => {
  const response = await fetch('/api/progress');
  const result = await response.json();
  console.log(result.data); // 获取保存的数据
};
```

---

### 练习2：统计 API（10分钟）

**创建文件**：`src/app/api/stats/route.ts`

```typescript
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { data } = await request.json();
    
    // 计算统计数据
    let total = 0;
    let completed = 0;
    let inProgress = 0;
    let pending = 0;
    let skipped = 0;
    
    data.forEach((category: any) => {
      category.items.forEach((item: any) => {
        total++;
        switch (item.status) {
          case 'completed':
            completed++;
            break;
          case 'in-progress':
            inProgress++;
            break;
          case 'pending':
            pending++;
            break;
          case 'skipped':
            skipped++;
            break;
        }
      });
    });
    
    const completionRate = total > 0 
      ? Math.round((completed / total) * 100) 
      : 0;
    
    return NextResponse.json({
      success: true,
      stats: {
        total,
        completed,
        inProgress,
        pending,
        skipped,
        completionRate,
      },
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: '统计失败' },
      { status: 500 }
    );
  }
}
```

**前端调用**：

```typescript
const getStats = async () => {
  const response = await fetch('/api/stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }), // 发送路线图数据
  });
  
  const result = await response.json();
  console.log(result.stats);
  // { total: 80, completed: 25, completionRate: 31, ... }
};
```

---

### 练习3：笔记 API（15分钟）

**创建文件**：`src/app/api/notes/route.ts`

```typescript
import { NextResponse } from 'next/server';

// 临时存储笔记
const notesStorage: Record<string, any> = {};

// POST /api/notes - 保存笔记
export async function POST(request: Request) {
  try {
    const { itemId, notes, notesUpdatedAt } = await request.json();
    
    if (!itemId) {
      return NextResponse.json(
        { error: 'itemId 不能为空' },
        { status: 400 }
      );
    }
    
    // 保存笔记
    notesStorage[itemId] = {
      notes,
      notesUpdatedAt,
    };
    
    return NextResponse.json({
      success: true,
      message: '笔记保存成功',
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: '保存失败' },
      { status: 500 }
    );
  }
}

// GET /api/notes?itemId=xxx - 获取笔记
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get('itemId');
  
  if (!itemId) {
    return NextResponse.json(
      { error: 'itemId 不能为空' },
      { status: 400 }
    );
  }
  
  const noteData = notesStorage[itemId];
  
  return NextResponse.json({
    success: true,
    data: noteData || null,
  });
}
```

**前端调用**：

```typescript
// 保存笔记
const saveNote = async (itemId: string, notes: string) => {
  await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      itemId,
      notes,
      notesUpdatedAt: new Date().toISOString(),
    }),
  });
};

// 获取笔记
const loadNote = async (itemId: string) => {
  const response = await fetch(`/api/notes?itemId=${itemId}`);
  const result = await response.json();
  return result.data;
};
```

---

## 🛠️ 常用工具函数

### 错误处理包装器

```typescript
// src/lib/api-handler.ts

export function apiHandler(handler: Function) {
  return async (request: Request, context?: any) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json(
        { error: '服务器错误' },
        { status: 500 }
      );
    }
  };
}

// 使用
export const POST = apiHandler(async (request: Request) => {
  // 你的逻辑
});
```

### 验证中间件

```typescript
// src/lib/validate.ts

export function validateRequired(data: any, fields: string[]) {
  const missing = fields.filter(field => !data[field]);
  
  if (missing.length > 0) {
    throw new Error(`缺少必填字段: ${missing.join(', ')}`);
  }
}

// 使用
const body = await request.json();
validateRequired(body, ['itemId', 'status']);
```

---

## 📚 API 设计最佳实践

### 1. 统一的响应格式

```typescript
// 成功响应
{
  success: true,
  data: { ... },
  message: '操作成功'
}

// 错误响应
{
  success: false,
  error: '错误信息',
  code: 'ERROR_CODE'
}
```

### 2. HTTP 状态码

```typescript
// 200 - 成功
return NextResponse.json({ success: true }, { status: 200 });

// 201 - 创建成功
return NextResponse.json({ success: true }, { status: 201 });

// 400 - 客户端错误
return NextResponse.json({ error: '参数错误' }, { status: 400 });

// 401 - 未认证
return NextResponse.json({ error: '未登录' }, { status: 401 });

// 403 - 无权限
return NextResponse.json({ error: '无权限' }, { status: 403 });

// 404 - 未找到
return NextResponse.json({ error: '未找到' }, { status: 404 });

// 500 - 服务器错误
return NextResponse.json({ error: '服务器错误' }, { status: 500 });
```

### 3. RESTful 设计

```
GET    /api/items         获取列表
GET    /api/items/:id     获取单个
POST   /api/items         创建
PUT    /api/items/:id     完整更新
PATCH  /api/items/:id     部分更新
DELETE /api/items/:id     删除
```

---

## 🔍 调试技巧

### 1. 查看请求日志

```typescript
export async function POST(request: Request) {
  console.log('📥 收到请求');
  console.log('Method:', request.method);
  console.log('URL:', request.url);
  
  const body = await request.json();
  console.log('Body:', body);
  
  // 你的逻辑...
}
```

### 2. 使用 Postman 测试

或者使用 VSCode 插件 REST Client：

创建 `test.http` 文件：

```http
### 测试 GET
GET http://localhost:3000/api/test

### 测试 POST
POST http://localhost:3000/api/progress
Content-Type: application/json

{
  "itemId": "html-1",
  "status": "completed"
}
```

---

## ⚠️ 常见错误

### 错误1：忘记 export

```typescript
// ❌ 错误
function GET() {
  return Response.json({ data: 'test' });
}

// ✅ 正确
export async function GET() {
  return Response.json({ data: 'test' });
}
```

### 错误2：忘记 await request.json()

```typescript
// ❌ 错误
const body = request.json(); // 返回 Promise

// ✅ 正确
const body = await request.json();
```

### 错误3：CORS 错误（通常不需要处理）

Next.js API Routes 默认同域，不会有 CORS 问题。
如果需要允许外部访问：

```typescript
export async function GET(request: Request) {
  const response = NextResponse.json({ data: 'test' });
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  
  return response;
}
```

---

## 🎯 下一步

1. ✅ 完成上面 3 个练习
2. ✅ 在你的项目中实际使用这些 API
3. ✅ 准备好后，告诉我，我给你数据库版本的指南

**API 开发真的很简单！试试就知道了！** 🚀

