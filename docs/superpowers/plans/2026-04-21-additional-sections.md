# Additional Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four scroll sections (#projects, #services, #career, #contact) to `index v3.html`, maintaining the existing liquid-glass aesthetic and bilingual i18n system.

**Architecture:** All changes are confined to one file — `D:\个人网站\index v3.html`. New CSS is appended inside the existing `<style>` block (before `</style>`). New HTML sections are inserted after the `.divider` div and before the first `<script>` tag. A small JS snippet for WeChat copy is appended before `</body>`.

**Tech Stack:** Vanilla HTML/CSS/JS; no build step. Preview via `npx serve -l 5500 .` → http://localhost:5500

---

## File Map

| File | Change |
|------|--------|
| `D:\个人网站\index v3.html` | All CSS, HTML, JS changes inline |
| `D:\个人网站\references\spirit-construct-first.png` | Used as `<img src>` — read-only |
| `D:\个人网站\references\评审助手页.png` | Used as `<img src>` — read-only |
| `D:\个人网站\references\LLM评测平台.png` | Used as `<img src>` — read-only |

---

## Task 1 — Add global CSS (variables + shared section styles)

**Files:**
- Modify: `D:\个人网站\index v3.html` — inside `<style>` block, before `</style>`

Find the exact closing tag `</style>` and insert the following CSS block immediately before it.

- [ ] **Step 1: Open the file and locate `</style>`**

The `</style>` tag is on line 273. Confirm it's the only `</style>` in the file:
```bash
grep -n "</style>" "D:/个人网站/index v3.html"
```
Expected output: one line, e.g. `273:</style>`

- [ ] **Step 2: Insert global CSS before `</style>`**

Using the Edit tool, replace `</style>` with the following block + `</style>`:

