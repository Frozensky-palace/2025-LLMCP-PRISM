# PRISM

> **Prompt Refinement & Image Synthesis Manager**
>
> 基于 LLM 的 AI 绘画 Prompt 优化中间层

## 项目简介

PRISM 是一个智能 AI 绘画 Prompt 优化系统，解决用户无法写出高质量 Prompt 的痛点。

### 核心功能

- 🎨 **智能 Prompt 生成**：用户用自然语言描述创意，系统生成专业级详细 Prompt
- 🔄 **多轮迭代优化**：通过 Prompt Diff 机制，精确修改并重新生成
- 📊 **版本管理**：支持历史查看、版本对比、任意回滚

### 技术特点

- 📦 结构化 Prompt Schema 设计
- 🤖 基于 GPT-4o 的 Prompt Engineering
- 🔀 创新的 Prompt Diff 机制
- 🏗️ 前后端分离的现代化架构

## 技术栈

### 后端

- **语言**：Python 3.11+
- **框架**：FastAPI
- **数据库**：PostgreSQL + SQLAlchemy
- **LLM**：OpenAI GPT-4o
- **图像生成**：SeeDream API
- **包管理**：UV

### 前端

- **框架**：Vue 3 + TypeScript
- **构建工具**：Vite
- **状态管理**：Pinia
- **UI 库**：Element Plus
- **包管理**：pnpm

### DevOps

- **容器化**：Docker + Docker Compose
- **数据库**：PostgreSQL 16
- **缓存**：Redis 7

## 快速开始

### 前置要求

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- UV (Python 包管理器)
- pnpm (Node.js 包管理器)

### 后端启动

1. 启动数据库和 Redis：

```bash
docker-compose up -d
```

2. 配置环境变量：

```bash
cd backend
cp .env.example .env
# 编辑 .env 文件，填入你的 API keys
```

3. 安装依赖并启动：

```bash
uv sync
uv run python main.py
```

后端服务将运行在 `http://localhost:8000`

### 前端启动

```bash
cd frontend
pnpm install
pnpm dev
```

前端服务将运行在 `http://localhost:5173`

## 项目结构

```
prism/
├── backend/              # 后端服务
│   ├── app/
│   │   ├── api/         # API 路由
│   │   ├── core/        # 核心业务逻辑
│   │   ├── services/    # 外部服务
│   │   ├── models/      # 数据库模型
│   │   └── schemas/     # Pydantic schemas
│   ├── prompts/         # System Prompt 模板
│   └── main.py          # 主入口
├── frontend/            # 前端应用
│   └── src/
│       ├── components/  # Vue 组件
│       ├── api/         # API 调用
│       ├── stores/      # 状态管理
│       └── views/       # 页面
├── docs/                # 文档
│   └── 项目方案.md      # 完整技术方案
├── storage/             # 图片存储
└── docker-compose.yml   # Docker 配置
```

## API 文档

后端启动后访问：`http://localhost:8000/docs`

## 开发指南

详细的开发指南请查看 [项目方案文档](./docs/项目方案.md)

## 团队

- AptS:1547
- AptS:1548

## License

MIT