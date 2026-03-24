# 自治配送 · Web 前端

自治调度与交付管理应用的浏览器端界面。技术栈：**Vite 5**、**React 18**、**TypeScript**、**Ant Design 5**、**React Router 6**。

## 环境要求

- **Node.js**：建议 **18.x 或 20.x LTS**（与当前 Vite / TypeScript 工具链兼容）。
- **npm**：仓库已包含 `package-lock.json`。团队协作与 CI 推荐使用 **`npm ci`** 以锁定依赖版本。

## 安装依赖

在仓库根目录进入 `frontend` 后执行：

```bash
cd frontend
npm ci
```

**说明：**

- `npm ci` 会按 `package-lock.json` 安装，删除现有 `node_modules` 后重装，适合可复现构建。
- 若本地尚无 lockfile、或你需要增删依赖，请使用 `npm install`（并提交更新后的 `package-lock.json`）。

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器（默认一般为 `http://localhost:5173`）。 |
| `npm run build` | 运行 `tsc -b` 类型检查并执行 `vite build`，产物在 `frontend/dist/`。 |
| `npm run preview` | 在本地预览生产构建（需先 `npm run build`）。 |

## 项目结构（`src/`）

```
src/
├── main.tsx              # 入口：BrowserRouter、Providers、AuthProvider、路由
├── app/
│   ├── router.tsx        # 路由表（公开页 / 受保护布局 + 子路由）
│   └── providers.tsx     # Ant Design ConfigProvider（主题、中文）、App 容器
├── pages/                # 路由级页面（薄层，组装 features / components）
│   ├── auth/
│   ├── order/
│   ├── checkout/
│   ├── tracking/
│   ├── history/
│   └── profile/
├── features/             # 按业务域拆分的智能组件（当前多为占位，随 UIBacklog 落地）
│   ├── auth/
│   ├── address/
│   ├── package/
│   ├── recommendations/
│   ├── checkout/
│   ├── tracking/
│   ├── history/
│   └── postDelivery/
├── components/
│   ├── layout/           # 如 AppShell（侧栏 + Outlet）
│   ├── common/           # 通用 UI（如加载态）
│   └── auth/             # 如 ProtectedRoute
├── context/              # 全局状态（如 AuthContext）
├── theme/                # antd ThemeConfig
├── hooks/                # 自定义 Hook
├── services/             # API / 第三方 SDK 封装（Maps、Stripe 等）
├── types/                # 共享类型
└── assets/               # 静态资源
```

更完整的**分层职责、依赖约定与运行时示意图**见仓库根目录 [UIBacklog.md](../UIBacklog.md) 中的 **「前端架构设计（`frontend/`）」** 一节。

## 开发提示

- **路径别名**：`@` 指向 `src/`（见 `vite.config.ts` 与 `tsconfig.app.json`），例如 `import x from '@/app/router'`。
- **认证**：当前为前端占位实现（`sessionStorage` 模拟登录），用于走通 MVP 路由；对接后端时请改为 JWT / Cookie 等与 API 契约一致的方案。

## 相关文档

- [UIBacklog.md](../UIBacklog.md) — UI 待办与前端架构
- [ProductBacklog.md](../ProductBacklog.md) — 产品用户故事
- [SprintReleasePlan.md](../SprintReleasePlan.md) — 冲刺计划
