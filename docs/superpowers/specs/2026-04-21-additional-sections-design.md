# 个人网站附加板块设计文档

**日期：** 2026-04-21  
**作者：** 毛睿平 (Maropion)  
**文件：** `D:\个人网站\index v3.html`

---

## 1. 目标与背景

在现有 `index v3.html` 的英雄区（已含自我介绍、头像、统计条）基础上，向页面追加 4 个滚动板块，使访客能完整了解作品、服务能力、职业经历并完成联系。

导航栏锚链接（`#projects` / `#services` / `#career` / `#contact`）已存在，点击后通过 `scroll-behavior: smooth` 平滑定位到对应板块。

---

## 2. 全局设计约定

- **页面结构：** 单页滚动，所有新增板块追加在 `stats-strip` 之后、`</body>` 之前。
- **视觉风格：** 延续首页液态玻璃风格；新增 section 容器用 `rgba(255,255,255,.07)` 背景 + `backdrop-filter:blur(24px)` + 内顶高光 `inset 0 1px 0 rgba(255,255,255,.22)`。
- **色彩系统：** 沿用 CSS 变量 `--pink:#FF8FAB` / `--blue:#6CB8E8` / `--yellow:#FFCA5F`，新增 `--purple:#c084fc`（用于学术项目与经历高亮）。
- **字体：** 标题 `--serif`（Instrument Serif），正文 `--sans`（Barlow / Noto Sans SC）。
- **动效：** 使用已有 `.reveal` + IntersectionObserver 方案，新增 `.reveal` class 实现滚动进入淡入上移。
- **双语：** 所有文案使用 `data-i18n="zh:…;en:…"` 属性，由已有 `applyI18n()` 函数处理。
- **背景：** `#bg-scene` Canvas Aurora 全程 `position:fixed`，无需每板块重绘。

---

## 3. 板块详细设计

### 3.1 作品集 · Projects (`#projects`)

**布局：** 中央垂直时间轴，左右交替排列项目卡片（奇数项：左截图右文字；偶数项：左文字右截图）。时间轴线渐变色 `#FF8FAB → #6CB8E8 → #FFCA5F → #c084fc`，每项节点为8px圆点。

**项目列表（共4项）：**

| # | 项目名 | 截图文件 | 时间 | 链接 |
|---|--------|----------|------|------|
| 1 | Spirit Construct · 灵构 | `references/spirit-construct-first.png` | 2026-01 至今 | https://spirit-construct-maropion.top/ · GitHub: Maropion03/Spirit-Construct-AIPM-stack |
| 2 | PRD 智能评审工作台 | `references/评审助手页.png` | 2026-01 – 2026-03 | https://awesome-requirement-review-agent-production.up.railway.app/ · GitHub: Maropion03/awesome-requirement-review-agent |
| 3 | LLM Eval Studio | `references/LLM评测平台.png` | 2025-11 – 2026-03 | 无线上链接 |
| 4 | 上市公司财务舞弊识别研究 | 文字摘要卡（无截图）| 2025-11 – 2026-03 | 核心研究员·学术 |

**每个项目卡包含：**
- 截图区（`border-radius:12px`，`object-fit:cover`，点击可放大或跳转）
- 时间标签（彩色小标签）
- 项目名（`font-weight:700`）
- 一句话描述（≤ 40 字）
- 技术标签徽章（`border-radius:999px`，各项目颜色对应主色）
- 链接按钮：线上演示 + GitHub（学术项目无链接，显示"核心研究员"标注）

**第4项学术项目**：左侧替换为摘要文字块（论文题目、关键词、F1指标结论），右侧文字区正常。

---

### 3.2 服务 · Services (`#services`)

**布局：** 4列等宽玻璃卡片网格，移动端折叠为 2×2。

**服务项目：**

| 图标 | 标题 | 副标题 |
|------|------|--------|
| 🤖 | AI产品规划 | 需求挖掘、PRD撰写、MVP敏捷迭代与用户体验设计 |
| ✏️ | Prompt Engineering | CoT/Few-shot调优、Agent协同设计与LLM能力边界评估 |
| 📊 | 数据分析 | Python/Pandas/ML建模、用户洞察与机器学习文本挖掘 |
| 🔍 | 竞品分析 | 20+竞品深度调研，定价策略与差异化产品定位建议 |

