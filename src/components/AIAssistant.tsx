'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2, Sparkles } from 'lucide-react';
import { KnowledgeCategory } from '@/types/roadmap';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  roadmapData?: KnowledgeCategory[]; // 可选：传入路线图数据让AI了解进度
}

export default function AIAssistant({ roadmapData }: AIAssistantProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStream, setCurrentStream] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 计算用户学习进度
  const calculateProgress = () => {
    if (!roadmapData || roadmapData.length === 0) return null;

    let total = 0;
    let completed = 0;
    let inProgress = 0;
    let skipped = 0;
    let pending = 0;

    roadmapData.forEach(category => {
      category.items.forEach(item => {
        total++;
        switch (item.status) {
          case 'completed':
            completed++;
            break;
          case 'in-progress':
            inProgress++;
            break;
          case 'skipped':
            skipped++;
            break;
          case 'pending':
            pending++;
            break;
        }
      });
    });

    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : '0.0';

    return {
      total,
      completed,
      inProgress,
      skipped,
      pending,
      completionRate,
    };
  };

  // 发送消息
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
  setIsLoading(true);

    try {
      // 计算用户进度
      const userProgress = calculateProgress();

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          history: messages.slice(-6).map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          userProgress, // 发送用户进度信息
        }),
      });

      // 如果后端返回流（response.body 可读），则逐块读取并实时渲染
      if (response.body && typeof response.body.getReader === 'function') {
        setIsStreaming(true);
        setCurrentStream('');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let accumulated = '';

        while (!done) {
          // eslint-disable-next-line no-await-in-loop
          const result = await reader.read();
          done = !!result.done;
          if (result.value) {
            const chunk = decoder.decode(result.value, { stream: true });
            accumulated += chunk;
            setCurrentStream(accumulated);
          }
        }

        // 将完整的流内容作为一条消息加入消息列表
        const aiMessage: Message = {
          role: 'assistant',
          content: accumulated,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        setCurrentStream('');
        setIsStreaming(false);
      } else {
        // 非流式回退
        const data = await response.json();

        if (data.success) {
          const aiMessage: Message = {
            role: 'assistant',
            content: data.reply,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, aiMessage]);
        } else {
          throw new Error(data.error || '请求失败');
        }
      }
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `❌ ${error.message || '抱歉，服务暂时不可用，请稍后再试。'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理Enter键发送
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 快捷问题
  const quickQuestions = [
    '什么是闭包？',
    'Flexbox和Grid有什么区别？',
    '解释一下Promise',
    '如何优化网页性能？',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 悬浮按钮 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
          aria-label="打开AI助手"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
          </span>
        </button>
      )}

      {/* 聊天窗口 */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[400px] h-[600px] flex flex-col border border-gray-200 dark:border-gray-700">
          {/* 头部 */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold flex items-center gap-2">
                  AI学习助手
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Beta</span>
                </h3>
                <p className="text-white/80 text-xs">随时为你解答疑惑</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              aria-label="关闭"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center mt-8">
                <div className="inline-block p-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl mb-4">
                  <Sparkles className="w-12 h-12 text-purple-500" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                  你好！我是AI学习助手 👋
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  我可以帮你：
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left max-w-xs mx-auto">
                  <li>• 解释前端技术概念</li>
                  <li>• 提供代码示例</li>
                  <li>• 推荐学习资源</li>
                  <li>• 回答疑难问题</li>
                </ul>

                {/* 快捷问题 */}
                <div className="mt-6 space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">试试这些问题：</p>
                  {quickQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInput(question);
                      }}
                      className="block w-full text-left px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  } rounded-2xl px-4 py-2.5 shadow-sm`}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div
                        className="whitespace-pre-wrap break-words"
                        dangerouslySetInnerHTML={{
                          __html: formatMessage(message.content),
                        }}
                      />
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap break-words text-sm">
                      {message.content}
                    </p>
                  )}
                  <p
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-white/60' : 'text-gray-400'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* 正在流式生成时的实时预览 */}
            {isStreaming && currentStream && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-2 max-w-[85%]">
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap break-words">
                    <div dangerouslySetInnerHTML={{ __html: formatMessage(currentStream) }} />
                  </div>
                  <span className="ml-1 animate-pulse">▌</span>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">思考中...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 输入框 */}
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入你的问题..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                aria-label="发送"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
              AI助手由SiliconFlow驱动
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// 格式化消息内容（支持代码块等）
function formatMessage(content: string): string {
  // 简单的Markdown处理
  let formatted = content
    // 代码块
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto my-2"><code class="text-sm">${escapeHtml(
        code.trim()
      )}</code></pre>`;
    })
    // 行内代码
    .replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">$1</code>')
    // 粗体
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // 标题
    .replace(/^### (.+)$/gm, '<h3 class="font-bold text-base mt-3 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-bold text-lg mt-3 mb-1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-bold text-xl mt-3 mb-1">$1</h1>')
    // 列表
    .replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>')
    // 换行
    .replace(/\n/g, '<br>');

  return formatted;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

