# 我是如何用AI一天搞定支付系统集成的

作为个人开发者，最痛苦的不是写代码，而是那些繁琐的第三方集成。

今天早上8点起床，我给自己的AI图片生成工具加支付功能。晚上8点，第一笔支付成功到账，积分自动到账。

中间踩过的坑，让我想写下来分享给其他独立开发者。

## 为什么是Creem？

我做过Stripe，也做过Paddle，但作为个人开发者，它们都有痛点：

- Stripe：需要美国/欧洲公司，个人开发者难以申请
- Paddle：作为商家of record，税务处理复杂，费率较高
- 国内支付：只支持国内用户，出海产品用不了

最后选了Creem，几个关键点：

1. **个人友好**：个人开发者直接申请，不需要公司主体
2. **测试环境完善**：Test模式下可以完整测试流程，不用花真钱
3. **API简洁**：文档清晰，集成代码量少
4. **适合出海**：支持国际信用卡，面向全球用户

## 集成流程：从零到支付

### 第一步：创建产品和定价

在Creem Dashboard创建产品，获取Product ID。我创建了三个套餐：

- 100积分 - $9.9
- 500积分 - $39.9
- 1000积分 - $69.9

### 第二步：Checkout API集成

前端调用创建checkout的API：

```typescript
const response = await fetch('/api/creem/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    product_id: productId,
    success_url: `${origin}/success?package=${amount}`,
    cancel_url: `${origin}/pricing`,
    customer_email: userEmail,  // 关键：传递用户邮箱
    metadata: { package_amount: amount }
  })
});
```

返回`checkout_url`后，直接跳转到Creem的支付页面。

**重点**：一定要传递`customer_email`！我第一次没传，导致用户在支付页随便填了个邮箱，最后积分加不到账。

### 第三步：Webhook接收支付通知

这是最关键的一步。用户支付完成后，Creem会发送webhook通知你的服务器。

```typescript
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('creem-signature');

  // 1. 验证签名
  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // 2. 解析事件
  const event = JSON.parse(rawBody);
  const eventType = event.eventType;

  // 3. 处理支付完成
  if (eventType === 'checkout.completed') {
    await handleCheckoutCompleted(event.object);
  }

  return NextResponse.json({ received: true });
}
```

## 踩过的三个坑

### 坑1：签名验证失败

错误信息：`Input buffers must have the same byte length`

**原因**：Creem发送的签名带`sha256=`前缀，直接比较会长度不匹配。

**解决**：
```typescript
// 去掉前缀
const receivedSignature = signature.replace(/^sha256=/, '');

// 先检查长度，再比较
if (receivedSignature.length !== digest.length) {
  return false;
}

return crypto.timingSafeEqual(
  Buffer.from(receivedSignature),
  Buffer.from(digest)
);
```

### 坑2：找不到用户

错误信息：`User not found for email: xxx@qq.com`

**原因**：支付时用户填的邮箱和系统登录邮箱不一致。

用户A登录账户是`user@gmail.com`，但支付时填了`test@qq.com`，webhook处理时找不到`test@qq.com`对应的账户。

**解决**：前端创建checkout时传递当前登录用户的邮箱：
```typescript
// 获取当前用户
const supabase = createClient();
const { data: { session } } = await supabase.auth.getSession();
const userEmail = session?.user?.email;

// 传递给checkout
customer_email: userEmail  // 强制使用登录邮箱
```

这样支付邮箱=登录邮箱，保证积分加到正确账户。

### 坑3：测试环境URL混淆

Creem有两个API：
- 测试环境：`https://test-api.creem.io`
- 生产环境：`https://api.creem.io`

我一开始用生产URL配测试Key，一直403 Forbidden。后来才发现要在`.env`里配置正确的BASE_URL：

```bash
# .env.local
CREEM_BASE_URL=https://test-api.creem.io
CREEM_API_KEY=creem_test_xxx
```

部署到生产时切换：
```bash
CREEM_BASE_URL=https://api.creem.io
CREEM_API_KEY=creem_live_xxx
```

## 使用AI加速开发

这次集成能这么快，AI帮了大忙。

我用的Claude Code，它不是那种"给我写个支付系统"的AI，而是**陪我debug的AI**。

比如签名验证的问题，我只是把错误日志贴给它：

```
RangeError: Input buffers must have the same byte length
    at verifyWebhookSignature (route.ts:23:58)
```

它直接告诉我："签名有前缀，需要去掉`sha256=`"，还给出了修复代码。

再比如用户邮箱的问题，它看到日志后问我："支付邮箱和登录邮箱是不是不一样？"，一语道破。

我算了一下，传统方式我至少要花3天：
- 读文档理解API：4小时
- 写代码集成：4小时
- Debug各种问题：8小时
- 测试验证：4小时

用AI后：
- 写代码：2小时（AI生成框架代码）
- Debug：1小时（AI快速定位问题）
- 测试：1小时

总共4小时，节省了67%的时间。

## 给出海独立开发者的建议

### 1. 支付越早越好

不要等产品完美了再加支付。MVP阶段就应该接入支付，验证用户是否愿意付费。

### 2. 测试环境很重要

选支付平台时，一定要看测试环境是否完善。Creem的Test模式让我省了不少真金白银。

### 3. 记录用户邮箱

从支付到服务发放，邮箱是唯一的用户标识。确保支付邮箱=系统登录邮箱，避免服务发放失败。

### 4. Webhook要幂等

支付平台可能重复发送webhook，你的处理逻辑要幂等（重复执行结果一致）。

### 5. 日志要详细

支付涉及钱，出问题要能快速定位。我加了详细的日志：

```typescript
console.log('🔍 Raw webhook payload:', rawBody);
console.log('🔍 Received signature:', signature);
console.log('🔍 Expected signature:', expectedDigest);
console.log('📦 Received Creem webhook:', eventType);
console.log(`💰 Adding ${creditsToAdd} credits to user ${userId}`);
```

出问题时看日志一目了然。

## 一天完成集成的关键

回顾这次集成，关键在于：

1. **选择对的工具**：Creem对个人开发者友好
2. **善用AI**：Claude Code帮我快速定位和解决问题
3. **快速试错**：测试环境完善，可以大胆测试
4. **详细日志**：出问题能快速定位

## 我的AI编程实践

从ChatGPT到Claude，我试过各种AI工具。现在我的工作流是：

**AI = 代码生成 + Debug助手 + 代码审查**

- **代码生成**：给我搭框架，写样板代码
- **Debug助手**：看日志，分析错误，给解决方案
- **代码审查**：改完后帮我检查，有没有安全隐患

它不是替代我，而是**放大我的能力**。我以前要花3天的事，现在1天搞定。

这不是说我不写代码了。相反，我写的代码更多了——因为那些重复的、繁琐的工作被AI接管了，我可以专注于产品逻辑和用户体验。

## 写在最后

如果你是独立开发者，正在做出海产品，我的建议是：

**尽快验证，快速迭代**

支付不是技术难题，而是商业验证。用户愿意付费，才是对你产品最大的认可。

不要等到产品"完美"了再加支付。MVP阶段就应该接入，验证商业模式。

---

**🚀 免费获取7天AI编程套餐**

我做了个AI编程辅助工具，帮你：

- 自动生成代码框架
- 快速定位和修复Bug
- 代码审查和优化建议

关注公众号**「AI编程出海笔记」**，回复**「加群」**进交流群，免费领取7天Pro套餐。

群里还有：
- 独立开发者经验分享
- 出海支付、部署等实战经验
- AI编程最佳实践

一起用AI加速出海！
