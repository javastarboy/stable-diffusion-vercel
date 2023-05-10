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
  const ipIdentifier = req.headers['x-real-cdn-ip'] ?? requestIp.getClientIp(req)
  const result = await ratelimit.limit(`acg-ai_${ipIdentifier}`);
  res.setHeader('X-RateLimit-Limit', result.limit)
  res.setHeader('X-RateLimit-Remaining', result.remaining)
  res.setHeader('X-Reques-IP', ipIdentifier || '?')
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "25d2f75ecda0c0bed34c806b7b70319a53a1bccad3ade1a7496524f013f48983",
        input: { 
          prompt: req.body.prompt,
          num_inference_steps: 30
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