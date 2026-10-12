// Deployment batch config — first-batch slice (照 obbba 分批配方).
// Batch 1 = 一期 30 页(线上已有) + 二期最强词族 30 页(nano-banana 族 15 + banana 工具族 15)。
// 其余 83 个二期页留在源码(staging)，不入 build/sitemap，后续批次逐步放出。
export const BATCH1_EXTRA_SLUGS: ReadonlySet<string> = new Set([
  // nano-banana 族 (hub: nano-banana-alternative) — 一期高排名品牌词族展开
  'nano-banana-pro',
  'nano-banana-pro-free',
  'nano-banana-image-generator',
  'nano-banana-text-to-image',
  'nano-banana-photo-editor',
  'nano-banana-online',
  'nano-banana-vs-nano-banana-pro',
  'nano-banana-prompt-guide',
  'nano-banana-pricing',
  'nano-banana-app',
  'nano-banana-api',
  'gemini-nano-banana',
  'nano-banana-alternatives-free',
  'nano-banana-tutorial',
  'nano-banana-avatar-generator',
  // banana 工具族 (hub: banana-ai-image-generator) — 需求最强的 15 个工具页
  'banana-ai-sticker-maker',
  'banana-ai-meme-generator',
  'banana-ai-coloring-page-generator',
  'banana-ai-tattoo-generator',
  'banana-ai-wallpaper-generator',
  'banana-ai-poster-maker',
  'banana-ai-icon-maker',
  'banana-ai-pixel-art-generator',
  'banana-ai-portrait-generator',
  'banana-ai-emoji-maker',
  'banana-ai-pattern-generator',
  'banana-ai-book-cover-generator',
  'banana-ai-illustration-generator',
  'banana-ai-3d-character-generator',
  'banana-ai-game-art-generator',
]);
