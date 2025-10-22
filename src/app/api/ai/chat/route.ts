import { NextResponse } from 'next/server';
import OpenAI from 'openai';

/**
 * AI聊天API
 * 使用SiliconFlow服务（兼容OpenAI API格式）
 */
export async function POST(request: Request) {
  try {
    const { message, history = [], userProgress } = await request.json();

    // 验证消息
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: '消息内容不能为空' },
        { status: 400 }
      );
    }

    // 检查API密钥
    if (!process.env.SILICONFLOW_API_KEY) {
      console.error('❌ 缺少 SILICONFLOW_API_KEY 环境变量');
      return NextResponse.json(
        { error: '服务配置错误，请联系管理员' },
        { status: 500 }
      );
    }

    // 初始化SiliconFlow客户端（使用OpenAI SDK）
    const client = new OpenAI({
      apiKey: process.env.SILICONFLOW_API_KEY,
      baseURL: process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1',
    });

    // 构建用户进度信息
    let progressInfo = '';
    if (userProgress) {
      progressInfo = `

# 📊 用户当前学习进度
- 总知识点：${userProgress.total || 0}个
- 已完成：${userProgress.completed || 0}个 (${userProgress.completionRate || 0}%)
- 学习中：${userProgress.inProgress || 0}个
- 已跳过：${userProgress.skipped || 0}个
- 待学习：${userProgress.pending || 0}个

**根据这些进度信息，你可以：**
- 鼓励用户的学习进展
- 推荐下一步应该学习的内容
- 提供更有针对性的建议
`;
    }

    // 构建消息历史
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `你是"前端学习路线图"项目的AI学习助手。${progressInfo}

# 📚 项目背景
你所在的是一个互动式前端学习路线图系统，帮助学习者系统化学习前端开发。

## 项目功能
- 📊 学习进度管理：用户可以标记知识点为"待定/进行中/已完成/已跳过"
- 🔍 搜索和筛选：快速查找知识点
- 💾 数据持久化：学习进度自动保存
- 📈 学习统计：显示完成率、总知识点等
- 🤖 AI助手（你）：解答学习疑问

## 知识体系（14个分类）
1. **Internet** - 互联网基础（HTTP、DNS、浏览器等）
2. **HTML** - HTML5、语义化标签、表单、SEO
3. **CSS** - 基础、Flexbox、Grid、响应式、动画
4. **JavaScript** - 基础、函数、DOM、ES6+、异步编程、OOP
5. **Version Control** - Git基础、分支管理、GitHub
6. **Package Manager** - npm、package.json
7. **Browser** - 渲染原理、缓存、存储、API
8. **Network** - HTTP/HTTPS、RESTful、AJAX、WebSocket、CORS
9. **Framework** - React、Vue、状态管理、路由
10. **Build Tools** - Webpack、Vite、Babel
11. **Performance** - 性能指标、代码分割、图片优化、缓存策略
12. **Web Security** - XSS、CSRF、HTTPS、CSP
13. **TypeScript** - 基础、高级类型、配置
14. **Testing** - 单元测试、组件测试、E2E测试

# 🎯 你的任务
帮助用户在这个学习路线图中更好地学习：

## 回答技术问题时
1. **先确认上下文**：如果用户提到具体知识点，关联到路线图中的对应类别
2. **结构化回答**：
   - 用一句话总结核心概念
   - 用通俗的语言详细解释（多用类比）
   - 提供2-3个代码示例（从简单到复杂）
   - 说明常见错误和注意事项
   - 关联到路线图的其他知识点

3. **提供学习建议**：
   - 在路线图中的位置（前置知识、后续学习）
   - 预计学习时间
   - 推荐学习资源
   - 实践项目建议

## 特殊能力
- 📋 **学习规划**：帮用户制定基于路线图的学习计划
- 🎯 **进度分析**：根据用户描述的进度给出建议
- 🔗 **知识关联**：指出知识点之间的关联
- 💡 **项目推荐**：推荐适合当前学习阶段的练习项目

## 沟通风格
- 友好、鼓励、耐心
- 用中文回答
- 适当使用emoji让对话生动
- 对初学者更简单，对有经验者更深入
- 主动询问用户的学习背景和目标

# 💬 示例对话

用户："我不知道从哪开始学"
你："你好！👋 我看到你在使用前端学习路线图。让我帮你规划一下：

**建议从这3个基础模块开始：**
1️⃣ Internet（1周）- 了解网络基础
2️⃣ HTML（2周）- 掌握页面结构
3️⃣ CSS（3周）- 学习样式设计

你有编程基础吗？这样我可以给你更合适的建议 😊"

用户："什么是闭包？"
你："闭包是JavaScript中的重要概念，在路线图的【JavaScript > 函数和作用域】部分。

**一句话理解：**
闭包 = 函数 + 能访问外部变量的能力

[详细解释 + 代码示例]...

**在路线图中的位置：**
- 前置知识：✅ JavaScript基础、✅ 函数声明
- 相关知识：作用域链、this关键字
- 实际应用：模块化、数据私有化"

记住：你不只是一个通用AI，你是这个**前端学习路线图项目**的专属助手！`
      },
      // 添加历史消息
      ...history.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      // 当前消息
      {
        role: 'user',
        content: message,
      },
    ];

    // 调用AI模型（尝试流式返回）
    // 如果底层 AI 服务支持 stream:true，则可以把流直接转发给前端。
    // 这里我们优先尝试使用 SDK 的流式接口；若不支持或出错，会回退到非流式（一次性返回）实现。

    try {
      const completion = await client.chat.completions.create({
        model: 'deepseek-ai/DeepSeek-V3.2-Exp',
        messages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: true,
      });

      // 如果 SDK 返回了一个可以作为流处理的 response（例如 fetch-like Response），
      // 我们尝试直接把它的 body 转为可读流并返回给前端。
      // SiliconFlow / OpenAI SDK 不同版本返回类型不同，下面对常见情况做兼容处理。

      // 情况 A: completion 本身是一个带 body 的 Response-like 对象
      // 情况 B: completion 里包含一个可迭代的事件流（此处不做复杂解析，回退到一次性返回）

      // 如果 completion.body 可用且为 ReadableStream，直接返回该流
      // 使用原生 Response 可以将 ReadableStream 转发到客户端
      const maybeBody: any = (completion as any).body || (completion as any).data;

      // 情况 1: completion 返回的是一个 ReadableStream-like（例如 fetch Response body）
      if (maybeBody && typeof maybeBody.getReader === 'function') {
        return new NextResponse(maybeBody, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }

      // 情况 2: 某些 SDK（或 deepseek）在开启 stream:true 时返回一个 async iterable（可 for-await-of）
      // 我们检测对象是否实现了 Symbol.asyncIterator 并将其转换为 ReadableStream 转发给前端
      const asAny: any = completion as any;
      if (asAny && typeof asAny[Symbol.asyncIterator] === 'function') {
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of asAny) {
                // chunk 可能是字符串、Uint8Array 或者包含 text/delta 的对象
                let text = '';
                try {
                  if (typeof chunk === 'string') {
                    text = chunk;
                  } else if (chunk instanceof Uint8Array) {
                    text = new TextDecoder().decode(chunk);
                  } else if (chunk && typeof chunk === 'object') {
                    // 常见：{ choices: [{ delta: { content: '...' } }] } 或 { delta: { content: '...' } }
                    if (chunk.delta && (chunk.delta.content || chunk.delta.role)) {
                      text = chunk.delta.content || '';
                    } else if (chunk.choices && Array.isArray(chunk.choices)) {
                      // 提取所有 choices 中的文本变化
                      for (const c of chunk.choices) {
                        if (c.delta && c.delta.content) text += c.delta.content;
                        else if (c.text) text += c.text;
                      }
                    } else if (chunk.text) {
                      text = chunk.text;
                    } else {
                      // 兜底：把对象序列化为字符串（避免丢失信息）
                      try { text = JSON.stringify(chunk); } catch (_) { text = String(chunk); }
                    }
                  } else {
                    text = String(chunk);
                  }
                } catch (e) {
                  // 若解析单个 chunk 失败，仍尝试把原始 chunk 转为字符串
                  text = String(chunk);
                }

                if (text) controller.enqueue(encoder.encode(text));
              }

              controller.close();
            } catch (err) {
              controller.error(err as any);
            }
          },
        });

        return new NextResponse(stream, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }

      // 情况不匹配时，尝试把 SDK 的 choices 拼接后作为非流式返回（回退）
      const reply: string = (completion as any).choices?.[0]?.message?.content || '';

      if (reply) {
        return NextResponse.json({ success: true, reply, usage: (completion as any).usage });
      }
    } catch (streamErr: any) {
      // 如果流式调用失败，降级到非流式调用
      console.warn('流式调用失败，回退到非流式接口：', streamErr?.message || streamErr);
    }

    // 回退：非流式完成（兼容旧实现）
    const completion = await client.chat.completions.create({
      model: 'deepseek-ai/DeepSeek-V3.2-Exp', // 使用deepseek模型
      messages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: false,
    });

    const reply = completion.choices[0]?.message?.content || '抱歉，我暂时无法回答这个问题。';

    return NextResponse.json({
      success: true,
      reply,
      usage: completion.usage,
    });

  } catch (error: any) {
    // 更友好的错误信息
    let errorMessage = '抱歉，AI服务暂时出现问题，请稍后再试。';
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorMessage = '无法连接到AI服务，请检查网络连接。';
    } else if (error.status === 401) {
      errorMessage = 'API密钥无效，请检查配置。';
    } else if (error.status === 429) {
      errorMessage = '请求过于频繁，请稍后再试。';
    }

    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: error.status || 500 }
    );
  }
}