```css
/* ── Purple variable ─────────────────────── */
:root { --purple:#c084fc; }

/* ── Shared section wrapper ──────────────── */
.section-wrap{
  max-width:1100px;margin:0 auto;
  padding:100px clamp(24px,5vw,80px);
  position:relative;z-index:1;
}
.sec-eyebrow{
  font-size:11px;letter-spacing:3px;text-transform:uppercase;
  margin-bottom:8px;font-weight:500;
}
.sec-title{
  font-family:var(--serif);font-style:italic;
  font-size:clamp(36px,5vw,56px);line-height:1;
  color:#fff;margin-bottom:60px;
}

/* ── Timeline shared (used in Projects + Career) ── */
.tl-track{display:flex;flex-direction:column;gap:0;position:relative}
.tl-track::before{
  content:'';position:absolute;left:50%;top:0;bottom:0;
  width:2px;transform:translateX(-50%);
  background:linear-gradient(180deg,var(--pink),var(--blue) 40%,var(--yellow) 70%,var(--purple));
}
/* Each timeline row */
.tl-row{
  display:grid;grid-template-columns:1fr 48px 1fr;
  align-items:center;gap:0;margin-bottom:56px;
}
.tl-row:last-child{margin-bottom:0}
/* Center node */
.tl-node{
  display:flex;align-items:center;justify-content:center;
  position:relative;z-index:2;
}
.tl-dot{
  width:12px;height:12px;border-radius:50%;
  border:2px solid rgba(255,255,255,.3);
  flex-shrink:0;
}
/* Left cell */
.tl-left{padding-right:32px;text-align:right}
/* Right cell */
.tl-right{padding-left:32px;text-align:left}

/* ── Glass card (shared by Projects + Career) ── */
.glass-card{
  background:rgba(255,255,255,.07);
  backdrop-filter:blur(24px) saturate(160%);-webkit-backdrop-filter:blur(24px) saturate(160%);
  border:1px solid rgba(255,255,255,.16);border-radius:18px;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.22),0 8px 32px rgba(0,0,0,.18);
  overflow:hidden;
}
/* Screenshot container inside project card */
.proj-img{
  width:100%;aspect-ratio:16/9;overflow:hidden;
  background:rgba(255,255,255,.04);
  display:flex;align-items:center;justify-content:center;
}
.proj-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s ease}
.glass-card:hover .proj-img img{transform:scale(1.03)}
.proj-body{padding:20px 22px 22px}
.proj-time{
  font-size:10px;letter-spacing:1.5px;text-transform:uppercase;
  margin-bottom:6px;font-weight:500;
}
.proj-name{font-size:16px;font-weight:700;color:#fff;margin-bottom:6px;line-height:1.25}
.proj-desc{font-size:13px;color:rgba(255,255,255,.55);line-height:1.6;margin-bottom:12px}
.tag-row{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px}
.tag{
  font-size:10px;padding:3px 10px;border-radius:999px;font-weight:500;
  border:1px solid currentColor;opacity:.85;
}
.tag-pink{color:var(--pink);background:rgba(255,143,171,.1)}
.tag-blue{color:var(--blue);background:rgba(108,184,232,.1)}
.tag-yellow{color:var(--yellow);background:rgba(255,202,95,.1)}
.tag-purple{color:var(--purple);background:rgba(192,132,252,.1)}
.proj-links{display:flex;gap:14px}
.proj-link{
  font-size:12px;font-weight:500;letter-spacing:.04em;
  display:inline-flex;align-items:center;gap:4px;
  transition:opacity .2s;
}
.proj-link:hover{opacity:.7}
/* Abstract card (for academic project) */
.proj-abstract{
  padding:22px;
  font-size:12px;color:rgba(255,255,255,.6);line-height:1.75;
}
.proj-abstract .abstract-title{
  font-size:13px;font-weight:700;color:#fff;margin-bottom:8px;line-height:1.3;
}
.proj-abstract .abstract-kw{
  margin-top:10px;font-size:11px;color:var(--purple);letter-spacing:.04em;
}

/* ── Services section ────────────────────── */
#services .svc-grid{
  display:grid;grid-template-columns:repeat(4,1fr);gap:16px;
}
@media(max-width:800px){#services .svc-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:460px){#services .svc-grid{grid-template-columns:1fr}}
.svc-card{
  background:rgba(255,255,255,.07);
  backdrop-filter:blur(24px) saturate(160%);-webkit-backdrop-filter:blur(24px) saturate(160%);
  border:1px solid rgba(255,255,255,.14);border-radius:18px;
  padding:28px 22px;text-align:center;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.22);
  transition:transform .25s,box-shadow .25s;
}
.svc-card:hover{transform:translateY(-5px);box-shadow:inset 0 1px 0 rgba(255,255,255,.28),0 16px 40px rgba(0,0,0,.22)}
.svc-icon{font-size:2rem;margin-bottom:14px;display:block}
.svc-name{font-size:15px;font-weight:700;color:#fff;margin-bottom:8px}
.svc-desc{font-size:12px;color:rgba(255,255,255,.5);line-height:1.65}

/* ── Career section ─────────────────────── */
#career .tl-track::before{
  background:linear-gradient(180deg,var(--pink),var(--blue) 30%,var(--yellow) 65%,var(--purple) 85%,rgba(255,255,255,.2));
}
.career-card{
  background:rgba(255,255,255,.07);
  backdrop-filter:blur(24px) saturate(160%);-webkit-backdrop-filter:blur(24px) saturate(160%);
  border:1px solid rgba(255,255,255,.14);border-radius:16px;padding:18px 20px;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.20);
}
.career-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;gap:8px}
.career-role{font-size:14px;font-weight:700;color:#fff;line-height:1.25}
.career-time-badge{
  font-size:9px;letter-spacing:1px;padding:3px 9px;border-radius:999px;
  flex-shrink:0;font-weight:500;white-space:nowrap;margin-top:2px;
}
.career-co{font-size:12px;color:rgba(255,255,255,.45);margin-bottom:8px}
.career-bullets{font-size:12px;color:rgba(255,255,255,.5);line-height:1.65;list-style:none;padding:0}
.career-bullets li::before{content:'→ ';color:rgba(255,255,255,.25)}

/* Career: left-side label column */
.career-label{text-align:right;padding-right:16px}
.career-label-role{font-size:13px;font-weight:600;color:#fff;margin-bottom:3px}
.career-label-co{font-size:11px;color:rgba(255,255,255,.4)}

/* ── Contact section ────────────────────── */
#contact{text-align:center}
#contact .section-wrap{padding-bottom:80px}
.contact-title{
  font-family:var(--serif);font-style:italic;
  font-size:clamp(36px,5vw,60px);color:#fff;margin-bottom:12px;line-height:1;
}
.contact-sub{font-size:15px;color:rgba(255,255,255,.45);margin-bottom:36px;line-height:1.6}
.contact-main-btn{
  display:inline-flex;align-items:center;gap:8px;
  padding:14px 36px;border-radius:9999px;
  background:var(--pink);color:#fff;font-size:15px;font-weight:600;letter-spacing:.04em;
  transition:all .25s;box-shadow:0 4px 20px rgba(255,143,171,.35);margin-bottom:40px;
}
.contact-main-btn:hover{background:#ff7099;transform:translateY(-2px);box-shadow:0 8px 28px rgba(255,143,171,.45)}
.contact-links{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:60px}
.contact-card{
  display:flex;align-items:center;gap:10px;
  padding:13px 20px;border-radius:14px;
  background:rgba(255,255,255,.07);
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  border:1px solid rgba(255,255,255,.15);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.20);
  font-size:13px;color:rgba(255,255,255,.8);
  transition:all .22s;cursor:pointer;
}
.contact-card:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.28);transform:translateY(-2px)}
.contact-card .cc-icon{font-size:18px;flex-shrink:0}
.contact-card .cc-label{font-size:10px;color:rgba(255,255,255,.35);display:block;line-height:1.2}
.contact-card .cc-val{font-size:12px;color:#fff;font-weight:500}
/* Copy feedback */
.copy-toast{
  display:none;position:fixed;bottom:28px;left:50%;transform:translateX(-50%);
  background:rgba(192,132,252,.15);backdrop-filter:blur(12px);
  border:1px solid rgba(192,132,252,.3);border-radius:10px;
  padding:8px 20px;font-size:13px;color:#fff;z-index:200;
  animation:fadeup .3s ease;
}
@keyframes fadeup{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}

/* ── Footer ──────────────────────────────── */
.site-footer{
  text-align:center;padding:20px;
  font-size:11px;color:rgba(255,255,255,.2);
  letter-spacing:.05em;position:relative;z-index:1;
}

/* ── Timeline mobile stacking ────────────── */
@media(max-width:700px){
  .tl-track::before{left:20px}
  .tl-row{grid-template-columns:32px 1fr;grid-template-rows:auto}
  .tl-left{display:none}
  .tl-right{padding-left:16px;text-align:left;grid-column:2}
  .tl-node{grid-column:1;justify-content:flex-start}
}
</style>
```

- [ ] **Step 3: Verify in browser**

