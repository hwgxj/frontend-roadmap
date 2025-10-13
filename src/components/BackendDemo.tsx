'use client';

import { useState } from 'react';

export default function BackendDemo() {
  const [saveResult, setSaveResult] = useState<any>(null);
  const [loadResult, setLoadResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 测试保存数据
  const testSave = async () => {
    setLoading(true);
    setSaveResult(null);
    
    try {
      console.log('🚀 开始测试保存...');
      
      const testData = {
        data: [
          {
            id: 'test-1',
            title: '测试分类',
            status: 'in-progress',
            items: [
              {
                id: 'test-item-1',
                title: '测试知识点',
                status: 'completed',
                notes: '这是测试笔记'
              }
            ]
          }
        ]
      };
      
      const response = await fetch('/api/roadmap/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });
      
      const result = await response.json();
      
      console.log('✅ 保存成功：', result);
      setSaveResult(result);
      
    } catch (error) {
      console.error('❌ 保存失败：', error);
      setSaveResult({ 
        success: false, 
        error: error instanceof Error ? error.message : '保存失败' 
      });
    } finally {
      setLoading(false);
    }
  };

  // 测试加载数据
  const testLoad = async () => {
    setLoading(true);
    setLoadResult(null);
    
    try {
      console.log('🚀 开始测试加载...');
      
      const response = await fetch('/api/roadmap/save');
      const result = await response.json();
      
      console.log('✅ 加载成功：', result);
      setLoadResult(result);
      
    } catch (error) {
      console.error('❌ 加载失败：', error);
      setLoadResult({ 
        success: false, 
        error: error instanceof Error ? error.message : '加载失败' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎯 后端管理演示
        </h1>
        <p className="text-gray-600 mb-8">
          这个页面演示如何管理后端 API：保存数据、读取数据、查看日志
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 保存数据 */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              💾 保存数据到服务器
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              点击按钮将测试数据保存到服务器文件系统
            </p>
            <button
              onClick={testSave}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? '保存中...' : '保存测试数据'}
            </button>

            {saveResult && (
              <div className={`mt-4 p-4 rounded-lg ${
                saveResult.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${
                  saveResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {saveResult.success ? '✅ 保存成功' : '❌ 保存失败'}
                </h3>
                <pre className="text-sm text-gray-800 overflow-x-auto">
                  {JSON.stringify(saveResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* 加载数据 */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📤 从服务器加载数据
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              点击按钮从服务器读取之前保存的数据
            </p>
            <button
              onClick={testLoad}
              disabled={loading}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? '加载中...' : '加载服务器数据'}
            </button>

            {loadResult && (
              <div className={`mt-4 p-4 rounded-lg ${
                loadResult.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${
                  loadResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {loadResult.success ? '✅ 加载成功' : '❌ 加载失败'}
                </h3>
                <pre className="text-sm text-gray-800 overflow-x-auto max-h-64 overflow-y-auto">
                  {JSON.stringify(loadResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* 说明部分 */}
        <div className="space-y-4">
          {/* 如何查看后端日志 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-800 mb-3">
              📋 如何查看后端日志？
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
              <li>打开你运行 <code className="bg-yellow-100 px-2 py-1 rounded">npm run dev</code> 的终端窗口</li>
              <li>点击上面的"保存测试数据"或"加载服务器数据"按钮</li>
              <li>在终端中会看到类似这样的日志：
                <pre className="mt-2 bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`📥 [保存API] 收到保存请求
📦 [保存API] 数据大小: 245 bytes
📁 [保存API] 创建数据目录: /path/to/server-data
✅ [保存API] 数据已保存到: /path/to/server-data/roadmap.json
⏰ [保存API] 保存时间: 2025-10-13 15:30:00`}
                </pre>
              </li>
              <li>这些日志证明代码在<strong>服务器端</strong>运行！</li>
            </ol>
          </div>

          {/* 数据保存位置 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-3">
              💾 数据保存在哪里？
            </h3>
            <div className="space-y-2 text-gray-700 text-sm">
              <p>
                <strong>保存位置：</strong> 
                <code className="bg-blue-100 px-2 py-1 rounded ml-2">
                  项目根目录/server-data/roadmap.json
                </code>
              </p>
              <p>
                <strong>文件内容：</strong> JSON 格式的路线图数据
              </p>
              <p>
                <strong>持久化：</strong> 数据会保存在文件中，重启服务器后仍然存在
              </p>
              <p className="mt-3 text-gray-600">
                💡 提示：你可以在项目中找到 <code>server-data</code> 文件夹，打开 <code>roadmap.json</code> 查看保存的数据
              </p>
            </div>
          </div>

          {/* API 文件位置 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-800 mb-3">
              📂 后端代码在哪里？
            </h3>
            <div className="space-y-2 text-gray-700 text-sm">
              <p>
                <strong>API 文件：</strong> 
                <code className="bg-green-100 px-2 py-1 rounded ml-2">
                  src/app/api/roadmap/save/route.ts
                </code>
              </p>
              <p>
                <strong>API 地址：</strong> 
                <code className="bg-green-100 px-2 py-1 rounded ml-2">
                  /api/roadmap/save
                </code>
              </p>
              <p className="mt-3">
                <strong>支持的请求：</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>POST /api/roadmap/save - 保存数据</li>
                <li>GET /api/roadmap/save - 读取数据</li>
              </ul>
            </div>
          </div>

          {/* 管理后端的步骤 */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-semibold text-purple-800 mb-3">
              🎯 管理后端的核心步骤
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
              <li>
                <strong>创建 API 文件：</strong> 在 <code>src/app/api/</code> 下创建文件夹和 <code>route.ts</code>
              </li>
              <li>
                <strong>写处理函数：</strong> 导出 GET、POST 等函数处理请求
              </li>
              <li>
                <strong>添加日志：</strong> 使用 <code>console.log()</code> 查看运行状态
              </li>
              <li>
                <strong>处理数据：</strong> 保存到文件、内存或数据库
              </li>
              <li>
                <strong>返回响应：</strong> 使用 <code>NextResponse.json()</code> 返回结果
              </li>
              <li>
                <strong>测试调试：</strong> 在前端调用，查看终端日志
              </li>
            </ol>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            💡 <strong>提示：</strong> 点击按钮后，记得查看终端（运行 npm run dev 的窗口）的日志输出！
            <br />
            这些日志证明你的代码在服务器端运行。
          </p>
        </div>
      </div>
    </div>
  );
}



