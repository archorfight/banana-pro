帮我实现核心功能：
1. 用户点击Add Image后可以上传图片
2. 用户上传图片，并且在Main Prompt中写入提示词，点击Generate Now后，把图片和提示词都发给Gemini 2.5 Flash Image (Nano Banana) API处理，在Output Gallery区域返回API生成好的图片。
3. 这是API的说明文档：https://openrouter.ai/google/gemini-2.5-flash-image/api
4. 这是API key：XXX（填自己的API key），新建一个.env.local文件，存放API key
5. 这是API示例代码：
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "<OPENROUTER_API_KEY>",
  defaultHeaders: {
    "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  },
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash-image",
    messages: [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "What is in this image?"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
            }
          }
        ]
      }
    ]
  });

  console.log(completion.choices[0].message);
}

main();