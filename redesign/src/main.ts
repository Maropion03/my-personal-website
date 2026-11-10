import { gsap } from "gsap";
import {
  projects,
  experiences,
  education,
  skillGroups,
  t,
  type Language,
  type Project,
  type Experience,
} from "./content";
import type { JellyfishController, JellyfishMode } from "./jellyfish";
import "./styles.css";
import "./organizations.css";

const app = document.querySelector<HTMLDivElement>("#app")!;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const systemDark = matchMedia("(prefers-color-scheme: dark)");
const resume = `${import.meta.env.BASE_URL}resume.pdf`;
const portrait = new URL("../../assets/hero-portrait.jpg", import.meta.url)
  .href;
const favicon = new URL("../../assets/favicon.svg", import.meta.url).href;
const wechatQR = new URL("../../assets/wechat-qr.jpg", import.meta.url).href;
const feishuQR = new URL("../../assets/feishu-qr.png", import.meta.url).href;
const e = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const save = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Storage is optional. */
  }
};
let lang: Language = read("maropion-language") === "en" ? "en" : "zh";
let theme = read("maropion-theme") ?? (systemDark.matches ? "dark" : "light");
let current = 0;
let busy = false;
let queued: number | null = null;
let menuOpen = false;
let timeline: gsap.core.Timeline | undefined;
let dialogReturn: HTMLElement | null = null;
let activeDialog:
  | "works"
  | "experience"
  | "skills"
  | "wechat"
  | Project
  | null = null;
let activeQrChannel: "wechat" | "feishu" = "wechat";
let renderGeneration = 0;
let selectedExperience =
  experiences.find((ex) => location.hash === `#internship-${ex.id}`)?.id ??
  experiences[0].id;
let experienceBusy = false;
let experienceQueued: string | null = null;
let experienceTransition: gsap.core.Timeline | undefined;
const experienceTransitionDuration = 0.58;
const featured = projects;
const projectSceneIds = featured.map((project, index) =>
  index === 0 ? "projects" : `project-${project.id}`,
);
const sceneIds = ["hero", "experience", ...projectSceneIds, "about", "contact"];
const chapters = sceneIds.map((id) =>
  projectSceneIds.includes(id) ? "projects" : id,
);
const sceneTransitionDuration = 0.88;
const tr = (zh: string, en: string) => e(lang === "zh" ? zh : en);
const chapterLabels = () => [
  tr("首页", "Home"),
  tr("实习经历", "Experience"),
  tr("作品", "Work"),
  tr("关于我", "About"),
  tr("联系", "Contact"),
];
const chapterKeys = ["hero", "experience", "projects", "about", "contact"];
const padSceneNum = (n: number) => String(n).padStart(2, "0");

function organizationLogo(
  source: string,
  id: string,
  deferred = true,
): string {
  return `<span class="organization-logo" data-org="${e(id)}"><img ${deferred ? "data-src" : "src"}="${e(source)}" alt="" width="136" height="64" /></span>`;
}

function experienceLinksMarkup(ex: Experience): string {
  if (!ex.links?.length) return "";
  return `<div class="internship-links" aria-label="${tr("相关文档与作品链接", "Related documents and links")}">${ex.links
    .map(
      (link) =>
        `<a class="evidence-link" href="${e(link.url)}" target="_blank" rel="noopener noreferrer"><span>${e(t(link.label, lang))}</span><i aria-hidden="true">↗</i></a>`,
    )
    .join("")}</div>`;
}

function ragArchitectureSvg(compact = false): string {
  const shortRisk = lang === "zh" ? "短频风险特征" : "Short-Window Risk";
  const longSem = lang === "zh" ? "长文语义表征" : "Long-Context Semantics";
  const chromaLabel =
    lang === "zh"
      ? "ChromaDB · 百份年报 MD&A 语义切块与靶向 RAG 检索"
      : "ChromaDB · 100+ Annual Report MD&A Chunking & Targeted RAG";
  const debateLabel =
    lang === "zh"
      ? "Multi-Agent 协同辩论流"
      : "Multi-Agent Collaborative Debate Flow";
  const extNode = lang === "zh" ? "外部监控" : "Monitor";
  const intNode = lang === "zh" ? "内部审计" : "Auditor";
  const judgeNode = lang === "zh" ? "主审法官" : "Chief Judge";
  const footerMain =
    lang === "zh"
      ? "F1 领跑单模型基线 · 白盒证据溯源"
      : "F1 Outperforms Single-Model Baseline · Traceable Citations";
  const footerSub =
    lang === "zh"
      ? "1:3 极度不平衡控制集验证"
      : "Validated on 1:3 Imbalanced Control Set";

  return `<svg class="rag-diagram ${compact ? "rag-diagram--compact" : ""}" viewBox="0 0 420 290" fill="none" role="img" aria-label="${tr("双通道 RAG 与多智能体协同辩论架构图", "Dual-channel RAG and multi-agent debate architecture diagram")}">
    <g font-family="IBM Plex Mono, PingFang SC, monospace">
      <rect x="20" y="22" width="160" height="44" rx="3" fill="var(--paper)" stroke="var(--line)" stroke-width="1.2"/>
      <text x="100" y="42" text-anchor="middle" fill="var(--accent)" font-size="11" font-weight="600">TextCNN</text>
      <text x="100" y="57" text-anchor="middle" fill="var(--muted)" font-size="8.5">${e(shortRisk)}</text>

      <rect x="240" y="22" width="160" height="44" rx="3" fill="var(--paper)" stroke="var(--line)" stroke-width="1.2"/>
      <text x="320" y="42" text-anchor="middle" fill="var(--accent)" font-size="11" font-weight="600">FinBERT</text>
      <text x="320" y="57" text-anchor="middle" fill="var(--muted)" font-size="8.5">${e(longSem)}</text>

      <path d="M100 66 L100 90 M96 84 L100 90 L104 84" stroke="var(--accent)" stroke-width="1.3" fill="none"/>
      <path d="M320 66 L320 90 M316 84 L320 90 L324 84" stroke="var(--accent)" stroke-width="1.3" fill="none"/>

      <rect x="20" y="92" width="380" height="36" rx="3" fill="var(--paper)" stroke="var(--gold)" stroke-width="1.2"/>
      <text x="210" y="114" text-anchor="middle" fill="var(--ink)" font-size="9.5" font-weight="600">${e(chromaLabel)}</text>

      <path d="M210 128 L210 148 M206 142 L210 148 L214 142" stroke="var(--accent)" stroke-width="1.3" fill="none"/>

      <rect x="20" y="150" width="380" height="90" rx="4" fill="var(--paper)" stroke="var(--accent)" stroke-width="1.4"/>
      <text x="210" y="170" text-anchor="middle" fill="var(--accent)" font-size="10.5" font-weight="600">${e(debateLabel)}</text>

      <g font-size="9">
        <rect x="34" y="182" width="104" height="44" rx="3" fill="var(--paper-2)" stroke="var(--line)"/>
        <text x="86" y="201" text-anchor="middle" fill="var(--ink)" font-weight="600">${e(extNode)}</text>
        <text x="86" y="216" text-anchor="middle" fill="var(--muted)" font-size="8">External Signal</text>

        <path d="M142 204 L154 204" stroke="var(--accent)" stroke-width="1.2"/>

        <rect x="158" y="182" width="104" height="44" rx="3" fill="var(--paper-2)" stroke="var(--line)"/>
        <text x="210" y="201" text-anchor="middle" fill="var(--ink)" font-weight="600">${e(intNode)}</text>
        <text x="210" y="216" text-anchor="middle" fill="var(--muted)" font-size="8">Internal Audit</text>

        <path d="M266 204 L278 204" stroke="var(--accent)" stroke-width="1.2"/>

        <rect x="282" y="182" width="104" height="44" rx="3" fill="var(--paper-2)" stroke="var(--line)"/>
        <text x="334" y="201" text-anchor="middle" fill="var(--ink)" font-weight="600">${e(judgeNode)}</text>
        <text x="334" y="216" text-anchor="middle" fill="var(--muted)" font-size="8">Final Verdict</text>
      </g>

      <text x="210" y="262" text-anchor="middle" fill="var(--ink)" font-size="10" font-weight="600">${e(footerMain)}</text>
      <text x="210" y="278" text-anchor="middle" fill="var(--muted)" font-size="8.5">${e(footerSub)}</text>
    </g>
  </svg>`;
}

