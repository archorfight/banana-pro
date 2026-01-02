# Grasi Nano Banana API 接入指南

## 目录
- [概述](#概述)
- [API 准备工作](#api-准备工作)
- [项目结构](#项目结构)
- [实施步骤](#实施步骤)
- [环境变量配置](#环境变量配置)
- [部署到 Vercel](#部署到-vercel)
- [API 参考](#api-参考)
- [常见问题](#常见问题)

---

## 概述

本文档说明如何将 Grasi Nano Banana 图像生成 API 安全地集成到 Next.js 项目中。

### 安全架构

```
客户端浏览器 → Next.js API Route → Grasi API
                        ↑
                  (API Key 在这里)
```

**关键原则**：API Key 永远只存在于服务端，不暴露到客户端。

---

## API 准备工作

### 1. 注册账号

访问 https://grsai.com 注册账号并登录。

### 2. 获取 API Key

1. 进入控制台 → API Management → API Key
2. 点击"创建 API Key"
3. 复制保存 API Key（格式类似：`grsai_xxxxxxxx`）

### 3. 充值积分（可选）

- Nano Banana Fast: 约 0.022 元/张
- Nano Banana: 约 0.09 元/张（支持 4K）

---

## 项目结构

接入后的文件结构：

```
banana_pro/
├── app/
│   └── api/
│       ├── generate/
│       │   └── route.ts       # 生图任务提交接口
│       └── result/
│           └── route.ts       # 结果查询接口
├── components/
│   └── EditorSection.tsx      # 修改：调用本地 API
├── .env.local                 # 本地环境变量
└── .env.example              # 环境变量模板
```

---

## 实施步骤

### 步骤 1：创建生图 API Route

**文件**: `app/api/generate/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

interface GenerateRequest {
  prompt: string;
  model?: 'nano-banana-fast' | 'nano-banana';
  imageUrls?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt, model = 'nano-banana-fast', imageUrls } = body;

    // 参数验证
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: '提示词不能为空' },
        { status: 400 }
      );
    }

    // 调用 Grasi API
    const apiUrl = 'https://grsai.dakka.com.cn/v1/draw/nano-banana';
    const apiKey = process.env.GRSAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key 未配置' },
        { status: 500 }
      );
    }

    const requestBody: Record<string, any> = {
      model,
      prompt,
      webHook: '-1', // 立即返回任务ID
    };

    if (imageUrls && imageUrls.length > 0) {
      requestBody.urls = imageUrls;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Grasi API 错误: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const result = await response.json();

    // 返回任务ID供轮询使用
    return NextResponse.json({
      taskId: result.data?.id || result.id,
      status: result.status,
    });

  } catch (error) {
    console.error('生成图片错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
```

---

### 步骤 2：创建结果查询 API Route

**文件**: `app/api/result/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

interface ResultRequest {
  taskId: string;
}

interface GrasiResult {
  id: string;
  results?: Array<{
    url: string;
    content: string;
  }>;
  progress: number;
  status: 'running' | 'succeeded' | 'failed';
  failure_reason?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ResultRequest = await request.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: '任务ID不能为空' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GRSAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key 未配置' },
        { status: 500 }
      );
    }

    // 调用 Grasi 结果查询接口
    const response = await fetch('https://grsai.dakka.com.cn/v1/draw/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ task_id: taskId }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `查询失败: ${response.status}` },
        { status: response.status }
      );
    }

    const result: GrasiResult = await response.json();

    // 返回结果
    return NextResponse.json({
      status: result.status,
      progress: result.progress,
      imageUrl: result.results?.[0]?.url || null,
      failureReason: result.failure_reason,
      error: result.error,
    });

  } catch (error) {
    console.error('查询结果错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
```

---

### 步骤 3：修改前端组件

**文件**: `components/EditorSection.tsx`

替换 `handleGenerate` 函数（第 68-115 行）：

```typescript
const handleGenerate = async () => {
  if (!prompt.trim()) return;

  setIsGenerating(true);

  try {
    // 1. 提交生成任务
    const generateResponse = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt.trim(),
        model: model === 'flux' ? 'nano-banana' : 'nano-banana-fast',
        ...(uploadedImage && { imageUrls: [uploadedImage] }),
      }),
    });

    if (!generateResponse.ok) {
      const errorData = await generateResponse.json();
      throw new Error(errorData.error || '生成失败');
    }

    const { taskId, status: initialStatus } = await generateResponse.json();

    // 2. 轮询获取结果
    let currentStatus = initialStatus || 'running';
    let imageUrl = null;
    let failureReason = null;

    const maxAttempts = 60; // 最多轮询 60 次（约 2 分钟）
    let attempts = 0;

    while (currentStatus === 'running' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 等待 2 秒

      const resultResponse = await fetch('/api/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });

      if (!resultResponse.ok) {
        throw new Error('查询结果失败');
      }

      const resultData = await resultResponse.json();
      currentStatus = resultData.status;
      imageUrl = resultData.imageUrl;
      failureReason = resultData.failureReason;
      attempts++;
    }

    // 3. 处理最终结果
    if (currentStatus === 'succeeded' && imageUrl) {
      setGeneratedImage({
        url: imageUrl,
        timestamp: Date.now(),
      });
    } else if (currentStatus === 'failed') {
      throw new Error(failureReason || '生成失败，请重试');
    } else {
      throw new Error('生成超时，请重试');
    }

  } catch (error) {
    console.error('生成图片错误:', error);
    alert(error instanceof Error ? error.message : '生成失败，请重试');
  } finally {
    setIsGenerating(false);
  }
};
```

---

### 步骤 4：创建环境变量模板

**文件**: `.env.example`

```bash
# Grasi API Key
# 在 https://grsai.com 控制台获取
GRSAI_API_KEY=your_api_key_here
```

---

## 环境变量配置

### 本地开发

创建 `.env.local` 文件（不要提交到 Git）：

```bash
GRSAI_API_KEY=grsai_xxxxxxxxxxxxxxxxxxxxxxxx
```

确保 `.gitignore` 包含：
```
.env.local
.env*.local
```

---

## 部署到 Vercel

### 1. 添加环境变量

1. 进入 Vercel 项目 → Settings → Environment Variables
2. 添加以下变量：

| 名称 | 值 | 环境 |
|------|-----|------|
| `GRSAI_API_KEY` | 你的 API Key | Production, Preview, Development |

**重要**：不要使用 `NEXT_PUBLIC_` 前缀，否则会暴露到客户端！

### 2. 重新部署

添加环境变量后，触发一次新的部署：
- 可以在 Vercel 控制台点击 "Redeploy"
- 或者推送一个新的 commit

---

## API 参考

### 生图接口

**端点**: `POST /api/generate`

**请求体**:
```typescript
{
  prompt: string;           // 必填：生成提示词
  model?: string;           // 可选：模型类型，默认 "nano-banana-fast"
  imageUrls?: string[];     // 可选：参考图片URL数组
}
```

**响应**:
```typescript
{
  taskId: string;           // 任务ID，用于查询结果
  status: string;           // 任务状态
}
```

---

### 结果查询接口

**端点**: `POST /api/result`

**请求体**:
```typescript
{
  taskId: string;           // 必填：任务ID
}
```

**响应**:
```typescript
{
  status: 'running' | 'succeeded' | 'failed';
  progress: number;         // 进度 0-100
  imageUrl?: string;        // 成功时返回图片URL
  failureReason?: string;   // 失败原因
}
```

---

### Grasi 原始 API 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| model | string | 是 | `nano-banana-fast`（快）或 `nano-banana`（高质量） |
| prompt | string | 是 | 生成提示词 |
| urls | array | 否 | 参考图片URL（图生图） |
| webHook | string | 否 | `"-1"` 立即返回任务ID，或设置回调URL |
| shutProgress | boolean | 否 | 直接返回最终结果，建议配合 webHook 使用 |

---

## 常见问题

### Q1: API Key 是否安全？

**A**: 是的。API Key 只存储在服务端环境变量中，通过 Next.js API Route 调用，客户端无法访问。

### Q2: 图片 URL 有效期多久？

**A**: 2小时。建议用户及时下载保存。

### Q3: 什么情况会返还积分？

**A**: 只有系统错误（`failure_reason: "error"`）时返还。内容违规（`input_moderation` 或 `output_moderation`）不返还。

### Q4: 如何处理生成超时？

**A**: 轮询最多 60 次（约 2 分钟）。可以调整 `maxAttempts` 参数。

### Q5: 支持图生图吗？

**A**: 支持。上传图片后，将图片 URL 传给 `imageUrls` 参数即可。

### Q6: 如何限制用户使用量？

**A**: 需要额外实现用户配额系统，可以：
- 在数据库记录用户调用次数
- 在 API Route 中验证用户配额
- 使用 NextAuth.js 等认证系统

### Q7: 生成的图片可以商用吗？

**A**: 请参考 Grasi 的服务条款和用户协议。

---

## 成本估算

| 模型 | 单价 | 1000 张成本 |
|------|------|-------------|
| nano-banana-fast | ~0.022 元/张 | ~22 元 |
| nano-banana (4K) | ~0.09 元/张 | ~90 元 |

建议：
1. 使用 `nano-banana-fast` 进行测试
2. 确认效果后再切换到高质量模型
3. 实现用户配额限制控制成本

---

## 下一步优化

1. **用户配额系统**：限制每个用户的生成次数
2. **结果缓存**：对相同 prompt 缓存结果
3. **错误重试**：实现自动重试机制
4. **图片存储**：将生成的图片保存到 CDN
5. **用户认证**：接入登录系统
6. **支付集成**：接入支付系统实现增值服务

---

## 技术支持

- Grasi 官方文档: https://grsai.com/zh/dashboard/documents/nano-banana
- Grasi 控制台: https://grsai.com/zh/dashboard
