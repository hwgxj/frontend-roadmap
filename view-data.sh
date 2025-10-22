#!/bin/bash
echo "📊 学习进度统计："
echo "==============="
cat server-data/progress/default.json | grep -o '"status":"[^"]*"' | sort | uniq -c

echo ""
echo "📝 笔记列表："
echo "==============="
cat server-data/notes/default.json | grep -o '"itemTitle":"[^"]*"' | sed 's/"itemTitle":"//g' | sed 's/"//g' | nl

echo ""
echo "📂 数据文件大小："
echo "==============="
du -h server-data/progress/default.json
du -h server-data/notes/default.json 2>/dev/null || echo "暂无笔记文件"
