export type Language = "zh" | "en";
export type LocalText = { zh: string; en: string };
export const t = (value: LocalText, lang: Language): string => value[lang];
const image = (name: string) =>
  `${import.meta.env.BASE_URL}images/${name}.webp`;

export interface Project {
  id: string;
  title: LocalText;
  subtitle: LocalText;
  category: LocalText;
  summary: LocalText;
  detail: LocalText;
  role: LocalText;
  image?: string;
  imageAlt: LocalText;
  stack: string[];
  live?: string;
  github?: string;
}

// These are short translations of the master branch's index v4.html.
// They describe the existing portfolio, not freshly verified production results.
export const projects: Project[] = [
  {
    id: "meloscape",
    title: { zh: "让音乐，有了形状。", en: "Give sound\na little scenery." },
    subtitle: {
      zh: "Meloscape / 实时音乐可视化",
      en: "Meloscape / Music visualization",
    },
    category: { zh: "声音 × 实时视觉", en: "Sound meets real-time visuals" },
    summary: {
      zh: "把节奏、能量与歌词情绪，变成随音乐生长的像素场景。",
      en: "Turning rhythm, energy and lyrical emotion into living pixel landscapes.",
    },
    detail: {
      zh: "围绕“让用户看见音乐”设计浏览器端实时音乐可视化产品，整合音频输入、解析、播放与场景反馈。通过 Web Audio API 分析 BPM、能量、频谱重心和歌曲结构，并结合歌词情绪映射为不同的像素艺术场景。",
      en: "A browser-based music visualization product connecting audio input, analysis, playback and visual feedback. Web Audio API analysis of BPM, energy, spectral centroid and song structure combines with lyrical emotion to shape pixel-art scenes.",
    },
    role: {
      zh: "独立产品设计与开发",
      en: "Independent product design & development",
    },
    image: image("meloscape"),
    imageAlt: {
      zh: "Meloscape 音乐可视化产品的实际界面",
      en: "Actual interface of the Meloscape music visualizer",
    },
    stack: ["Web Audio", "Canvas", "Node.js"],
    live: "https://meloscape-inn2.vercel.app",
    github: "https://github.com/Maropion03/Meloscape",
  },
  {
    id: "dayuyan",
    title: {
      zh: "文档之外，\n读懂问题。",
      en: "Read the document.\nUnderstand the question.",
    },
    subtitle: {
      zh: "答于言 / 端侧文档判断",
      en: "DaYuYan / On-device document intelligence",
    },
    category: {
      zh: "图像 × 文档理解",
      en: "Vision meets document understanding",
    },
    summary: {
      zh: "让高敏文档在本地完成解析，从结构化信息走向有依据的判断。",
      en: "From document parsing to grounded judgments, keeping sensitive files on-device.",
    },
    detail: {
      zh: "中途接手基础图片问答 Demo，重新定义面向高敏文档工作者的端侧判断产品，覆盖论文与简历评估、合同对比和票据核验。重构“文件解析 → 结构化提取 → 场景结论”链路，使用 PDF 逐页解析与 OCR 辅助处理长文档，完成前后端 Demo 与答辩交付。",
      en: "Reframed an image-Q&A demo around sensitive-document tasks: paper and résumé evaluation, contract comparison and receipt verification. Rebuilt the parsing → structured extraction → contextual judgment flow, with page-by-page PDF parsing and OCR support, and delivered the end-to-end demo and presentation.",
    },
    role: {
      zh: "AI 产品定义与前后端 Demo 交付",
      en: "AI product definition & end-to-end demo delivery",
    },
    image: image("dayuyan"),
    imageAlt: {
      zh: "答于言文档解析引擎的实际界面",
      en: "Actual interface of the DaYuYan document engine",
    },
    stack: ["On-device AI", "Qwen VL", "OCR"],
    github: "https://github.com/Maropion03/DaYuYan-engine",
  },
  {
    id: "requirement-review",
    title: {
      zh: "让不同视角，\n一起思考。",
      en: "Different perspectives.\nA better product.",
    },
    subtitle: {
      zh: "PRD 评审助手 / 多 Agent 工作台",
      en: "Requirement Review / Multi-agent workspace",
    },
    category: {
      zh: "产品判断 × Agent 协作",
      en: "Product thinking meets agent collaboration",
    },
    summary: {
      zh: "把研发、设计与测试的视角，放进一个过程可见的评审工作台。",
      en: "A visible review process bringing engineering, design and QA perspectives together.",
    },
    detail: {
      zh: "基于 CrewAI 设计研发、设计和测试三类 Agent 的并行评审机制，以六个维度组织结构化结论。通过实时进度、运行日志和报告切换降低长任务的不确定感，完成前后端、Docker 部署和报告导出。",
      en: "Designed parallel engineering, design and QA review agents with CrewAI, organizing findings across six dimensions. Live progress, run logs and report navigation make long-running reviews easier to follow. Delivered the frontend, backend, Docker setup and report export.",
    },
    role: {
      zh: "独立产品设计与开发",
      en: "Independent product design & development",
    },
    image: image("requirement-review"),
    imageAlt: {
      zh: "PRD 智能评审工作台的实际界面",
      en: "Actual interface of the requirement review workspace",
    },
    stack: ["CrewAI", "FastAPI", "SSE"],
    live: "https://awesome-requirement-review-agent.vercel.app/single-page-shell.html",
    github: "https://github.com/Maropion03/awesome-requirement-review-agent",
  },
  {
    id: "spirit-construct",
    title: { zh: "Spirit Construct / 灵构", en: "Spirit Construct" },
    subtitle: {
      zh: "面向 AI 产品经理的工具箱",
      en: "A toolkit for AI product managers",
    },
    category: { zh: "产品工具", en: "Product tools" },
    summary: {
      zh: "将模型 ROI 计算、参数调试与 PRD 生成整合进一个工作台。",
      en: "Model ROI estimation, parameter tuning and PRD generation in one workspace.",
    },
    detail: {
      zh: "面向非技术 AI 产品经理完成需求定义、UI/UX 与 MVP 开发，接入多模型服务、OAuth 登录和 SSE 流式反馈。",
      en: "Defined and built an MVP for non-technical AI product managers, with multi-model services, OAuth and streaming feedback.",
    },
    role: {
      zh: "独立产品设计与开发",
      en: "Independent product design & development",
    },
    image: image("spirit-construct"),
    imageAlt: {
      zh: "Spirit Construct 灵构实际界面",
      en: "Actual interface of Spirit Construct",
    },
    stack: ["Supabase", "SSE", "Multi-model"],
    live: "https://spirit-construct-maropion.top/",
    github: "https://github.com/Maropion03/Spirit-Construct-AIPM-stack",
  },
  {
    id: "eval-studio",
    title: { zh: "Eval Studio", en: "Eval Studio" },
    subtitle: { zh: "LLM 评估工作台", en: "An LLM evaluation workspace" },
    category: { zh: "模型评估", en: "Model evaluation" },
    summary: {
      zh: "用会话隔离、三维指标和 Diff 视图，比较模型的不同回答。",
      en: "Compare model responses with isolated sessions, three evaluation dimensions and a diff view.",
    },
    detail: {
      zh: "针对模型输出难以横向比较的问题，设计本地优先的评估工作台，以 Faithfulness、Relevance 和 Coherence 三维指标及 Diff 视图帮助定位异常。",
      en: "A local-first workspace for comparing LLM outputs, using faithfulness, relevance and coherence metrics alongside a diff view.",
    },
    role: { zh: "独立开发", en: "Independent development" },
    image: image("eval-studio"),
    imageAlt: {
      zh: "Eval Studio 模型评估平台实际界面",
      en: "Actual interface of Eval Studio",
    },
    stack: ["React", "FastAPI", "SQLite"],
    live: "https://eval-studio-pxygyj528-maropions-projects.vercel.app",
    github: "https://github.com/Maropion03/Eval-studio",
  },
  {
    id: "financial-research",
    title: { zh: "财务舞弊识别研究", en: "Financial fraud detection research" },
    subtitle: {
      zh: "RAG 与多智能体协同",
      en: "RAG & multi-agent collaboration",
    },
    category: { zh: "研究项目", en: "Research project" },
    summary: {
      zh: "将年报检索、双通道文本分析与多 Agent 辩论结合，形成可溯源的审计线索。",
      en: "Combining annual-report retrieval, dual-channel text analysis and multi-agent debate for traceable audit signals.",
    },
    detail: {
      zh: "构建 TextCNN 与 FinBERT 双通道网络，结合 ChromaDB 对年报 MD&A 进行语义切块和检索，组织外部监控、内部审计与主审法官三节点辩论流程。",
      en: "A TextCNN and FinBERT dual-channel network, semantic retrieval of annual-report MD&A with ChromaDB, and a three-agent monitor, auditor and adjudicator debate flow.",
    },
    role: { zh: "研究与方案设计", en: "Research & system design" },
    imageAlt: {
      zh: "财务舞弊识别研究",
      en: "Financial fraud detection research",
    },
    stack: ["RAG", "FinBERT", "ChromaDB"],
  },
];