function experienceDetail(ex: Experience): string {
  return `<div class="internship-identity">${organizationLogo(ex.logo, ex.id)}<div><h3 id="internship-title-${ex.id}">${e(t(ex.company, lang))}</h3>${ex.department ? `<p class="internship-department">${e(t(ex.department, lang))}</p>` : ""}</div></div>
    <div class="internship-meta"><p>${e(t(ex.role, lang))}</p><p class="internship-period">${e(ex.period)}</p></div>
    <div class="internship-metrics" aria-label="${tr("核心成果指标", "Key impact metrics")}">${ex.metrics.map((m) => `<span class="metric-pill"><i aria-hidden="true"></i>${e(t(m, lang))}</span>`).join("")}</div>
    ${experienceLinksMarkup(ex)}
    <p class="internship-summary">${e(t(ex.summary, lang))}</p>
    <ul class="internship-bullets">${ex.bullets.map((bullet) => `<li>${e(t(bullet, lang))}</li>`).join("")}</ul>`;
}

function experienceScene(): string {
  return `<section class="scene experience-scene" id="experience" data-chapter="experience" aria-labelledby="experience-title" inert>
    <div class="scene-inner internship-layout">
      <div class="internship-heading" data-copy><div><p class="eyebrow">${tr("沿途的实践", "Learning by building")}</p><h2 id="experience-title">${tr("实习经历", "Experience, in practice.")}</h2></div><button class="text-link" data-dialog="experience">${tr("完整经历", "Full experience")} <span aria-hidden="true">↗</span></button></div>
      <nav class="internship-timeline" aria-label="${tr("实习经历时间线", "Experience timeline")}"><ol>${experiences.map((ex) => `<li><a class="internship-node" href="#internship-${ex.id}" data-experience="${ex.id}" aria-label="${e(t(ex.company, lang))}, ${e(ex.period)}" ${ex.id === selectedExperience ? 'aria-current="location"' : ""}><span class="internship-node-mark" aria-hidden="true"></span><span class="internship-node-label"><span>${e(t(ex.company, lang))}</span><time>${e(ex.period)}</time></span></a></li>`).join("")}</ol></nav>
      <div class="internship-deck" tabindex="0" role="region" aria-label="${tr("实习经历内容，使用上下方向键切换", "Internship details. Use up and down arrows to change employers.")}" data-depth>${experiences.map((ex) => `<section class="internship-panel" id="internship-${ex.id}" data-employer="${ex.id}" aria-labelledby="internship-title-${ex.id}" aria-hidden="${ex.id !== selectedExperience}" ${ex.id !== selectedExperience ? "inert" : ""}>${experienceDetail(ex)}</section>`).join("")}</div>
    </div>
  </section>`;
}

function markExperience(id: string): void {
  selectedExperience = id;
  const activeIdx = Math.max(
    0,
    experiences.findIndex((ex) => ex.id === id),
  );
  const progress =
    experiences.length > 1 ? activeIdx / (experiences.length - 1) : 1;
  const rail = document.querySelector<HTMLElement>(".internship-timeline");
  rail?.style.setProperty("--timeline-progress", progress.toFixed(3));

  document
    .querySelectorAll<HTMLAnchorElement>(".internship-node")
    .forEach((node, idx) => {
      node.classList.toggle("is-passed", idx < activeIdx);
      if (node.dataset.experience === id)
        node.setAttribute("aria-current", "location");
      else node.removeAttribute("aria-current");
    });
  const node = document.querySelector<HTMLElement>(
    `.internship-node[data-experience="${id}"]`,
  );
  if (node && rail) {
    const nodeRect = node.getBoundingClientRect();
    const railRect = rail.getBoundingClientRect();
    if (nodeRect.top < railRect.top)
      rail.scrollTop += nodeRect.top - railRect.top;
    else if (nodeRect.bottom > railRect.bottom)
      rail.scrollTop += nodeRect.bottom - railRect.bottom;
  }
}

function activateExperience(id: string, announce = false): void {
  document
    .querySelectorAll<HTMLElement>(".internship-panel")
    .forEach((panel) => {
      const active = panel.dataset.employer === id;
      panel.classList.toggle("is-current", active);
      panel.classList.remove("is-incoming", "is-outgoing");
      panel.inert = !active;
      panel.setAttribute("aria-hidden", String(!active));
      gsap.set(panel, { autoAlpha: active ? 1 : 0, y: 0 });
      gsap.set(
        panel.querySelectorAll(
          ".internship-identity, .internship-meta, .metric-pill, .evidence-link, .internship-summary, .internship-bullets li",
        ),
        { clearProps: "transform,opacity" },
      );
    });
  markExperience(id);
  if (announce) {
    const ex = experiences.find((item) => item.id === id)!;
    document.querySelector("#scene-announcement")!.textContent =
      `${t(ex.company, lang)} / ${t(ex.role, lang)}`;
  }
}

