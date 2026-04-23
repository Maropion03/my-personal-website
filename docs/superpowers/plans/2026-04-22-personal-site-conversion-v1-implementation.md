# Personal Site Conversion V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不推翻现有视觉风格的前提下，完成“求职主目标 + 接单副目标”的转化优化落地，并落实已确认的三条信息（求职倾向文案、评审时长 5min、AI workflow 节省 70%）。

**Architecture:** 继续保持单文件页面 `index v3.html` 架构；通过小范围 HTML/CSS 文案与样式改动完成信息层级重排；通过轻量前端埋点函数采集 CTA 点击数据，不引入后端依赖。

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript, PowerShell（本地校验）

---

### Task 1: Hero 区“求职倾向”信息落地（小一号展示）

**Files:**
- Modify: `D:\个人网站\index v3.html`
- Test: `D:\个人网站\index v3.html`（本地浏览器手测 + 文本检索）

- [ ] **Step 1: 写一个失败校验（先确认当前缺少目标文案）**

```powershell
Select-String -Path 'D:\个人网站\index v3.html' -Pattern '求职倾向：面试 / 内推（主）' -SimpleMatch
```

Expected: 无输出（当前尚未落地或不一致）。

- [ ] **Step 2: 在 Hero Bio 下方增加“求职倾向”微文案**

```html
<p class="hero-intent-note reveal d3">求职倾向：面试 / 内推（主），同时承接 AI workflow 与网页开发项目（副）</p>
```

放置位置：`#hero .hero-left` 区域，建议在 `.hero-bio` 后、`.skill-chips` 前。

- [ ] **Step 3: 增加小一号样式（12-13px）**

```css
.hero-intent-note{
  margin-top:8px;
  margin-bottom:20px;
  font-size:12px;
  line-height:1.5;
  color:rgba(255,255,255,.56);
  letter-spacing:.02em;
}
```

- [ ] **Step 4: 运行校验确认文案与样式已存在**

```powershell
Select-String -Path 'D:\个人网站\index v3.html' -Pattern 'hero-intent-note|求职倾向：面试 / 内推（主）' -AllMatches
```

Expected: 至少命中 2 条（CSS 选择器 + HTML 文案）。

- [ ] **Step 5: Commit**

```bash
git add "D:/个人网站/index v3.html"
git commit -m "feat: add hero job-intent microcopy with smaller typography"
```

---

### Task 2: 作品与经历中的关键结果指标改写（5min / 70%）

**Files:**
- Modify: `D:\个人网站\index v3.html`
- Test: `D:\个人网站\index v3.html`

- [ ] **Step 1: 写失败校验（先验证目标指标文案未完整命中）**

```powershell
Select-String -Path 'D:\个人网站\index v3.html' -Pattern '评审平均时长 5min|AI workflow 平均节省 70%' -AllMatches
```

Expected: 至少有一条未命中。

- [ ] **Step 2: 在“PRD 智能评审工作台”项目中替换/补充结果句**

```html
<li>评审平均时长压缩至 5min，支持快速复核与多轮迭代。</li>
```

放置位置：相关项目描述或 career bullet 中“效率提升”语句所在位置，避免重复表达。

- [ ] **Step 3: 在 workflow 相关内容补充 70% 节省口径**

```html
<li>AI workflow 平均节省 70% 人工耗时，提升需求评审与交付效率。</li>
```

优先落点：`services` 的 Harness/Workflow 相关卡片或 `projects` 对应案例描述。

- [ ] **Step 4: 运行校验确认两条指标都已存在**

```powershell
Select-String -Path 'D:\个人网站\index v3.html' -Pattern '评审平均时长压缩至 5min|AI workflow 平均节省 70% 人工耗时' -AllMatches
```

Expected: 两条都命中。

- [ ] **Step 5: Commit**

```bash
git add "D:/个人网站/index v3.html"
git commit -m "feat: update conversion metrics copy to 5min review and 70% workflow savings"
```

---

### Task 3: 联系区优先级与 CTA 文案一致化（微信/LinkedIn 优先）

**Files:**
- Modify: `D:\个人网站\index v3.html`
- Test: `D:\个人网站\index v3.html`

- [ ] **Step 1: 写失败校验（先查主 CTA 是否不一致）**

```powershell
Select-String -Path 'D:\个人网站\index v3.html' -Pattern '聊一聊|聊合作|Let''s talk|Send me an email' -AllMatches
```

Expected: 命中多个不同口径（表示尚未统一）。

- [ ] **Step 2: 统一主 CTA 文案为单一动作**

```html
<a href="mailto:maropion@163.com" class="nav-cta">加微信沟通</a>
```

同时将 Hero 主按钮、Contact 主按钮口径统一为同一中文动作词（英文可保留对应翻译）。

- [ ] **Step 3: 联系卡顺序调整为 微信 -> LinkedIn -> 邮箱 -> GitHub**

```html
<!-- 联系卡容器内按顺序重排节点 -->
```

保持现有 hover 与尺寸，不做大幅视觉改造。

- [ ] **Step 4: 运行校验确认 CTA 统一和顺序调整**

```powershell
Select-String -Path 'D:\个人网站\index v3.html' -Pattern '加微信沟通|LinkedIn|maropion@163.com|Maropion03' -AllMatches
```