export interface Experience {
  id: string;
  logo: string;
  company: LocalText;
  role: LocalText;
  department?: LocalText;
  period: string;
  summary: LocalText;
  metrics: LocalText[];
  bullets: LocalText[];
}

const logo = (name: string) => `${import.meta.env.BASE_URL}logos/${name}.svg`;

// Employment and education follow the user-provided latest resume.
// The resume is the source for these claims, not an independent verification.
export const experiences: Experience[] = [
  {
    id: "tencent",
    logo: logo("tencent"),
    company: {
      zh: "腾讯 · 微信事业群",
      en: "Tencent · WXG",
    },
    department: {
      zh: "微信支付 · AI 产品",
      en: "WeChat Pay · AI Product",
    },
    role: {
      zh: "AI 产品经理（微信支付）",
      en: "AI Product Manager / WeChat Pay",
    },
    period: "2026.11 - 至今",
    summary: {
      zh: "围绕微信支付业务场景，推进 AI 智能体与大模型应用产品设计。",
      en: "Designing AI agents and LLM product experiences within WeChat Pay scenarios.",
    },
    metrics: [
      { zh: "微信事业群 WXG", en: "WeChat Group (WXG)" },
      { zh: "微信支付 AI 产品", en: "WeChat Pay AI Product" },
      { zh: "Agent 场景落地", en: "Agent Scenario Delivery" },
    ],
    bullets: [
      {
        zh: "聚焦微信支付核心业务与服务链路，参与 AI 智能体能力规划、交互链路设计与场景化落地验证。",
        en: "Focused on core WeChat Pay service flows, contributing to AI agent capability planning, interaction design and scenario validation.",
      },
    ],
  },
  {
    id: "cecloud",
    logo: logo("cecloud"),
    company: {
      zh: "中国电子云",
      en: "CEC Cloud",
    },
    role: {
      zh: "AI 产品经理（智能体与管控产品）",
      en: "AI Product Manager / Agents & Governance",
    },
    period: "2026.07 - 2026.11",
    summary: {
      zh: "负责第三方 Agent 纳管、资源审批治理、Claw 澄清机制与 Agent 评测体系设计。",
      en: "Third-party agent onboarding, resource approval governance, Claw clarification strategies and agent evaluation systems.",
    },
    metrics: [
      { zh: "A2A / API 第三方纳管", en: "A2A & API Agent Onboarding" },
      { zh: "4 类上下架审批治理", en: "4 Approval Governance Flows" },
      { zh: "4 类 Claw 澄清判定", en: "4-Tier Clarification Logic" },
      { zh: "Judge 评测 + ALHF 链路", en: "Multi-Judge Eval & ALHF" },
    ],
    bullets: [
      {
        zh: "第三方 Agent 纳管：针对客户自建及外部平台 Agent 难以在 AF 中统一使用的问题，撰写纳管 PRD，设计 A2A 与 API 接入、认证校验、资产权限和启停管理；定义引用关系、异步任务状态及结果回传规则，明确平台管理与外部运行的职责边界。",
        en: "Third-party agent onboarding: Authored the onboarding PRD to unify customer-built and external agents in AF, designing A2A and API integration, auth verification, asset permissions and lifecycle controls alongside async state and callback rules.",
      },
      {
        zh: "资源审批与版本治理：负责 AF 平台流程管理与消息待办，覆盖写作智能体、插件/MCP 上下架 4 类审批场景；设计申请发起、审批处理及结果回写流程，制定写作智能体审批后切换版本、插件/MCP 下架后恢复编辑等规则，统一上架范围、状态展示与操作交互。",
        en: "Resource approval & version governance: Led workflow management and todo notifications across four approval scenarios for writing agents and plugin/MCP publishing, defining version-switching and rollback rules.",
      },
      {
        zh: "Claw 澄清机制设计：针对内部 Claw 缺参时猜测参数并执行的问题，撰写澄清策略优化 PRD，定义必须澄清、高影响澄清、说明假设后推进及直接执行 4 类判定；设计逐题跳过、任务受阻与续接、子智能体反馈主智能体补齐后重新派发机制，制定任务完成与策略合规双维验收。",
        en: "Claw clarification mechanism: Authored the clarification strategy PRD to prevent blind parameter guessing, defining four decision tiers, question skipping, blocked-task resumption and sub-agent parameter handoff with dual-dimension acceptance.",
      },
      {
        zh: "Agent 评测体系设计：针对智能体与工作流的质量验收、失败定位和迭代验证需求，设计从评测集、LLM / Code / Agent Judge 评估器到批量实验、版本对比和过程诊断的评测体系；串联日常运行评分、异常样本回流与回归验证，进一步规划 AI 目标识别 → 问题归因 → 修复及策略候选生成 → 固定判据自评 → 人工审核的 ALHF 链路，定义改动应用后的运行反馈与版本恢复机制。",
        en: "Agent evaluation system: Designed end-to-end evaluation from datasets and LLM/Code/Agent Judges to batch experiments, version comparison and trace diagnosis, connecting production scoring, anomaly write-back and an ALHF optimization loop.",
      },
    ],
  },
  {
    id: "baidu",
    logo: logo("baidu"),
    company: {
      zh: "百度 MEG",
      en: "Baidu MEG",
    },
    role: {
      zh: "AI 产品经理",
      en: "AI Product Manager",
    },
    period: "2026.04 - 2026.07",
    summary: {
      zh: "从选题到成片，梳理 AI 创作任务与分镜工作区。",
      en: "AI creation workflows, from ideation to storyboard-based production.",
    },
    metrics: [
      { zh: "工具入口 → 任务入口", en: "Tool → Task Entry" },
      { zh: "全链路 Agent 规划", en: "End-to-End Agent Planning" },
      { zh: "对话 + 分镜工作区", en: "Chat + Storyboard Studio" },
    ],
    bullets: [
      {
        zh: "面向泛知识与资讯创作者，拆解选题、脚本、分镜、素材和数字人成片链路，定位入口割裂、过程不透明与成本问题。",
        en: "Mapped the ideation, script, storyboard, asset and digital-presenter workflow for knowledge and news creators, identifying fragmented entry points, opaque processes and cost issues.",
      },
      {
        zh: "推动由工具入口升级为创作任务入口，设计 Agent 意图理解、任务规划，以及脚本、分镜、素材、配音、审核与导出 Workflow。",
        en: "Developed the creation-task entry concept, including agent intent understanding, task planning and workflows for scripts, storyboards, assets, voice-over, review and export.",
      },
      {
        zh: "设计对话 + 分镜工作区，支持进度展示、镜头级修改、影响提示和版本回退，并结合用户价值、模型成熟度与成本完成 MVP 裁剪。",
        en: "Designed a conversation-and-storyboard workspace with progress, shot-level edits, impact notices and version rollback; scoped the MVP around user value, model readiness and cost.",
      },
    ],
    department: {
      zh: "人工智能创作产品部",
      en: "AI Creation Products",
    },
  },
  {
    id: "meituan",
    logo: logo("meituan"),
    company: {
      zh: "美团 · 点评",
      en: "Meituan / Dianping",
    },
    role: {
      zh: "产品运营（AI / 风控方向）",
      en: "Product Operations / AI & Risk",
    },
    period: "2025.07 - 2025.09",
    summary: {
      zh: "评论线索 Agent、用户与舆情洞察、黑灰产风险分析。",
      en: "Comment-lead agents, user insights and risk intelligence.",
    },
    metrics: [
      { zh: "Agent V35 · 60s → 30s", en: "Agent V35 · 60s → 30s" },
      { zh: "周均匹配线索 300+", en: "300+ Weekly Leads" },
      { zh: "2500+ 情报 · 处置 50+ 商户", en: "2,500+ Signals · 50+ Handled" },
    ],
    bullets: [
      {
        zh: "基于 Claude Sonnet 4.5 和 Nocode 接入美团 SSO，迭代评论线索 Agent 至 V35 并部署；结合 CoT、Few-Shot 和预览纠错，将单帖处理耗时由 60s 降至 30s。",
        en: "Integrated a no-code comment-lead agent with Meituan SSO using Claude Sonnet 4.5, iterating to V35 and deploying it. CoT, few-shot prompts and preview correction reduced per-post processing from 60s to 30s.",
      },
      {
        zh: "分析 1800+ 条小红书帖子，周均匹配潜在用户 300+；通过聚类分级负面舆情，月均识别 150+ 并制定应对策略。",
        en: "Analyzed 1,800+ Xiaohongshu posts, identifying 300+ potential users weekly. Clustered negative sentiment, identifying 150+ cases monthly and developing response strategies.",
      },
      {
        zh: "搭建多城市社群情报网络，分析 2500+ 条风险情报，协助识别并处置 50+ 违规商户。",
        en: "Built a multi-city community intelligence network, analyzed 2,500+ risk signals and helped identify and address 50+ non-compliant merchants.",
      },
    ],
    department: {
      zh: "核心本地商业 · 点评事业部",
      en: "Core Local Commerce / Dianping",
    },
  },
  {
    id: "somark",
    logo: logo("somark"),
    company: {
      zh: "上海守扣科技",
      en: "SoMark",
    },
    role: {
      zh: "AI 产品经理",
      en: "AI Product Manager",
    },
    period: "2026.02 - 2026.04",
    summary: {
      zh: "文档智能产品定义、工作流设计与端侧 Demo 交付。",
      en: "Document intelligence, workflows and on-device demo delivery.",
    },
    metrics: [
      { zh: "AI PC 赛道创意赛亚军", en: "2nd Place · AI PC Track" },
      { zh: "拆解 20+ 文档智能产品", en: "20+ Products Analyzed" },
      { zh: "5 类高敏文档工作流", en: "5 Sensitive-Doc Workflows" },
    ],
    bullets: [
      {
        zh: "接手图片问答 Demo，重定义简历评估、合同对比、票据核验等高敏场景，重构文件解析、结构化提取与场景结论链路；引入 PDF 逐页解析与 OCR，完成前后端 Demo 和答辩交付，获 AI PC 赛道创意赛亚军。",
        en: "Reframed an image-Q&A demo for sensitive-document tasks, rebuilding parsing, structured extraction and contextual judgments with page-by-page PDF parsing and OCR. Delivered the end-to-end demo and presentation; the project won second place in the AI PC creative track.",
      },
      {
        zh: "拆解 20+ 文档智能产品，从用户任务、解析质量、复杂表格、私有化部署和 Agentic OCR 等维度形成定位与路线建议。",
        en: "Studied 20+ document-intelligence products across user tasks, parsing quality, complex tables, private deployment and agentic OCR, informing positioning and roadmap recommendations.",
      },
      {
        zh: "围绕合同、简历、研报等 5 类任务，设计触发、解析、并行分析、结果回写链路，以及状态、异常和结果回看交互。",
        en: "Designed trigger, parsing, parallel-analysis and write-back flows for five task types, including contracts, resumes and research reports, with status, error and result-review interactions.",
      },
    ],
  },
  {
    id: "annpoint",
    logo: logo("annpoint"),
    company: {
      zh: "广州安点科技",
      en: "Annpoint",
    },
    role: {
      zh: "AI 产品经理",
      en: "AI Product Manager",
    },
    period: "2025.11 - 2026.02",
    summary: {
      zh: "多 Agent 评审工作台与 AI 指标助手产品规划。",
      en: "Multi-agent review workspace and AI indicator assistant planning.",
    },
    metrics: [
      { zh: "0 → 1 独立全栈交付", en: "0 → 1 Solo Delivery" },
      { zh: "初稿耗时 2h → 3min", en: "Draft Time 2h → 3min" },
      { zh: "6 大模块 · 25 项验收标准", en: "6 Modules · 25 Criteria" },
    ],
    bullets: [
      {
        zh: "独立 0 → 1 完成 PRD 智能评审工作台，基于 CrewAI 搭建研发、设计、测试三类 Agent 并行评审，按 6 个维度输出结论；完成前后端、Docker 部署和导出，将初稿耗时由约 2 小时降至约 3 分钟。",
        en: "Independently built a PRD review workspace with parallel engineering, design and QA agents in CrewAI, producing findings across six dimensions. Delivered frontend, backend, Docker deployment and export, reducing first-draft time from about two hours to about three minutes.",
      },
      {
        zh: "围绕 PineScript 生成和验证难点，规划期货指标 AI 助手的 6 个模块、25 项验收标准与 MVP，设计需求输入、流式生成、代码编辑、错误定位与解释链路。",
        en: "Planned six modules, 25 acceptance criteria and the MVP for an AI indicator assistant, covering requirements, streaming PineScript generation, editing, error location and explanation.",
      },
    ],
  },
  {
    id: "gtht",
    logo: logo("gtht"),
    company: {
      zh: "国泰海通证券",
      en: "Guotai Haitong Securities",
    },
    role: {
      zh: "行业研究",
      en: "Industry Research",
    },
    period: "2025.09 - 2025.11",
    summary: {
      zh: "新能源发债项目财务核查与行业研究。",
      en: "Financial review and research for a renewable-energy bond project.",
    },
    metrics: [
      { zh: "三峡新能源发债项目", en: "Three Gorges Bond Project" },
      { zh: "应收账款与现金流核查", en: "Cash Flow & Solvency Review" },
    ],
    bullets: [
      {
        zh: "参与三峡新能源发债项目财务核查与行业研究，分析应收账款、经营现金流和偿债能力，支持发债项目材料准备。",
        en: "Supported financial review and industry research for a China Three Gorges Renewables bond project, analyzing receivables, operating cash flow and debt-servicing capacity, and preparing project materials.",
      },
    ],
    department: {
      zh: "债务融资部",
      en: "Debt Financing",
    },
  },
  {
    id: "shinewing",
    logo: logo("shinewing"),
    company: {
      zh: "信永中和会计师事务所",
      en: "ShineWing",
    },
    role: {
      zh: "审计实习生",
      en: "Audit Intern",
    },
    period: "2024.06 - 2024.09",
    summary: {
      zh: "库存数据分析与多家子公司的业务流看板。",
      en: "Inventory analysis and business-flow dashboards across subsidiaries.",
    },
    metrics: [
      { zh: "聚类识别 42 处异常记录", en: "42 Anomalies Identified" },
      { zh: "15 家子公司业务流看板", en: "15-Subsidiary Dashboards" },
    ],
    bullets: [
      {
        zh: "基于库存数据聚类识别 42 处异常记录，并搭建覆盖 15 家子公司的业务流看板，支持审计复核与项目复盘。",
        en: "Identified 42 anomalous inventory records through clustering and built business-flow dashboards spanning 15 subsidiaries to support audit review and project retrospectives.",
      },
    ],
  },
];

export interface Education {
  id: string;
  logo: string;
  school: LocalText;
  degree: LocalText;
  period: string;
  note?: LocalText;
}

export const education: Education[] = [
  {
    id: "cityu",
    logo: logo("cityu"),
    school: {
      zh: "香港城市大学",
      en: "City University of Hong Kong",
    },
    degree: {
      zh: "计算机科学与技术（商业人工智能）· 硕士",
      en: "Master’s · Artificial Intelligence in Business",
    },
    period: "2026.09 - 2027.06",
    note: {
      zh: "QS 62 · 商业 GenAI / 金融科技与 AI / 预测建模",
      en: "QS 62 · GenAI in Business, FinTech & Predictive Modeling",
    },
  },
  {
    id: "gdufe",
    logo: logo("gdufe"),
    school: {
      zh: "广东财经大学",
      en: "Guangdong University of Finance and Economics",
    },
    degree: {
      zh: "会计学 · 本科",
      en: "Bachelor’s degree · Accounting",
    },
    period: "2022.09 - 2026.06",
    note: {
      zh: "GPA 3.86 / 5 · 专业前 10%",
      en: "GPA 3.86 / 5 · Top 10%",
    },
  },
];
