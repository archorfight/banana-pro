# Banana Pro 二期内链结构（hub-spoke）说明 — t_40419d7c

## 总览
- 一期 30 个 landing slug（lib/landing-pages.ts）+ 二期 113 个新 slug（lib/landing-pages-2.ts）= 143 个内容页 × 2 语言 = 286 页，加 10 个核心 URL（en/zh 首页、pricing、privacy、terms、refund），build 产物 310 个静态页，sitemap 296 URL，全部本地验证 200。

## Hub 选定（一期高排名页作轮辐中心）
二期新页每页归属一个 hub（hub 字段），11 个 hub 按集群划分：

| Hub（一期页） | 集群 | 反链到它的二期新页数 |
|---|---|---|
| banana-ai-image-generator | banana 工具族 | 25 |
| nano-banana-alternative | nano-banana 族 | 15 |
| text-to-image-generator | 通用工具族 | 17 |
| ai-photo-editor | 通用工具族（修图向） | 5 |
| ai-avatar-generator-from-photo | 通用工具族（头像向） | 6 |
| ai-logo-generator-free | logo/icon 向 | 4 |
| anime-ai-generator | 动漫风格族 | 5 |
| ai-art-generator-free | 艺术风格族 | 19 |
| realistic-ai-image-generator | 写实向 | 4 |
| youtube-thumbnail-ai-generator | 缩略图用例族 | 4 |
| ai-headshot-generator | 头像用例族 | 2 |

## 轮辐结构实现
1. **spoke → hub**：每个二期页底部渲染 "Part of the guide: {hub H1} →" 反链，权重全部指向一期高排名页。
2. **hub → spokes**：hub 页（一期页）底部新增 "More {hub H1} tools" 网格区，列出该 hub 名下全部二期页（hubSpokes 映射，lib/landing-pages-2.ts 导出），形成 hub 向新页的权重分发。
3. **横向 related**：二期页原有的 related chips（hub + 2 个同 hub 兄弟页）保留，形成同簇内互联。
4. 全部内链用 next/link 本地化路径（en 无前缀 / zh 前缀），与既有 middleware 规则一致。

## 关键文件
- lib/landing-pages-2.ts — 113 页双语内容 + hubSpokes 映射（生成器：kanban workspace t_40419d7c/gen.py，manifest.ts 为关键词真源）
- app/[locale]/[slug]/page.tsx — allPages 合并一期二期；新增 hub-spoke 两个 section
- app/sitemap.ts — 合并两期 slug

## 验证记录
- `npx tsc --noEmit` 零错误
- `NEXT_PUBLIC_SUPABASE_URL=...placeholder npm run build` → 310/310 静态页生成，零错误（构建期需 dummy Supabase env，与部署平台注入真实值不冲突）
- 本地 next start 抽查 + 全量循环：113 个新 slug 的 en/zh 两版全部 200；sitemap 296 URL；hub↔spoke 双向链接在 HTML 中可见；FAQPage JSON-LD 存在
