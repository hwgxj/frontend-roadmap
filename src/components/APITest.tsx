'use client';

import { useState } from 'react';

export default function APITest() {
  const [getResult, setGetResult] = useState<any>(null);
  const [postResult, setPostResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 测试 GET 请求
  const testGet = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      setGetResult(data);
      console.log('✅ GET 请求成功！', data);
    } catch (error) {
      console.error('❌ GET 请求失败：', error);
    } finally {
      setLoading(false);
    }
  };

  // 测试 POST 请求
  const testPost = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: '这是从前端发送的数据',
          timestamp: new Date().toISOString(),
          testData: {
            user: '测试用户',
            action: '测试POST请求'
          }
        })
      });
      const data = await response.json();
      setPostResult(data);
      console.log('✅ POST 请求成功！', data);
    } catch (error) {
      console.error('❌ POST 请求失败：', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎉 后端测试工具
        </h1>
        <p className="text-gray-600 mb-8">
          证明你的 Next.js 项目已经有后端了！
        </p>

        <div className="space-y-6">
          {/* GET 请求测试 */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📥 测试 GET 请求（获取数据）
            </h2>
            <button
              onClick={testGet}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? '请求中...' : '发送 GET 请求'}
            </button>

            {getResult && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">
                  ✅ 后端返回的数据：
                </h3>
                <pre className="text-sm text-gray-800 overflow-x-auto">
                  {JSON.stringify(getResult, null, 2)}
                </pre>
                <p className="text-sm text-gray-600 mt-2">
                  💡 这些数据来自服务器！查看终端可以看到后端日志
                </p>
              </div>
            )}
          </div>

          {/* POST 请求测试 */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📤 测试 POST 请求（发送数据）
            </h2>
            <button
              onClick={testPost}
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? '请求中...' : '发送 POST 请求'}
            </button>

            {postResult && (
              <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-2">
                  ✅ 后端返回的数据：
                </h3>
                <pre className="text-sm text-gray-800 overflow-x-auto">
                  {JSON.stringify(postResult, null, 2)}
                </pre>
                <p className="text-sm text-gray-600 mt-2">
                  💡 后端收到了你发送的数据并处理了！
                </p>
              </div>
            )}
          </div>

          {/* 说明 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-800 mb-2">
              🎯 如何确认后端在工作？
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>点击上面的按钮发送请求</li>
              <li>看到返回的数据（证明后端响应了）</li>
              <li>查看你的<strong>终端</strong>（不是浏览器控制台）</li>
              <li>会看到 "🚀 后端 API 被调用了！" 的日志</li>
              <li>这证明代码在<strong>服务器端</strong>运行！</li>
            </ol>
          </div>

          {/* 技术说明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-2">
              📚 技术说明
            </h3>
            <div className="space-y-2 text-gray-700 text-sm">
              <p>
                <strong>API 文件位置：</strong> 
                <code className="bg-gray-100 px-2 py-1 rounded">
                  src/app/api/test/route.ts
                </code>
              </p>
              <p>
                <strong>API 地址：</strong> 
                <code className="bg-gray-100 px-2 py-1 rounded">
                  http://localhost:3000/api/test
                </code>
              </p>
              <p>
                <strong>运行位置：</strong> Next.js 服务器（当你运行 npm run dev 时启动）
              </p>
              <p>
                <strong>前端和后端：</strong> 在同一个项目中！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