function changeExperience(id: string, focus = false): void {
  if (!experiences.some((ex) => ex.id === id)) return;
  if (focus)
    document
      .querySelector<HTMLElement>(`.internship-node[data-experience="${id}"]`)
      ?.focus({ preventScroll: true });
  if (experienceBusy) {
    experienceQueued = id;
    return;
  }
  if (selectedExperience === id) return;
  const prevIdx = experiences.findIndex((ex) => ex.id === selectedExperience);
  const nextIdx = experiences.findIndex((ex) => ex.id === id);
  const direction = nextIdx >= prevIdx ? 1 : -1;
  character?.pulse(direction * 0.6);

  if (reduced.matches) {
    activateExperience(id, true);
    return;
  }
  experienceBusy = true;
  const from = document.getElementById(`internship-${selectedExperience}`)!;
  const to = document.getElementById(`internship-${id}`)!;
  from.classList.add("is-outgoing");
  to.classList.add("is-incoming");
  from.inert = true;
  markExperience(id);

  const toItems = to.querySelectorAll(
    ".internship-identity, .internship-meta, .metric-pill, .evidence-link, .internship-summary, .internship-bullets li",
  );
  gsap.set(from, { autoAlpha: 1, y: 0 });
  gsap.set(to, { autoAlpha: 1, y: 0 });
  gsap.set(toItems, { opacity: 0, y: direction * 18 });

  experienceTransition = gsap.timeline({
    onComplete: () => {
      activateExperience(id, true);
      experienceBusy = false;
      const next = experienceQueued;
      experienceQueued = null;
      if (next && next !== selectedExperience) changeExperience(next);
    },
  });
  experienceTransition.to(
    from,
    {
      opacity: 0,
      y: direction * -22,
      duration: 0.28,
      ease: "power2.in",
    },
    0,
  );
  experienceTransition.to(
    toItems,
    {
      opacity: 1,
      y: 0,
      duration: 0.42,
      stagger: 0.032,
      ease: "power3.out",
    },
    0.12,
  );
}

function stepExperience(direction: number): void {
  if (busy || experienceBusy) return;
  const index = experiences.findIndex((ex) => ex.id === selectedExperience);
  const next = index + direction;
  if (next < 0 || next >= experiences.length) go(current + direction);
  else changeExperience(experiences[next].id);
}

function projectScene(project: Project, index: number): string {
  const mediaMarkup = project.image
    ? `<img data-src="${e(project.image)}" alt="${e(t(project.imageAlt, lang))}" loading="lazy" width="1600" height="1000" />`
    : `<div class="stage-rag-diagram">${ragArchitectureSvg(false)}</div>`;
  const secondaryAction = project.live
    ? `<a class="text-link" href="${e(project.live)}" target="_blank" rel="noopener noreferrer">${tr("在线体验", "Try it live")} <span aria-hidden="true">↗</span></a>`
    : project.github
      ? `<a class="text-link" href="${e(project.github)}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>`
      : "";
  return `<section class="scene project-scene project-scene--${project.id}" id="${projectSceneIds[index]}" data-chapter="projects" aria-labelledby="title-${project.id}" inert>
    <div class="scene-inner project-layout">
      <figure class="project-visual" data-depth>
        <div class="project-image-wrap">
          <span class="voxel-corner voxel-corner--tl" aria-hidden="true"></span>
          <span class="voxel-corner voxel-corner--br" aria-hidden="true"></span>
          <span class="project-index" aria-hidden="true">${padSceneNum(index + 1)} / ${padSceneNum(featured.length)}</span>
          ${mediaMarkup}
        </div>
        <figcaption>${e(t(project.subtitle, lang))}</figcaption>
      </figure>
      <div class="project-copy" data-copy>
        <p class="eyebrow">${e(t(project.category, lang))}</p>
        <h2 id="title-${project.id}">${e(t(project.title, lang))}</h2>
        <div class="project-metrics" aria-label="${tr("项目核心指标", "Project highlights")}">${project.metrics.map((m) => `<span class="metric-pill"><i aria-hidden="true"></i>${e(t(m, lang))}</span>`).join("")}</div>
        <p class="project-summary">${e(t(project.summary, lang))}</p>
        <ul class="stack" aria-label="${tr("项目技术", "Project technologies")}">${project.stack.map((s) => `<li>${e(s)}</li>`).join("")}</ul>
        <div class="project-actions"><button class="button button--ink" data-project="${project.id}">${tr("看看这个项目", "Explore the project")} <span aria-hidden="true">↗</span></button>
        ${secondaryAction}</div>
      </div>
    </div>
    <button class="all-work-link text-link" data-dialog="works">${tr("全部作品 (6)", "All projects (6)")} <span aria-hidden="true">↗</span></button>
  </section>`;
}

function modeForScene(index: number): {
  mode: JellyfishMode;
  variant: number;
  attr: string;
} {
  const id = sceneIds[index];
  if (id === "hero") return { mode: "hero", variant: 0, attr: "hero" };
  if (id === "experience")
    return { mode: "experience", variant: 0, attr: "experience" };
  if (id === "about") return { mode: "about", variant: 0, attr: "about" };
  if (id === "contact") return { mode: "contact", variant: 0, attr: "contact" };
  const pIdx = Math.max(0, projectSceneIds.indexOf(id)) % 3;
  return {
    mode: "projects",
    variant: pIdx,
    attr: `projects-${pIdx}`,
  };
}