每张卡：大图标（`font-size:2rem`） + 标题（`font-weight:700`） + 2行描述，悬停时卡片轻微上移 + 发光光晕。

---

### 3.3 经历 · Career (`#career`)

**布局：** 竖向时间线，从新到旧排列。左侧2px渐变线，每项有8px彩色圆点节点，右侧卡片（玻璃风格）。

**经历列表（共5项，按时间倒序）：**

| 时间 | 公司/机构 | 职位 | 节点色 | 关键内容 |
|------|-----------|------|--------|----------|
| 2026-04 至今 | 上海守扣科技 | AI产品经理 | `--pink` | 落地页改版、多语言产品规划、竞品调研、OCR技术跟进 |
| 2026-01 – 2026-03 | 广州安点科技 | AI产品经理 | `--blue` | PRD智能评审工作台从0到1，CrewAI·FastAPI·Docker |
| 2025-09 – 2025-11 | 国泰海通证券 | 行业研究 | `--yellow` | 三峡新能源千亿级发债前财务核查，ML偿债模型，1.70%债券定价 |
| 2025-07 – 2025-09 | 美团-点评事业部 | 产品运营（AI/风控）| `--purple` | 小红书AI Agent V35·CoT+Few-Shot提效50%·黑灰产情报网 |
| 2024-06 – 2024-09 | 信永中和会计师事务所 | 审计实习生 | `rgba(255,255,255,.3)` | 数据聚类仓库盘点、BI工具15家子公司可视化全景看板 |

每张经历卡：时间标签（右上角彩色） + 公司名·职位（加粗白色） + 2-3个关键词亮点（`--muted` 颜色）。技能标签徽章可选（与项目板块保持一致风格）。

---

### 3.4 联系 · Contact (`#contact`)

**布局：** 居中 CTA，页面底部压轴。

**内容：**
- 大标题：「有想法？一起聊聊」（英文：`Got an idea? Let's talk.`）
- 副标题：「无论是合作、咨询还是打招呼，我都很乐意回复」
- 主按钮：「发邮件给我」→ `mailto:maropion@163.com`（粉色实心按钮）
- 4个图标链接卡（玻璃风格圆角卡片）：
  - 📧 `maropion@163.com` → `mailto:maropion@163.com`
  - 💬 微信：`MRP18565682722`（点击复制）
  - 🐱 GitHub → `https://github.com/Maropion03`
  - 💼 LinkedIn → `https://www.linkedin.com/in/ruiping-mao-5521273a5/`
- Footer 小字：`© 2026 毛睿平 · Maropion · Built with ☁️`

---

## 4. 资产清单

| 文件 | 用途 | 状态 |
|------|------|------|
| `references/spirit-construct-first.png` | 灵构项目截图 | ✅ 已有 |
| `references/评审助手页.png` | PRD工作台截图 | ✅ 已有 |
| `references/LLM评测平台.png` | Eval Studio截图 | ✅ 已有 |
| `avatar.jpg` | About板块头像（已去除） | N/A |

---

## 5. 技术实现要点

1. **新增 CSS 变量：** `--purple:#c084fc`，添加到 `:root`。
2. **通用 Section 容器样式：** `.section-wrap` — `max-width:1100px; margin:0 auto; padding:100px clamp(24px,5vw,80px)`。
3. **Section 标题组：** 小号分类标签（字母间距 3px，颜色对应主色）+ 大号中文标题 + 可选副标题。
4. **时间线组件（Projects + Career 共用）：** `display:grid; grid-template-columns:1fr 2px 1fr`，中列为渐变线，每项节点用 `::before` 伪元素或内联 `div`。
5. **图片懒加载：** `<img loading="lazy">` 防止首屏阻塞。
6. **微信复制功能：** 点击微信卡片执行 `navigator.clipboard.writeText('MRP18565682722')` 并临时显示「已复制」提示。
7. **无障碍：** 所有图标链接加 `aria-label`，图片加 `alt`。

---

## 6. 不在本次范围内

- 移动端汉堡菜单（导航栏移动端已隐藏 `.nav-links`，本次不改动）
- 项目详情弹窗/跳转页（本次仅展示卡片）
- 后端表单处理（联系板块只用 `mailto:`）
- 性能优化（图片 WebP 转换等）