Open http://localhost:5500 — page should look identical to before (no new sections yet, just CSS added). Check browser console for zero errors.

- [ ] **Step 4: Commit**

```bash
cd "D:/个人网站"
git add "index v3.html"
git commit -m "style: add global CSS for new sections (timeline, glass-card, section-wrap)"
```

---

## Task 2 — Add #projects section HTML

**Files:**
- Modify: `D:\个人网站\index v3.html` — after `.divider` div, before first `<script>`

The insertion point is the line containing `<div class="divider"></div>`. Insert the projects section HTML immediately after it.

- [ ] **Step 1: Locate insertion point**

```bash
grep -n "divider" "D:/个人网站/index v3.html"
```
Expected: one line like `367:<div class="divider"></div>`

- [ ] **Step 2: Insert #projects section after the divider line**

Using the Edit tool, replace:
```html
<div class="divider"></div>
```
with:
```html
<div class="divider"></div>

<!-- ══════════════ PROJECTS ══════════════ -->
<section id="projects">
<div class="section-wrap">
  <p class="sec-eyebrow reveal" style="color:var(--pink)" data-i18n="zh:作品集;en:Works">作品集</p>
  <h2 class="sec-title reveal d1" data-i18n="zh:我做过什么;en:Selected Projects">我做过什么</h2>

  <div class="tl-track">

    <!-- ① Spirit Construct — left:screenshot  right:text -->
    <div class="tl-row reveal">
      <div class="tl-left">
        <div class="glass-card">
          <div class="proj-img">
            <img src="references/spirit-construct-first.png" alt="Spirit Construct 界面截图" loading="lazy">
          </div>
        </div>
      </div>
      <div class="tl-node"><div class="tl-dot" style="background:var(--pink);border-color:rgba(255,143,171,.4)"></div></div>
      <div class="tl-right">
        <div class="glass-card">
          <div class="proj-body">
            <p class="proj-time" style="color:var(--pink)" data-i18n="zh:2026-01 · 至今;en:Jan 2026 · Present">2026-01 · 至今</p>
            <h3 class="proj-name">Spirit Construct · 灵构</h3>
            <p class="proj-desc" data-i18n="zh:面向AI产品经理的垂直SaaS工具，Vibe Coding模式30小时完成MVP，含大模型ROI计算器与可视化参数调试场；采用Serverless边缘路由大幅压降服务器成本。;en:Vertical SaaS for AI PMs — MVP shipped in 30h via Vibe Coding. Features LLM ROI calculator and visual parameter debugger with serverless edge routing.">面向AI产品经理的垂直SaaS工具，Vibe Coding模式30小时完成MVP，含大模型ROI计算器与可视化参数调试场；采用Serverless边缘路由大幅压降服务器成本。</p>
            <div class="tag-row">
              <span class="tag tag-pink">SaaS</span>
              <span class="tag tag-blue">SSE流式输出</span>
              <span class="tag tag-yellow">Serverless</span>
              <span class="tag tag-pink">Fetch API</span>
            </div>
            <div class="proj-links">
              <a class="proj-link" style="color:var(--pink)" href="https://spirit-construct-maropion.top/" target="_blank" rel="noopener" aria-label="Spirit Construct 线上演示">↗ <span data-i18n="zh:线上演示;en:Live Demo">线上演示</span></a>
              <a class="proj-link" style="color:rgba(255,255,255,.45)" href="https://github.com/Maropion03/Spirit-Construct-AIPM-stack" target="_blank" rel="noopener" aria-label="Spirit Construct GitHub">⎇ GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ② PRD评审工作台 — left:text  right:screenshot -->
    <div class="tl-row reveal d1">
      <div class="tl-left">
        <div class="glass-card">
          <div class="proj-body">
            <p class="proj-time" style="color:var(--blue)" data-i18n="zh:2026-01 – 2026-03;en:Jan – Mar 2026">2026-01 – 2026-03</p>
            <h3 class="proj-name">PRD 智能评审工作台</h3>
            <p class="proj-desc" data-i18n="zh:基于CrewAI多Agent架构设计6维度评审系统，FastAPI+SSE实现实时流式推送，单次评审从人工2h缩短至AI辅助3min，支持PDF/Markdown双格式导出，Docker部署上线。;en:6-dimension PRD review system built on CrewAI multi-agent. FastAPI+SSE streaming. Review time cut from 2h manual to 3min AI-assisted. PDF/MD export, Dockerized.">基于CrewAI多Agent架构设计6维度评审系统，FastAPI+SSE实现实时流式推送，单次评审从人工2h缩短至AI辅助3min，支持PDF/Markdown双格式导出，Docker部署上线。</p>
            <div class="tag-row">
              <span class="tag tag-blue">Multi-Agent</span>
              <span class="tag tag-yellow">FastAPI + SSE</span>
              <span class="tag tag-pink">Docker</span>
              <span class="tag tag-blue">CrewAI</span>
            </div>
            <div class="proj-links">
              <a class="proj-link" style="color:var(--blue)" href="https://awesome-requirement-review-agent-production.up.railway.app/single-page-shell.html" target="_blank" rel="noopener" aria-label="PRD评审工作台线上演示">↗ <span data-i18n="zh:线上演示;en:Live Demo">线上演示</span></a>
              <a class="proj-link" style="color:rgba(255,255,255,.45)" href="https://github.com/Maropion03/awesome-requirement-review-agent" target="_blank" rel="noopener" aria-label="PRD评审工作台 GitHub">⎇ GitHub</a>
            </div>
          </div>
        </div>
      </div>
      <div class="tl-node"><div class="tl-dot" style="background:var(--blue);border-color:rgba(108,184,232,.4)"></div></div>
      <div class="tl-right">
        <div class="glass-card">
          <div class="proj-img">
            <img src="references/评审助手页.png" alt="PRD智能评审工作台界面截图" loading="lazy">
          </div>
        </div>
      </div>
    </div>

    <!-- ③ LLM Eval Studio — left:screenshot  right:text -->
    <div class="tl-row reveal d2">
      <div class="tl-left">
        <div class="glass-card">
          <div class="proj-img">
            <img src="references/LLM评测平台.png" alt="LLM Eval Studio 界面截图" loading="lazy">
          </div>
        </div>
      </div>
      <div class="tl-node"><div class="tl-dot" style="background:var(--yellow);border-color:rgba(255,202,95,.4)"></div></div>
      <div class="tl-right">
        <div class="glass-card">
          <div class="proj-body">
            <p class="proj-time" style="color:var(--yellow)" data-i18n="zh:2025-11 – 2026-03;en:Nov 2025 – Mar 2026">2025-11 – 2026-03</p>
            <h3 class="proj-name">LLM Eval Studio</h3>
            <p class="proj-desc" data-i18n="zh:Prompt调试台与LLM多维Judge评测平台，支持自定义评分标准（Faithfulness/Relevance/Coherence）与测试用例批量管理，内置系统Prompt与上下文注入。;en:Prompt debugger and multi-dimension LLM judge platform. Custom scoring criteria (Faithfulness/Relevance/Coherence), batch test-case management, system-prompt injection.">Prompt调试台与LLM多维Judge评测平台，支持自定义评分标准（Faithfulness/Relevance/Coherence）与测试用例批量管理，内置系统Prompt与上下文注入。</p>
            <div class="tag-row">
              <span class="tag tag-yellow">Prompt Eng</span>
              <span class="tag tag-pink">LLM Eval</span>
              <span class="tag tag-yellow">Judge系统</span>
            </div>
            <div class="proj-links">
              <span class="proj-link" style="color:rgba(255,255,255,.3)" data-i18n="zh:内部工具;en:Internal Tool">内部工具</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ④ 财务舞弊研究 — left:abstract  right:text -->
    <div class="tl-row reveal d3">
      <div class="tl-left">
        <div class="glass-card">
          <div class="proj-abstract">
            <p class="abstract-title">融合检索增强生成与多智能体协同的上市公司财务舞弊深度识别研究</p>
            <p>As financial fraud in capital markets becomes increasingly covert, this study constructs a dual-channel perception network (TextCNN + FinBERT) fused with a multi-agent debate framework for deep cross-source semantic verification.</p>
            <p class="abstract-kw">Keywords: Financial Fraud Detection · RAG · Multi-Agent · FinBERT · ChromaDB</p>
          </div>
        </div>
      </div>
      <div class="tl-node"><div class="tl-dot" style="background:var(--purple);border-color:rgba(192,132,252,.4)"></div></div>
      <div class="tl-right">
        <div class="glass-card">
          <div class="proj-body">
            <p class="proj-time" style="color:var(--purple)" data-i18n="zh:2025-11 – 2026-03 · 学术;en:Nov 2025 – Mar 2026 · Academic">2025-11 – 2026-03 · 学术</p>
            <h3 class="proj-name" data-i18n="zh:上市公司财务舞弊识别研究;en:Financial Fraud Detection Research">上市公司财务舞弊识别研究</h3>
            <p class="proj-desc" data-i18n="zh:独立完成「感知-认知」双层架构设计与核心代码实现。TextCNN+FinBERT双通道提取短频风险与长文语义，RAG靶向召回百份年报，三节点Agent辩论框架核查幻觉。极度不平衡样本下F1显著领跑传统单模型基线。;en:Sole architect of dual-layer perception-cognition system. TextCNN+FinBERT dual-channel extraction, RAG over 100+ annual reports, 3-agent debate for hallucination checking. F1 significantly outperforms single-model baselines on imbalanced samples.">独立完成「感知-认知」双层架构设计与核心代码实现。TextCNN+FinBERT双通道提取短频风险与长文语义，RAG靶向召回百份年报，三节点Agent辩论框架核查幻觉。极度不平衡样本下F1显著领跑传统单模型基线。</p>
            <div class="tag-row">
              <span class="tag tag-purple">RAG</span>
              <span class="tag tag-purple">FinBERT</span>
              <span class="tag tag-purple">ChromaDB</span>
              <span class="tag tag-purple">Multi-Agent</span>
            </div>
            <div class="proj-links">
              <span class="proj-link" style="color:var(--purple)" data-i18n="zh:核心研究员;en:Core Researcher">核心研究员</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div><!-- /.tl-track -->
</div><!-- /.section-wrap -->
</section>
```

