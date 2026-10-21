# Maropion 场景作品集样片

这是独立的设计评审样片，位于 `codex/personal-site-redesign-20261019` 分支，通过独立的 Vercel 项目提供在线预览。现站根目录入口、部署配置和域名保留，不合并到 `master`。

## 运行

在本目录执行：

```sh
npm ci
npm run dev
```

本地预览为 `http://127.0.0.1:4176/`。生产构建检查：

```sh
npm run build
npm run preview
```

当前评审会话另在 `http://127.0.0.1:4177/` 启动了构建产物预览。

## Vercel 自动部署

- 固定在线地址：[maropion-redesign.vercel.app](https://maropion-redesign.vercel.app/)。
- [Vercel 项目](https://vercel.com/maropions-projects/maropion-redesign) · [GitHub 分支](https://github.com/Maropion03/my-personal-website/tree/codex/personal-site-redesign-20261019)。
- 项目：`maropion-redesign`，连接 `Maropion03/my-personal-website`。
- Root Directory：`redesign`，允许读取根目录外的仓库素材。
- Node.js：24.x；安装 `npm ci`，构建 `npm run build`，输出 `dist`。
- 分支范围及构建命令记录在本目录的 `vercel.json`。
- 固定域名已绑定 `codex/personal-site-redesign-20261019`，当前分支推送后，Git 集成自动构建并更新该地址。

修改后在仓库中提交并推送：

```sh
git add <本次修改的文件>
git commit -m "描述本次修改"
git push origin codex/personal-site-redesign-20261019
```

自动部署由 GitHub push 触发。本地保存后可先用开发服务器检查，再提交推送。构建失败时，预览地址继续提供上一份成功构建。

这是独立项目的分支地址。原项目生产分支保持 `master`，`maropion.fun` 沿用原站。

## 已确认的设计范围

- 求职优先，兼顾接单；网站本身体现审美和交互表达。
- 原创像素 / 体素水母作为主视觉。
- Mistral 的暖色与像素语言，Kimi 的整屏纵深切换，Unstructured 的局部漂浮感作为参考。
- 首页 → 实习经历 → 作品 → 关于我 → 联系，顶部导航持续可用。
- Meloscape、答于言、PRD 评审助手作为三项主线，其余三项保留在“全部作品”。
- 完整双语，首次默认中文；支持明暗主题。

## 操作

- 滚轮、上下方向键、PageUp / PageDown、底部按钮：逐幕浏览。
- 实习经历内，滚轮或纵向手势在固定区域切换公司，侧边节点同步高亮；完整经历弹层保留全部原文。
- 顶部导航：直接前往章节。
- 转场：下一幕在当前幕后方淡入，当前幕渐隐，约 0.9 秒后完成页面状态交接；不使用色块遮罩。
- 拖动水母、聚焦水母后使用左右方向键：旋转角色。
- 项目按钮与“完整经历”：原生模态框，支持 Escape 关闭和焦点返回。
- 手机目录和纵向滑动：切换章节。实习经历使用原位切换；其他章节在矮屏有内容溢出时允许本幕内部滚动，底部按钮继续提供翻幕。
- 中英切换保留当前场景；语言与手动主题选择保存在本机。
- 尊重 `prefers-reduced-motion`，关闭自动摆动、字体切片和转场动画。

## 实现与素材来源

- `src/content.ts`：统一的中英项目、经历和教育数据。经历与教育已按用户最新简历同步；没有独立核验简历中的业务指标。
- `src/main.ts`：七幕控制、手势、键盘、导航、语言、原生模态框和联系操作。
- `src/jellyfish.ts`：原创 Three.js 体素角色、实例化方块和材质 Shader；在不可见或页面隐藏时暂停更新。
- `src/styles.css`：语义化主题、响应式构图、变量字体和减少动态效果适配。
- 真实项目截图复用旧实验分支 `codex/alche-pixel-rebuild` 已有的 `*-full.webp`，未复用其场景代码。
- 肖像、微信二维码与 favicon 复用仓库已有素材；下载简历为最新 `public/resume.pdf`（约 796 kB）。机构标志来源见 `public/logos/README.md`。
- 水母静态参考使用内置 imagegen 生成，项目文件为 `public/images/jellyfish-concept.png`；完整提示词见 `../docs/design/jellyfish-image-prompt.txt`。正常 WebGL 路径不下载这张大图，仅在渲染不可用时使用。
- Space Grotesk 与 IBM Plex Mono 本地托管，许可文件随 `public/fonts/` 一起保留。

所有内容都由 HTML 承载；Canvas 不承担项目文字、导航或联系入口。没有接入外部统计、表单后台、账户服务或自动消息发送。

## 当前边界

此版本通过 Vercel 提供分支预览，保留 noindex。原站入口与域名继续沿用现有版本。Three.js 动态模块原始体积略超 Vite 默认的 500 kB 提示线，与主入口分开加载。

模拟视口和模拟触控检查不等于真实手机性能验收。正式替换原站前还需要完成文案、域名语言策略与 SEO 校对。
