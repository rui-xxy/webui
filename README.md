# 日报表平台

```
├── my-app                # React Web 前端
├── apps
│   └── server            # 新增 Node/Express 后端
├── database              # 数据库脚本
└── docs                  # 设计/迁移文档
```

## 快速开始

1. **后端**
   ```bash
   cd apps/server
   cp .env.example .env
   npm install
   npm run dev
   ```
   如果数据库尚未创建储罐表，执行 `database/tank_inventory.sql`。

2. **前端**
   ```bash
   cd my-app
   cp .env.example .env   # 设置 VITE_API_BASE_URL
   npm install
   npm run dev
   ```

前端会周期性访问 `GET /api/tanks`，加载 PostgreSQL 中的储罐实时数据。

## 前端代码结构

Web 端全部代码位于 `my-app/src`：

```
src/
├── components/      # 仪表板模块（任务概览、储罐、用能等）
├── providers/       # 主题、上下文提供者
├── theme/           # Tailwind/HeroUI 主题扩展
├── App.tsx          # 布局与网格
├── main.tsx         # 程序入口
└── globals.css      # 全局样式
```

后续扩展新模块时，建议直接在 `components/` 下创建子目录或迁移到 `components/<feature>`，便于长期维护。
