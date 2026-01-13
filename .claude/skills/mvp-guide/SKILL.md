---
name: |
  MVP开发指南
description: |
  快速搭建MVP应用的软件工程最佳实践，避坑指南。基于实战经验总结。
---

# MVP 开发指南

快速搭建 MVP 应用的软件工程最佳实践，帮助避坑和提高效率。

## 核心原则

1. **Build once, deploy anywhere** - 同一份代码，不同环境用不同配置
2. **文档先于调试** - 遇到问题先读官方文档，不要盲目假设
3. **环境隔离** - dev/staging/prod 完全分离
4. **配置外置** - 所有环境相关配置通过环境变量注入

---

## 目录

1. [环境配置哲学](#环境配置哲学)
2. [技术选型原则](#技术选型原则)
3. [数据库设计](#数据库设计)
4. [第三方集成](#第三方集成)
5. [前后端分离](#前后端分离)
6. [部署策略](#部署策略)
7. [常见陷阱](#常见陷阱)

---

## 环境配置哲学

### 三环境模型

```
Development → Staging → Production
    ↓           ↓           ↓
test-api   staging-api  api
test-keys  staging-keys prod-keys
test-data  staging-data  real-data
```

### 配置策略（12-Factor App）

#### 规则 1: 配置通过环境变量注入

❌ **错误做法**
```typescript
const API_URL = 'https://api.creem.io'
```

✅ **正确做法**
```typescript
const CREEM_BASE_URL = process.env.CREEM_BASE_URL || (process.env.NODE_ENV === 'production'
  ? 'https://api.creem.io'
  : 'https://test-api.creem.io')
```

#### 规则 2: 环境自动切换

```typescript
// Next.js 自动设置 NODE_ENV
// development: npm run dev
// production: npm run build && npm start
```

### 环境变量命名规范

```bash
# 服务配置
CREEM_BASE_URL=https://test-api.creem.io
CREEM_API_KEY=creem_test_xxx

# 代理配置（开发环境）
HTTP_PROXY=http://127.0.0.1:7897
HTTPS_PROXY=http://127.0.0.1:7897

# 功能开关
MOCK_PAYMENT=false  # 设为 true 跳过真实 API 调用
```

### .env 文件组织

```
.env                # 默认配置（提交到 git）
.env.local          # 本地覆盖（不提交）
.env.production     # 生产环境（不提交）
.env.test           # 测试环境（不提交）
```

---

## 技术选型原则

### MVP 技术栈选择标准

1. **学习曲线** - 越短越好
2. **社区支持** - 文档齐全、问题有答案
3. **部署简单** - 一键部署最佳
4. **成本可控** - 免费额度够用

### 推荐技术栈（2025）

| 类别 | 推荐技术 | 理由 |
|------|---------|------|
| 前端框架 | Next.js 14 | 全栈、零配置、Vercel 一键部署 |
| UI 库 | Tailwind CSS | 开发快、不需要写 CSS |
| 认证 | Supabase Auth | 免费额度、OAuth 开箱即用 |
| 数据库 | Supabase PostgreSQL | 免费额度、RLS 安全、自带 API |
| 支付 | Creem | 简单、测试模式完善 |
| 表单 | React Hook Form | 类型安全、性能好 |

### 避免的技术（MVP 阶段）

❌ Redux（除非必要）
❌ 自建 CI/CD（用 Vercel/GitHub Actions）
❌ 微服务（单体架构足够）
❌ TypeScript 严格模式（后期优化）

---

## 数据库设计

### 设计原则

1. **原子性优先** - 用数据库函数保证原子操作
2. **RLS 策略** - 行级安全，用户只能看自己的数据
3. **审计日志** - 记录所有关键操作

### 实战案例：点数系统

```sql
-- 1. 用户余额表（一行一个用户）
CREATE TABLE user_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  credits INTEGER NOT NULL DEFAULT 0 CHECK (credits >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. 交易记录表（每次操作记录）
CREATE TABLE credit_transactions (
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount INTEGER NOT NULL,  -- 正数加，负数减
  balance_after INTEGER NOT NULL,
  type TEXT NOT NULL,  -- 'purchase' | 'usage' | 'refund'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. 原子操作函数（保证并发安全）
CREATE FUNCTION add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT
) RETURNS JSONB AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  -- 锁定行，防止并发
  INSERT INTO user_credits (user_id, credits)
  VALUES (p_user_id, p_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET credits = user_credits.credits + p_amount
  RETURNING credits INTO v_new_balance;

  -- 记录交易
  INSERT INTO credit_transactions (user_id, amount, balance_after, type)
  VALUES (p_user_id, p_amount, v_new_balance, p_type);

  RETURN jsonb_build_object('success', true, 'new_balance', v_new_balance);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 常见陷阱

❌ **应用层加锁**
```typescript
// 容易出错，不支持多实例
let balance = await getBalance(user);
await updateBalance(user, balance + amount);
```

✅ **数据库原子操作**
```typescript
await supabase.rpc('add_credits', {
  p_user_id: user.id,
  p_amount: 100,
  p_type: 'purchase'
});
```

---

## 第三方集成

### 调试工作流程

```
遇到问题
    ↓
读官方文档（重点看环境区分）
    ↓
检查配置（URL、API Key、环境）
    ↓
验证凭证（最后才检查）
```

### Creem 集成经验

#### 问题：403 Forbidden

**排查步骤：**
1. 检查 API URL - 测试用 `test-api.creem.io`
2. 检查 API Key - 测试 key 和生产 key 分离
3. 检查请求格式 - header 名称、参数

**这次项目的教训：**
- 第一反应认为是 API Key 问题 ❌
- 实际是测试/生产 URL 混淆 ✅

#### Webhook 处理

```typescript
// 1. 验证签名
function verifyWebhookSignature(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  hmac.update(payload);
  const digest = hmac.digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

// 2. 使用 admin API（绕过 RLS）
const supabase = createClient(); // 需要 service role key
const { data } = await supabase.auth.admin.listUsers();
```

### Webhook 测试

**本地开发问题：** 本地 localhost 无法接收 webhook

**解决方案：**
```bash
# 使用 ngrok 暴露本地服务
ngrok http 3000

# 得到公网 URL: https://abc123.ngrok.io
# 在 Creem Dashboard 设置: https://abc123.ngrok.io/api/creem/webhook
```

---

## 前后端分离

### API 设计原则

#### 1. 统一响应格式

```typescript
// 成功响应
{ success: true, data: {...} }

// 错误响应
{ success: false, error: "错误信息" }
```

#### 2. HTTP 状态码规范

| 状态码 | 含义 | 场景 |
|--------|------|------|
| 200 | 成功 | 查询成功 |
| 400 | 请求错误 | 参数错误、余额不足 |
| 401 | 未认证 | 未登录、token 过期 |
| 403 | 禁止访问 | API Key 无效、环境错误 |
| 500 | 服务器错误 | 代码 bug |

#### 3. 客户端状态管理

```typescript
// ❌ 不要在组件内重复创建 client
function MyComponent() {
  const supabase = createClient(); // 每次 render 都创建！
  // ...
}

// ✅ 使用 hook 缓存
function useCredits() {
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    fetchCredits().then(setCredits);
  }, []);

  return { credits };
}
```

### 组件性能优化

#### 问题：429 错误（头像请求频繁）

**原因：**
- `useEffect` 依赖项设置不当
- 每次 render 都创建新的 client
- 没有 memo 化头像 URL

**解决方案：**
```typescript
// 1. 固定依赖项
useEffect(() => {
  // ...
}, []); // 空数组，只执行一次

// 2. 缓存头像 URL
const avatarUrl = useMemo(() => {
  return user?.user_metadata?.avatar_url;
}, [user?.user_metadata?.avatar_url]);

// 3. 添加 ref 避免重复请求
const avatarUrlRef = useRef(null);
```

---

## 部署策略

### Vercel 部署流程

```bash
# 1. 连接 GitHub
# 2. 导入项目
# 3. 自动部署
```

### 环境变量配置（Vercel）

```
Settings → Environment Variables
├── NODE_ENV=production
├── NEXT_PUBLIC_SUPABASE_URL=xxx
├── NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
├── CREEM_API_KEY=creem_live_xxx  # 生产 key
└── CREEM_BASE_URL=https://api.creem.io  # 生产 URL
```

### 本地验证生产配置

```bash
# 本地模拟生产环境
NODE_ENV=production npm run build
NODE_ENV=production npm start
```

---

## 常见陷阱

### 陷阱 1: 混淆测试和生产环境

**症状：** 403 Forbidden

**原因：** 用测试 key 调用生产 API（或反之）

**解决：**
1. 先看文档的 Environment 部分
2. 确认当前环境对应的 URL
3. 检查 .env 配置

### 陷阱 2: 数据库查询返回 null

**症状：** 能查到数据（测试 API），但 API 返回 null

**原因：** 在函数内重复创建 client，丢失认证上下文

**解决：**
```typescript
// ❌ 错误
async function getData(userId) {
  const supabase = createClient(); // 新 client，无认证上下文
  return await supabase.from('table').select('*');
}

// ✅ 正确
async function GET(request) {
  const supabase = await createClient(); // 复用认证上下文
  return await supabase.from('table').select('*');
}
```

### 陷阱 3: useEffect 依赖循环

**症状：** 组件疯狂重渲染，429 错误

**原因：** 依赖项每次都是新对象

**解决：**
```typescript
// ❌ 错误
useEffect(() => {
  // ...
}, [supabase]); // supabase 每次都是新对象

// ✅ 正确
useEffect(() => {
  // ...
}, []); // 空数组，只执行一次
```

### 陷阱 4: 忘记 await

**症状：** API 返回 500，错误信息模糊

**原因：**
```typescript
const supabase = createClient(); // 没有 await！
const { data } = await supabase.auth.getUser(); // supabase 是 Promise，不是对象
```

**解决：** 总是 await `createClient()`

---

## MVP 开发检查清单

### 开始前

- [ ] 确认目标功能（不做多余功能）
- [ ] 选择简单技术栈
- [ ] 准备环境变量清单

### 开发中

- [ ] 测试/生产环境分离
- [ ] API Key 分离
- [ ] 数据库函数原子化
- [ ] Webhook 签名验证

### 部署前

- [ ] 本地模拟生产环境测试
- [ ] 检查 .env.local 不在 git 中
- [ ] 验证环境变量正确
- [ ] 测试完整支付流程

---

## 快速参考

### 环境判断模板

```typescript
const API_URL = process.env.API_URL || (process.env.NODE_ENV === 'production'
  ? 'https://api.example.com'
  : 'https://test-api.example.com');
```

### 数据库函数模板

```sql
CREATE FUNCTION do_something(p_user_id UUID, p_amount INTEGER)
RETURNS JSONB AS $$
BEGIN
  -- 原子操作
  -- 记录日志
  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### API 路由模板

```typescript
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 业务逻辑
  const { data } = await supabase.from('table').select('*').eq('user_id', user.id);

  return NextResponse.json(data);
}
```

---

**记住：文档先于调试，配置先于代码！**
