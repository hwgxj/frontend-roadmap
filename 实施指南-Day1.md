# Day 1 实施指南

## 上午任务：学习笔记功能（2-3小时）

### ✅ 检查清单
- [ ] 步骤1：修改类型定义（5分钟）
- [ ] 步骤2：修改 DetailPanel（30分钟）
- [ ] 步骤3：修改 KnowledgeCard（15分钟）
- [ ] 步骤4：测试功能（15分钟）
- [ ] 步骤5：Git commit（5分钟）

---

## 步骤1：修改类型定义（5分钟）

**文件**: `src/types/roadmap.ts`

找到 `KnowledgeItem` 接口，在最后添加两个字段：

```typescript
export interface KnowledgeItem {
  id: string;
  title: string;
  status: Status;
  description?: string;
  resources?: Resource[];
  notes?: string;              // 👈 新增
  notesUpdatedAt?: string;     // 👈 新增
}
```

**保存文件** ✅

---

## 步骤2：修改 DetailPanel（30分钟）

**文件**: `src/components/DetailPanel.tsx`

### 2.1 添加导入（如果需要）
确保文件顶部有 `useState` 导入：
```typescript
import { useState } from 'react';
```

### 2.2 在组件内部添加状态

找到 DetailPanel 函数组件内部，在现有的 `useState` 下方添加：

```typescript
export default function DetailPanel({ item, onClose, onUpdateItem }: DetailPanelProps) {
  // ... 现有的代码 ...
  
  // 👇 新增：笔记相关状态
  const [notes, setNotes] = useState(item.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // 👇 新增：保存笔记函数
  const handleSaveNotes = () => {
    onUpdateItem({
      ...item,
      notes: notes,
      notesUpdatedAt: new Date().toISOString(),
    });
    setIsEditingNotes(false);
  };

  // ... 继续现有的代码 ...
```

### 2.3 添加笔记编辑区域

在 JSX 中，找到学习资源部分的结束位置（通常在 `</div>` 之前），添加以下代码：

```typescript
      {/* 👇 新增：学习笔记区域 */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            📝 学习笔记
          </h3>
          {!isEditingNotes && (
            <button
              onClick={() => setIsEditingNotes(true)}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium transition"
            >
              {notes ? '编辑' : '添加笔记'}
            </button>
          )}
        </div>

        {isEditingNotes ? (
          <div className="space-y-3">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="记录你的学习心得、遇到的问题、重点知识等..."
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setNotes(item.notes || '');
                  setIsEditingNotes(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg transition"
              >
                取消
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                保存笔记
              </button>
            </div>
          </div>
        ) : (
          <div>
            {notes ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{notes}</p>
                {item.notesUpdatedAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    最后更新: {new Date(item.notesUpdatedAt).toLocaleString('zh-CN')}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                暂无笔记，点击"添加笔记"开始记录
              </p>
            )}
          </div>
        )}
      </div>
```

**保存文件** ✅

---

## 步骤3：修改 KnowledgeCard（15分钟）

**文件**: `src/components/KnowledgeCard.tsx`

### 3.1 在组件开头添加判断

```typescript
export default function KnowledgeCard({ item, onClick }: KnowledgeCardProps) {
  // 👇 新增：检查是否有笔记
  const hasNotes = item.notes && item.notes.length > 0;

  // ... 现有代码 ...
```

### 3.2 修改卡片内容显示

找到显示 `item.title` 的部分，将其包装在 flex 容器中：

```typescript
<div
  onClick={onClick}
  className={/* 保持现有的 className */}
>
  {/* 👇 修改：包装标题和图标 */}
  <div className="flex items-start justify-between gap-2">
    <span className={/* 保持现有的 className，通常是显示标题的样式 */}>
      {item.title}
    </span>
    
    {/* 👇 新增：笔记图标 */}
    {hasNotes && (
      <span 
        className="text-yellow-500 text-sm flex-shrink-0" 
        title="有笔记"
      >
        📝
      </span>
    )}
  </div>
  
  {/* 保持其他现有内容不变 */}
</div>
```

**保存文件** ✅

---

## 步骤4：测试功能（15分钟）

### 4.1 启动开发服务器

```bash
npm run dev
```

### 4.2 测试流程

1. **打开浏览器** http://localhost:3000

2. **点击任意知识点卡片**
   - 应该能看到详情面板打开

3. **测试添加笔记**
   - 在详情面板底部看到"📝 学习笔记"区域
   - 点击"添加笔记"按钮
   - 输入一些文字
   - 点击"保存笔记"

4. **验证笔记已保存**
   - 应该能看到笔记内容显示
   - 关闭详情面板
   - 卡片右上角应该显示 📝 图标

5. **测试编辑笔记**
   - 重新打开同一个知识点
   - 点击"编辑"按钮
   - 修改笔记内容
   - 点击"保存笔记"

6. **测试数据持久化**
   - 刷新页面（F5）
   - 重新打开该知识点
   - 笔记应该还在

### 4.3 可能遇到的问题

**问题1**: 编译错误 - 找不到 notes 属性
**解决**: 确保 `src/types/roadmap.ts` 中已添加 `notes?` 字段

**问题2**: 笔记保存后没有显示
**解决**: 检查 `onUpdateItem` 函数是否正确调用

**问题3**: 刷新后笔记丢失
**解决**: 确保 localStorage 正常工作（检查浏览器控制台）

---

## 步骤5：Git Commit（5分钟）

```bash
# 查看修改
git status

# 添加修改的文件
git add src/types/roadmap.ts
git add src/components/DetailPanel.tsx
git add src/components/KnowledgeCard.tsx

# 提交
git commit -m "feat: 添加学习笔记功能

- 为知识点添加笔记字段
- 在详情面板中实现笔记编辑器
- 在卡片上显示笔记图标
- 支持笔记的添加、编辑和保存
- 笔记数据自动持久化到 localStorage"

# 推送到远程（如果有）
git push
```

---

## ✅ 上午任务完成！

恭喜！你已经完成了第一个功能。现在：

- ✅ 学习笔记功能已实现
- ✅ 代码已提交到 Git
- ✅ 功能经过测试
- ✅ 准备好进入下午任务

---

## 下午任务预告

**数据可视化**：
- 安装 recharts
- 创建图表组件
- 添加标签页切换
- 展示学习数据分析

预计时间：2-3小时

---

## 💡 提示

- 每完成一个步骤就打勾 ✅
- 遇到问题先看"可能遇到的问题"部分
- 不确定的地方随时问我
- 不要跳步骤，按顺序来

**休息一下，准备下午的任务！** ☕

