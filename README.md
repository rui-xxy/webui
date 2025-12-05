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

Electron 前端位于 `apps/web/src/renderer/src`，现在按功能拆分：

```
features/
├── consumption/          # 电耗、水耗、过氧化氢等消耗看板
├── equipment/            # 设备监控
├── inventory/            # 储罐库存
├── production/           # 产量达成
├── tasks/                # 任务进度
└── trends/               # 产品走势
layout/
└── Header.tsx, Sidebar.tsx
```

新增功能时直接在 `features/<domain>` 目录创建组件，并在 `features/index.ts` 暴露给 `App` 使用，可避免再把文件塞进一个巨大的 `components` 文件夹。
