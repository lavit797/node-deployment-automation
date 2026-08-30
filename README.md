# Secure Task API

A full-fledged Node.js + Express + MongoDB REST API designed as a realistic deployment, monitoring and alerting target.

## Features

- MongoDB + Mongoose
- RESTful API
- JWT authentication
- Role-based authorization (`user`, `admin`)
- Password hashing with bcrypt
- Task ownership and assignment rules
- Request validation with express-validator
- Helmet security headers
- CORS configuration
- API and authentication rate limiting
- Centralized error handling
- Pagination, filtering, search and sorting
- Health checks
- Structured production-friendly project layout
- Automated API tests with Jest + Supertest

## Run locally

```bash
npm install
copy .env.example .env
npm run dev
```

Set `MONGO_URI` and a strong `JWT_SECRET` in `.env`.

## Important endpoints

### Health
`GET /api/health`
`GET /api/health/db`

### Auth
`POST /api/auth/register`
`POST /api/auth/login`
`GET /api/auth/me`

### Users
`GET /api/users` (admin)
`GET /api/users/:id`
`PUT /api/users/:id`
`DELETE /api/users/:id` (admin)

### Tasks
`POST /api/tasks`
`GET /api/tasks`
`GET /api/tasks/assigned`
`GET /api/tasks/:id`
`PUT /api/tasks/:id`
`DELETE /api/tasks/:id`

Example task query:
`GET /api/tasks?page=1&limit=20&status=pending&priority=high&search=backend&sortBy=createdAt&order=desc`

## Authentication

Send:

```http
Authorization: Bearer <JWT>
```

## Production checklist

- Use MongoDB Atlas or another managed MongoDB service.
- Set a long random `JWT_SECRET`.
- Set `NODE_ENV=production`.
- Configure `CLIENT_URL`.
- Deploy behind HTTPS.
- Configure your deployment platform's environment variables.
- Monitor `/api/health` and `/api/health/db`.
- Connect application errors/logs to an error-monitoring service.
- Configure uptime and error alerts.
- Never commit `.env`.

## Monitoring target

The application exposes lightweight health endpoints specifically for uptime monitoring:

- `/api/health` verifies the HTTP application process.
- `/api/health/db` verifies application-to-MongoDB connectivity.

These can be used with an uptime monitor and deployment-platform health checks.

## Testing

```bash
npm test
```

Add your integration tests under `tests/` as the project grows.

## License

MIT

