#!/bin/bash

# 获取端口号参数，默认为 5173
PORT=${1:-5173}

# 检查端口是否被占用
PIDS=$(lsof -ti:$PORT 2>/dev/null)

if [ -n "$PIDS" ]; then
    # 端口被占用，杀掉进程
    echo "$PIDS" | xargs kill -9 2>/dev/null
    echo "✅ 已终止端口 $PORT 的进程 (PID: $PIDS)"
else
    # 端口未被占用
    echo "ℹ️  端口 $PORT 没有被占用"
fi