function render(): void {
  experienceTransition?.kill();
  experienceBusy = false;
  experienceQueued = null;
  menuOpen = false;
  const labels = chapterLabels();
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.documentElement.dataset.theme = theme;
  app.innerHTML = `
    <header class="site-header">
      <a class="wordmark" href="#hero" data-go="hero" aria-label="Maropion ${tr("首页", "home")}"><img src="${e(favicon)}" width="24" height="24" alt="" />Maropion<span aria-hidden="true">.</span></a>
      <nav class="main-nav" aria-label="${tr("主要导航", "Main navigation")}">${chapterKeys.map((id, i) => `<a href="#${id}" data-go="${id}">${labels[i]}</a>`).join("")}</nav>
      <div class="header-actions"><button class="language-toggle" aria-label="${tr("EN：切换为英文", "中: Switch to Chinese")}">${lang === "zh" ? "EN" : "中"}</button><button class="theme-toggle" aria-label="${tr(theme === "dark" ? "日间：切换为浅色" : "夜间：切换为深色", theme === "dark" ? "Light: use light theme" : "Dark: use dark theme")}">${tr(theme === "dark" ? "日间" : "夜间", theme === "dark" ? "Light" : "Dark")}</button><a class="resume-link" href="${e(resume)}" download="Maropion-Resume.pdf" data-track="cta_nav_resume">${tr("简历", "Résumé")} <span aria-hidden="true">↗</span></a><button class="menu-toggle" aria-expanded="false" aria-controls="mobile-nav">${tr("目录", "Menu")}</button></div>
    </header>
    <nav id="mobile-nav" class="mobile-nav" aria-label="${tr("移动导航", "Mobile navigation")}" inert>${chapterKeys.map((id, i) => `<a href="#${id}" data-go="${id}">${labels[i]} <span aria-hidden="true">↗</span></a>`).join("")}</nav>
    <main class="stage" id="main" tabindex="-1" aria-label="${tr("Maropion 个人作品集", "Maropion portfolio")}">
      <div class="stage-voxels" aria-hidden="true">
        <i style="--speed: 1.2"></i>
        <i style="--speed: -0.9"></i>
        <i style="--speed: 1.5"></i>
        <i style="--speed: -1.1"></i>
        <i style="--speed: 0.7"></i>
        <i style="--speed: -1.4"></i>
        <i style="--speed: 1.0"></i>
      </div>
      <div class="character" tabindex="0" role="img" aria-label="${tr("原创体素水母，可拖动旋转，也可用左右方向键旋转", "Original voxel jellyfish. Drag or use left and right arrow keys to rotate.")}" data-mode="hero"><img class="character-fallback" src="${e(favicon)}" data-fallback-src="${import.meta.env.BASE_URL}images/jellyfish-concept.png" width="1200" height="1328" alt="" /></div>
      <section class="scene hero-scene" id="hero" data-chapter="hero" aria-labelledby="hero-title">
        <div class="scene-inner hero-layout">
          <div class="hero-copy" data-copy><p class="eyebrow">AI Product Manager & Builder</p><h1 id="hero-title" class="display-name" data-text="Maropion.">Maropion<span>.</span></h1><p class="hero-statement">${tr("把想法，做成体验。", "Ideas, made tangible.")}</p><p class="hero-intro">${tr("在 AI、交互与想象之间，\n探索新的可能。", "Exploring the space between\nAI, interaction and imagination.").replaceAll("\n", "<br>")}</p><div class="hero-actions"><a class="button button--accent" href="#experience" data-go="experience">${tr("先看实习经历", "My experience")} <span aria-hidden="true">↗</span></a><a class="text-link" href="#projects" data-go="projects">${tr("精选作品", "Selected work")} <span aria-hidden="true">↗</span></a></div></div>
        </div>
        <p class="character-hint"><span class="hint-dot" aria-hidden="true"></span>${tr("和水母打个招呼，拖动试试。", "Say hello. Give the jellyfish a little turn.")}</p>
      </section>
      ${experienceScene()}
      ${featured.map(projectScene).join("")}
      <section class="scene about-scene" id="about" data-chapter="about" aria-labelledby="about-title" inert>
        <div class="scene-inner about-layout"><figure class="portrait" data-depth><div class="portrait-card"><img data-src="${e(portrait)}" alt="Maropion" loading="lazy" width="600" height="800" /><span class="portrait-pixel" aria-hidden="true"></span></div><figcaption>Maropion</figcaption></figure><div class="about-copy" data-copy><p class="eyebrow">${tr("认识一下", "A little about me")}</p><h2 id="about-title">${tr("从商业问题，\n走向 AI 体验。", "A business mind.\nA builder’s instinct.").replaceAll("\n", "<br>")}</h2><p class="about-intro">${tr("会计学背景，AI 产品经理与独立开发者。喜欢把模糊的想法，变成可以体验、讨论和验证的东西。", "An accounting background, an AI product perspective, and a habit of building. I like turning ambiguous ideas into something people can try, discuss and improve.")}</p><div class="education education--branded">${education.map((school) => `<div class="education-row">${organizationLogo(school.logo, school.id)}<div><h3>${e(t(school.school, lang))}</h3><p>${e(t(school.degree, lang))}</p><time>${e(school.period)}</time>${school.note ? `<p class="education-note">${e(t(school.note, lang))}</p>` : ""}</div></div>`).join("")}</div><div class="about-actions"><button class="button button--ink" data-dialog="skills">${tr("能力图谱", "Capability map")} <span aria-hidden="true">↗</span></button><a class="text-link" href="${e(resume)}" download="Maropion-Resume.pdf" data-track="cta_about_resume">${tr("下载完整简历", "Download my résumé")} <span aria-hidden="true">↗</span></a></div></div></div>
      </section>
      <section class="scene contact-scene" id="contact" data-chapter="contact" aria-labelledby="contact-title" inert>
        <div class="scene-inner contact-layout"><div data-copy><p class="eyebrow">${tr("下一个想法，从一次对话开始", "The next idea starts with a conversation")}</p><h2 id="contact-title">${tr("一起，\n做点有意思的。", "Let’s make\nsomething matter.").replaceAll("\n", "<br>")}</h2><p class="contact-intro">${tr("关于 AI 产品岗位，或一个值得做出来的项目。", "For an AI product role, or an idea worth bringing to life.")}</p><a class="email-link" href="mailto:maropion@163.com" data-track="cta_contact_email">maropion@163.com <span aria-hidden="true">↗</span></a><div class="contact-actions"><button class="button button--accent" data-dialog="wechat" data-qr-open="wechat" data-track="cta_contact_qr">${tr("微信扫码", "WeChat QR")} <span aria-hidden="true">↗</span></button><button class="button button--ink" data-dialog="wechat" data-qr-open="feishu" data-track="cta_contact_feishu">${tr("飞书扫码", "Feishu QR")} <span aria-hidden="true">↗</span></button><a class="text-link" href="https://github.com/Maropion03" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a><button class="text-link" data-copy="18565682722">${tr("复制手机号", "Copy phone number")}</button></div></div></div>
      </section>
    </main>
    <footer class="scene-footer">
      <p>© 2026 Maropion</p>
      <div class="scene-progress" aria-hidden="true">
        <span class="scene-counter">01 / ${padSceneNum(sceneIds.length)}</span>
        <span class="scene-progress-track"><i class="scene-progress-fill"></i></span>
        <span class="chapter-name"></span>
      </div>
      <div class="scene-controls"><button data-step="-1" aria-label="${tr("上一幕", "Previous scene")}"><span aria-hidden="true">←</span><span>${tr("上一幕", "Previous")}</span></button><button data-step="1" aria-label="${tr("下一幕", "Next scene")}"><span>${tr("下一幕", "Next")}</span><span aria-hidden="true">→</span></button></div>
    </footer>
    <div class="sr-only" id="scene-announcement" aria-live="polite" aria-atomic="true"></div>
    <dialog class="detail-dialog" aria-labelledby="dialog-title"><div class="dialog-surface"><button class="dialog-close" aria-label="${tr("关闭详情", "Close details")}">×</button><div class="dialog-content"></div></div></dialog>
    <div class="toast" role="status"></div>`;

  wire();
  const generation = ++renderGeneration;
  const host = document.querySelector<HTMLElement>(".character")!;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      void import("./jellyfish")
        .then(({ createJellyfish }) => {
          if (generation !== renderGeneration) return;
          character = createJellyfish(host);
          const { mode, variant } = modeForScene(current);
          character.setVisible(true);
          character.setMode(mode, variant);
        })
        .catch(() => {
          host.dataset.fallback = "true";
          const fallback = host.querySelector<HTMLImageElement>("img");
          if (fallback?.dataset.fallbackSrc)
            fallback.src = fallback.dataset.fallbackSrc;
        });
    }),
  );
  activate(current);
  activateExperience(selectedExperience);
  if (current === 0 && !reduced.matches) {
    gsap.from(".hero-copy > *", {
      opacity: 0,
      y: 26,
      duration: 0.65,
      stagger: 0.075,
      ease: "power3.out",
      clearProps: "transform,opacity",
    });
    gsap.from(".character", {
      scale: 0.9,
      y: 18,
      duration: 0.8,
      ease: "power3.out",
      clearProps: "transform",
    });
    gsap.from(".stage-voxels i", {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      stagger: 0.06,
      ease: "back.out(2)",
      clearProps: "transform,opacity",
    });
  }
}

