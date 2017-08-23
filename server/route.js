const router = require('express').Router()
const pg = require('pg')
const RateLimit = require('./rate-limiter/rateLimit')
const path = require('path')

// configs come from standard PostgreSQL env vars
// https://www.postgresql.org/docs/9.6/static/libpq-envars.html
const pool = new pg.Pool()
const limiter = new RateLimit()

// Date-Formating
const options = { weekday: 'short', month: 'short', day: 'numeric' };

const queryHandler = (req, res, next) => {
  pool.query(req.sqlQuery).then((r) => {
    // Format data
    r.rows.forEach(row => {
      // Combine date and hour to get time
      if(row.hasOwnProperty('hour')) {
        row.time = row.date.toLocaleString('en-US', options) + ', ' + ('0' + row.hour).slice(-2) + ':00'
      } else row.time = row.date.toLocaleString('en-US', options)
      // Format time from 2017-01-01T00:00:00.000Z to Sun, 01 Jan 2017 00:00:00 GMT
      row.date = row.date.toUTCString()
      // if event is NULL, delete the property
      if(row.hasOwnProperty('events')) {
        if(row.events === null) {
          delete row.events
          row.eventNum = 0
        }
        else {
          row.events = parseInt(row.events)
          row.eventNum = parseInt(row.events)
        }
      }

      if(row.hasOwnProperty('impressions')) row.impressions = parseInt(row.impressions)
      if(row.hasOwnProperty('revenue')) row.revenue = parseFloat(row.revenue)
      if(row.hasOwnProperty('clicks')) row.clicks = parseInt(row.clicks)
    })

    return res.json(r.rows || [])
  }).catch(next)
}

router.route('/')
  .get((req, res) => {
    res.send('Welcome to EQ Works 😎')
  })

router.route('/events/hourly')
  .get((req, res, next) => {
    req.sqlQuery = `
      SELECT date, hour, SUM(events) AS events
      FROM public.hourly_events
      GROUP BY date, hour
      ORDER BY date, hour
      LIMIT 168;
    `
    return next()
  }, queryHandler)

// Apply Rate limiter to '/stats/hourly' endpoints
router.route('/stats/hourly')
  .get(limiter, (req, res, next) => {
    // use: /stats/hourly/?page=2&size=30
    let size = req.query.size || 168;
    let page = req.query.page || 1;
    let offset = size * (page - 1)
    req.sqlQuery = `
      SELECT date, hour,
          SUM(impressions) AS impressions,
          SUM(clicks) AS clicks,
          SUM(revenue) AS revenue
      FROM public.hourly_stats
      GROUP BY date, hour
      ORDER BY date, hour
      LIMIT ${size} OFFSET ${offset};
    `
    return next()
  }, queryHandler)

router.route('/hourly')
  .get((req, res, next) => {
    req.sqlQuery = `
      SELECT
          SUM(clicks) AS clicks,
          public.hourly_stats.date, public.hourly_stats.hour,
          SUM(impressions) AS impressions,
          SUM(revenue) AS revenue,
          SUM(events) AS events
      FROM public.hourly_stats
      LEFT OUTER JOIN public.hourly_events
      ON public.hourly_stats.date = public.hourly_events.date
      AND public.hourly_stats.hour = public.hourly_events.hour
      GROUP BY public.hourly_stats.date, public.hourly_stats.hour
      ORDER BY public.hourly_stats.date, public.hourly_stats.hour
      LIMIT 168;
    `
    return next()
  }, queryHandler)

router.route('/events/daily')
  .get((req, res, next) => {
  req.sqlQuery = `
    SELECT date, SUM(events) AS events
    FROM public.hourly_events
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
  return next()
}, queryHandler)



router.route('/stats/daily')
  .get((req, res, next) => {
  req.sqlQuery = `
    SELECT date,
        SUM(impressions) AS impressions,
        SUM(clicks) AS clicks,
        SUM(revenue) AS revenue
    FROM public.hourly_stats
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
  return next()
}, queryHandler)

router.route('/daily')
  .get((req, res, next) => {
  req.sqlQuery = `
    SELECT
      SUM(clicks) AS clicks,
      date AS date,
      SUM(impressions) AS impressions,
      SUM(revenue) AS revenue,
      SUM(events) AS events
    FROM (
      SELECT
          clicks,
          public.hourly_stats.date AS date,
          public.hourly_stats.hour,
          impressions,
          revenue,
          events
      FROM public.hourly_stats
      LEFT OUTER JOIN public.hourly_events
      ON public.hourly_stats.date = public.hourly_events.date
      AND public.hourly_stats.hour = public.hourly_events.hour
    ) AS Hourly
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
  return next()
}, queryHandler)

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
router.route('*')
  .get((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

module.exports = router;