- [ ] **Step 3: Verify in browser**

Open http://localhost:5500. Scroll down past stats strip — you should see the Projects section with 4 timeline rows. Check that:
- Images load (灵构 / PRD 评审 / Eval Studio screenshots visible)
- Academic project shows text abstract on left
- Timeline line runs vertically through all 4 items
- Console has zero errors

- [ ] **Step 4: Commit**

```bash
cd "D:/个人网站"
git add "index v3.html"
git commit -m "feat: add #projects section with alternating timeline layout"
```

---

## Task 3 — Add #services section HTML

**Files:**
- Modify: `D:\个人网站\index v3.html` — immediately after the closing `</section>` of `#projects`

- [ ] **Step 1: Locate insertion point**

Find the closing tag of the projects section you just added:
```bash
grep -n "PROJECTS\|/section" "D:/个人网站/index v3.html"
```
Identify the `</section>` that closes `#projects`.

- [ ] **Step 2: Insert #services section after `</section>` of projects**

Using the Edit tool, after the closing `</section>` of `#projects`, insert:

```html

<!-- ══════════════ SERVICES ══════════════ -->
<section id="services">
<div class="section-wrap">
  <p class="sec-eyebrow reveal" style="color:var(--blue)" data-i18n="zh:服务;en:Services">服务</p>
  <h2 class="sec-title reveal d1" data-i18n="zh:我能做什么;en:What I Offer">我能做什么</h2>

  <div class="svc-grid">

    <div class="svc-card reveal">
      <span class="svc-icon" role="img" aria-label="AI产品规划">🤖</span>
      <h3 class="svc-name" data-i18n="zh:AI 产品规划;en:AI Product Planning">AI 产品规划</h3>
      <p class="svc-desc" data-i18n="zh:需求挖掘、PRD撰写、MVP敏捷迭代与用户体验设计，覆盖产品全生命周期管理。;en:Requirements, PRD writing, MVP agile iteration and UX design — full product lifecycle coverage.">需求挖掘、PRD撰写、MVP敏捷迭代与用户体验设计，覆盖产品全生命周期管理。</p>
    </div>

    <div class="svc-card reveal d1">
      <span class="svc-icon" role="img" aria-label="Prompt Engineering">✏️</span>
      <h3 class="svc-name">Prompt Engineering</h3>
      <p class="svc-desc" data-i18n="zh:CoT/Few-shot调优策略、Agent协同机制设计与LLM能力边界评估，指导产品功能落地。;en:CoT/Few-shot tuning, agent coordination design, and LLM capability boundary assessment for real product features.">CoT/Few-shot调优策略、Agent协同机制设计与LLM能力边界评估，指导产品功能落地。</p>
    </div>

    <div class="svc-card reveal d2">
      <span class="svc-icon" role="img" aria-label="数据分析">📊</span>
      <h3 class="svc-name" data-i18n="zh:数据分析;en:Data Analysis">数据分析</h3>
      <p class="svc-desc" data-i18n="zh:Python / Pandas / Scikit-learn 数据清洗与ML建模，文本挖掘与用户洞察周报输出。;en:Python / Pandas / Scikit-learn data wrangling, ML modeling, text mining and user-insight reporting.">Python / Pandas / Scikit-learn 数据清洗与ML建模，文本挖掘与用户洞察周报输出。</p>
    </div>

    <div class="svc-card reveal d3">
      <span class="svc-icon" role="img" aria-label="竞品分析">🔍</span>
      <h3 class="svc-name" data-i18n="zh:竞品分析;en:Competitive Research">竞品分析</h3>
      <p class="svc-desc" data-i18n="zh:国内外20+竞品深度调研，覆盖定价策略与技术路线，输出产品定位与差异化建议。;en:Deep research on 20+ domestic and international competitors — pricing, tech roadmap, positioning and differentiation.">国内外20+竞品深度调研，覆盖定价策略与技术路线，输出产品定位与差异化建议。</p>
    </div>

  </div>
</div>
</section>
```