let character: JellyfishController | undefined;
function loadSceneMedia(index: number): void {
  document
    .querySelectorAll<HTMLImageElement>(`#${sceneIds[index]} img[data-src]`)
    .forEach((image) => {
      image.loading = "eager";
      image.src = image.dataset.src!;
      delete image.dataset.src;
    });
}

function updateFooterProgress(index: number): void {
  const label = chapterLabels()[chapterKeys.indexOf(chapters[index])];
  const chapterEl = document.querySelector(".chapter-name");
  if (chapterEl) chapterEl.textContent = label;
  const counterEl = document.querySelector(".scene-counter");
  if (counterEl)
    counterEl.textContent = `${padSceneNum(index + 1)} / ${padSceneNum(sceneIds.length)}`;
  const fillEl = document.querySelector<HTMLElement>(".scene-progress-fill");
  if (fillEl) {
    const ratio = (index + 1) / sceneIds.length;
    fillEl.style.transform = `scaleX(${ratio.toFixed(3)})`;
  }
}

function activate(index: number): void {
  loadSceneMedia(index);
  current = index;
  document.querySelectorAll<HTMLElement>(".scene").forEach((el) => {
    const active = el.id === sceneIds[index];
    el.classList.remove("is-outgoing", "is-incoming");
    el.classList.toggle("is-active", active);
    el.inert = !active;
    el.setAttribute("aria-hidden", String(!active));
    gsap.set(el, { autoAlpha: active ? 1 : 0 });
    gsap.set(el.querySelector(".scene-inner"), {
      clearProps: "transform,opacity,visibility",
    });
    gsap.set(
      el.querySelectorAll(
        "[data-copy] > *, [data-depth], .stack li, .education-row, .metric-pill",
      ),
      { clearProps: "transform,opacity" },
    );
  });
  const stage = document.querySelector<HTMLElement>(".stage")!;
  stage.dataset.chapter = chapters[index];
  stage.style.setProperty("--scene-index", String(index));
  document
    .querySelectorAll<HTMLAnchorElement>(".main-nav a, .mobile-nav a")
    .forEach((link) => {
      if (link.dataset.go === chapters[index])
        link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  const host = document.querySelector<HTMLElement>(".character")!;
  const { mode, variant, attr } = modeForScene(index);
  host.dataset.mode = attr;
  host.classList.remove("is-transitioning");
  host.tabIndex = index === 0 ? 0 : -1;
  host.setAttribute("aria-hidden", String(index !== 0));
  character?.setVisible(true);
  character?.setMode(mode, variant);

  document.querySelector<HTMLButtonElement>('[data-step="-1"]')!.disabled =
    index === 0;
  document.querySelector<HTMLButtonElement>('[data-step="1"]')!.disabled =
    index === sceneIds.length - 1;
  updateFooterProgress(index);
  const label = chapterLabels()[chapterKeys.indexOf(chapters[index])];
  const title =
    document.querySelector(`#${sceneIds[index]} h1, #${sceneIds[index]} h2`)
      ?.textContent ?? label;
  document.querySelector("#scene-announcement")!.textContent = title;
  history.replaceState(null, "", `#${sceneIds[index]}`);
}

function go(index: number): void {
  setMenu(false);
  index = Math.max(0, Math.min(sceneIds.length - 1, index));
  if (index === current) return;
  if (experienceBusy) {
    experienceTransition?.kill();
    experienceBusy = false;
    experienceQueued = null;
    activateExperience(selectedExperience);
  }
  loadSceneMedia(index);
  if (busy) {
    queued = index;
    return;
  }
  const direction = index > current ? 1 : -1;
  const { mode, variant, attr } = modeForScene(index);
  const host = document.querySelector<HTMLElement>(".character")!;
  host.dataset.mode = attr;
  character?.setMode(mode, variant);
  character?.pulse(direction);

  const stage = document.querySelector<HTMLElement>(".stage")!;
  stage.style.setProperty("--scene-index", String(index));
  updateFooterProgress(index);

  if (reduced.matches) {
    activate(index);
    return;
  }
  busy = true;
  const fromScene = document.getElementById(sceneIds[current])!;
  const toScene = document.getElementById(sceneIds[index])!;
  const fromInner = fromScene.querySelector<HTMLElement>(".scene-inner")!;
  const toInner = toScene.querySelector<HTMLElement>(".scene-inner")!;
  const toCopyItems = toScene.querySelectorAll<HTMLElement>("[data-copy] > *");
  const toDepth = toScene.querySelector<HTMLElement>("[data-depth]");
  const toSubItems = toScene.querySelectorAll<HTMLElement>(
    ".stack li, .education-row, .project-metrics .metric-pill",
  );

  fromScene.classList.add("is-outgoing");
  toScene.classList.add("is-incoming");
  fromScene.inert = true;
  gsap.set(fromScene, { autoAlpha: 1 });
  gsap.set(toScene, { autoAlpha: 1 });
  gsap.set(toInner, { scale: 0.97, z: -60 });
  gsap.set(toCopyItems, { opacity: 0, y: direction * 28 });
  if (toDepth) {
    gsap.set(toDepth, {
      opacity: 0,
      y: direction * 36,
      scale: 0.94,
      rotateX: direction * -5,
    });
  }
  if (toSubItems.length) {
    gsap.set(toSubItems, { opacity: 0, y: 12 });
  }

  timeline = gsap.timeline({
    onComplete: () => {
      activate(index);
      busy = false;
      const next = queued;
      queued = null;
      if (next !== null && next !== current) go(next);
    },
  });

  // Outgoing scene glides and fades out cleanly
  timeline.to(
    fromInner,
    {
      y: direction * -32,
      scale: 1.02,
      z: 20,
      duration: 0.42,
      ease: "power2.in",
    },
    0,
  );
  timeline.to(
    fromScene,
    { opacity: 0, duration: 0.38, ease: "power2.inOut" },
    0.04,
  );

  // Incoming scene container settles into place
  timeline.to(
    toInner,
    {
      scale: 1,
      z: 0,
      duration: sceneTransitionDuration,
      ease: "power3.out",
    },
    0.1,
  );

  // Visual / depth container rises with 3D perspective
  if (toDepth) {
    timeline.to(
      toDepth,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 0.68,
        ease: "power3.out",
      },
      0.16,
    );
  }

  // Copy elements stagger in
  if (toCopyItems.length) {
    timeline.to(
      toCopyItems,
      {
        opacity: 1,
        y: 0,
        duration: 0.56,
        stagger: 0.06,
        ease: "power3.out",
      },
      0.18,
    );
  }

  // Stack tags or education rows cascade in
  if (toSubItems.length) {
    timeline.to(
      toSubItems,
      {
        opacity: 1,
        y: 0,
        duration: 0.44,
        stagger: 0.04,
        ease: "power2.out",
      },
      0.34,
    );
  }
}

function indexForHash(hash: string): number {
  const key = hash.replace("#", "");
  if (experiences.some((ex) => key === `internship-${ex.id}`))
    return sceneIds.indexOf("experience");
  if (key === "education" || key === "skills") return sceneIds.indexOf("about");
  return Math.max(0, sceneIds.indexOf(key));
}

function setMenu(value: boolean): void {
  menuOpen = value;
  document.querySelector(".mobile-nav")?.classList.toggle("is-open", value);
  const nav = document.querySelector<HTMLElement>(".mobile-nav");
  if (nav) nav.inert = !value;
  const stage = document.querySelector<HTMLElement>(".stage");
  const footer = document.querySelector<HTMLElement>(".scene-footer");
  if (stage) stage.inert = value;
  if (footer) footer.inert = value;
  document
    .querySelector(".menu-toggle")
    ?.setAttribute("aria-expanded", String(value));
  if (value) nav?.querySelector("a")?.focus();
}

function renderQrDialogContent(): string {
  const isWechat = activeQrChannel === "wechat";
  const qrSrc = isWechat ? wechatQR : feishuQR;
  const qrAlt = isWechat
    ? tr("Maropion 的微信二维码", "Maropion’s WeChat QR code")
    : tr("Maropion 的飞书二维码", "Maropion’s Feishu QR code");
  const note = isWechat
    ? tr(
        "微信扫码添加，或直接复制下方微信号",
        "Scan with WeChat, or copy the WeChat ID below",
      )
    : tr(
        "飞书扫码即可直接发起对话",
        "Scan with Feishu / Lark to start a conversation",
      );

  return `<p class="eyebrow">${tr("认识一下", "Let’s connect")}</p>
    <h2 id="dialog-title">${tr("微信或飞书，随时聊聊。", "Connect on WeChat or Feishu.")}</h2>
    <div class="qr-switcher" role="tablist" aria-label="${tr("选择联系渠道", "Choose contact channel")}">
      <button type="button" role="tab" class="qr-switch-btn ${isWechat ? "is-active" : ""}" aria-selected="${isWechat}" data-qr-channel="wechat">${tr("微信 WeChat", "WeChat")}</button>
      <button type="button" role="tab" class="qr-switch-btn ${!isWechat ? "is-active" : ""}" aria-selected="${!isWechat}" data-qr-channel="feishu">${tr("飞书 Feishu", "Feishu")}</button>
    </div>
    <div class="qr-card-frame">
      <img class="wechat-qr" src="${e(qrSrc)}" alt="${qrAlt}" width="260" height="260" />
      <p class="qr-note">${note}</p>
    </div>
    ${
      isWechat
        ? `<button class="button button--ink" data-copy="MRP18565682722">${tr("复制微信号", "Copy WeChat ID")} ↗</button>`
        : `<button class="button button--ink" data-copy="18565682722">${tr("复制手机号", "Copy phone number")} ↗</button>`
    }`;
}

function showDialog(value: typeof activeDialog): void {
  if (!value) return;
  activeDialog = value;
  const dialog = document.querySelector<HTMLDialogElement>(".detail-dialog")!;
  if (!dialog.open) dialogReturn = document.activeElement as HTMLElement;
  const target = dialog.querySelector(".dialog-content")!;
  if (value === "works") {
    target.innerHTML = `<p class="eyebrow">${tr("继续看看", "More to explore")}</p><h2 id="dialog-title">${tr("全部作品 (6)", "All projects (6)")}</h2><div class="work-index">${projects
      .map(
        (p) =>
          `<button class="work-index-row" data-project="${p.id}">${
            p.image
              ? `<img src="${e(p.image)}" alt="" width="140" height="90" loading="lazy" />`
              : `<span class="research-mark" aria-hidden="true"><span>TextCNN × FinBERT</span><strong>RAG + Agent</strong></span>`
          }<span><strong>${e(t(p.subtitle, lang))}</strong><span>${e(t(p.category, lang))} · ${p.metrics.map((m) => e(t(m, lang))).slice(0, 2).join(" / ")}</span></span><span aria-hidden="true">↗</span></button>`,
      )
      .join("")}</div>`;
  } else if (value === "experience") {
    target.innerHTML = `<p class="eyebrow">${tr("实践与学习", "Practice & learning")}</p><h2 id="dialog-title">${tr("完整实习经历", "Full Experience")}</h2><div class="full-experience">${experiences
      .map(
        (ex) =>
          `<article class="full-experience-entry"><div class="full-experience-heading">${organizationLogo(ex.logo, ex.id, false)}<div><h3>${e(t(ex.company, lang))}</h3><p class="detail-role">${e(t(ex.role, lang))}</p>${ex.department ? `<p class="internship-department">${e(t(ex.department, lang))}</p>` : ""}<p class="internship-period">${e(ex.period)}</p></div></div><div class="internship-metrics">${ex.metrics.map((m) => `<span class="metric-pill"><i aria-hidden="true"></i>${e(t(m, lang))}</span>`).join("")}</div>${experienceLinksMarkup(ex)}<p>${e(t(ex.summary, lang))}</p><ul class="internship-bullets">${ex.bullets.map((bullet) => `<li>${e(t(bullet, lang))}</li>`).join("")}</ul></article>`,
      )
      .join("")}</div><a class="button button--ink" href="${e(resume)}" download="Maropion-Resume.pdf">${tr("完整简历 PDF", "Full résumé PDF")} ↗</a>`;
  } else if (value === "skills") {
    target.innerHTML = `<p class="eyebrow">${tr("产品 × 工程 × 落地", "Product × Engineering × Delivery")}</p><h2 id="dialog-title">${tr("个人能力图谱", "Capability Map")}</h2><div class="skills-modal-grid">${skillGroups
      .map(
        (group) =>
          `<section class="skill-modal-card"><span class="skill-modal-code">A_${e(group.code)}</span><h3>${e(t(group.title, lang))}</h3><ul class="skill-modal-list">${group.items
            .map(
              (item) =>
                `<li><span>${e(t(item.name, lang))}</span><code>${e(item.tag)}</code></li>`,
            )
            .join("")}</ul><p class="skill-modal-desc">${e(t(group.summary, lang))}</p></section>`,
      )
      .join("")}</div>`;
  } else if (value === "wechat") {
    target.innerHTML = renderQrDialogContent();
  } else {
    const visualBlock = value.image
      ? `<img class="detail-image" src="${e(value.image)}" alt="${e(t(value.imageAlt, lang))}" />`
      : value.diagram === "rag-arch"
        ? `<div class="detail-diagram">${ragArchitectureSvg(false)}</div>`
        : "";
    target.innerHTML = `<p class="eyebrow">${e(t(value.category, lang))}</p><h2 id="dialog-title">${e(t(value.subtitle, lang))}</h2><p class="detail-role">${e(t(value.role, lang))}</p><div class="internship-metrics">${value.metrics.map((m) => `<span class="metric-pill"><i aria-hidden="true"></i>${e(t(m, lang))}</span>`).join("")}</div>${visualBlock}<p class="detail-summary">${e(t(value.detail, lang))}</p><ul class="stack">${value.stack.map((s) => `<li>${e(s)}</li>`).join("")}</ul><div class="dialog-actions">${value.live ? `<a class="button button--accent" href="${e(value.live)}" target="_blank" rel="noopener noreferrer">${tr("在线体验", "Try it live")} ↗</a>` : ""}${value.github ? `<a class="text-link" href="${e(value.github)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>` : ""}<button class="text-link" data-dialog="works">${tr("返回全部作品", "Back to all projects")} ↗</button></div>`;
  }
  if (!dialog.open) dialog.showModal();
  dialog.querySelector<HTMLButtonElement>(".dialog-close")!.focus();
  dialog.scrollTop = 0;

  if (!reduced.matches) {
    gsap.fromTo(
      dialog.querySelector(".dialog-surface"),
      { opacity: 0, y: 20, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.36,
        ease: "power3.out",
        clearProps: "transform,opacity",
      },
    );
    gsap.fromTo(
      target.children,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.38,
        stagger: 0.045,
        ease: "power2.out",
        clearProps: "transform,opacity",
      },
    );
  }
}

