// import {Ratelimit} from "@upstash/ratelimit";
// import {Redis} from "@upstash/redis";
// import requestIp from "request-ip";

// const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL || "",
//   token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
// })

// const ratelimit = new Ratelimit({
//   redis: redis,
//   limiter: Ratelimit.fixedWindow(5, "720 m"),
//   analytics: false,
// });

export default async function handler(req, res) {
  // const ipIdentifier = req.headers['x-real-cdn-ip'] ?? requestIp.getClientIp(req)
  // const result = await ratelimit.limit(`acg-ai_${ipIdentifier}`);
  // res.setHeader('X-RateLimit-Limit', result.limit)
  // res.setHeader('X-RateLimit-Remaining', result.remaining)
  // res.setHeader('X-Reques-IP', ipIdentifier || '?')
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "09a5805203f4c12da649ec1923bb7729517ca25fcac790e640eaa9ed66573b65",
        input: { 
          prompt: req.body.prompt,
          negative_prompt: "nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name",
          num_inference_steps: 20
      },
      }),
    });
  
    if (response.status !== 201) {
      let error = await response.json();
      res.statusCode = 500;
      res.end(JSON.stringify({ detail: error.detail }));
      return;
    }

    // if (!result.success) {
    //   res.statusCode = 429;
    //   res.end(JSON.stringify({ detail: '今天的生成次数已达到上限。' }));
    //   return
    // }
    
    const prediction = await response.json();
    res.statusCode = 201;
    res.end(JSON.stringify(prediction));
  }