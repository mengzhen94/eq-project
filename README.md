## Environment

* Node.js 6.1+

## Setup and Run

0. Clone this repository and change directory to `eq-project`
1. Store PostgreSQL environment variables into a `.env` file
2. Run `$ docker-compose up` (or `$ docker-compose up -d` to run in the background)
3. Open your browser and point to `localhost:5555` and you should see index page

## Pagination
URL could be like `http://localhost:5555/stats/hourly?page=2&size=10`

## Rate Limiting
Rate Limiting is implemented on `/stats/hourly` endpoint, allowing 5 requests per minute