let toastTimer: ReturnType<typeof setTimeout>;
async function copy(value: string): Promise<void> {
  const toast = document.querySelector<HTMLElement>(".toast")!;
  try {
    await navigator.clipboard.writeText(value);
    toast.textContent =
      lang === "zh" ? "已复制，可以去打个招呼了。" : "Copied. Go say hello.";
  } catch {
    toast.textContent = `${lang === "zh" ? "请手动复制：" : "Please copy: "}${value}`;
  }
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function wire(): void {
  document
    .querySelector<HTMLDialogElement>(".detail-dialog")!
    .addEventListener("close", () => {
      activeDialog = null;
      if (dialogReturn?.isConnected) dialogReturn.focus();
    });

  // Subtle magnetic pull on primary buttons
  document.querySelectorAll<HTMLElement>(".button").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      if (reduced.matches || innerWidth < 768) return;
      const rect = btn.getBoundingClientRect();
      const bx = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const by = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
      btn.style.setProperty("--bx", `${bx.toFixed(1)}px`);
      btn.style.setProperty("--by", `${by.toFixed(1)}px`);
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.setProperty("--bx", "0px");
      btn.style.setProperty("--by", "0px");
    });
  });
}

// Smooth 3D cursor parallax loop for stage voxels and depth frames
let targetPx = 0;
let targetPy = 0;
let curPx = 0;
let curPy = 0;
let parallaxRaf = 0;

