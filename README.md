# Financial Dashboard API

This is the backend API for the financial dashboard, providing endpoints for managing records, users, and computing analytics.

## Tech Stack
- **Node.js + Express**: Web server
- **PostgreSQL**: Primary database (via `pg` module)
- **Redis**: Caching layer for dashboard analytics (via `ioredis`)

## Assumptions & Design Decisions
- **Missing Months/Weeks in Trends**: Time-based trend queries (e.g., `getMonthlyTrends`, `getWeeklyTrends`) only return rows for periods that actually have records. If there were no expenses or income in a given month/week, that period will not appear in the results. The frontend consumer should fill in the gaps with zeros for continuous chart rendering.
- **Floating Point Precision**: Aggregations from PostgreSQL's `NUMERIC` columns are returned as strings by the `pg` driver to prevent precise floating-point precision loss. We handle parsing to standard JS floats explicitly in the service layer where exact precision is acceptable for high-level dashboard display.
- **Dashboard Caching**: The `/dashboard` endpoint utilizes caching. It defaults to the `redis://localhost:6379` service. On active development or if Redis is not running, `ioredis` fails gracefully after retries and the dashboard computes data on-the-fly directly from DB. Cached results are invalidated automatically upon any admin-triggered write operations (Add, Update, Delete) on the `records` table.
