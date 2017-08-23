/*
  Rate Limit Implementation has five procedures:
    1. Get the subject's IP address
    2. Find or create a new rate bucket
    3. Increment the hits counter
    4. Allow or reject future transactions => send corresponding response to client with res header added
    5. Set interval function to clean data
*/

const config = require('./rate-config')

function RateLimit() {

    let options = {
        // milliseconds - how long to keep records of requests in memory
        intervalTime: config.rateLimits.intervalTime || 60 * 1000,
        // max number of recent connections during `intervalTime` milliseconds before sending a error message
        max: config.rateLimits.max || 20,
        // Error message
        message : 'Too many requests, please try again later.',
        // If return error, the status should be 429
        statusCode: 429
    }

    let clicks = {}

    rateLimit = (req, res, next) => {
        let key = req.ip
        clicks[key] = clicks[key] === undefined ? 1 : clicks[key] + 1

        res.setHeader('X-RateLimit-Limit', options.max)
        res.setHeader('X-RateLimit-Remaining', Math.max(options.max - clicks[key], 0))

        if (clicks[key] > options.max) {
          //return res.json(options.message)
          return res.status(options.statusCode).json({ message: options.message });
        }

        next()

    }
    this.resetAll = () => clicks = {}
    setInterval(this.resetAll, options.intervalTime);

    return rateLimit
}

module.exports = RateLimit
