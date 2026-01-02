import { NextRequest, NextResponse } from 'next/server';

interface GenerateRequest {
  prompt: string;
  model?: 'nano-banana-fast' | 'nano-banana';
  imageUrls?: string[];
}

// 解析 SSE 格式的数据
async function* parseSSE(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data.trim()) {
          try {
            yield JSON.parse(data);
          } catch {
            // 忽略无效 JSON
          }
        }
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt, model = 'nano-banana-fast', imageUrls } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: '提示词不能为空' },
        { status: 400 }
      );
    }

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

    // 处理 SSE 流式响应
    let finalData: any = null;
    let dataCount = 0;

    for await (const data of parseSSE(response.body!)) {
      dataCount++;
      console.log(`[Generate API] SSE data #${dataCount}:`, JSON.stringify(data, null, 2));
      finalData = data;

      // 检查是否成功完成
      if (data.status === 'succeeded' && data.results?.[0]?.url) {
        return NextResponse.json({
          status: 'succeeded',
          imageUrl: data.results[0].url,
        });
      }

      // 检查是否失败
      if (data.status === 'failed') {
        return NextResponse.json(
          { error: data.failure_reason || data.error || '生成失败' },
          { status: 500 }
        );
      }
    }

    console.log('[Generate API] Stream ended. Total messages:', dataCount);
    console.log('[Generate API] Final data:', JSON.stringify(finalData, null, 2));

    // 流结束后检查最后一条数据
    if (finalData?.status === 'succeeded' && finalData.results?.[0]?.url) {
      return NextResponse.json({
        status: 'succeeded',
        imageUrl: finalData.results[0].url,
      });
    }

    return NextResponse.json(
      { error: '未获取到生成结果' },
      { status: 500 }
    );

  } catch (error) {
    console.error('生成图片错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
