import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from "./env.js";

const aj = arcjet({

    key: ARCJET_KEY,
    characteristics: ["ip.src"], // to track requests by ip address

    rules: [
      // Shield protects your app from common attacks e.g. SQL injection
      shield({ mode: "LIVE" }),
      // Create a bot detection rule
      detectBot({
        mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
        allow: [ "CATEGORY:SEARCH_ENGINE" ],
      }),
      // token bucket rate limit to limit the number of requests per interval
      tokenBucket({
        mode: "LIVE",
        refillRate: 5, // Refill 5 tokens per interval
        interval: 10, // Refill every 10 seconds
        capacity: 10, // Bucket capacity of 10 tokens
      }),
    ],
  });
  
  export default aj;