import ratelimit from "../config/upstash.js"

const rateLimiter = async (req, res, next) =>{

    try {
        const {success} = await ratelimit.limit("my-rate-limit");
        
        if(!success){
            return res.status(429).json({
            message:"Too many requests, please try again later "})
        }
        next();
    } catch (error) {
        console.log("Rate limiter error", error);
        // If the rate limiter service errors (e.g. missing Upstash env vars),
        // allow the request to continue so the app remains operational while
        // the issue is diagnosed. This prevents requests from hanging.
        return next();
    }
}
export default rateLimiter;