- [ ] **Step 3: Verify in browser**

Scroll past projects — Services section should show 4 glass cards in a 4-column grid. Hover each card to confirm `translateY(-5px)` lift effect. On window width < 800px, should collapse to 2×2.

- [ ] **Step 4: Commit**

```bash
cd "D:/个人网站"
git add "index v3.html"
git commit -m "feat: add #services section with 4-column glass card grid"
```

---

## Task 4 — Add #career section HTML

**Files:**
- Modify: `D:\个人网站\index v3.html` — after closing `</section>` of `#services`

- [ ] **Step 1: Insert #career section after services `</section>`**

Using the Edit tool, after the closing `</section>` of `#services`, insert:

```html

<!-- ══════════════ CAREER ══════════════ -->
<section id="career">
<div class="section-wrap">
  <p class="sec-eyebrow reveal" style="color:var(--yellow)" data-i18n="zh:经历;en:Experience">经历</p>
  <h2 class="sec-title reveal d1" data-i18n="zh:我走过哪里;en:Where I've Been">我走过哪里</h2>

  <div class="tl-track">

    <!-- ① 上海守扣科技 -->
    <div class="tl-row reveal">
      <div class="tl-left career-label">
        <p class="career-label-role" data-i18n="zh:AI 产品经理;en:AI Product Manager">AI 产品经理</p>
        <p class="career-label-co">上海守扣科技有限公司</p>
      </div>
      <div class="tl-node"><div class="tl-dot" style="background:var(--pink);border-color:rgba(255,143,171,.4)"></div></div>
      <div class="tl-right">
        <div class="career-card">
          <div class="career-header">
            <span class="career-role" data-i18n="zh:落地页改版 · 多语言规划 · 竞品调研;en:Landing Page Revamp · Multilingual Planning · Competitive Research">落地页改版 · 多语言规划 · 竞品调研</span>
            <span class="career-time-badge" style="background:rgba(255,143,171,.12);color:var(--pink)" data-i18n="zh:2026-04 至今;en:Apr 2026 · Present">2026-04 至今</span>
          </div>
          <p class="career-co">上海守扣科技有限公司</p>
          <ul class="career-bullets">
            <li data-i18n="zh:主导首页从零重构，建立统一视觉标题系统与组件规范;en:Led homepage full reconstruction — established unified visual title system and component spec">主导首页从零重构，建立统一视觉标题系统与组件规范</li>
            <li data-i18n="zh:基于214国GDP/人口数据制定三阶段多语言路线图;en:Built 3-stage multilingual roadmap from 214-country GDP/population data">基于214国GDP/人口数据制定三阶段多语言路线图</li>
            <li data-i18n="zh:深入理解OCR多引擎能力边界，推动产品与研发实现对齐;en:Deep-dived OCR multi-engine capabilities to align product features with R&D delivery">深入理解OCR多引擎能力边界，推动产品与研发实现对齐</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ② 广州安点科技 -->
    <div class="tl-row reveal d1">
      <div class="tl-left career-label">
        <p class="career-label-role" data-i18n="zh:AI 产品经理;en:AI Product Manager">AI 产品经理</p>
        <p class="career-label-co">广州安点科技有限公司</p>
      </div>
      <div class="tl-node"><div class="tl-dot" style="background:var(--blue);border-color:rgba(108,184,232,.4)"></div></div>
      <div class="tl-right">
        <div class="career-card">
          <div class="career-header">
            <span class="career-role" data-i18n="zh:PRD智能评审工作台 · 从0到1独立落地;en:PRD Review Platform · Built from 0 to 1">PRD智能评审工作台 · 从0到1独立落地</span>
            <span class="career-time-badge" style="background:rgba(108,184,232,.12);color:var(--blue)" data-i18n="zh:2026-01 – 03;en:Jan – Mar 2026">2026-01 – 03</span>
          </div>
          <p class="career-co">广州安点科技有限公司</p>
          <ul class="career-bullets">
            <li data-i18n="zh:基于CrewAI多Agent架构设计6维度评审系统，三专业Agent并行评审;en:Designed 6-dimension review system on CrewAI multi-agent with 3 specialist agents running in parallel">基于CrewAI多Agent架构设计6维度评审系统，三专业Agent并行评审</li>
            <li data-i18n="zh:后端FastAPI+SSE实时流式推送，多阶段Docker构建部署及slowapi限流防护;en:FastAPI+SSE real-time streaming backend, multi-stage Docker build with slowapi rate limiting">后端FastAPI+SSE实时流式推送，多阶段Docker构建部署及slowapi限流防护</li>
            <li data-i18n="zh:单次评审耗时从人工2小时缩短至AI辅助3分钟（提效97%）;en:Reduced review time from 2h manual to 3min AI-assisted (97% efficiency gain)">单次评审耗时从人工2小时缩短至AI辅助3分钟（提效97%）</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ③ 国泰海通证券 -->
    <div class="tl-row reveal d2">
      <div class="tl-left career-label">
        <p class="career-label-role" data-i18n="zh:行业研究;en:Industry Research">行业研究</p>
        <p class="career-label-co">国泰海通证券-债务融资部</p>
      </div>
      <div class="tl-node"><div class="tl-dot" style="background:var(--yellow);border-color:rgba(255,202,95,.4)"></div></div>
      <div class="tl-right">
        <div class="career-card">
          <div class="career-header">
            <span class="career-role" data-i18n="zh:量化分析 · ML偿债模型 · 千亿级债券定价;en:Quantitative Analysis · ML Solvency Model · CNY 100B Bond Pricing">量化分析 · ML偿债模型 · 千亿级债券定价</span>
            <span class="career-time-badge" style="background:rgba(255,202,95,.12);color:var(--yellow)" data-i18n="zh:2025-09 – 11;en:Sep – Nov 2025">2025-09 – 11</span>
          </div>
          <p class="career-co">国泰海通证券-债务融资部</p>
          <ul class="career-bullets">
            <li data-i18n="zh:独立完成三峡新能源千亿级发债前财务核查;en:Independently completed pre-issuance financial review for CNY 100B+ Three Gorges New Energy bond">独立完成三峡新能源千亿级发债前财务核查</li>
            <li data-i18n="zh:基于回归分析等ML算法构建偿债能力评估模型，精准穿透4700亿应收账款;en:Built ML solvency model using regression analysis, penetrating CNY 470B in receivables">基于回归分析等ML算法构建偿债能力评估模型，精准穿透4700亿应收账款</li>
            <li data-i18n="zh:为债券利率（1.70%）定价提供核心数据支撑;en:Provided core data support for bond interest rate pricing at 1.70%">为债券利率（1.70%）定价提供核心数据支撑</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ④ 美团 -->
    <div class="tl-row reveal d3">
      <div class="tl-left career-label">
        <p class="career-label-role" data-i18n="zh:产品运营（AI/风控）;en:Product Operations (AI/Risk)">产品运营（AI/风控）</p>
        <p class="career-label-co">美团-核心本地商业-点评事业部</p>
      </div>
      <div class="tl-node"><div class="tl-dot" style="background:var(--purple);border-color:rgba(192,132,252,.4)"></div></div>
      <div class="tl-right">
        <div class="career-card">
          <div class="career-header">
            <span class="career-role" data-i18n="zh:AI Agent开发 · 机器学习数据洞察 · 黑灰产防控;en:AI Agent Dev · ML Data Insights · Fraud Prevention">AI Agent开发 · 机器学习数据洞察 · 黑灰产防控</span>
            <span class="career-time-badge" style="background:rgba(192,132,252,.12);color:var(--purple)" data-i18n="zh:2025-07 – 09;en:Jul – Sep 2025">2025-07 – 09</span>
          </div>
          <p class="career-co">美团-核心本地商业-点评事业部</p>
          <ul class="career-bullets">
            <li data-i18n="zh:基于Claude Sonnet开发「小红书评论筛选」AI Agent，迭代至V35并部署；CoT+Few-Shot策略将单帖处理时间从60s→30s（提效50%）;en:Built Xiaohongshu comment-filtering AI Agent on Claude Sonnet, iterated to V35; CoT+Few-Shot cut per-post time from 60s to 30s (50% gain)">基于Claude Sonnet开发「小红书评论筛选」AI Agent，迭代至V35并部署；CoT+Few-Shot策略将单帖处理时间从60s→30s（提效50%）</li>
            <li data-i18n="zh:ML文本挖掘分析1800+帖子，精准匹配潜在用户300+名/周;en:ML text mining on 1800+ posts, matching 300+ potential users per week">ML文本挖掘分析1800+帖子，精准匹配潜在用户300+名/周</li>
            <li data-i18n="zh:建立覆盖成都/重庆/长沙等城市300余个社群情报网络，月均识别150+条相关舆情;en:Built 300+ community intelligence networks across Chengdu/Chongqing/Changsha; identified 150+ risk signals/month">建立覆盖成都/重庆/长沙等城市300余个社群情报网络，月均识别150+条相关舆情</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ⑤ 信永中和 -->
    <div class="tl-row reveal d4">
      <div class="tl-left career-label">
        <p class="career-label-role" data-i18n="zh:审计实习生;en:Audit Intern">审计实习生</p>
        <p class="career-label-co">信永中和会计师事务所广州分所</p>
      </div>
      <div class="tl-node"><div class="tl-dot" style="background:rgba(255,255,255,.5);border-color:rgba(255,255,255,.2)"></div></div>
      <div class="tl-right">
        <div class="career-card">
          <div class="career-header">
            <span class="career-role" data-i18n="zh:机器辅助风险盘点 · BI看板;en:ML-Assisted Risk Inventory · BI Dashboards">机器辅助风险盘点 · BI看板</span>
            <span class="career-time-badge" style="background:rgba(255,255,255,.08);color:rgba(255,255,255,.4)" data-i18n="zh:2024-06 – 09;en:Jun – Sep 2024">2024-06 – 09</span>
          </div>
          <p class="career-co">信永中和会计师事务所广州分所（特殊普通合伙）</p>
          <ul class="career-bullets">
            <li data-i18n="zh:应用数据聚类算法重构仓库存货盘点流程，精准识别42处高危异常数据;en:Applied clustering algorithms to reconstruct inventory process, identifying 42 high-risk anomalies">应用数据聚类算法重构仓库存货盘点流程，精准识别42处高危异常数据</li>
            <li data-i18n="zh:引入BI工具实现15家子公司业务流可视化全景看板;en:Implemented BI dashboards for full business-flow visualization across 15 subsidiaries">引入BI工具实现15家子公司业务流可视化全景看板</li>
          </ul>
        </div>
      </div>
    </div>

  </div><!-- /.tl-track -->
</div><!-- /.section-wrap -->
</section>
```

