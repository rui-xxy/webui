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

前端会周期性访问 `GET /api/tanks`，加载 PostgreSQL 中的储罐实时数据。*** End Patch