Expected: 主 CTA 统一文案命中；联系区顺序在源码中与目标一致。

- [ ] **Step 5: Commit**

```bash
git add "D:/个人网站/index v3.html"
git commit -m "feat: unify primary CTA copy and prioritize wechat/linkedin contacts"
```

---

### Task 4: 轻量埋点（CTA 点击事件）接入

**Files:**
- Modify: `D:\个人网站\index v3.html`
- Test: `D:\个人网站\index v3.html`（浏览器控制台）

- [ ] **Step 1: 写失败校验（检查是否已有统一 track 函数）**

```powershell
Select-String -Path 'D:\个人网站\index v3.html' -Pattern 'function trackEvent\\(|window\\.dataLayer|cta_click_' -AllMatches
```

Expected: 无统一实现或覆盖不足。

- [ ] **Step 2: 新增统一埋点函数（失败不阻断）**

```javascript
function trackEvent(eventName, payload){
  try{
    const data = { event: eventName, ...payload, ts: Date.now() };
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push(data);
    } else {
      console.info('[track]', data);
    }
  }catch(e){
    // silent fail
  }
}
```

- [ ] **Step 3: 为核心 CTA 绑定点击事件**

```javascript
trackEvent('cta_click_wechat', { section:'contact', lang:document.documentElement.lang });
trackEvent('cta_click_linkedin', { section:'contact', lang:document.documentElement.lang });
trackEvent('cta_click_email', { section:'contact', lang:document.documentElement.lang });
trackEvent('cta_click_cv_download', { section:'hero', lang:document.documentElement.lang });
```

绑定点：微信按钮、LinkedIn 卡片、邮件按钮、简历下载按钮。

- [ ] **Step 4: 浏览器手动验证**

```text
1) 打开页面，按 F12
2) 点击上述 CTA
3) 在 Console 观察 [track] 日志或 dataLayer 事件
```

Expected: 每次点击至少出现一条对应事件。

- [ ] **Step 5: Commit**

```bash
git add "D:/个人网站/index v3.html"
git commit -m "feat: add lightweight CTA tracking events for conversion funnel"
```

---

### Task 5: 微信二维码弹层预留位（不发布视觉，仅留接口）

**Files:**
- Modify: `D:\个人网站\index v3.html`
- Test: `D:\个人网站\index v3.html`

- [ ] **Step 1: 添加占位容器与关闭机制（默认隐藏）**

```html
<div id="wechatQrModal" class="wechat-qr-modal" aria-hidden="true" hidden>
  <div class="wechat-qr-dialog">
    <button type="button" id="wechatQrClose">×</button>
    <p>二维码待补充</p>
  </div>
</div>
```

- [ ] **Step 2: 增加最小样式（不影响当前页面）**

```css
.wechat-qr-modal[hidden]{display:none}
.wechat-qr-modal{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:300}
.wechat-qr-dialog{width:min(320px,90vw);margin:12vh auto;padding:16px;border-radius:12px;background:#111}
```

- [ ] **Step 3: 增加打开/关闭 JS 占位逻辑**

```javascript
function openWechatQr(){ /* TODO: 后续接入真实二维码素材 */ }
function closeWechatQr(){ /* close modal */ }
```

注意：该任务仅预留接口，不改默认交互（仍保留“点击复制”）。

- [ ] **Step 4: 校验默认行为不回归**

```text
1) 点击微信卡仍然触发复制
2) 页面无新增可见弹层
3) 控制台无报错
```

- [ ] **Step 5: Commit**

```bash
git add "D:/个人网站/index v3.html"
git commit -m "chore: add hidden wechat qr modal placeholder for future asset sync"
```

---

### Task 6: 整体验收与回归

**Files:**
- Test: `D:\个人网站\index v3.html`

- [ ] **Step 1: 视觉回归（桌面端）**

```text
检查点：
- Hero 新增求职倾向文案可读且不抢主标题
- 时间轴对齐与节点颜色不被本次改动破坏
- 联系卡尺寸维持当前“精致感”
```

- [ ] **Step 2: 转化路径回归**

```text
路径：
Hero -> Projects -> Career -> Contact
确认 90 秒内可完成至少一个联系动作
```

- [ ] **Step 3: 事件回归**

```text
逐项点击：
wechat / linkedin / email / cv download
确认事件输出无缺失
```

- [ ] **Step 4: 记录验收结果**

```markdown
在 PR 描述或变更记录中补充：
- 完成项
- 未完成项（二维码素材待同步）
- 风险项
```

- [ ] **Step 5: Commit（若有回归修复）**

```bash
git add "D:/个人网站/index v3.html"
git commit -m "fix: polish regressions after conversion optimization rollout"
```

---

## Self-Review

### 1) Spec coverage
- 已覆盖：求职倾向显式化（小字号）、5min 与 70% 指标落地、微信/LinkedIn 优先路径、埋点。
- 部分保留：微信二维码素材未到位，仅预留弹层接口。

### 2) Placeholder scan
- 本计划无 `TBD` / `implement later` 类型空步骤。
- 仅在二维码接口内保留注释说明“待真实素材”，不影响当前上线。

### 3) Consistency check
- 所有任务均围绕同一文件 `index v3.html`，不存在跨文件命名不一致问题。
- 事件命名统一 `cta_click_*` 前缀。

