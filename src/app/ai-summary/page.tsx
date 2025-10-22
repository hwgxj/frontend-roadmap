'use client';

import { useState } from 'react';
import { getAISummary } from '@/lib/api-client';

export default function AISummaryPage() {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const loadSummary = async () => {
    setIsLoading(true);
    try {
      const result = await getAISummary();
      if (result.success && result.data && result.data.summary) {
        setSummary(result.data.summary);
      }
    } catch (error) {
      console.error('加载摘要失败:', error);
      setSummary('加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  const copySummary = () => {
    navigator.clipboard.writeText(summary);
    alert('✅ 已复制到剪贴板！可以粘贴给AI了');
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🤖 AI 友好的学习进度摘要</h1>
        <p className="text-gray-600">
          生成详细的学习进度报告，让AI能准确了解你的学习情况
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={loadSummary}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition-colors"
        >
          {isLoading ? '生成中...' : '生成AI摘要'}
        </button>

        {summary && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={copySummary}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                📋 复制摘要（给AI看）
              </button>
              <button
                onClick={() => setSummary('')}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                清除
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
                {summary}
              </pre>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>使用方法：</strong>
              </p>
              <ol className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1 list-decimal list-inside">
                <li>点击上方"📋 复制摘要"按钮</li>
                <li>打开与AI的对话窗口</li>
                <li>粘贴这段摘要</li>
                <li>AI就能看到你具体完成/学习/跳过了哪些知识点！</li>
              </ol>
            </div>
          </div>
        )}

        {!summary && !isLoading && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">
              📌 这个功能解决什么问题？
            </h3>
            <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
              <p>
                <strong>问题：</strong>AI 只能看到统计数字（如"完成25个"），但不知道具体是哪25个知识点。
              </p>
              <p>
                <strong>解决：</strong>这个API生成详细的、AI易读的摘要，包含：
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>✅ 已完成的具体知识点清单</li>
                <li>🔄 正在学习的具体知识点清单</li>
                <li>⏭️ 已跳过的具体知识点清单</li>
                <li>📚 每个分类的详细进度</li>
              </ul>
              <p className="mt-3">
                <strong>效果：</strong>AI能准确回答"我HTML学了哪些"、"JavaScript还有哪些没学"等问题！
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

