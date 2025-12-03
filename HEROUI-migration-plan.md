# HeroUI 仪表盘迁移方案

## 1. 项目现状速览

- 当前 Electron + React 应用虽然引入了 `HeroUIProvider`，但 UI 仍依靠大量自定义 DOM/CSS（`src/renderer/src/assets/styles/*.css`）与原生元素，组件拆分不便于主题/暗色模式。
- 仪表盘骨架使用 `react-grid-layout`，每个 widget 直接输出原生 `div` 与类名，头部(`Header`)等核心区域为纯自绘渐变，和 HeroUI 设计体系割裂。
- 产线图、能耗卡、储罐、圆环、年停机等所有卡片自行实现标题、卡片、弹层、按钮，重复逻辑多且未复用 HeroUI 组件与 token。
- 样式散落在多个 CSS 文件，颜色/阴影/间距与 Tailwind/HeroUI token 脱节，难以后续统一风格或扩展。

## 2. 分阶段实施计划

### Phase 1：HeroUI 主题基座

1. 在 `src/renderer/src/App.tsx` 将 `HeroUIProvider` 抽离为 `providers/theme.tsx`（或同级），配置品牌色、半径、字体、暗色策略等 theme token。
2. 清理 `globals.css` 仅保留 `@tailwind` 指令与必要 reset，将颜色等变量迁入 `tailwind.config.js` 与 HeroUI theme。
3. 逐步停用 `src/renderer/src/assets/styles/*.css`，以 Tailwind class + HeroUI token 代替；短期保留必要动画/关键帧，记录到 `theme.md`/注释。

### Phase 2：顶层布局与导航

1. 使用 HeroUI `Navbar` 或 `Card` + `Tabs` 重建 `Header`，将“日报/年报”切换迁入 HeroUI 组件（`ButtonGroup`/`SegmentedControl`），并保留现有 `onReportChange` 逻辑。
2. 在 `DashboardLayout` 中封装 `DashboardCard`（包裹 HeroUI `Card`, `CardHeader`, `CardBody`, `CardFooter`），`draggableHandle` 指向 `CardHeader`，保证与 `react-grid-layout` 兼容。
3. 为每日/年度布局区域添加统一的 HeroUI/Tailwind 间距、背景、滚动条样式，移除旧的 `.layout`, `.dashboard-main` CSS。

### Phase 3：图表容器统一

1. `ProductionLineChart`, `MonthlyTreemap`, `ProductionRingChart`, `YearlyDowntimeTimeline` 等组件改成复用 `DashboardCard`，标题、副标题、统计信息由 HeroUI `Chip`, `Badge`, `Spacer` 组成。
2. 右键菜单、设置面板改用 HeroUI `Dropdown`, `Popover`, `Modal`, `DateRangePicker`，删除 `createPortal` + 自写遮罩与手动定位逻辑，保留交互含义。
3. 统一 Recharts 颜色/字体，使用 HeroUI theme 的变量，封装 `chartColors.ts`，同时确保 Tooltip/Legend 样式与卡片一致。

### Phase 4：交互组件迁移

1. **ConsumptionMonitor**：以 HeroUI `Accordion`/`Collapse` + `Card` 表现单项消耗卡，切换按钮改用 HeroUI `SegmentedControl`；抽象共享 hook 保持 `DashboardLayout` 中高度同步逻辑。
2. **StorageTanks**：用 HeroUI `Grid`, `Card`, `Progress`, `Tooltip` 构建 3 组液位卡，液位动画保留必要 CSS，但外层改 Tailwind/HeroUI 样式。
3. **ProjectStatus**：完全替换为 HeroUI `Card` + `Table` + `Modal` + `Progress` + `useDisclosure`，删除手写 `createPortal` Modal 和 `project-status.css`，保留数据格式。
4. **Yearly/Daily Downtime Timeline**：算法保留，视觉层用 HeroUI `Card`, `Spacer`, `Tooltip`, `Chip`；时间轴可继续用自定义 SVG/CSS，但依赖 Tailwind token，确保 hover/tooltip 统一。

### Phase 5：样式与资产收口

1. 每迁移完一个模块，删除对应旧 CSS，或将残余 util 类迁入 `src/renderer/src/styles/legacy.css` 以备清理；最终移除整个 `assets/styles` 目录。
2. 在根目录记录 `theme.md`/`THEME_NOTES.md`，写明品牌色、渐变、暗色模式策略以及 HeroUI/Tailwind 配置，便于维护。
3. 关注 `react-grid-layout` 的 inline 样式对 HeroUI `Card` 圆角/阴影的影响，如需，在 `DashboardCard` 外加包裹层控制 `overflow`、`border-radius`。

### Phase 6：验证与测试

1. 每阶段完成后运行 `npm run lint`, `npm run typecheck`, `npm run dev`；重点检查日报/年报切换、能耗卡展开、ProjectStatus Modal、时间轴 hover 等交互。
2. Electron 预览 `npm run dev` / `npm run build:unpack` 观察最终打包，确保 HeroUI 样式被正确 tree-shake 且无残余自定义 CSS 影响。
3. 可追加轻量级测试：为关键组件写 React Testing Library smoke test 或 Storybook story，确保迁移前后的 UI 一致；必要时在 QA 测试中截图对比。

## 3. 风险与应对

- **样式冲突**：`react-grid-layout` 注入的 inline 样式可能覆盖 HeroUI `Card` 圆角、阴影。解决：在 `DashboardCard` 中用容器包裹并设置 `overflow: hidden`, `borderRadius`。
- **旧 CSS 变量残留**：若旧 `assets/styles` 中定义的 `:root` 变量与 HeroUI token 冲突，需在 Phase 1 就逐步删除或改名，避免新主题被覆盖。
- **Electron 环境**：`HeroUIProvider` 对 `localStorage`/`document` 的访问需确保仅在 renderer 端执行；如果加了 SSR-like 代码要加守卫。
- **可访问性**：HeroUI 已内建焦点管理，但 `react-grid-layout` 的拖拽节点需手动维护 `aria-grabbed`、`aria-label`；在实现时同步补足。

## 4. 里程碑与交付

| 里程碑 | 内容 | 验收 |
| --- | --- | --- |
| M1 | 完成 HeroUI theme + Header/布局重构 | UI 头部/布局风格统一，旧 CSS 基本停用 |
| M2 | 主要图表卡片迁移并共享 `DashboardCard` | 所有卡片使用 HeroUI Card，交互保持 |
| M3 | 交互组件（能耗、储罐、项目、时间轴）完成迁移 | 旧 `project-status.css` 等删除 |
| M4 | 样式清理与 QA 测试 | 仅保留 Tailwind/HeroUI 样式，lint/typecheck/build 全过 |

## 5. 下一步建议

1. 在执行 Phase 1 前规划主题文档与设计稿，以便统一色彩与组件尺寸。
2. 迁移过程中优先处理共享基础件（`DashboardCard`, `ChartToolbar`, `Modal`），减少重复劳动。
3. 完成迁移后考虑引入 Storybook/Chromatic 做视觉回归，保证后续迭代稳定。

