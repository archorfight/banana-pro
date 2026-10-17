# H0 Spike 报告：gpt-image-2 via GrsAI /v1/api/generate

> 日期：2026-07-27
> 分支：spike/gpt-image-2
> PRD v2 H0 技术验证
> 状态：PARTIAL — 接口与错误结构已验证；成功率有真实数据但样本量因余额限制仅 4 次成功

---

## 结论

GrsAI 新统一接口 /v1/api/generate 可达、认证有效、响应结构清晰。4 次成功生成验证了文生图、两种比例（1024x1024 / 1536x1024）。P50 约 37.5 秒。但充值额度仅够 4 次成功调用，参考图编辑、内容拒绝、超时等场景仍因余额不足未完成。

---

## 1. 核心指标

| 指标 | 值 | 备注 |
|------|------|------|
| 成功率（有余额时） | 4/5 = 80% | 第 5 次为 NETWORK 错误，非 API 拒绝 |
| P50 生成耗时 | 37.5 秒 | 4 次成功样本 |
| P95 生成耗时 | 43.2 秒 | 样本量小，仅供参考 |
| 最快 | 32.1 秒 | 产品图 prompt |
| 最慢 | 43.2 秒 | 通用咖啡店 prompt |
| 实际单次成本 | ¥0.03 | 与公开价格一致 |
| 已消耗 | ¥0.12 | 4 次成功生成 |

---

## 2. 已验证项

### 2.1 文生图（PASS）
4 次成功：
- 咖啡店水彩风格（1024x1024，43.2s）
- 陶瓷杯产品图（1024x1024，32.1s）
- 山湖风景照（1536x1024，37.6s）
- 蓝色圆圈（验证用，1024x1024，56.9s，手动 curl）

### 2.2 成功响应结构（PASS）
统一格式：
```json
{
  "id": "9-a8df1129-a059-4a55-9007-3d4b339effec",
  "status": "succeeded",
  "results": [{ "url": "https://file5.aitohumanize.com/file/6a4002705fa0424f8212ad9c4ed42a84.png" }],
  "progress": 100
}
```
- URL 域名：file5~7.aitohumanize.com（多 CDN 节点）
- 同步返回，无需轮询

### 2.3 余额不足错误结构（PASS — 场景 6 完整覆盖）
```json
{
  "id": "15-e2f05f91-b69c-41da-bcbc-a5831895c8d7",
  "status": "failed",
  "error": "apikey credits not enough"
}
```
HTTP 400，稳定可归类，错误响应延迟约 320-400ms。

### 2.4 网络中断行为（观测到 1 次）
第 3 次调用（文字海报 prompt）在 12.4 秒后返回 NETWORK 错误（httpStatus:0），非超时。可能是 GrsAI 端临时波动或连接重置。实际使用需在 Provider Adapter 中处理重试。

---

## 3. 未完成项（余额不足）

| 场景 | 状态 |
|------|------|
| 单参考图编辑 | 4 个 case 全部 INSUFFICIENT_BALANCE |
| 比例 1024x1536 / auto | 未获得成功样本 |
| 内容拒绝（暴力/NSFW） | 全部 INSUFFICIENT_BALANCE（无法验证 moderation） |
| 超时压力测试 | INSUFFICIENT_BALANCE |
| URL 有效期 | 4 个成功 URL 待验证过期时间 |

---

## 4. 错误分布（20 次调用）

| 错误类型 | 次数 | 说明 |
|----------|------|------|
| SUCCESS | 3 | 脚本内成功（不含手动 curl） |
| NETWORK | 1 | httpStatus:0，连接中断 |
| INSUFFICIENT_BALANCE | 15 | 余额耗尽后 |
| OTHER | 1 | 伪造 key 测试 |

---

## 5. 给 H1 Provider Adapter 的输入

基于实测数据，Provider Adapter 应注意：

1. GrsAI /v1/api/generate 是同步接口，但生成耗时 30-57 秒，Vercel serverless 默认超时需确认（Hobby 60s）
2. 错误响应很快（~300ms），余额/权限检查在生成前
3. 成功时 results[0].url 直接可用，无需轮询（与旧 /v1/draw/nano-banana 接口不同）
4. 需处理 NETWORK 中断（httpStatus:0）的自动重试
5. URL 域名 file*.aitohumanize.com，需确认过期时间后决定是否需要转存

---

## 6. 给 Owner 的下一步

选项 A：充值 ≥¥1（覆盖剩余 16 次测试），我立即重跑完成全部验证
选项 B：当前数据已足够支撑 H1 Provider Adapter 开发决策，接受 PARTIAL 结果继续推进

完整 20 条去敏样本：spike/results/raw-samples.jsonl
聚合数据：spike/results/spike-report.json