- [ ] **Step 2: Verify in browser**

Scroll past services — Career section should show 5 timeline entries, newest to oldest. Left side shows role/company label, right side shows detail card. Check that `.d4` delay class gives the 5th item a slight stagger. On mobile (< 700px), left labels should hide and only right cards show.

- [ ] **Step 3: Commit**

```bash
cd "D:/个人网站"
git add "index v3.html"
git commit -m "feat: add #career section with 5-entry vertical timeline"
```

---

## Task 5 — Add #contact section + footer HTML

**Files:**
- Modify: `D:\个人网站\index v3.html` — after closing `</section>` of `#career`, before first `<script>`

- [ ] **Step 1: Insert #contact section after career `</section>`**

Using the Edit tool, after the closing `</section>` of `#career`, insert:

```html

<!-- ══════════════ CONTACT ══════════════ -->
<section id="contact">
<div class="section-wrap">
  <p class="sec-eyebrow reveal" style="color:var(--pink)" data-i18n="zh:联系;en:Contact">联系</p>

  <h2 class="contact-title reveal d1" data-i18n="zh:有想法？一起聊聊;en:Got an idea? Let's talk.">有想法？一起聊聊</h2>
  <p class="contact-sub reveal d2" data-i18n="zh:无论是合作、咨询还是打招呼，我都很乐意回复;en:Whether it's a collaboration, a question, or just a hello — I'm happy to chat.">无论是合作、咨询还是打招呼，我都很乐意回复</p>

  <a class="contact-main-btn reveal d2" href="mailto:maropion@163.com" aria-label="发邮件给我">
    📧 <span data-i18n="zh:发邮件给我;en:Send me an email">发邮件给我</span>
  </a>

  <div class="contact-links reveal d3">

    <a class="contact-card" href="mailto:maropion@163.com" aria-label="发送邮件至 maropion@163.com">
      <span class="cc-icon">📧</span>
      <div>
        <span class="cc-label" data-i18n="zh:邮箱;en:Email">邮箱</span>
        <span class="cc-val">maropion@163.com</span>
      </div>
    </a>

    <button class="contact-card" id="wechatBtn" onclick="copyWechat()" aria-label="复制微信号 MRP18565682722">
      <span class="cc-icon">💬</span>
      <div>
        <span class="cc-label" data-i18n="zh:微信（点击复制）;en:WeChat (click to copy)">微信（点击复制）</span>
        <span class="cc-val">MRP18565682722</span>
      </div>
    </button>

    <a class="contact-card" href="https://github.com/Maropion03" target="_blank" rel="noopener" aria-label="GitHub 主页">
      <span class="cc-icon">🐱</span>
      <div>
        <span class="cc-label">GitHub</span>
        <span class="cc-val">Maropion03</span>
      </div>
    </a>

    <a class="contact-card" href="https://www.linkedin.com/in/ruiping-mao-5521273a5/" target="_blank" rel="noopener" aria-label="LinkedIn 主页">
      <span class="cc-icon">💼</span>
      <div>
        <span class="cc-label">LinkedIn</span>
        <span class="cc-val">Ruiping Mao</span>
      </div>
    </a>

  </div>
</div>
</section>

<!-- ── Footer ── -->
<footer class="site-footer">
  © 2026 毛睿平 · Maropion · Built with ☁️
</footer>

<!-- Copy toast -->
<div class="copy-toast" id="copyToast" data-i18n="zh:微信号已复制 ✓;en:WeChat ID copied ✓">微信号已复制 ✓</div>
```

