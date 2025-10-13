# 前端知识路线图 Frontend Roadmap

一个功能完善的前端开发知识学习进度管理系统，帮助你系统化地学习和追踪前端技术栈。

![Preview](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat&logo=tailwindcss)

## ✨ 核心功能

### 📊 学习进度管理
- **4种学习状态**：待定、进行中、已完成、已跳过
- **实时统计**：总知识点数、完成数、完成率等关键指标
- **进度可视化**：直观的进度条和统计卡片
- **状态分布**：清晰展示各状态的知识点数量

### 🔍 搜索和筛选
- **实时搜索**：快速查找知识点，支持标题和描述搜索
- **状态筛选**：按学习状态筛选知识点
- **智能过滤**：自动隐藏无匹配项的分类

### 💾 数据管理
- **本地存储**：数据自动保存在浏览器 localStorage 中
- **数据导出**：导出学习进度为 JSON 文件
- **数据导入**：从 JSON 文件恢复学习进度
- **一键重置**：清空所有数据重新开始

### 🎨 用户界面
- **可视化路线图**：清晰展示前端学习路径
- **下拉式状态选择**：点击卡片直接选择状态
- **详情面板**：查看知识点详细描述和学习资源
- **现代化设计**：使用 Tailwind CSS 打造美观界面
- **响应式布局**：完美支持桌面和移动设备

### 📚 知识体系
- **14个技术分类**：涵盖前端开发全栈技能
- **80+知识点**：从基础到进阶的完整学习路径
- **详细描述**：每个知识点都有说明
- **学习资源**：提供外部学习资源链接

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建生产版本

```bash
npm run build
npm start
```

## 📖 使用说明

### 1. 查看学习统计

在页面顶部可以看到：
- 总知识点数
- 已完成数量
- 学习中数量
- 已跳过数量
- 整体完成率和进度条

### 2. 搜索和筛选

使用搜索栏快速查找知识点：
```
输入关键词 → 实时搜索标题和描述
选择状态 → 按学习状态筛选
```

### 3. 管理学习状态

点击任意知识点卡片：
1. 打开右侧详情面板
2. 查看详细描述和学习资源
3. 点击顶部下拉菜单选择状态
4. 状态立即更新并自动保存

**4种学习状态**：
- 🟡 **待定 (pending)**: 黄色 - 尚未开始学习
- 🟣 **进行中 (in-progress)**: 紫色 - 正在学习中
- ⚪ **已完成 (completed)**: 灰色 + ✓ - 已掌握
- 🔵 **已跳过 (skipped)**: 深青色 + ✓ - 已跳过

### 4. 数据备份和恢复

**导出数据**：
- 点击"导出"按钮
- 下载 JSON 文件到本地
- 文件名格式：`frontend-roadmap-2024-01-01.json`

**导入数据**：
- 点击"导入"按钮
- 选择之前导出的 JSON 文件
- 数据自动恢复

**重置数据**：
- 点击"重置"按钮
- 确认后清空所有学习进度

### 添加知识点

编辑 `src/data/roadmapData.ts` 文件来添加新的知识点或分类：

```typescript
{
  id: 'react',
  title: 'React',
  status: 'pending',
  items: [
    { id: 'react-1', title: 'Components and Props', status: 'pending' },
    { id: 'react-2', title: 'State and Lifecycle', status: 'pending' },
  ],
}
```

## 🛠️ 技术栈

### 核心技术
- **框架**: [Next.js 15.5](https://nextjs.org/) - React 全栈框架
- **UI库**: [React 19](https://react.dev/) - 最新版本 React
- **语言**: [TypeScript](https://www.typescriptlang.org/) - 类型安全
- **样式**: [Tailwind CSS 4](https://tailwindcss.com/) - 原子化 CSS
- **图标**: [Lucide React](https://lucide.dev/) - 现代图标库

### 技术亮点
- ✅ **自定义 Hooks**：useLocalStorage 封装本地存储逻辑
- ✅ **React.useMemo**：优化搜索和筛选性能
- ✅ **TypeScript 类型安全**：完整的类型定义和接口
- ✅ **组件化设计**：高度模块化的组件架构
- ✅ **响应式设计**：移动端和桌面端完美适配
- ✅ **数据持久化**：localStorage 自动保存
- ✅ **用户体验优化**：平滑动画、即时反馈

## 📁 项目结构

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 主页入口
│   └── globals.css          # 全局样式和动画
├── components/              # React 组件
│   ├── Roadmap.tsx         # 主路线图容器（状态管理）
│   ├── StatisticsPanel.tsx # 学习统计面板
│   ├── SearchBar.tsx       # 搜索和筛选栏
│   ├── ActionBar.tsx       # 操作栏（导入/导出/重置）
│   ├── CategoryCard.tsx    # 分类卡片
│   ├── KnowledgeCard.tsx   # 知识点卡片
│   └── DetailPanel.tsx     # 详情面板（状态选择）
├── hooks/                   # 自定义 Hooks
│   └── useLocalStorage.ts  # 本地存储 Hook
├── data/                    # 数据源
│   └── roadmapData.ts      # 14个分类，80+知识点
└── types/                   # TypeScript 类型定义
    └── roadmap.ts          # 数据结构接口
```

## 🎯 已实现功能 ✅

- [x] 本地存储学习进度（localStorage）
- [x] 学习统计和数据可视化
- [x] 搜索和筛选功能
- [x] 数据导入导出（JSON）
- [x] 下拉式状态选择器
- [x] 详情面板和资源链接
- [x] 响应式设计
- [x] TypeScript 类型安全

## 🚀 未来计划

- [ ] 学习笔记功能
- [ ] 数据可视化图表（Recharts）
- [ ] 学习计划和提醒
- [ ] 深色模式切换
- [ ] 国际化支持（i18n）
- [ ] 用户认证系统
- [ ] 云端数据同步
- [ ] AI 学习建议
- [ ] PWA 支持
- [ ] 单元测试覆盖

## 🌟 项目特色

### 为什么选择这个项目？

1. **完整的功能实现**
   - 不仅是静态展示，而是真正可用的学习管理工具
   - 数据持久化、搜索筛选、统计分析等实用功能

2. **现代化技术栈**
   - Next.js 15 + React 19 最新技术
   - TypeScript 保证代码质量
   - 自定义 Hooks 展示 React 最佳实践

3. **工程化实践**
   - 组件化设计，代码高度复用
   - 类型安全，避免运行时错误
   - 性能优化（useMemo、useCallback）

4. **用户体验优先**
   - 直观的交互设计
   - 平滑的动画效果
   - 完善的反馈机制

## 📝 开发笔记

### 关键技术实现

**1. 本地存储 Hook**
```typescript
// 自定义 Hook 封装 localStorage 逻辑
useLocalStorage('key', initialValue)
// 自动保存，自动读取，错误处理
```

**2. 搜索筛选优化**
```typescript
// 使用 useMemo 避免不必要的计算
const filteredData = useMemo(() => {
  // 搜索和筛选逻辑
}, [data, searchTerm, filterStatus]);
```

**3. 状态管理模式**
```typescript
// 不可变更新模式
setData(prevData => prevData.map(item => 
  item.id === id ? { ...item, status: newStatus } : item
))
```

## 📄 许可证

MIT License

## 👨‍💻 作者

如果这个项目对你有帮助，欢迎 Star ⭐️

---

基于 [Next.js](https://nextjs.org) 构建 | 使用 ❤️ 和 TypeScript 开发
