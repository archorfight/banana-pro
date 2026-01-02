import { NextRequest, NextResponse } from 'next/server';

interface ResultRequest {
  taskId: string;
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
        { error: `查询失败` },
        { status: response.status }
      );
    }

    const result = await response.json();

    console.log('[Result API] Grasi response:', JSON.stringify(result, null, 2));

    // Grasi 返回 code: -22 表示结果不存在（任务可能还在处理中）
    if (result.code === -22 || result.msg === 'result not exist') {
      return NextResponse.json({
        status: 'running',
        progress: 0,
        imageUrl: null,
        failureReason: null,
      });
    }

    return NextResponse.json({
      status: result.status,
      progress: result.progress,
      imageUrl: result.results?.[0]?.url || null,
      failureReason: result.failure_reason,
    });

  } catch (error) {
    console.error('查询结果错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