- [ ] **Step 2: Verify in browser**

Scroll to bottom — Contact section visible with email button, 4 contact cards, footer text. Clicking the email button should open mail client. Console has zero errors.

- [ ] **Step 3: Commit**

```bash
cd "D:/个人网站"
git add "index v3.html"
git commit -m "feat: add #contact section and site footer"
```

---

## Task 6 — Add WeChat copy JS + wire reveal observers

**Files:**
- Modify: `D:\个人网站\index v3.html` — inside the first `<script>` block (the i18n/reveal script), add `copyWechat` function and extend the reveal observer

- [ ] **Step 1: Locate the reveal IntersectionObserver in the first script**

Find this line in the first `<script>` block:
```js
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));
```

- [ ] **Step 2: Replace that line to also register new `.reveal` elements + add copyWechat**

Using the Edit tool, replace:
```js
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));
```
with:
```js
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));

// WeChat copy
function copyWechat(){
  navigator.clipboard.writeText('MRP18565682722').then(()=>{
    const t=document.getElementById('copyToast');
    t.style.display='block';
    // re-run i18n on toast so EN/ZH label is correct
    applyI18n(t);
    setTimeout(()=>{t.style.display='none'},2000);
  }).catch(()=>{
    // Fallback for environments without clipboard API
    prompt('复制微信号：','MRP18565682722');
  });
}
```

