# Supabase Google 登录配置指南

本文档详细说明如何配置 Supabase 和 Google OAuth 来实现用户认证功能。

---

## 一、创建 Supabase 项目

### 1.1 注册 Supabase

1. 访问 [Supabase 官网](https://supabase.com)
2. 点击 **Start your project**
3. 使用 GitHub 账号登录（推荐）或邮箱注册

### 1.2 创建新项目

1. 点击 **New Project**
2. 填写项目信息：
   - **Organization**: 选择或创建组织
   - **Name**: `banana-pro` (或你喜欢的项目名)
   - **Database Password**: 自动生成或自定义（请保存好密码）
   - **Region**: 选择离你用户最近的区域（如 Singapore、Tokyo）
3. 点击 **Create new project**，等待项目创建完成（约 2 分钟）

### 1.3 获取 API 凭证

1. 进入项目 Dashboard
2. 点击左侧菜单 **Settings** → **API**
3. 复制以下信息到 `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 二、配置 Google OAuth

### 2.1 创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 顶部选择框点击 **NEW PROJECT**
3. 填写项目信息：
   - **Project Name**: `Banana Pro`
4. 点击 **CREATE**，等待创建完成

### 2.2 启用 Google+ API

1. 在左侧菜单选择 **APIs & Services** → **Library**
2. 搜索 "Google+ API" 或 "Google Identity"
3. 点击 **ENABLE**

### 2.3 配置 OAuth 同意屏幕

1. 进入 **APIs & Services** → **OAuth consent screen**
2. 选择 **External**（面向所有 Google 用户）
3. 点击 **CREATE**

#### 填写应用信息（必填项）：

| 字段 | 值 |
|-----|-----|
| App name | Banana Pro |
| User support email | your-email@example.com |
| Developer contact email | your-email@example.com |

4. 点击 **SAVE AND CONTINUE**
5. **Scopes** 页面：直接点击 **SAVE AND CONTINUE**
6. **Test users** 页面：可以添加测试用户或直接 **SAVE AND CONTINUE**
7. 点击 **BACK TO DASHBOARD**

### 2.4 创建 OAuth 2.0 凭证

1. 进入 **APIs & Services** → **Credentials**
2. 点击 **+ CREATE CREDENTIALS** → **OAuth client ID**
3. 应用类型选择 **Web application**

#### 配置授权信息：

**Name**: `Banana Pro Web Client`

**Authorized JavaScript origins**（授权的 JavaScript 来源）：
```
http://localhost:3000
https://your-domain.com  # 生产环境域名
```

**Authorized redirect URIs**（授权的重定向 URI）：
```
https://xxxxx.supabase.co/auth/v1/callback
```

> **注意**: `xxxxx.supabase.co` 是你的 Supabase 项目 URL，在 Supabase Dashboard 的 Settings → API 中可以找到。

4. 点击 **CREATE**
5. 复制 **Client ID** 和 **Client Secret**（Secret 只显示一次，请立即保存）

---

## 三、在 Supabase 中配置 Google Provider

### 3.1 启用 Google Provider

1. 回到 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 点击左侧菜单 **Authentication** → **Providers**
4. 找到 **Google** provider，点击进入
5. 将 **Enable Sign in with Google** 开关打开

### 3.2 填写 Google 凭证

在 Google provider 配置页面填入：

| 字段 | 值 |
|-----|-----|
| Client ID | 你从 Google Cloud Console 获取的 Client ID |
| Client Secret | 你从 Google Cloud Console 获取的 Client Secret |

6. 点击 **Save**

### 3.3 配置重定向 URL

在同一个页面，找到 **Redirect URLs** 部分，添加：

```
http://localhost:3000/auth/callback
```

生产环境需要添加：
```
https://your-domain.com/auth/callback
```

---

## 四、本地开发配置

### 4.1 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4.2 重启开发服务器

```bash
# 停止当前运行的服务器 (Ctrl+C)
npm run dev
```

### 4.3 测试登录流程

1. 访问 http://localhost:3000
2. 点击右上角的 **Sign In** 按钮
3. 应该会跳转到 Google 登录页面
4. 选择你的 Google 账号授权
5. 授权成功后会跳转回首页，显示你的头像和用户名

---

## 五、生产环境配置

### 5.1 更新 Google OAuth 回调 URL

在 [Google Cloud Console](https://console.cloud.google.com/)：

1. 进入 **APIs & Services** → **Credentials**
2. 编辑你的 OAuth 2.0 Client ID
3. 在 **Authorized redirect URIs** 添加：
   ```
   https://your-production-domain.com/auth/callback
   ```

### 5.2 更新 Supabase 重定向 URL

在 [Supabase Dashboard](https://supabase.com/dashboard)：

1. 进入 **Authentication** → **URL Configuration**
2. 在 **Redirect URLs** 添加：
   ```
   https://your-production-domain.com/auth/callback
   ```

### 5.3 配置生产环境变量

在你的生产环境（如 Vercel）设置环境变量：

| 变量名 | 值 |
|-------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 Supabase Anon Key |

---

## 六、技术实现说明

### 6.1 项目结构

```
utils/supabase/
├── client.ts      # 浏览器端客户端
├── server.ts      # 服务器端客户端
└── middleware.ts  # 中间件辅助函数

app/auth/callback/
└── route.ts       # OAuth 回调处理

middleware.ts      # Next.js 中间件（合并 next-intl 和 Supabase）

components/
└── AuthButton.tsx # 登录/登出按钮
```

### 6.2 认证流程

1. **用户点击登录**
   - AuthButton 调用 `supabase.auth.signInWithOAuth()`
   - 重定向到 Google 授权页面

2. **Google 授权**
   - 用户登录并授权应用
   - Google 重定向到 Supabase: `https://xxxxx.supabase.co/auth/v1/callback`

3. **Supabase 处理**
   - Supabase 交换授权码获取用户信息
   - 创建用户 session
   - 重定向到你的应用: `http://localhost:3000/auth/callback`

4. **应用回调**
   - `app/auth/callback/route.ts` 调用 `exchangeCodeForSession()`
   - Session 保存到 cookie
   - 重定向到首页

### 6.3 Session 管理

- **浏览器端**: 使用 `BrowserClient`，自动管理 cookie
- **服务器端**: 使用 `createServerClient()`，从 cookies 读取 session
- **中间件**: 每次请求刷新 session，确保不会过期

---

## 七、常见问题

### Q1: 登录后立即退出

**原因**: 中间件配置问题或 cookie 设置问题

**解决**:
- 确保 `middleware.ts` 正确配置
- 检查 Supabase project settings 中的 Site URL

### Q2: 重定向错误

**原因**: Redirect URLs 没有正确配置

**解决**:
- 检查 Google Cloud Console 的 Redirect URIs
- 检查 Supabase 的 Redirect URLs 配置
- 确保 URL 完全匹配（包括协议、域名、路径）

### Q3: CORS 错误

**原因**: Supabase 项目配置问题

**解决**:
- 在 Supabase Dashboard → Settings → API 中添加你的域名

### Q4: 本地开发环境可以登录，生产环境不行

**原因**: 生产环境的环境变量或回调 URL 未配置

**解决**:
- 检查生产环境的 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 确保在 Google Console 和 Supabase 中都添加了生产环境的回调 URL

---

## 八、参考文档

- [Supabase Auth - Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase SSR 指南](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Google Cloud OAuth 指南](https://cloud.google.com/identity-platform/docs/web/google)

---

## 九、安全建议

1. **永远不要提交 `.env.local` 到 Git**
   - 已在 `.gitignore` 中配置

2. **使用环境变量管理密钥**
   - 生产环境使用平台的环境变量配置

3. **启用 Supabase RLS (Row Level Security)**
   - 在 Database 中为用户表设置 RLS 策略

4. **定期更新依赖**
   ```bash
   npm update @supabase/supabase-js @supabase/ssr
   ```

---

**文档版本**: 1.0
**最后更新**: 2026-01-03
**维护者**: Banana Pro Team
