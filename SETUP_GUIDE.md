# 项目启动指导文档

## 📋 依赖的第三方服务

本项目依赖以下第三方服务，启动前需要确保相关配置正确：

### 1. Supabase（数据库 + 认证）

**作用**：用户认证、数据存储、积分系统

**必需配置**：
```bash
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的匿名密钥
SUPABASE_SERVICE_ROLE_KEY=你的服务角色密钥（重要！webhook需要）
```

**获取方式**：
1. 访问 https://supabase.com
2. 创建项目或进入已有项目
3. Settings → API 复制以下信息：
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`（点击reveal显示）

**⚠️ 重要提醒**：
- `SUPABASE_SERVICE_ROLE_KEY` 用于服务端操作（如webhook），必须配置
- service_role key 绝不要泄露到前端代码

---

### 2. Creem Payment（支付系统）

**作用**：处理用户支付、积分购买

**必需配置**：
```bash
CREEM_API_KEY=你的Creem API密钥
CREEM_WEBHOOK_SECRET=你的Webhook密钥
```

**获取方式**：
1. 访问 https://creem.io
2. 创建账户并进入 Dashboard
3. Developers → API Keys 获取：
   - Test API Key（测试环境）或 Live API Key（生产环境）
4. Developers → Webhooks 获取 Webhook Secret

**环境区分**：
- **测试环境**：
  ```bash
  CREEM_BASE_URL=https://test-api.creem.io
  CREEM_API_KEY=creem_test_xxx
  ```
- **生产环境**：
  ```bash
  CREEM_BASE_URL=https://api.creem.io
  CREEM_API_KEY=creem_live_xxx
  ```

**Webhook配置**：
1. 在 Creem Dashboard 设置 Webhook URL
2. 本地开发使用 ngrok：`https://xxx.ngrok.io/api/creem/webhook`
3. 生产环境：`https://你的域名.com/api/creem/webhook`

---

### 3. AI图像生成API（GRSAI）

**作用**：AI图像生成功能

**必需配置**：
```bash
GRSAI_API_KEY=你的API密钥
```

**获取方式**：
- 根据你使用的AI服务获取对应的API Key

---

### 4. 网络代理（可选，国内访问Creem需要）

**作用**：访问受地域限制的API（如Creem）

**必需配置**（仅在需要时）：
```bash
HTTP_PROXY=http://127.0.0.1:7897
HTTPS_PROXY=http://127.0.0.1:7897
```

**说明**：
- 使用 Clash/V2Ray 等代理工具
- 端口号根据你的代理配置修改
- 如果不需要访问Creem API，可以删除此配置

---

## 🚀 快速启动步骤

### 第一次启动

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置环境变量**
   - 复制示例文件（如果有）：
     ```bash
     cp .env.example .env.local
     ```
   - 编辑 `.env.local`，填入上述第三方服务的密钥

3. **设置数据库**
   - 确保Supabase中已创建必要的表和函数：
     - `user_credits` 表（用户积分）
     - `credit_transactions` 表（积分交易记录）
     - `add_credits` 数据库函数

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   - 打开浏览器访问 http://localhost:3000

---

### 日常启动

1. **确保代理运行**（如果需要访问Creem）
   - 启动你的代理工具（Clash/V2Ray等）

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **本地测试Webhook**（如需测试支付）
   ```bash
   # 启动ngrok
   ngrok http 3000

   # 记录显示的公网URL，例如：https://xxx.ngrok.io
   # 在Creem Dashboard设置Webhook URL为：
   # https://xxx.ngrok.io/api/creem/webhook
   ```

---

## ⚙️ 配置文件说明

### `.env.local`（本地环境，不提交到git）

包含所有敏感信息，**必须加入 `.gitignore`**：

```bash
# AI服务
GRSAI_API_KEY=sk-xxx

# Creem支付
CREEM_API_KEY=creem_test_xxx
CREEM_WEBHOOK_SECRET=whsec_xxx
MOCK_PAYMENT=false

# 代理（可选）
HTTP_PROXY=http://127.0.0.1:7897
HTTPS_PROXY=http://127.0.0.1:7897

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx  # 重要！
```

---

## 🔧 常见问题排查

### 问题1：支付接口403 Forbidden

**可能原因**：
- API Key 配置错误
- 测试/生产环境混淆

**解决方法**：
- 检查 `CREEM_BASE_URL` 和 `CREEM_API_KEY` 是否匹配
- 测试环境用 `test-api.creem.io` + `creem_test_xxx`
- 生产环境用 `api.creem.io` + `creem_live_xxx`

### 问题2：Webhook不工作

**可能原因**：
- 本地localhost无法接收webhook
- ngrok未启动或URL配置错误

**解决方法**：
- 使用 ngrok 暴露本地服务
- 在Creem Dashboard配置正确的webhook URL

### 问题3：积分加不上

**可能原因**：
- `SUPABASE_SERVICE_ROLE_KEY` 未配置或错误
- Webhook签名验证失败

**解决方法**：
- 检查 `.env.local` 中是否配置了 `SUPABASE_SERVICE_ROLE_KEY`
- 查看服务器日志，确认webhook是否正确接收和处理

### 问题4：Creem API连接超时

**可能原因**：
- 国内网络无法直接访问

**解决方法**：
- 配置代理：`HTTP_PROXY` 和 `HTTPS_PROXY`
- 或者使用Mock模式：`MOCK_PAYMENT=true`

---

## 📝 生产环境部署

### Vercel部署

1. **连接GitHub仓库**
   - 在Vercel导入项目

2. **配置环境变量**
   - 在 Vercel Dashboard → Settings → Environment Variables 添加：
     ```bash
     GRSAI_API_KEY
     CREEM_API_KEY（使用生产key）
     CREEM_WEBHOOK_SECRET
     CREEM_BASE_URL=https://api.creem.io
     SUPABASE_SERVICE_ROLE_KEY
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     ```

3. **配置生产Webhook**
   - 在Creem Dashboard设置：
     - Webhook URL: `https://你的域名.com/api/creem/webhook`

4. **删除代理配置**
   - 生产环境不需要 `HTTP_PROXY` 和 `HTTPS_PROXY`

---

## 📚 相关资源

- **Supabase文档**: https://supabase.com/docs
- **Creem文档**: https://creem.io/docs
- **Next.js文档**: https://nextjs.org/docs
- **ngrok下载**: https://ngrok.com/download

---

## ✅ 启动检查清单

每次启动项目前，确认：

- [ ] `.env.local` 文件存在且配置完整
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 已配置（重要！）
- [ ] 代理工具已启动（如需访问Creem）
- [ ] npm依赖已安装 (`npm install` 最新)
- [ ] Supabase项目正常运行
- [ ] Creem API Key 在有效期内

---

## 🆘 遇到问题？

如果按照上述步骤仍无法启动，检查：

1. **Node.js版本**：确保使用 Node.js 18+
   ```bash
   node --version
   ```

2. **依赖安装**：删除 `node_modules` 重新安装
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **端口占用**：确保3000端口未被占用
   ```bash
   # Windows
   netstat -ano | findstr :3000
   ```

4. **查看日志**：启动时的错误信息通常会提示具体问题

---

**最后更新**: 2026-01-10
