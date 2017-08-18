const express = require('express')
const pg = require('pg')
const path = require('path')

const app = express()

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// configs come from standard PostgreSQL env vars
// https://www.postgresql.org/docs/9.6/static/libpq-envars.html
const pool = new pg.Pool()

const queryHandler = (req, res, next) => {
  pool.query(req.sqlQuery).then((r) => {
    // if events is NULL, drop the property
    r.rows.map((row) => { if(row.events === null) return delete row.events});
    return res.json(r.rows || [])
  }).catch(next)
}

app.get('/', (req, res) => {
  res.send('Welcome to EQ Works 😎')
})

app.get('/events/hourly', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, hour, SUM(events) AS events
    FROM public.hourly_events
    GROUP BY date, hour
    ORDER BY date, hour
    LIMIT 168;
  `
  return next()
}, queryHandler)

app.get('/stats/hourly', (req, res, next) => {
  // use: /stats/hourly/?page=2&size=30
  let size = req.query.size || 20;
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

app.get('/hourly', (req, res, next) => {
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


app.get('/events/daily', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, SUM(events) AS events
    FROM public.hourly_events
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
  return next()
}, queryHandler)


app.get('/stats/daily', (req, res, next) => {
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

app.get('/daily', (req, res, next) => {
  req.sqlQuery = `
    SELECT
      SUM(clicks) AS clicks,
      date AS date,
      SUM(impressions) AS impressions,
      SUM(revenue) AS revenue,
      SUM(events) AS events
    FROM (
      SELECT
          SUM(clicks) AS clicks,
          public.hourly_stats.date AS date,
          public.hourly_stats.hour,
          SUM(impressions) AS impressions,
          SUM(revenue) AS revenue,
          SUM(events) AS events
      FROM public.hourly_stats
      LEFT OUTER JOIN public.hourly_events
      ON public.hourly_stats.date = public.hourly_events.date
      AND public.hourly_stats.hour = public.hourly_events.hour
      GROUP BY public.hourly_stats.date, public.hourly_stats.hour
    ) AS Hourly
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
  return next()
}, queryHandler)

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(process.env.PORT || 5555, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    console.log(`Running on ${process.env.PORT || 5555}`)
  }
})

// last resorts
process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`)
  process.exit(1)
})
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  process.exit(1)
})
