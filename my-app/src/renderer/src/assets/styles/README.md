# CSS模块化结构说明

本项目的CSS已按照功能模块进行拆分，提高了代码的可维护性和组织性。

## 文件结构

```
styles/
├── README.md           # 本说明文件
├── base.css           # 基础样式和CSS变量
├── header.css         # 未来科技感头部样式
├── dashboard.css      # 仪表盘布局和表单控件
├── charts.css         # 图表容器和右键菜单
├── components.css     # 各种组件样式（储罐、图例、能耗等）
├── timeline.css       # 时间轴样式（月度和年度）
├── production.css    # 产量圆环图样式
└── responsive.css    # 响应式设计和增强效果
```

## 模块说明

### base.css
- 包含基础样式重置
- CSS变量定义（未来科技感主题色彩）
- 基本的body和#root样式

### header.css
- 未来科技感NERV指挥中心风格头部样式
- 包含多种动画效果：网格扫描、扫描线、色差效果、数字噪音、数据流等
- 按钮样式和交互效果
- 标题动画和发光效果

### dashboard.css
- 仪表盘内容区布局
- 表单控件样式（输入框、按钮等）
- 仪表盘网格布局背景

### charts.css
- 图表容器样式
- 右键菜单样式
- 柱状图和树状图图例样式

### components.css
- 储罐监控样式
- 能耗消耗监控样式
- 各种UI组件的详细样式

### timeline.css
- 月度停机时间轴样式
- 年度停车时间轴样式
- 时间轴事件和提示框样式

### production.css
- 产量圆环图样式
- 进度条和动画效果
- 数据详情卡片样式

### responsive.css
- 响应式设计媒体查询
- 额外的未来科技感增强效果
- 粒子效果和边框发光效果

## 使用方式

主CSS文件（main.css）通过@import语句引入所有模块：

```css
/* 导入基础样式和CSS变量 */
@import './styles/base.css';

/* 导入未来科技感头部样式 */
@import './styles/header.css';

/* 导入仪表盘布局和表单控件样式 */
@import './styles/dashboard.css';

/* 导入图表容器和右键菜单样式 */
@import './styles/charts.css';

/* 导入各种组件样式（储罐、图例、能耗等） */
@import './styles/components.css';

/* 导入时间轴样式 */
@import './styles/timeline.css';

/* 导入产量圆环图样式 */
@import './styles/production.css';

/* 导入响应式设计和增强效果 */
@import './styles/responsive.css';
```

## 注意事项

1. 所有CSS变量定义在base.css中，确保在使用前已导入
2. 动画效果和交互样式分布在各个模块中，保持功能相关性
3. 响应式设计集中在responsive.css中
4. 未来科技感主题的完整实现分布在多个模块中，共同构建统一的视觉风格

## 维护建议

1. 新增样式时，请根据功能选择合适的模块文件
2. 如需新增模块，请在main.css中添加相应的@import语句
3. 保持模块间的依赖关系清晰，避免循环依赖
4. 定期检查和优化CSS，确保性能和可维护性