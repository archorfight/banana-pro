import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getCreditCostByApiModel, FREE_TIER_RESTRICTIONS } from '@/lib/config/generation';

// Force dynamic rendering for API routes that use cookies
export const dynamic = 'force-dynamic';

interface GenerateRequest {
  prompt: string;
  model?: 'nano-banana-fast' | 'nano-banana';
  style?: 'default' | 'anime' | 'realistic';
  resolution?: 'standard' | 'high';
  imageUrls?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '请先登录', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body: GenerateRequest = await request.json();
    const {
      prompt,
      model = 'nano-banana-fast',
      style = 'default',
      resolution = 'standard',
      imageUrls
    } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: '提示词不能为空', code: 'EMPTY_PROMPT' },
        { status: 400 }
      );
    }

    // Get user credits
    const { data: creditsData } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    const userCredits = creditsData?.credits || 0;
    const isFreeUser = userCredits === 0;
    const needsCredits = style === 'realistic' || resolution === 'high';

    // Free user checks
    if (isFreeUser) {
      if (needsCredits) {
        return NextResponse.json(
          {
            error: '此功能需要积分，请购买积分后使用',
            code: 'NEEDS_CREDITS',
            needsUpgrade: true
          },
          { status: 403 }
        );
      }

      const { data: dailyLimitData } = await supabase.rpc('check_daily_generation_limit', {
        p_user_id: user.id,
        p_limit: FREE_TIER_RESTRICTIONS.dailyLimit,
      });

      if (!dailyLimitData?.can_generate) {
        return NextResponse.json(
          {
            error: '免费用户每天只能生成1次，请购买积分后无限使用',
            code: 'DAILY_LIMIT',
            dailyLimit: true,
            needsUpgrade: true
          },
          { status: 429 }
        );
      }
    }

    // Credit user checks and deduction
    let creditCost = 0;
    if (!isFreeUser) {
      creditCost = getCreditCostByApiModel(model, resolution);

      if (userCredits < creditCost) {
        return NextResponse.json(
          {
            error: `积分不足，需要${creditCost}积分，当前${userCredits}积分`,
            code: 'INSUFFICIENT_CREDITS',
            insufficient: true,
            required: creditCost,
            current: userCredits
          },
          { status: 402 }
        );
      }

      const { data: deductResult } = await supabase.rpc('deduct_credits', {
        p_user_id: user.id,
        p_amount: creditCost,
        p_type: 'usage',
        p_description: `图片生成 (${model}, ${resolution}, ${style})`,
        p_metadata: { model, resolution, style, prompt: prompt.substring(0, 50) }
      });

      if (!deductResult?.success) {
        return NextResponse.json(
          { error: deductResult?.error || '扣除积分失败', code: 'DEDUCT_FAILED' },
          { status: 400 }
        );
      }
    }

    // Record free user generation
    if (isFreeUser) {
      await supabase.rpc('increment_daily_generation', {
        p_user_id: user.id
      });
    }

    // Call generation API
    const apiUrl = 'https://grsai.dakka.com.cn/v1/draw/nano-banana';
    const apiKey = process.env.GRSAI_API_KEY;

    if (!apiKey) {
      if (!isFreeUser && creditCost > 0) {
        await supabase.rpc('add_credits', {
          p_user_id: user.id,
          p_amount: creditCost,
          p_type: 'refund',
          p_description: 'API配置错误退款',
          p_metadata: { original_reason: 'api_key_missing' }
        });
      }
      return NextResponse.json(
        { error: 'API Key 未配置', code: 'API_KEY_MISSING' },
        { status: 500 }
      );
    }

    const requestBody: Record<string, any> = {
      model,
      prompt,
    };

    if (imageUrls && imageUrls.length > 0) {
      requestBody.urls = imageUrls;
    }

    console.log('[Generate API] Request:', { model, promptLength: prompt.length, hasImage: !!imageUrls });

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
      if (!isFreeUser && creditCost > 0) {
        await supabase.rpc('add_credits', {
          p_user_id: user.id,
          p_amount: creditCost,
          p_type: 'refund',
          p_description: '生成API错误退款',
          p_metadata: { status: response.status, error: errorText.substring(0, 100) }
        });
      }
      return NextResponse.json(
        { error: `Grasi API 错误: ${response.status}`, code: 'API_ERROR' },
        { status: 500 }
      );
    }

    // Read response - parse SSE stream
    const rawResponse = await response.text();
    console.log('[Generate API] Response (first 500 chars):', rawResponse.substring(0, 500));

    // Parse SSE stream to extract task ID and check for immediate results
    let taskId: string | null = null;
    const lines = rawResponse.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          taskId = data.id || data.task_id || data.taskId || taskId;
          console.log('[Generate API] SSE data:', JSON.stringify(data));

          // Check if already succeeded in the stream
          if (data.status === 'succeeded' && data.results?.[0]?.url) {
            return NextResponse.json({
              status: 'succeeded',
              imageUrl: data.results[0].url,
              creditsUsed: creditCost,
            });
          }

          // Check if failed in the stream
          if (data.status === 'failed') {
            if (!isFreeUser && creditCost > 0) {
              await supabase.rpc('add_credits', {
                p_user_id: user.id,
                p_amount: creditCost,
                p_type: 'refund',
                p_description: '生成失败退款',
                p_metadata: { reason: data.failure_reason || 'generation_failed' }
              });
            }
            return NextResponse.json(
              { error: data.failure_reason || data.error || '生成失败', code: 'GENERATION_FAILED' },
              { status: 500 }
            );
          }
        } catch {
          // Skip invalid JSON lines
        }
      }
    }

    // Handle Grasi API error format (code: -1) from single JSON response
    try {
      const jsonData = JSON.parse(rawResponse);
      if (jsonData.code === -1) {
        const errorMsg = jsonData.msg || '生成服务错误';
        if (!isFreeUser && creditCost > 0) {
          await supabase.rpc('add_credits', {
            p_user_id: user.id,
            p_amount: creditCost,
            p_type: 'refund',
            p_description: `API错误退款: ${errorMsg}`,
            p_metadata: { code: jsonData.code, msg: errorMsg }
          });
        }
        return NextResponse.json(
          { error: `Grasi API: ${errorMsg}`, code: 'GRASI_API_ERROR', originalError: errorMsg },
          { status: 500 }
        );
      }

      // Handle direct JSON response (non-SSE)
      if (jsonData.status === 'succeeded' && jsonData.results?.[0]?.url) {
        return NextResponse.json({
          status: 'succeeded',
          imageUrl: jsonData.results[0].url,
          creditsUsed: creditCost,
        });
      }

      if (jsonData.status === 'failed') {
        if (!isFreeUser && creditCost > 0) {
          await supabase.rpc('add_credits', {
            p_user_id: user.id,
            p_amount: creditCost,
            p_type: 'refund',
            p_description: '生成失败退款',
            p_metadata: { reason: jsonData.failure_reason || 'generation_failed' }
          });
        }
        return NextResponse.json(
          { error: jsonData.failure_reason || jsonData.error || '生成失败', code: 'GENERATION_FAILED' },
          { status: 500 }
        );
      }

      // Extract task ID from direct JSON
      taskId = jsonData.task_id || jsonData.taskId || jsonData.id || taskId;
    } catch {
      // Not a JSON response, already handled SSE above
    }

    // If has task ID, poll for result
    if (taskId) {
      console.log('[Generate API] Got task ID:', taskId, '- polling...');

      for (let i = 0; i < 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const resultResponse = await fetch('https://grsai.dakka.com.cn/v1/draw/result', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ task_id: taskId }),
        });

        if (resultResponse.ok) {
          const resultData = await resultResponse.json();
          console.log(`[Generate API] Poll ${i + 1}:`, resultData.status);

          if (resultData.status === 'succeeded' && resultData.results?.[0]?.url) {
            return NextResponse.json({
              status: 'succeeded',
              imageUrl: resultData.results[0].url,
              creditsUsed: creditCost,
            });
          }

          if (resultData.status === 'failed') {
            if (!isFreeUser && creditCost > 0) {
              await supabase.rpc('add_credits', {
                p_user_id: user.id,
                p_amount: creditCost,
                p_type: 'refund',
                p_description: '生成失败退款',
                p_metadata: { taskId, reason: resultData.failure_reason || 'generation_failed' }
              });
            }
            return NextResponse.json(
              { error: resultData.failure_reason || resultData.error || '生成失败', code: 'GENERATION_FAILED' },
              { status: 500 }
            );
          }

          if (resultData.status === 'processing' || resultData.status === 'pending') {
            continue;
          }

          break;
        }
      }

      // Timeout - refund credits
      if (!isFreeUser && creditCost > 0) {
        await supabase.rpc('add_credits', {
          p_user_id: user.id,
          p_amount: creditCost,
          p_type: 'refund',
          p_description: '轮询超时退款',
          p_metadata: { taskId }
        });
      }
      return NextResponse.json(
        { error: '生成超时，请稍后重试', code: 'TIMEOUT' },
        { status: 408 }
      );
    }

    // Fallback - no task ID or no result
    if (!isFreeUser && creditCost > 0) {
      await supabase.rpc('add_credits', {
        p_user_id: user.id,
        p_amount: creditCost,
        p_type: 'refund',
        p_description: '无法解析响应退款',
        p_metadata: { rawResponse: rawResponse.substring(0, 200) }
      });
    }
    return NextResponse.json(
      { error: '未获取到生成结果', code: 'NO_RESULT' },
      { status: 500 }
    );

  } catch (error) {
    console.error('生成图片错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
