import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
import dns from "node:dns";

dotenv.config();

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

/**
 * Helper that returns a no-op limiter (always allows requests).
 */
const noopLimiter = {
    async limit() {
        return { success: true };
    },
};

let ratelimit = noopLimiter;

if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    console.warn("Upstash env vars missing — rate limiter disabled.");
} else {
    // Try to resolve the Upstash hostname before creating the client. If DNS
    // lookup fails we fallback to a no-op limiter to avoid repeated runtime
    // fetch errors for each request.
    try {
        const url = new URL(UPSTASH_URL);
        const hostname = url.hostname;
        // perform a DNS lookup; use the promise API and await it at module top-level
        await dns.promises.lookup(hostname);

        // Host resolved, create the real rate limiter
        ratelimit = new Ratelimit({
            redis: Redis.fromEnv(),
            limiter: Ratelimit.slidingWindow(10, "20 s"),
        });
        console.log("Upstash host resolved — rate limiter enabled.");
    } catch (err) {
        console.warn(
            "Upstash host unreachable or DNS lookup failed — rate limiter disabled.",
            err && err.message ? err.message : err
        );
        ratelimit = noopLimiter;
    }
}

export default ratelimit;