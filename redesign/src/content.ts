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
  company: LocalText;
  role: LocalText;
  period: string;
  summary: LocalText;
}

export const experiences: Experience[] = [
  {
    company: { zh: "百度 MEG", en: "Baidu MEG" },
    role: { zh: "AI 产品经理", en: "AI Product Manager" },
    period: "2026.04 - 2026.07",
    summary: {
      zh: "从选题到成片，梳理 AI 创作任务与分镜工作区。",
      en: "AI creation workflows, from ideation to storyboard-based production.",
    },
  },
  {
    company: { zh: "上海守扣科技", en: "Shanghai SoMark" },
    role: { zh: "AI 产品经理", en: "AI Product Manager" },
    period: "2026.02 - 2026.04",
    summary: {
      zh: "文档智能产品定义、工作流设计与端侧 Demo 交付。",
      en: "Document intelligence, workflows and on-device demo delivery.",
    },
  },
  {
    company: { zh: "广州安点科技", en: "Guangzhou Andian" },
    role: { zh: "AI 产品经理", en: "AI Product Manager" },
    period: "2025.11 - 2026.02",
    summary: {
      zh: "多 Agent 评审工作台与 AI 指标助手产品规划。",
      en: "Multi-agent review workspace and AI indicator assistant planning.",
    },
  },
  {
    company: { zh: "美团 · 点评", en: "Meituan / Dianping" },
    role: { zh: "产品运营（AI / 风控）", en: "Product Operations / AI & Risk" },
    period: "2025.07 - 2025.09",
    summary: {
      zh: "评论线索结构化、文本数据洞察与风险情报分析。",
      en: "Structured comment workflows, text insights and risk intelligence.",
    },
  },
  {
    company: { zh: "国泰海通证券", en: "Guotai Haitong Securities" },
    role: { zh: "行业研究", en: "Industry Research" },
    period: "2025.08 - 2025.10",
    summary: {
      zh: "新能源发债项目财务核查与行业研究。",
      en: "Financial review and industry research for a renewable-energy bond project.",
    },
  },
  {
    company: { zh: "信永中和", en: "ShineWing" },
    role: { zh: "审计实习生", en: "Audit Intern" },
    period: "2024.06 - 2024.09",
    summary: {
      zh: "库存数据分析与多家子公司的业务流看板。",
      en: "Inventory analysis and business-flow dashboards across subsidiaries.",
    },
  },
];