function stepParallax(): void {
  parallaxRaf = 0;
  curPx += (targetPx - curPx) * 0.1;
  curPy += (targetPy - curPy) * 0.1;
  const stage = document.querySelector<HTMLElement>(".stage");
  if (stage) {
    stage.style.setProperty("--px", curPx.toFixed(4));
    stage.style.setProperty("--py", curPy.toFixed(4));
  }
  if (Math.abs(targetPx - curPx) > 0.001 || Math.abs(targetPy - curPy) > 0.001) {
    parallaxRaf = requestAnimationFrame(stepParallax);
  }
}

window.addEventListener(
  "pointermove",
  (event) => {
    if (reduced.matches || innerWidth < 768) return;
    targetPx = (event.clientX / Math.max(1, innerWidth) - 0.5) * 2;
    targetPy = (event.clientY / Math.max(1, innerHeight) - 0.5) * 2;
    if (!parallaxRaf) parallaxRaf = requestAnimationFrame(stepParallax);
  },
  { passive: true },
);

app.addEventListener("click", (event) => {
  const target = (event.target as Element).closest<HTMLElement>("a,button");
  if (!target) return;
  if (target.dataset.go) {
    event.preventDefault();
    go(indexForHash(target.dataset.go));
  }
  if (target.dataset.step) {
    if (sceneIds[current] === "experience")
      stepExperience(Number(target.dataset.step));
    else go(current + Number(target.dataset.step));
  }
  if (target.dataset.experience) {
    if (
      event instanceof MouseEvent &&
      (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
    )
      return;
    event.preventDefault();
    changeExperience(target.dataset.experience);
  }
  if (target.dataset.qrOpen) {
    activeQrChannel = target.dataset.qrOpen as "wechat" | "feishu";
  }
  if (target.dataset.qrChannel) {
    const nextChannel = target.dataset.qrChannel as "wechat" | "feishu";
    if (nextChannel !== activeQrChannel) {
      activeQrChannel = nextChannel;
      const contentEl = document.querySelector(".dialog-content");
      if (contentEl && activeDialog === "wechat") {
        contentEl.innerHTML = renderQrDialogContent();
      }
    }
    return;
  }
  if (target.dataset.project)
    showDialog(projects.find((p) => p.id === target.dataset.project) ?? null);
  if (target.dataset.dialog)
    showDialog(
      target.dataset.dialog as "works" | "experience" | "skills" | "wechat",
    );
  if (target.dataset.copy) void copy(target.dataset.copy);
  if (target.classList.contains("dialog-close"))
    document.querySelector<HTMLDialogElement>(".detail-dialog")!.close();
  if (target.classList.contains("menu-toggle")) setMenu(!menuOpen);
  if (target.classList.contains("language-toggle")) {
    timeline?.kill();
    busy = false;
    queued = null;
    gsap.killTweensOf(app.querySelectorAll("*"));
    const dialogBefore = activeDialog;
    character?.dispose();
    lang = lang === "zh" ? "en" : "zh";
    save("maropion-language", lang);
    render();
    if (dialogBefore) showDialog(dialogBefore);
    else document.querySelector<HTMLButtonElement>(".language-toggle")!.focus();
  }
  if (target.classList.contains("theme-toggle")) {
    theme = theme === "dark" ? "light" : "dark";
    save("maropion-theme", theme);
    document.documentElement.dataset.theme = theme;
    character?.pulse(0.5);
    target.textContent =
      lang === "zh"
        ? theme === "dark"
          ? "日间"
          : "夜间"
        : theme === "dark"
          ? "Light"
          : "Dark";
    target.setAttribute(
      "aria-label",
      lang === "zh"
        ? theme === "dark"
          ? "日间：切换为浅色"
          : "夜间：切换为深色"
        : theme === "dark"
          ? "Light: use light theme"
          : "Dark: use dark theme",
    );
  }
  if (target.dataset.track)
    window.dispatchEvent(
      new CustomEvent("portfolio:action", {
        detail: { name: target.dataset.track, scene: sceneIds[current] },
      }),
    );
});
app.addEventListener("click", (event) => {
  if ((event.target as HTMLElement).classList.contains("detail-dialog"))
    document.querySelector<HTMLDialogElement>(".detail-dialog")!.close();
});

app.addEventListener("keydown", (event) => {
  const tab = (event.target as Element).closest<HTMLElement>(
    "[data-experience]",
  );
  if (
    !tab ||
    ![
      "ArrowDown",
      "ArrowRight",
      "ArrowUp",
      "ArrowLeft",
      "Home",
      "End",
    ].includes(event.key)
  )
    return;
  event.preventDefault();
  event.stopPropagation();
  const index = experiences.findIndex((ex) => ex.id === tab.dataset.experience);
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? experiences.length - 1
        : (index +
            (["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1) +
            experiences.length) %
          experiences.length;
  changeExperience(experiences[next].id, true);
});

function hasReadingScroll(target: Element): boolean {
  let element: HTMLElement | null = target.closest<HTMLElement>(
    ".scene,.internship-timeline",
  );
  while (element) {
    if (
      element.scrollHeight > element.clientHeight + 3 ||
      element.scrollWidth > element.clientWidth + 3
    )
      return true;
    element =
      element.parentElement?.closest<HTMLElement>(
        ".scene,.internship-timeline",
      ) ?? null;
  }
  return false;
}

let wheelDelta = 0;
let wheelReset: ReturnType<typeof setTimeout>;
let wheelLock = 0;
let wheelGestureClaimed = false;
window.addEventListener(
  "wheel",
  (event) => {
    if (
      activeDialog ||
      menuOpen ||
      event.ctrlKey ||
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
    )
      return;
    const inExperience = sceneIds[current] === "experience";
    if (!inExperience && hasReadingScroll(event.target as Element)) return;
    event.preventDefault();
    clearTimeout(wheelReset);
    wheelReset = setTimeout(() => {
      wheelDelta = 0;
      wheelGestureClaimed = false;
    }, 180);
    if (
      wheelGestureClaimed ||
      busy ||
      experienceBusy ||
      performance.now() < wheelLock ||
      Math.abs(event.deltaY) < 3
    )
      return;
    const delta =
      event.deltaMode === 1
        ? event.deltaY * 20
        : event.deltaMode === 2
          ? event.deltaY * innerHeight
          : event.deltaY;
    if (Math.sign(wheelDelta) !== Math.sign(delta)) wheelDelta = 0;
    wheelDelta += delta;
    if (Math.abs(wheelDelta) >= 55) {
      const direction = Math.sign(wheelDelta);
      wheelDelta = 0;
      wheelGestureClaimed = true;
      const index = experiences.findIndex((ex) => ex.id === selectedExperience);
      const withinExperience =
        inExperience &&
        index + direction >= 0 &&
        index + direction < experiences.length;
      const duration = reduced.matches
        ? 0.12
        : withinExperience
          ? experienceTransitionDuration
          : sceneTransitionDuration;
      wheelLock = performance.now() + duration * 1000 + 140;
      if (inExperience) stepExperience(direction);
      else go(current + direction);
    }
  },
  { passive: false },
);
window.addEventListener("keydown", (event) => {
  if (
    activeDialog ||
    (event.target as Element).closest(
      "input,textarea,select,[contenteditable],.character",
    )
  )
    return;
  if (event.key === "Escape" && menuOpen) {
    setMenu(false);
    document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
    return;
  }
  if (menuOpen || busy) return;
  if (
    sceneIds[current] === "experience" &&
    ["ArrowDown", "PageDown", "ArrowUp", "PageUp", " ", "Home", "End"].includes(
      event.key,
    )
  ) {
    if (event.key === " " && (event.target as Element).closest("button,a"))
      return;
    event.preventDefault();
    if (experienceBusy) return;
    if (event.key === "Home" || event.key === "End")
      changeExperience(
        experiences[event.key === "Home" ? 0 : experiences.length - 1].id,
      );
    else stepExperience(event.key.includes("Up") ? -1 : 1);
    return;
  }
  if (["ArrowDown", "PageDown", "ArrowUp", "PageUp", " "].includes(event.key)) {
    if (event.key === " " && (event.target as Element).closest("button,a"))
      return;
    event.preventDefault();
    go(current + (event.key === "ArrowUp" || event.key === "PageUp" ? -1 : 1));
  }
  if (event.key === "Home") {
    event.preventDefault();
    go(0);
  }
  if (event.key === "End") {
    event.preventDefault();
    go(sceneIds.length - 1);
  }
});
let touchX = 0;
let touchY = 0;
let touchExcluded = false;
app.addEventListener(
  "touchstart",
  (event) => {
    touchX = event.touches[0].clientX;
    touchY = event.touches[0].clientY;
    touchExcluded =
      !!(event.target as Element).closest("dialog,.mobile-nav") ||
      hasReadingScroll(event.target as Element);
  },
  { passive: true },
);
app.addEventListener(
  "touchend",
  (event) => {
    if (touchExcluded || activeDialog || menuOpen || busy || experienceBusy)
      return;
    const dy = touchY - event.changedTouches[0].clientY;
    const dx = touchX - event.changedTouches[0].clientX;
    if (Math.abs(dy) > 65 && Math.abs(dy) > Math.abs(dx) * 1.2) {
      if (sceneIds[current] === "experience") stepExperience(Math.sign(dy));
      else go(current + Math.sign(dy));
    }
  },
  { passive: true },
);
window.addEventListener("hashchange", () => {
  const id = experiences.find(
    (ex) => location.hash === `#internship-${ex.id}`,
  )?.id;
  go(indexForHash(location.hash));
  if (id) changeExperience(id);
  if (location.hash === "#skills") showDialog("skills");
});
window.addEventListener("beforeunload", () => {
  timeline?.kill();
  experienceTransition?.kill();
  character?.dispose();
});
systemDark.addEventListener("change", () => {
  if (!read("maropion-theme")) {
    theme = systemDark.matches ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
  }
});
current = indexForHash(location.hash);
render();
if (location.hash === "#skills") showDialog("skills");