- [ ] **Step 3: Verify WeChat copy**

Open http://localhost:5500, scroll to Contact, click the WeChat card. A toast should appear at the bottom of the screen reading "微信号已复制 ✓" and disappear after 2 seconds. Switch to EN mode and click again — toast should read "WeChat ID copied ✓".

- [ ] **Step 4: Full end-to-end check**

- [ ] Scroll from top to bottom — all 4 sections appear in order: Projects → Services → Career → Contact
- [ ] Nav links work: click 作品 → jumps to #projects; click 服务 → #services; click 经历 → #career; click 联系 → #contact
- [ ] `.reveal` elements animate in as you scroll (fade + translateY)
- [ ] Switch language (EN button) — all `data-i18n` labels update correctly
- [ ] Mobile: resize to 375px width — timeline left labels hidden, service cards go 2-column, nav links hidden
- [ ] Console: zero JS errors

- [ ] **Step 5: Commit**

```bash
cd "D:/个人网站"
git add "index v3.html"
git commit -m "feat: add WeChat clipboard copy, verify full section reveal and i18n"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Covered by |
|-----------------|-----------|
| #projects — 4 items, timeline, alternating left/right | Task 2 |
| Screenshot images with loading=lazy | Task 2 (all `<img>` tags) |
| Academic project uses abstract text block | Task 2 (item ④) |
| Tech tags with color variants | Task 2 (tag-pink/blue/yellow/purple classes) |
| #services — 4-col grid, 2×2 on mobile | Task 3 + Task 1 CSS |
| Hover lift effect on service cards | Task 1 CSS `.svc-card:hover` |
| #career — 5 entries newest→oldest, left labels | Task 4 |
| Career timeline gradient matches spec | Task 1 CSS `#career .tl-track::before` |
| #contact — mailto CTA button + 4 contact cards | Task 5 |
| WeChat copy-to-clipboard with toast feedback | Task 6 |
| Toast respects EN/ZH via data-i18n + applyI18n | Task 6 |
| Footer copyright line | Task 5 |
| Mobile timeline stacking (left col hidden) | Task 1 CSS `@media(max-width:700px)` |
| `--purple` CSS variable added | Task 1 |
| `.reveal` IntersectionObserver covers new sections | Task 6 (observer runs on all `.reveal` in DOM) |
| `aria-label` on all icon links | Tasks 2,3,4,5 |
| `data-i18n` bilingual on all visible text | Tasks 2,3,4,5 |

**Placeholder scan:** No TBD/TODO found. All code blocks contain complete, runnable HTML/CSS/JS.

**Type consistency:** `copyWechat()` defined in Task 6 and called via `onclick="copyWechat()"` in Task 5 — consistent. `applyI18n()` used in Task 6 — function exists in the original first `<script>` block. `toggleSelect` is NOT used (brainstorming server only) — no conflict.
