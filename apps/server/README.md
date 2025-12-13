# Backend Server

Node + Express API that surfaces production data for the dashboard.

## Commands

```bash
# install dependencies
npm install

# start in watch mode
npm run dev

# build for production
npm run build
npm start
```

## Environment

Copy `.env.example` to `.env` and adjust the connection info. The default values
match the database credentials you shared (`postgres/123456` on `127.0.0.1:5432`).

## Tank Schema

The API expects `storage_tank_categories` and `tanks` tables. See
`../../database/tank_inventory.sql` for the schema and seed data you can run
inside your PostgreSQL instance.

## Meters

Create the meter tables with `../../create_meter_tables.sql` and seed with
`../../insert_meters_data.sql` + `../../insert_meter_readings_data.sql`.

The dashboard reads total daily electricity usage from:

`GET /api/meters/electric/total/trend?start=YYYY-MM-DD&end=YYYY-MM-DD`
